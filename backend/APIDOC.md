# ReWear Backend API Documentation

## Overview
ReWear is a community clothing exchange platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. This backend provides all the necessary APIs to support the platform's features.

## Features Implemented

### 🔐 Authentication System
- User registration with email/password
- Login/logout functionality
- Token-based authentication
- User profiles with points system

### 👕 Item Management
- Create, read, update clothing items
- Image upload support with automatic resizing
- Categories and filtering
- Advanced search functionality
- Admin moderation system

### 🔄 Swapping System
- Direct item-to-item swap requests
- Swap status tracking (pending, accepted, completed)
- Points-based redemption system
- Automatic points calculation and rewards

### 📊 User Dashboard
- Personal item overview
- Points balance and transaction history
- Ongoing and completed swaps
- Notifications system

### 👨‍💼 Admin Features
- Item moderation (approve/reject)
- User management
- Platform oversight tools

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Virtual environment

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   .venv\\Scripts\\activate

   # Linux/Mac
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Populate database with sample data:**
   ```bash
   python manage.py populate_db
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | User registration | No |
| POST | `/api/auth/login/` | User login | No |
| POST | `/api/auth/logout/` | User logout | Yes |

#### Registration Example:
```json
POST /api/auth/register/
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword",
    "password_confirm": "securepassword",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### Login Example:
```json
POST /api/auth/login/
{
    "username": "johndoe",
    "password": "securepassword"
}
```

### Profile & Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET/PUT | `/api/profile/` | Get/Update user profile | Yes |
| GET | `/api/dashboard/stats/` | Get dashboard statistics | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories/` | List all categories | No |

### Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/items/` | List all available items | No |
| POST | `/api/items/create/` | Create new item | Yes |
| GET | `/api/items/{id}/` | Get item details | No |
| PUT | `/api/items/{id}/update/` | Update own item | Yes |
| GET | `/api/items/featured/` | Get featured items | No |
| GET | `/api/items/my-items/` | Get user's items | Yes |
| GET | `/api/search/` | Search items | No |

#### Item Creation Example:
```json
POST /api/items/create/
Content-Type: multipart/form-data

{
    "title": "Vintage Denim Jacket",
    "description": "Classic blue denim jacket from the 90s",
    "category": 1,
    "type": "unisex",
    "size": "m",
    "condition": "excellent",
    "points_value": 25,
    "tags": "vintage, denim, 90s",
    "images": [file1, file2]
}
```

#### Search Parameters:
- `q`: Search query
- `category`: Category ID
- `type`: Item type (men, women, unisex, kids)
- `size`: Size (xs, s, m, l, xl, xxl, xxxl)
- `condition`: Condition (excellent, good, fair, poor)
- `min_points`: Minimum points value
- `max_points`: Maximum points value
- `availability`: Filter by availability (swap, points)

### Swap Requests

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swaps/` | List swap requests | Yes |
| POST | `/api/swaps/create/` | Create swap request | Yes |
| GET/PUT | `/api/swaps/{id}/` | View/Update swap request | Yes |

#### Swap Request Example:
```json
POST /api/swaps/create/
{
    "requester_item_id": 1,
    "requested_item_id": 2,
    "message": "I'd love to swap my jacket for your dress!"
}
```

#### Update Swap Status:
```json
PUT /api/swaps/{id}/
{
    "status": "accepted",
    "response_message": "Great! Let's make this swap happen."
}
```

### Points System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/points/transactions/` | List points transactions | Yes |
| POST | `/api/points/redeem/` | Redeem item with points | Yes |
| GET | `/api/points/redemptions/` | List redemption requests | Yes |

#### Points Redemption Example:
```json
POST /api/points/redeem/
{
    "item_id": 5,
    "message": "I'd like to redeem this item with my points"
}
```

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications/` | List notifications | Yes |
| POST | `/api/notifications/{id}/read/` | Mark notification as read | Yes |
| POST | `/api/notifications/read-all/` | Mark all as read | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/items/pending/` | List pending items | Admin |
| POST | `/api/admin/items/{id}/moderate/` | Approve/reject item | Admin |

#### Item Moderation Example:
```json
POST /api/admin/items/{id}/moderate/
{
    "action": "approve", // or "reject"
    "message": "Item looks great!"
}
```

## 🏗️ Database Models

### Core Models:
- **UserProfile**: Extended user information with points balance
- **Category**: Clothing categories (Shirts, Pants, etc.)
- **ClothingItem**: Main item model with all details
- **ItemImage**: Multiple images per item
- **SwapRequest**: Swap requests between users
- **PointsTransaction**: Points earning/spending history
- **PointsRedemption**: Points-based item redemptions
- **Notification**: User notification system
- **UserInteraction**: Analytics and tracking

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### CORS Settings
The backend is configured to accept requests from:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## 📱 Frontend Integration

### Authentication Headers
Include the authentication token in requests:
```javascript
headers: {
    'Authorization': 'Token your-auth-token-here',
    'Content-Type': 'application/json'
}
```

### File Uploads
For endpoints that accept file uploads, use `multipart/form-data`:
```javascript
const formData = new FormData();
formData.append('title', 'Item Title');
formData.append('images', file1);
formData.append('images', file2);

fetch('/api/items/create/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token your-auth-token'
    },
    body: formData
});
```

## 🧪 Testing

### Sample Users
The populate_db command creates sample users:
- Username: `john_doe`, Password: `password123`
- Username: `jane_smith`, Password: `password123`
- Username: `alex_johnson`, Password: `password123`

### Admin Access
Django admin interface available at: `http://localhost:8000/admin/`

## 🚀 Deployment Notes

1. **Static Files**: Configure static file serving for production
2. **Media Files**: Set up proper media file handling
3. **Database**: Use PostgreSQL for production
4. **Security**: Update SECRET_KEY and security settings
5. **CORS**: Update CORS settings for production domain

## 📝 Development Notes

### Points System
- Users earn 5 points for listing an item
- Users earn 10 points for completing a swap
- Points can be used to redeem items directly
- Starting bonus: 50 points for new users

### Item Status Flow
1. `pending` → Item awaiting admin approval
2. `available` → Item approved and available for swapping
3. `in_swap` → Item currently in a swap process
4. `swapped` → Item successfully swapped
5. `rejected` → Item rejected by admin

### Image Handling
- Images automatically resized to max 800x800px
- Primary image flag for main display
- Supports multiple images per item

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add proper docstrings to new functions
3. Update API documentation for new endpoints
4. Test all endpoints before committing

## 📞 Support

For any questions or issues with the backend API, please refer to this documentation or check the Django admin interface for data inspection.

## Problem Statement
ReWear – Community Clothing Exchange Overview: 
Develop ReWear, a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## Team Name : R2V2
Team 2551

## email
- vidita1812@gmail.com
