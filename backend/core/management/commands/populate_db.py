from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Category, ClothingItem, UserProfile, PointsTransaction
from django.utils import timezone


class Command(BaseCommand):
    help = 'Populate the database with initial categories and sample data'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {'name': 'Shirts', 'description': 'T-shirts, dress shirts, blouses, and tops'},
            {'name': 'Pants', 'description': 'Jeans, trousers, leggings, and pants'},
            {'name': 'Dresses', 'description': 'Casual dresses, formal dresses, and gowns'},
            {'name': 'Outerwear', 'description': 'Jackets, coats, sweaters, and hoodies'},
            {'name': 'Shoes', 'description': 'Sneakers, boots, sandals, and formal shoes'},
            {'name': 'Accessories', 'description': 'Bags, belts, hats, and jewelry'},
            {'name': 'Sportswear', 'description': 'Athletic wear, gym clothes, and activewear'},
            {'name': 'Formal Wear', 'description': 'Business attire, suits, and formal clothing'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name}')
                )

        # Create sample users if they don't exist
        sample_users_data = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'username': 'alex_johnson', 'email': 'alex@example.com', 'first_name': 'Alex', 'last_name': 'Johnson'},
        ]

        for user_data in sample_users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                
                # Create user profile
                profile, profile_created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'bio': f'Hi, I\'m {user.first_name}! I love sustainable fashion.',
                        'location': 'New York, NY',
                        'points_balance': 50  # Starting points
                    }
                )
                
                if profile_created:
                    # Create initial points transaction
                    PointsTransaction.objects.create(
                        user=user,
                        transaction_type='bonus',
                        amount=50,
                        description='Welcome bonus points'
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {user.username}')
                )

        # Create sample clothing items
        sample_items_data = [
            {
                'title': 'Vintage Denim Jacket',
                'description': 'Classic blue denim jacket from the 90s. Perfect condition with minimal wear.',
                'category': 'Outerwear',
                'type': 'unisex',
                'size': 'm',
                'condition': 'excellent',
                'points_value': 25,
                'tags': 'vintage, denim, 90s, classic',
                'owner': 'john_doe'
            },
            {
                'title': 'Black Summer Dress',
                'description': 'Elegant black dress perfect for summer events. Light and breathable fabric.',
                'category': 'Dresses',
                'type': 'women',
                'size': 's',
                'condition': 'good',
                'points_value': 20,
                'tags': 'summer, elegant, black, formal',
                'owner': 'jane_smith'
            },
            {
                'title': 'Nike Running Shoes',
                'description': 'Comfortable Nike running shoes, size 10. Great for daily runs and workouts.',
                'category': 'Shoes',
                'type': 'unisex',
                'size': 'l',
                'condition': 'good',
                'points_value': 30,
                'tags': 'nike, running, sports, comfortable',
                'owner': 'alex_johnson'
            },
            {
                'title': 'Cotton T-Shirt',
                'description': 'Basic white cotton t-shirt. Soft and comfortable, perfect for casual wear.',
                'category': 'Shirts',
                'type': 'unisex',
                'size': 'm',
                'condition': 'excellent',
                'points_value': 15,
                'tags': 'cotton, basic, white, casual',
                'owner': 'john_doe'
            },
            {
                'title': 'Designer Handbag',
                'description': 'Luxury designer handbag in excellent condition. Perfect for special occasions.',
                'category': 'Accessories',
                'type': 'women',
                'size': 'm',
                'condition': 'excellent',
                'points_value': 40,
                'tags': 'designer, luxury, handbag, special',
                'owner': 'jane_smith'
            },
        ]

        for item_data in sample_items_data:
            try:
                category = Category.objects.get(name=item_data['category'])
                owner = User.objects.get(username=item_data['owner'])
                
                item, created = ClothingItem.objects.get_or_create(
                    title=item_data['title'],
                    owner=owner,
                    defaults={
                        'description': item_data['description'],
                        'category': category,
                        'type': item_data['type'],
                        'size': item_data['size'],
                        'condition': item_data['condition'],
                        'points_value': item_data['points_value'],
                        'tags': item_data['tags'],
                        'status': 'available',  # Auto-approve sample items
                        'approved_at': timezone.now(),
                    }
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Created item: {item.title}')
                    )
                    
            except (Category.DoesNotExist, User.DoesNotExist) as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating item {item_data["title"]}: {e}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with initial data!')
        )
