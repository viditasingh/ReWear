from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import (
    UserProfile, Category, ClothingItem, ItemImage, SwapRequest,
    PointsTransaction, PointsRedemption, Notification, UserInteraction
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'location', 'phone', 'points_balance', 
                 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['points_balance', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'items_count', 'created_at']

    def get_items_count(self, obj):
        return obj.items.filter(status='available').count()


class ItemImageSerializer(serializers.ModelSerializer):
    """Serializer for ItemImage model"""
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'is_primary', 'uploaded_at']


class ClothingItemSerializer(serializers.ModelSerializer):
    """Serializer for ClothingItem model"""
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = ItemImageSerializer(many=True, read_only=True)
    tags_list = serializers.SerializerMethodField()
    can_swap = serializers.SerializerMethodField()
    can_redeem = serializers.SerializerMethodField()

    class Meta:
        model = ClothingItem
        fields = [
            'id', 'title', 'description', 'category', 'category_id', 'type', 
            'size', 'condition', 'owner', 'status', 'points_value',
            'is_available_for_swap', 'is_available_for_points', 'tags',
            'tags_list', 'images', 'can_swap', 'can_redeem',
            'created_at', 'updated_at', 'approved_at'
        ]
        read_only_fields = ['owner', 'status', 'approved_at']

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_can_swap(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return (obj.status == 'available' and 
                obj.is_available_for_swap and 
                obj.owner != request.user)

    def get_can_redeem(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        user_points = request.user.profile.points_balance
        return (obj.status == 'available' and 
                obj.is_available_for_points and 
                obj.owner != request.user and 
                user_points >= obj.points_value)

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ClothingItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating clothing items with image upload"""
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = ClothingItem
        fields = [
            'title', 'description', 'category', 'type', 'size', 'condition',
            'points_value', 'is_available_for_swap', 'is_available_for_points',
            'tags', 'images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        validated_data['owner'] = self.context['request'].user
        item = ClothingItem.objects.create(**validated_data)
        
        for i, image_data in enumerate(images_data):
            ItemImage.objects.create(
                item=item,
                image=image_data,
                is_primary=(i == 0)  # First image is primary
            )
        
        return item


class SwapRequestSerializer(serializers.ModelSerializer):
    """Serializer for SwapRequest model"""
    requester = UserSerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    requester_item = ClothingItemSerializer(read_only=True)
    requested_item = ClothingItemSerializer(read_only=True)
    requester_item_id = serializers.IntegerField(write_only=True)
    requested_item_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            'id', 'requester_item', 'requested_item', 'requester', 'owner',
            'requester_item_id', 'requested_item_id', 'status', 'message',
            'response_message', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['requester', 'owner', 'completed_at']

    def validate(self, attrs):
        requester_item_id = attrs.get('requester_item_id')
        requested_item_id = attrs.get('requested_item_id')
        
        try:
            requester_item = ClothingItem.objects.get(id=requester_item_id)
            requested_item = ClothingItem.objects.get(id=requested_item_id)
        except ClothingItem.DoesNotExist:
            raise serializers.ValidationError("One or both items don't exist")

        user = self.context['request'].user
        
        # Validate requester owns the requester_item
        if requester_item.owner != user:
            raise serializers.ValidationError("You don't own the item you're offering")
        
        # Validate items are available
        if requester_item.status != 'available':
            raise serializers.ValidationError("Your item is not available for swapping")
        
        if requested_item.status != 'available':
            raise serializers.ValidationError("Requested item is not available")
        
        # Can't swap with yourself
        if requested_item.owner == user:
            raise serializers.ValidationError("You can't swap with yourself")
        
        # Check if swap already exists
        if SwapRequest.objects.filter(
            requester_item=requester_item,
            requested_item=requested_item,
            status='pending'
        ).exists():
            raise serializers.ValidationError("Swap request already exists")

        attrs['requester_item'] = requester_item
        attrs['requested_item'] = requested_item
        attrs['requester'] = user
        attrs['owner'] = requested_item.owner
        
        return attrs

    def create(self, validated_data):
        return SwapRequest.objects.create(**validated_data)


class PointsTransactionSerializer(serializers.ModelSerializer):
    """Serializer for PointsTransaction model"""
    user = UserSerializer(read_only=True)
    related_item = ClothingItemSerializer(read_only=True)

    class Meta:
        model = PointsTransaction
        fields = [
            'id', 'user', 'transaction_type', 'amount', 'description',
            'related_item', 'created_at'
        ]


class PointsRedemptionSerializer(serializers.ModelSerializer):
    """Serializer for PointsRedemption model"""
    user = UserSerializer(read_only=True)
    item = ClothingItemSerializer(read_only=True)
    item_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = PointsRedemption
        fields = [
            'id', 'user', 'item', 'item_id', 'points_used', 'status',
            'message', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['user', 'points_used', 'completed_at']

    def validate(self, attrs):
        item_id = attrs.get('item_id')
        
        try:
            item = ClothingItem.objects.get(id=item_id)
        except ClothingItem.DoesNotExist:
            raise serializers.ValidationError("Item doesn't exist")

        user = self.context['request'].user
        
        # Validate item is available for points redemption
        if item.status != 'available':
            raise serializers.ValidationError("Item is not available")
        
        if not item.is_available_for_points:
            raise serializers.ValidationError("Item is not available for points redemption")
        
        # Can't redeem your own item
        if item.owner == user:
            raise serializers.ValidationError("You can't redeem your own item")
        
        # Check if user has enough points
        if user.profile.points_balance < item.points_value:
            raise serializers.ValidationError("Insufficient points")
        
        # Check if redemption already exists
        if PointsRedemption.objects.filter(
            user=user,
            item=item,
            status='pending'
        ).exists():
            raise serializers.ValidationError("Redemption request already exists")

        attrs['item'] = item
        attrs['points_used'] = item.points_value
        
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return PointsRedemption.objects.create(**validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    related_item = ClothingItemSerializer(read_only=True)
    related_swap = SwapRequestSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'is_read',
            'related_item', 'related_swap', 'created_at'
        ]


class UserInteractionSerializer(serializers.ModelSerializer):
    """Serializer for UserInteraction model"""
    item = ClothingItemSerializer(read_only=True)

    class Meta:
        model = UserInteraction
        fields = [
            'id', 'interaction_type', 'item', 'search_query', 'created_at'
        ]


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for user dashboard statistics"""
    total_items = serializers.IntegerField()
    available_items = serializers.IntegerField()
    pending_items = serializers.IntegerField()
    points_balance = serializers.IntegerField()
    pending_swap_requests = serializers.IntegerField()
    ongoing_swaps = serializers.IntegerField()
    completed_swaps = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
