# Project Constitution

## Fundamental Architecture Principles

This document defines the principles, patterns, and architecture standards that govern the development of AppWeb POS. All developers must adhere to these principles to maintain the integrity and scalability of the project.

---

## Clean Architecture

### Layer Structure

The application is organized in 4 concentric layers, where dependencies always point inward:

```
Layer 4: Frameworks & Drivers
         (Flask, MySQL, React, Router, etc)
         
Layer 3: Interface Adapters
         (HTTP Routes, Serialization, DTO)
         
Layer 2: Application Business Rules
         (Business Logic, Use Cases)
         
Layer 1: Enterprise Business Rules (Innermost)
         (Data Models, Business Rules)
```

### 1. Enterprise Business Rules - Entities (Innermost)

Responsibilities:
- Represent business concepts (Product, Order, Contact, etc.)
- Contain critical business rules
- Be completely independent of frameworks

Backend (app/models/):
```python
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    def calculate_discount(self, percentage):
        """Pure business rule of the product"""
        return self.price * (1 - percentage / 100)
```

Rules:
- Can import other entities
- Can contain validation logic
- Cannot import controllers or services
- Cannot query database directly (only define structure)

### 2. Application Business Rules - Services and Controllers (Middle)

Responsibilities:
- Implement specific use cases
- Orchestrate interactions between entities
- Handle transactions and persistence

Backend (app/controllers/):
```python
class ProductController:
    def create_product(self, name, price, category_id):
        """Use case: create a product"""
        if price < 0:
            raise ValueError("Price cannot be negative")
        
        product = Product(name=name, price=price)
        db.session.add(product)
        db.session.commit()
        
        return product
```

Rules:
- Can import entities and other services
- Contain use case logic
- Cannot import routes
- Cannot import database details directly

### 3. Interface Adapters - Route Controllers and DTOs (Outer)

Responsibilities:
- Translate HTTP requests to use cases
- Serialize entities to JSON (DTOs)
- Handle input validation

Backend (app/routes/ and app/view_model/):
```python
# routes/api.py
@api_bp.route('/products', methods=['POST'])
@token_required
def create_product():
    data = request.get_json()
    
    controller = ProductController()
    product = controller.create_product(
        name=data['name'],
        price=data['price'],
        category_id=data['category_id']
    )
    
    return jsonify(ProductListViewModel(product).to_dict())
```

Frontend (src/services/):
```javascript
// productService.js - Adapter to consume API
export async function createProduct(name, price) {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: JSON.stringify({ name, price })
    });
    return response.json();
}
```

Rules:
- Can import controllers and view models
- Contain all HTTP/API logic
- Cannot contain business logic
- Cannot communicate directly with database

### 4. Frameworks and Drivers (Outermost)

Responsibilities:
- Execute the application (Flask, React, etc.)
- Handle configuration
- Connect databases

Backend (app/__init__.py, run.py):
```python
def create_app():
    app = Flask(__name__)
    db.init_app(app)
    app.register_blueprint(api_bp)
    return app
```

---

## SOLID Principles

### 1. Single Responsibility Principle (SRP)

Each class should have a single reason to change.

Bad:
```python
class ProductController:
    def create_product(self, data):
        # Validate, create, send email, log, update cache
        pass
```

Good:
```python
class ProductController:
    def create_product(self, data):
        product = Product(**data)
        db.session.add(product)
        db.session.commit()
        return product

class ProductNotificationService:
    def notify_product_created(self, product):
        send_email(f"New product: {product.name}")
```

### 2. Open/Closed Principle (OCP)

Classes should be open for extension, closed for modification.

Bad:
```python
class ReportGenerator:
    def generate(self, report_type):
        if report_type == 'sales':
            return self.generate_sales_report()
        elif report_type == 'inventory':
            return self.generate_inventory_report()
```

Good:
```python
class ReportGenerator(ABC):
    @abstractmethod
    def generate(self):
        pass

class SalesReportGenerator(ReportGenerator):
    def generate(self):
        return self._calculate_sales()

class ExpensesReportGenerator(ReportGenerator):
    def generate(self):
        return self._calculate_expenses()
```

### 3. Liskov Substitution Principle (LSP)

Subclasses should be substitutable for their base classes.

Bad:
```python
class CardPaymentProcessor(PaymentProcessor):
    def process(self, amount):
        if random() > 0.5:
            raise Exception("Processing failed")
```

Good:
```python
class PaymentProcessor(ABC):
    def process(self, amount) -> PaymentResult:
        pass

class CardPaymentProcessor(PaymentProcessor):
    def process(self, amount) -> PaymentResult:
        return PaymentResult(status="success", amount=amount)

processor = CardPaymentProcessor()
result = processor.process(100)
```

### 4. Interface Segregation Principle (ISP)

Clients should not depend on interfaces they don't use.

Bad:
```python
class UserService(ABC):
    @abstractmethod
    def create_user(self): pass
    @abstractmethod
    def generate_report(self): pass
    @abstractmethod
    def send_email(self): pass
```

Good:
```python
class UserCreator(ABC):
    @abstractmethod
    def create_user(self): pass

class ReportGenerator(ABC):
    @abstractmethod
    def generate_report(self): pass

class UserManager(UserCreator):
    pass
```

### 5. Dependency Inversion Principle (DIP)

Depend on abstractions, not on concrete implementations.

Bad:
```python
class OrderController:
    def __init__(self):
        self.payment_processor = StripePaymentProcessor()
```

Good:
```python
class OrderController:
    def __init__(self, payment_processor: PaymentProcessor):
        self.payment_processor = payment_processor
```

---

## Applied Design Patterns

Model-View-Controller (MVC):
- Models (app/models/): Business entities
- Controllers (app/controllers/): Use cases and orchestration
- Views (app/view_model/): Response serialization
- Routes (app/routes/): HTTP endpoints

Data Transfer Objects (DTOs):
- Decouple entities from JSON format
- Allow different views of the same entity

Repository Pattern:
- SQLAlchemy models act as repositories
- Product.query.filter_by(id=1).first()

Service Layer:
- Complex logic that orchestrates multiple entities

---

## Developer Checklist

Before committing, verify:

Architecture:
- Business logic is in controllers/services, not in routes
- Entities do not import controllers or routes
- There is a modular view (DTO/ViewModel) for responses
- Dependencies point inward (Clean Architecture)

SOLID:
- Each class has a single responsibility (SRP)
- New features can be added without modifying existing code (OCP)
- Subclasses respect the base class contract (LSP)
- Interfaces are specific, not generic (ISP)
- Dependencies are injected instead of created (DIP)

Code Quality:
- Code is documented where necessary
- Unit tests exist for business logic
- Naming conventions are followed (snake_case for Python)
- No code duplication

---

## References

- Clean Architecture - Robert C. Martin
- SOLID Principles
- Domain-Driven Design

