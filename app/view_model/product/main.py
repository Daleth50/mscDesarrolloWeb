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
        name = form_data.get("name")
        description = form_data.get("description", "")
        price = float(form_data.get("price", 0.0))
        stock_quantity = int(form_data.get("stock_quantity", 0))
        featured_image = form_data.get("featured_image", "")
        if not name:
            raise ValueError("Name is required")

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