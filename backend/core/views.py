from rest_framework import generics, status, filters, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    UserProfile, Category, ClothingItem, ItemImage, SwapRequest,
    PointsTransaction, PointsRedemption, Notification, UserInteraction
)
from .serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    UserLoginSerializer, CategorySerializer, ClothingItemSerializer,
    ClothingItemCreateSerializer, SwapRequestSerializer,
    PointsTransactionSerializer, PointsRedemptionSerializer,
    NotificationSerializer, UserInteractionSerializer,
    DashboardStatsSerializer
)


class HelloView(APIView):
    """Simple hello endpoint for testing"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({"message": "Hello, ReWear!"})


# Authentication Views
class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create token for the user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """User login endpoint"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'profile': UserProfileSerializer(user.profile).data,
            'token': token.key,
            'message': 'Login successful'
        })


class LogoutView(APIView):
    """User logout endpoint"""
    def post(self, request):
        if request.user.is_authenticated:
            # Delete the token
            try:
                request.user.auth_token.delete()
            except:
                pass
            logout(request)
        
        return Response({'message': 'Logout successful'})


# Profile Views
class ProfileView(generics.RetrieveUpdateAPIView):
    """User profile view"""
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class DashboardStatsView(APIView):
    """Dashboard statistics for the user"""
    
    def get(self, request):
        user = request.user
        
        # Get user statistics
        stats = {
            'total_items': user.owned_items.count(),
            'available_items': user.owned_items.filter(status='available').count(),
            'pending_items': user.owned_items.filter(status='pending').count(),
            'points_balance': user.profile.points_balance,
            'pending_swap_requests': user.received_swap_requests.filter(status='pending').count(),
            'ongoing_swaps': user.sent_swap_requests.filter(status='accepted').count() + 
                           user.received_swap_requests.filter(status='accepted').count(),
            'completed_swaps': user.sent_swap_requests.filter(status='completed').count() + 
                             user.received_swap_requests.filter(status='completed').count(),
            'unread_notifications': user.notifications.filter(is_read=False).count(),
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


# Category Views
class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


# Item Views
class ItemPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ClothingItemListView(generics.ListAPIView):
    """List clothing items with filtering and search"""
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ItemPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'type', 'size', 'condition', 'status']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'points_value', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = ClothingItem.objects.filter(status='available').select_related(
            'owner', 'category'
        ).prefetch_related('images')
        
        # Additional filtering
        min_points = self.request.query_params.get('min_points')
        max_points = self.request.query_params.get('max_points')
        
        if min_points:
            queryset = queryset.filter(points_value__gte=min_points)
        if max_points:
            queryset = queryset.filter(points_value__lte=max_points)
        
        # Filter by availability type
        availability = self.request.query_params.get('availability')
        if availability == 'swap':
            queryset = queryset.filter(is_available_for_swap=True)
        elif availability == 'points':
            queryset = queryset.filter(is_available_for_points=True)
        
        return queryset


class ClothingItemDetailView(generics.RetrieveAPIView):
    """Get detailed view of a clothing item"""
    queryset = ClothingItem.objects.all()
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track user interaction if authenticated
        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='view',
                item=instance
            )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ClothingItemCreateView(generics.CreateAPIView):
    """Create a new clothing item"""
    serializer_class = ClothingItemCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        
        # Award points for listing an item
        PointsTransaction.objects.create(
            user=request.user,
            transaction_type='earned',
            amount=5,
            description='Points earned for listing an item',
            related_item=item
        )
        
        # Update user's points balance
        request.user.profile.points_balance += 5
        request.user.profile.save()
        
        return Response(
            ClothingItemSerializer(item, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class MyItemsView(generics.ListAPIView):
    """List user's own items"""
    serializer_class = ClothingItemSerializer
    pagination_class = ItemPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'status', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.request.user.owned_items.all().select_related(
            'category'
        ).prefetch_related('images')


class ItemUpdateView(generics.RetrieveUpdateAPIView):
    """Update user's own item"""
    serializer_class = ClothingItemSerializer

    def get_queryset(self):
        return self.request.user.owned_items.all()


# Swap Request Views
class SwapRequestCreateView(generics.CreateAPIView):
    """Create a new swap request"""
    serializer_class = SwapRequestSerializer


class SwapRequestListView(generics.ListAPIView):
    """List swap requests (sent and received)"""
    serializer_class = SwapRequestSerializer
    pagination_class = ItemPagination
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        request_type = self.request.query_params.get('type', 'all')
        
        if request_type == 'sent':
            return user.sent_swap_requests.all()
        elif request_type == 'received':
            return user.received_swap_requests.all()
        else:
            return SwapRequest.objects.filter(
                Q(requester=user) | Q(owner=user)
            ).select_related(
                'requester', 'owner', 'requester_item', 'requested_item'
            )


class SwapRequestDetailView(generics.RetrieveUpdateAPIView):
    """View and update swap request"""
    serializer_class = SwapRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(
            Q(requester=user) | Q(owner=user)
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Only the owner can accept/reject
        if instance.owner != request.user:
            return Response(
                {'error': 'Only the item owner can update this request'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        
        if new_status == 'accepted':
            # Mark both items as in_swap
            instance.requester_item.status = 'in_swap'
            instance.requested_item.status = 'in_swap'
            instance.requester_item.save()
            instance.requested_item.save()
            
            # Create notifications
            Notification.objects.create(
                user=instance.requester,
                notification_type='swap_accepted',
                title='Swap Request Accepted',
                message=f'Your swap request for {instance.requested_item.title} has been accepted!',
                related_swap=instance
            )
            
        elif new_status == 'completed':
            # Mark both items as swapped and award points
            instance.requester_item.status = 'swapped'
            instance.requested_item.status = 'swapped'
            instance.requester_item.save()
            instance.requested_item.save()
            
            instance.completed_at = timezone.now()
            
            # Award completion points to both users
            for user in [instance.requester, instance.owner]:
                PointsTransaction.objects.create(
                    user=user,
                    transaction_type='earned',
                    amount=10,
                    description='Points earned for completing a swap',
                    related_item=instance.requester_item if user == instance.requester else instance.requested_item
                )
                user.profile.points_balance += 10
                user.profile.save()
        
        return super().update(request, *args, **kwargs)


# Points Views
class PointsTransactionListView(generics.ListAPIView):
    """List user's points transactions"""
    serializer_class = PointsTransactionSerializer
    pagination_class = ItemPagination
    ordering = ['-created_at']

    def get_queryset(self):
        return self.request.user.points_transactions.all()


class PointsRedemptionCreateView(generics.CreateAPIView):
    """Create a points redemption request"""
    serializer_class = PointsRedemptionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        redemption = serializer.save()
        
        # Deduct points immediately (pending redemption)
        user = request.user
        user.profile.points_balance -= redemption.points_used
        user.profile.save()
        
        # Create transaction record
        PointsTransaction.objects.create(
            user=user,
            transaction_type='redeemed',
            amount=-redemption.points_used,
            description=f'Points redeemed for {redemption.item.title}',
            related_item=redemption.item
        )
        
        # Notify item owner
        Notification.objects.create(
            user=redemption.item.owner,
            notification_type='points_redeemed',
            title='Item Redeemed with Points',
            message=f'{user.username} wants to redeem your item "{redemption.item.title}" for {redemption.points_used} points',
            related_item=redemption.item
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PointsRedemptionListView(generics.ListAPIView):
    """List user's points redemptions"""
    serializer_class = PointsRedemptionSerializer
    pagination_class = ItemPagination
    ordering = ['-created_at']

    def get_queryset(self):
        return self.request.user.point_redemptions.all()


# Notification Views
class NotificationListView(generics.ListAPIView):
    """List user's notifications"""
    serializer_class = NotificationSerializer
    pagination_class = ItemPagination
    ordering = ['-created_at']

    def get_queryset(self):
        return self.request.user.notifications.all()


@api_view(['POST'])
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        notification = request.user.notifications.get(id=notification_id)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    request.user.notifications.filter(is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read'})


# Featured Items View
class FeaturedItemsView(generics.ListAPIView):
    """Get featured items for the landing page"""
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ItemPagination

    def get_queryset(self):
        # Return recently added, high-quality items
        return ClothingItem.objects.filter(
            status='available',
            condition__in=['excellent', 'good']
        ).select_related('owner', 'category').prefetch_related('images').order_by('-created_at')[:10]


# Search and Recommendations
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_items(request):
    """Advanced search for items"""
    query = request.GET.get('q', '')
    category = request.GET.get('category')
    item_type = request.GET.get('type')
    size = request.GET.get('size')
    condition = request.GET.get('condition')
    min_points = request.GET.get('min_points')
    max_points = request.GET.get('max_points')
    
    queryset = ClothingItem.objects.filter(status='available')
    
    if query:
        queryset = queryset.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(tags__icontains=query)
        )
        
        # Track search interaction
        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='search',
                search_query=query
            )
    
    if category:
        queryset = queryset.filter(category_id=category)
    if item_type:
        queryset = queryset.filter(type=item_type)
    if size:
        queryset = queryset.filter(size=size)
    if condition:
        queryset = queryset.filter(condition=condition)
    if min_points:
        queryset = queryset.filter(points_value__gte=min_points)
    if max_points:
        queryset = queryset.filter(points_value__lte=max_points)
    
    # Paginate results
    paginator = ItemPagination()
    page = paginator.paginate_queryset(queryset.order_by('-created_at'), request)
    serializer = ClothingItemSerializer(page, many=True, context={'request': request})
    
    return paginator.get_paginated_response(serializer.data)


# Admin Views (for moderation)
class AdminItemModerationView(generics.ListAPIView):
    """Admin view for moderating items"""
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = ItemPagination
    filter_backends = [filters.OrderingFilter]
    ordering = ['created_at']

    def get_queryset(self):
        return ClothingItem.objects.filter(status='pending').select_related(
            'owner', 'category'
        ).prefetch_related('images')


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def moderate_item(request, item_id):
    """Approve or reject an item"""
    try:
        item = ClothingItem.objects.get(id=item_id)
    except ClothingItem.DoesNotExist:
        return Response(
            {'error': 'Item not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    action = request.data.get('action')  # 'approve' or 'reject'
    message = request.data.get('message', '')
    
    if action == 'approve':
        item.status = 'available'
        item.approved_at = timezone.now()
        item.approved_by = request.user
        notification_type = 'item_approved'
        notification_title = 'Item Approved'
        notification_message = f'Your item "{item.title}" has been approved and is now available for swapping!'
        
    elif action == 'reject':
        item.status = 'rejected'
        notification_type = 'item_rejected'
        notification_title = 'Item Rejected'
        notification_message = f'Your item "{item.title}" has been rejected. Reason: {message}'
        
    else:
        return Response(
            {'error': 'Invalid action'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    item.save()
    
    # Create notification for the item owner
    Notification.objects.create(
        user=item.owner,
        notification_type=notification_type,
        title=notification_title,
        message=notification_message,
        related_item=item
    )
    
    return Response({
        'message': f'Item {action}d successfully',
        'item': ClothingItemSerializer(item).data
    })
