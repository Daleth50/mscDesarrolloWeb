# Backend Structure

## Overview

The backend of AppWeb POS is a REST API built with Flask that implements Clean Architecture to ensure clear separation of concerns, scalability, and maintainability.

---

## Directory Structure

```
backend/
├── app/                           # Main application code
│   ├── __init__.py               # Application factory (create_app)
│   ├── config.py                 # Configuration by environment
│   ├── database.py               # SQLAlchemy initialization
│   ├── auth.py                   # Authentication decorators and logic
│   │
│   ├── models/                   # ENTITIES (Clean Architecture Layer)
│   │   ├── __init__.py
│   │   ├── base.py              # Base class for all models
│   │   ├── pos.py               # Entity: Point of sale/Transaction
│   │   └── inventory/           # Domain: Inventory Management
│   │       ├── product.py       # Entity: Product
│   │       ├── category.py      # Entity: Category
│   │       └── movement.py      # Entity: Stock movement
│   │
│   ├── controllers/              # USE CASES (Business Logic)
│   │   ├── __init__.py
│   │   ├── main.py              # Main controller
│   │   ├── user.py              # Use cases: Users
│   │   ├── bill_account.py      # Use cases: Accounts receivable
│   │   │
│   │   ├── product/             # Domain: Products
│   │   │   ├── __init__.py
│   │   │   ├── create.py        # Use case: Create product
│   │   │   ├── list.py          # Use case: List products
│   │   │   └── movements.py     # Use case: Stock movements
│   │   │
│   │   ├── contact/             # Domain: Contacts
│   │   │   ├── __init__.py
│   │   │   ├── create.py        # Use case: Create contact
│   │   │   ├── list.py          # Use case: List contacts
│   │   │   └── update.py        # Use case: Update contact
│   │   │
│   │   ├── order/               # Domain: Orders
│   │   │   ├── __init__.py
│   │   │   ├── create.py        # Use case: Create order
│   │   │   ├── list.py          # Use case: List orders
│   │   │   ├── sales.py         # Use case: Sales orders
│   │   │   └── purchases.py     # Use case: Purchase orders
│   │   │
│   │   └── report/              # Domain: Reports
│   │       ├── __init__.py
│   │       └── overview.py      # Use case: General report
│   │
│   ├── routes/                   # INTERFACE ADAPTERS (API Endpoints)
│   │   ├── __init__.py          # Blueprint registration
│   │   ├── main.py              # Main routes (/health)
│   │   └── api.py               # All /api/* routes
│   │
│   ├── view_model/               # DTOs (Response Serialization)
│   │   ├── __init__.py
│   │   ├── main.py              # Main ViewModels
│   │   │
│   │   ├── product/             # DTOs for products
│   │   │   ├── __init__.py
│   │   │   ├── list.py          # DTO: Product list
│   │   │   └── detail.py        # DTO: Product detail
│   │   │
│   │   ├── order/               # DTOs for orders
│   │   │   ├── __init__.py
│   │   │   ├── list.py          # DTO: Order list
│   │   │   └── detail.py        # DTO: Order detail
│   │   │
│   │   └── contact/             # DTOs for contacts
│   │       ├── __init__.py
│   │       ├── list.py          # DTO: Contact list
│   │       └── detail.py        # DTO: Contact detail
│   │
│   ├── scripts/                  # Utilities and scripts
│   │   ├── __init__.py
│   │   └── dev.py              # Script to run in development
│   │
│   ├── static/
│   │   └── dist/               # Frontend build (production)
│   │
│   └── services/               # Specialized services (future)
│       └── (optional: External API integration, etc.)
│
├── migrations/                 # Alembic migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 20260227_add_kind_to_contacts.py
│       └── 20260506_add_geolocation_to_contacts.py
│
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── run.py                    # Main entry point
```

---

## Architecture Layers

### 1. Models (Entities) - app/models/

Responsibility: Represent the business domain.

Characteristics:
- SQLAlchemy classes that map database tables
- Contain fundamental business rules
- Completely independent of HTTP, routes, etc.
- Foundation for the entire application

Example: Product
```python
# app/models/inventory/product.py
from app.database import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    sku = db.Column(db.String(50), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
    def calculate_sell_price(self, margin_percentage):
        return self.price * (1 + margin_percentage / 100)
```

Conventions:
- Singular names (Product, Order, Contact)
- Inherit from db.Model
- Define __tablename__ explicitly
- Use explicit data types

---

### 2. Controllers (Use Cases) - app/controllers/

Responsibility: Implement use cases (what to do, not how).

Characteristics:
- Orchestrate interactions between entities
- Contain business logic
- Handle persistence (db.session)
- Be agnostic to HTTP

Example: ProductController
```python
# app/controllers/product/create.py
from app.models.inventory import Product, Category
from app.database import db

class ProductController:
    def create_product(self, name, sku, price, category_id):
        if price <= 0:
            raise ValueError("Price must be greater than 0")
        
        category = Category.query.get(category_id)
        if not category:
            raise ValueError("Category not found")
        
        product = Product(
            name=name,
            sku=sku,
            price=price,
            category_id=category_id
        )
        
        db.session.add(product)
        db.session.commit()
        
        return product
```

Structure by domain:
```
controllers/
├── product/
│   ├── create.py    → ProductController.create_product()
│   ├── list.py      → ProductController.list_products()
│   └── movements.py → ProductMovementController.get_movements()
├── order/
│   ├── create.py    → OrderController.create_order()
│   └── sales.py     → SalesController.process_sale()
└── report/
    └── overview.py  → ReportController.generate_overview()
```

Principles:
- One controller per domain/aggregate
- Specific methods for each use case
- Inject dependencies in __init__
- Do not access HTTP request or response
- Return entities, not JSON

---

### 3. Routes (Interface Adapters) - app/routes/

Responsibility: Adapt HTTP requests to use cases.

Characteristics:
- Flask endpoints (blueprints)
- Validate HTTP input
- Serialize responses
- Handle authentication/authorization

Example: API Routes
```python
# app/routes/api.py
from flask import request, jsonify
from app.auth import token_required
from app.controllers.product.create import ProductController
from app.view_model.product.list import ProductListViewModel

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/products', methods=['POST'])
@token_required
def create_product():
    data = request.get_json()
    
    if not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Missing fields'}), 400
    
    controller = ProductController()
    product = controller.create_product(
        name=data['name'],
        sku=data['sku'],
        price=data['price'],
        category_id=data['category_id']
    )
    
    view_model = ProductListViewModel(product)
    return jsonify(view_model.to_dict()), 201
```

Structure:
- Blueprints by version or domain
- @token_required decorators for protection
- Import controllers and view models
- Handle HTTP errors

Available routes:
```
GET    /api/products                 # List products
POST   /api/products                 # Create product
GET    /api/products/<id>            # Product detail
PUT    /api/products/<id>            # Update product
DELETE /api/products/<id>            # Delete product

GET    /api/orders                   # List orders
POST   /api/orders                   # Create order
GET    /api/orders/sales             # Sales orders
GET    /api/orders/purchases         # Purchase orders

# POS Cart (sales flow)
GET    /api/pos/bill-accounts        # List bill accounts (query ?type=cash|debt)
POST   /api/pos/cart                 # Create cart (body: contact_id, payment_status)
GET    /api/pos/cart/<id>            # Get cart with items
PUT    /api/pos/cart/<id>            # Update cart (contact_id, payment_status)
DELETE /api/pos/cart/<id>           # Delete pending cart and its items
POST   /api/pos/cart/<id>/items      # Add item to cart (body: product_id, quantity)
PUT    /api/pos/cart/<id>/items/<item_id>   # Update item quantity
DELETE /api/pos/cart/<id>/items/<item_id>  # Remove item from cart
POST   /api/pos/cart/<id>/complete   # Complete cart → creates sale (body: bill_account_id, payment_method: cash|transfer)

# POS Purchases flow
POST   /api/purchases/cart                          # Create purchase cart
GET    /api/purchases/cart/<id>                     # Get purchase cart
PUT    /api/purchases/cart/<id>                     # Update purchase cart
POST   /api/purchases/cart/<id>/items               # Add item
PUT    /api/purchases/cart/<id>/items/<item_id>     # Update item
DELETE /api/purchases/cart/<id>/items/<item_id>     # Remove item
POST   /api/purchases/cart/<id>/complete            # Complete purchase

GET    /api/contacts                 # List contacts
POST   /api/contacts                 # Create contact
PUT    /api/contacts/<id>            # Update contact

GET    /api/auth/login               # Login (get token)
GET    /api/auth/me                  # Current user profile
POST   /api/auth/password/forgot     # Password recovery
POST   /api/auth/password/reset      # Password reset

GET    /api/reports/overview         # General report
```

---

### 4. View Models (DTOs) - app/view_model/

Responsibility: Serialize entities to JSON.

Characteristics:
- Data Transfer Objects (DTOs)
- Decouple entities from HTTP format
- Allow different views of the same entity
- Output validation

Example: ProductListViewModel
```python
# app/view_model/product/list.py
class ProductListViewModel:
    def __init__(self, product):
        self.id = product.id
        self.name = product.name
        self.sku = product.sku
        self.price = product.price
        self.category_name = product.category.name if product.category else None
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sku': self.sku,
            'price': self.price,
            'categoryName': self.category_name
        }

class ProductDetailViewModel:
    """More complete view for detail"""
    def __init__(self, product):
        self.id = product.id
        self.name = product.name
        self.price = product.price
        self.stock = product.current_stock
        self.movements = [m.to_dict() for m in product.movements]
    
    def to_dict(self):
        # ... return with more details
        pass
```

Conventions:
- One class per view (List, Detail, Create, etc.)
- to_dict() method for serialization
- Attributes in camelCase (for frontend)
- Database columns in snake_case

---

## Authentication

System: JWT Bearer Token

```python
# app/auth.py
from functools import wraps
from flask import request
import jwt

@token_required
def my_endpoint():
    # Validate: Authorization: Bearer <token>
    pass

# In client:
# Authorization: Bearer eyJhbGc...
```

---

## Database

Engine: MySQL 8.0+
ORM: SQLAlchemy 2.0
Migrations: Alembic (Flask-Migrate)

Create migration:
```bash
cd backend
FLASK_APP=run.py python -m flask db migrate -m "Description of change"
```

Apply migrations:
```bash
FLASK_APP=run.py python -m flask db upgrade
```

---

## Execution

Development:
```bash
cd backend
source ../.venv/bin/activate
python run.py
# Or from root: python backend/app/scripts/dev.py
```

Production:
```bash
export FLASK_ENV=production
python run.py
```

---

## Main Dependencies

```
Flask==3.1.0              # Web framework
Flask-SQLAlchemy==3.1.1   # ORM
SQLAlchemy==2.0.46        # SQL toolkit
PyMySQL==1.1.0            # MySQL driver
Flask-Migrate==4.x        # Migrations
Flask-CORS==4.x           # CORS support
python-dotenv==1.0.1      # Environment variables
cryptography              # Secure hashing
```

---

## Testing

Recommended structure:
```
tests/
├── unit/
│   ├── models/
│   └── controllers/
└── integration/
    ├── routes/
    └── database/
```

Run tests:
```bash
pytest tests/ -v
```

---

## Implementation Checklist

When adding a new module:

- Add Entity in models/
- Add Controller in controllers/
- Add ViewModel in view_model/
- Add Routes in routes/api.py
- Create database migration
- Write unit tests
- Update documentation
