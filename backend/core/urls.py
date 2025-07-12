from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# URL patterns for the core app
urlpatterns = [
    # Authentication
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile and Dashboard
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    
    # Items
    path('items/', views.ClothingItemListView.as_view(), name='items-list'),
    path('items/create/', views.ClothingItemCreateView.as_view(), name='items-create'),
    path('items/<int:pk>/', views.ClothingItemDetailView.as_view(), name='items-detail'),
    path('items/<int:pk>/update/', views.ItemUpdateView.as_view(), name='items-update'),
    path('items/featured/', views.FeaturedItemsView.as_view(), name='items-featured'),
    path('items/my-items/', views.MyItemsView.as_view(), name='my-items'),
    path('search/', views.search_items, name='search'),
    
    # Swap Requests
    path('swaps/', views.SwapRequestListView.as_view(), name='swaps-list'),
    path('swaps/create/', views.SwapRequestCreateView.as_view(), name='swaps-create'),
    path('swaps/<int:pk>/', views.SwapRequestDetailView.as_view(), name='swaps-detail'),
    
    # Points
    path('points/transactions/', views.PointsTransactionListView.as_view(), name='points-transactions'),
    path('points/redeem/', views.PointsRedemptionCreateView.as_view(), name='points-redeem'),
    path('points/redemptions/', views.PointsRedemptionListView.as_view(), name='points-redemptions'),
    
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='notification-read'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='notifications-read-all'),
    
    # Admin/Moderation
    path('admin/items/pending/', views.AdminItemModerationView.as_view(), name='admin-items-pending'),
    path('admin/items/<int:item_id>/moderate/', views.moderate_item, name='admin-moderate-item'),
    
    # Test endpoint
    path('hello/', views.HelloView.as_view(), name='hello'),
]
