# ReWear API - Postman Collection Guide

## 📋 Overview
This guide explains how to use the Postman collection for testing the ReWear Backend API. The collection includes all available endpoints with sample requests and automated token handling.

## 📦 Files Included
1. **ReWear_API_Collection.postman_collection.json** - Complete API collection
2. **ReWear_Development_Environment.postman_environment.json** - Environment variables
3. **POSTMAN_GUIDE.md** - This documentation file

## 🚀 Setup Instructions

### 1. Import Collection and Environment
1. Open Postman
2. Click **Import** button
3. Drag and drop both JSON files:
   - `ReWear_API_Collection.postman_collection.json`
   - `ReWear_Development_Environment.postman_environment.json`
4. Select **ReWear Development Environment** from the environment dropdown

### 2. Start Django Server
Ensure your Django development server is running:
```bash
cd backend
python manage.py runserver
```

### 3. Verify Setup
Test the "Hello World" endpoint to confirm everything is working:
- Navigate to **Testing & Utilities** → **Hello World (Test Endpoint)**
- Click **Send**
- You should receive: `{"message": "Hello, ReWear!"}`

## 🔐 Authentication Flow

### Quick Start with Sample User
1. **Login with Sample User**:
   - Go to **Authentication** → **Login User**
   - The request body already contains sample credentials: `john_doe` / `password123`
   - Click **Send**
   - The auth token will be automatically saved to environment variables

2. **Register New User** (Alternative):
   - Go to **Authentication** → **Register User**
   - Modify the request body with your details
   - Click **Send**
   - The auth token will be automatically saved

### Admin Authentication
For admin endpoints, you'll need an admin token:
1. Create a superuser: `python manage.py createsuperuser`
2. Login using admin credentials
3. Copy the token to the `admin_token` environment variable

## 📚 Collection Structure

### 🔐 Authentication
- **Register User** - Create new user account
- **Login User** - Authenticate and get token
- **Logout User** - End session

### 👤 Profile & Dashboard
- **Get User Profile** - Retrieve user profile information
- **Update User Profile** - Modify profile details
- **Get Dashboard Stats** - Get user statistics

### 📂 Categories
- **Get All Categories** - List all clothing categories

### 👕 Items
- **Get All Items** - List available items with pagination
- **Get Items with Filters** - Filter by category, size, condition, etc.
- **Search Items** - Search items by keyword
- **Get Featured Items** - Get featured items for landing page
- **Get Item Details** - Detailed view of specific item
- **Create New Item** - Add new clothing item
- **Get My Items** - List user's own items
- **Update My Item** - Modify own items

### 🔄 Swap Requests
- **Get All Swap Requests** - All swap requests (sent + received)
- **Get Sent Swap Requests** - Only sent requests
- **Get Received Swap Requests** - Only received requests
- **Create Swap Request** - Initiate item swap
- **Get Swap Request Details** - View specific swap
- **Accept Swap Request** - Approve incoming swap
- **Reject Swap Request** - Decline incoming swap
- **Complete Swap** - Mark swap as completed

### 💰 Points System
- **Get Points Transactions** - View points history
- **Redeem Item with Points** - Use points to get items
- **Get Points Redemptions** - View redemption requests

### 🔔 Notifications
- **Get All Notifications** - List user notifications
- **Mark Notification as Read** - Mark single notification
- **Mark All Notifications as Read** - Mark all as read

### 👨‍💼 Admin Functions
- **Get Pending Items for Moderation** - Items awaiting approval
- **Approve Item** - Approve pending item
- **Reject Item** - Reject pending item

## 🎯 Testing Scenarios

### Scenario 1: Complete User Journey
1. **Register** a new user
2. **Get Categories** to see available options
3. **Create New Item** with sample data
4. **Get My Items** to see the created item
5. **Browse Items** to find swappable items
6. **Create Swap Request** with another user's item
7. **Check Dashboard Stats** to see updated counts

### Scenario 2: Admin Workflow
1. **Login** as admin user
2. **Get Pending Items** to see items awaiting moderation
3. **Approve** or **Reject** items
4. **Verify** items are now available in the general listing

### Scenario 3: Points System
1. **Get Points Transactions** to see current balance
2. **Find Item** available for points redemption
3. **Redeem Item** using points
4. **Check Updated Balance** in profile

## 🔧 Environment Variables

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `base_url` | API base URL | Manual |
| `auth_token` | User authentication token | Auto (login/register) |
| `admin_token` | Admin authentication token | Manual |
| `user_id` | Current user ID | Auto (login/register) |
| `username` | Current username | Auto (login/register) |
| `item_id` | Sample item ID for testing | Manual |
| `my_item_id` | User's own item ID | Manual |
| `swap_id` | Swap request ID | Manual |
| `notification_id` | Notification ID | Manual |
| `category_id` | Category ID for filtering | Manual |

## 📝 Sample Data Available

After running `python manage.py populate_db`, you'll have:

### Sample Users
- **john_doe** / password123
- **jane_smith** / password123  
- **alex_johnson** / password123

### Sample Categories
1. Shirts
2. Pants
3. Dresses
4. Outerwear
5. Shoes
6. Accessories
7. Sportswear
8. Formal Wear

### Sample Items
- Vintage Denim Jacket (john_doe)
- Black Summer Dress (jane_smith)
- Nike Running Shoes (alex_johnson)
- Cotton T-Shirt (john_doe)
- Designer Handbag (jane_smith)

## 🐛 Common Issues & Solutions

### Issue: "Authentication credentials were not provided"
**Solution**: Ensure you're logged in and the `auth_token` is set in environment variables

### Issue: "404 Not Found"
**Solution**: Check if Django server is running on http://localhost:8000

### Issue: "Invalid credentials"
**Solution**: Verify username/password or ensure sample data is loaded

### Issue: "Token not found in environment"
**Solution**: Run login request first, or manually set the token

## 📊 Response Examples

### Successful Login Response
```json
{
    "user": {
        "id": 2,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "profile": {
        "bio": "Hi, I'm John! I love sustainable fashion.",
        "location": "New York, NY",
        "points_balance": 50
    },
    "token": "a1b2c3d4e5f6789012345678901234567890abcd",
    "message": "Login successful"
}
```

### Item List Response
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Vintage Denim Jacket",
            "description": "Classic blue denim jacket from the 90s",
            "category": {
                "id": 4,
                "name": "Outerwear"
            },
            "type": "unisex",
            "size": "m",
            "condition": "excellent",
            "points_value": 25,
            "can_swap": true,
            "can_redeem": true
        }
    ]
}
```

## 🎉 Tips for Effective Testing

1. **Use Environment Variables**: Update item IDs, swap IDs after creating them
2. **Test Error Cases**: Try invalid data to test validation
3. **Check Authentication**: Test both authenticated and non-authenticated requests
4. **Test Pagination**: Use page parameters on list endpoints
5. **Verify Side Effects**: Check if points are updated after swaps
6. **Test Permissions**: Ensure users can only modify their own items

## 🔄 Automation Scripts

The collection includes pre-request and test scripts for:
- **Auto Token Management**: Automatically saves tokens from login/register
- **Environment Updates**: Updates user info after authentication
- **Response Validation**: Basic response code checking

## 📞 Support

If you encounter issues with the Postman collection:
1. Verify Django server is running
2. Check environment variable setup
3. Ensure sample data is loaded
4. Review request body formats
5. Check console for detailed error messages

Happy testing! 🚀
