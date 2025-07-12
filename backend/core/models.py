from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from PIL import Image
import os


class UserProfile(models.Model):
    """Extended user profile with additional information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    points_balance = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Category(models.Model):
    """Clothing categories like Shirts, Pants, Dresses, etc."""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class ClothingItem(models.Model):
    """Main model for clothing items"""
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]

    SIZE_CHOICES = [
        ('xs', 'Extra Small'),
        ('s', 'Small'),
        ('m', 'Medium'),
        ('l', 'Large'),
        ('xl', 'Extra Large'),
        ('xxl', '2X Large'),
        ('xxxl', '3X Large'),
    ]

    TYPE_CHOICES = [
        ('men', "Men's"),
        ('women', "Women's"),
        ('unisex', 'Unisex'),
        ('kids', 'Kids'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('available', 'Available'),
        ('in_swap', 'In Swap Process'),
        ('swapped', 'Swapped'),
        ('rejected', 'Rejected'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    
    # Owner and status
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_items')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    # Points and availability
    points_value = models.IntegerField(default=10, validators=[MinValueValidator(1), MaxValueValidator(100)])
    is_available_for_swap = models.BooleanField(default=True)
    is_available_for_points = models.BooleanField(default=True)
    
    # Tags for better searchability
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='approved_items')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.owner.username}"

    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []


class ItemImage(models.Model):
    """Images for clothing items"""
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='item_images/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'uploaded_at']

    def __str__(self):
        return f"Image for {self.item.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Resize image to optimize storage
        if self.image:
            img = Image.open(self.image.path)
            if img.height > 800 or img.width > 800:
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                img.save(self.image.path)


class SwapRequest(models.Model):
    """Model for swap requests between users"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    # Items being swapped
    requester_item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, 
                                     related_name='outgoing_swap_requests')
    requested_item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, 
                                     related_name='incoming_swap_requests')
    
    # Users involved
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_swap_requests')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_swap_requests')
    
    # Status and messaging
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, help_text="Optional message from requester")
    response_message = models.TextField(blank=True, help_text="Optional response from owner")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['requester_item', 'requested_item']
        ordering = ['-created_at']

    def __str__(self):
        return f"Swap: {self.requester_item.title} for {self.requested_item.title}"


class PointsTransaction(models.Model):
    """Track points transactions for redemptions and rewards"""
    TRANSACTION_TYPES = [
        ('earned', 'Points Earned'),
        ('redeemed', 'Points Redeemed'),
        ('bonus', 'Bonus Points'),
        ('penalty', 'Penalty'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='points_transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.IntegerField()  # Can be negative for redemptions
    description = models.CharField(max_length=200)
    related_item = models.ForeignKey(ClothingItem, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.amount} points ({self.transaction_type})"


class PointsRedemption(models.Model):
    """Model for redeeming items with points"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_redemptions')
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, related_name='point_redemptions')
    points_used = models.IntegerField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} redeemed {self.item.title} for {self.points_used} points"


class Notification(models.Model):
    """User notifications system"""
    NOTIFICATION_TYPES = [
        ('swap_request', 'New Swap Request'),
        ('swap_accepted', 'Swap Request Accepted'),
        ('swap_rejected', 'Swap Request Rejected'),
        ('swap_completed', 'Swap Completed'),
        ('item_approved', 'Item Approved'),
        ('item_rejected', 'Item Rejected'),
        ('points_earned', 'Points Earned'),
        ('points_redeemed', 'Points Redeemed'),
        ('general', 'General Notification'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, null=True, blank=True)
    related_swap = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"


class UserInteraction(models.Model):
    """Track user interactions for analytics and recommendations"""
    INTERACTION_TYPES = [
        ('view', 'Viewed Item'),
        ('like', 'Liked Item'),
        ('unlike', 'Unliked Item'),
        ('search', 'Searched'),
        ('filter', 'Applied Filter'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, null=True, blank=True, 
                           related_name='interactions')
    search_query = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} {self.interaction_type}"
