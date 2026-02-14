from app.database import db
# create a class that fetches products from the database and returns them as a list of dictionaries
from app.models.inventory.product import Product

class ProductViewModel:
    @staticmethod
    def get_all_products():
        products = Product.query.all()
        return [product.to_dict() for product in products]
    
    @staticmethod
    def get_product_by_id(product_id):
        product = Product.query.get(product_id)
        return product.to_dict() if product else None
    
    @staticmethod
    def create_product(form_data):
        name = form_data.get("name", "").strip()
        description = form_data.get("description", "")
        featured_image = form_data.get("featured_image", "")

        if not name:
            raise ValueError("Name is required")

        try:
            price = float(form_data.get("price", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Price must be a valid number")

        try:
            stock_quantity = int(form_data.get("stock_quantity", 0))
        except (TypeError, ValueError):
            raise ValueError("Stock quantity must be a valid integer")

        new_product = Product(
            name=name,
            description=description,
            price=price,
            stock_quantity=stock_quantity,  
            featured_image=featured_image
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product.to_dict()

    @staticmethod
    def update_product(product_id, form_data):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        name = form_data.get("name", "").strip()
        if not name:
            raise ValueError("Name is required")

        try:
            price = float(form_data.get("price", product.price))
        except (TypeError, ValueError):
            raise ValueError("Price must be a valid number")

        try:
            stock_quantity = int(form_data.get("stock_quantity", product.stock_quantity))
        except (TypeError, ValueError):
            raise ValueError("Stock quantity must be a valid integer")

        product.name = name
        product.description = form_data.get("description", "")
        product.price = price
        product.stock_quantity = stock_quantity
        product.featured_image = form_data.get("featured_image", "")

        db.session.commit()
        return product.to_dict()