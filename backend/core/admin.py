from django.contrib import admin
from django.utils.html import format_html
from .models import (
    UserProfile, Category, ClothingItem, ItemImage, SwapRequest,
    PointsTransaction, PointsRedemption, Notification, UserInteraction
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'points_balance', 'location', 'created_at']
    list_filter = ['created_at', 'location']
    search_fields = ['user__username', 'user__email', 'location']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'items_count', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']

    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items Count'


class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1
    readonly_fields = ['uploaded_at']


@admin.register(ClothingItem)
class ClothingItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'category', 'type', 'size', 'condition', 
                   'status', 'points_value', 'created_at']
    list_filter = ['status', 'category', 'type', 'size', 'condition', 'created_at']
    search_fields = ['title', 'description', 'owner__username', 'tags']
    readonly_fields = ['created_at', 'updated_at', 'approved_at']
    inlines = [ItemImageInline]
    
    actions = ['approve_items', 'reject_items']

    def approve_items(self, request, queryset):
        from django.utils import timezone
        updated = queryset.filter(status='pending').update(
            status='available',
            approved_at=timezone.now(),
            approved_by=request.user
        )
        self.message_user(request, f'{updated} items were approved.')
    approve_items.short_description = "Approve selected items"

    def reject_items(self, request, queryset):
        updated = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f'{updated} items were rejected.')
    reject_items.short_description = "Reject selected items"


@admin.register(ItemImage)
class ItemImageAdmin(admin.ModelAdmin):
    list_display = ['item', 'image_preview', 'is_primary', 'uploaded_at']
    list_filter = ['is_primary', 'uploaded_at']
    readonly_fields = ['uploaded_at']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'


@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ['requester', 'owner', 'requester_item', 'requested_item', 
                   'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['requester__username', 'owner__username', 
                    'requester_item__title', 'requested_item__title']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']


@admin.register(PointsTransaction)
class PointsTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'amount', 'description', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['user__username', 'description']
    readonly_fields = ['created_at']


@admin.register(PointsRedemption)
class PointsRedemptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'points_used', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'item__title']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'title', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at']

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = "Mark selected notifications as read"

    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications marked as unread.')
    mark_as_unread.short_description = "Mark selected notifications as unread"


@admin.register(UserInteraction)
class UserInteractionAdmin(admin.ModelAdmin):
    list_display = ['user', 'interaction_type', 'item', 'search_query', 'created_at']
    list_filter = ['interaction_type', 'created_at']
    search_fields = ['user__username', 'search_query']
    readonly_fields = ['created_at']
