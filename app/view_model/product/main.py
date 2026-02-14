from app.database import db
from app.models.inventory.product import Product, Taxonomy

class ProductViewModel:
    @staticmethod
    def list_products():
        return ProductViewModel.get_all_products()

    @staticmethod
    def get_all_products():
        products = Product.query.all()
        return [product.to_dict() for product in products]

    @staticmethod
    def get_categories():
        rows = (
            Taxonomy.query.with_entities(Taxonomy.id, Taxonomy.name, Taxonomy.value)
            .filter(Taxonomy.kind == "category")
            .order_by(Taxonomy.name.asc())
            .all()
        )
        categories = []
        for taxonomy_id, taxonomy_name, taxonomy_value in rows:
            label = (taxonomy_name or taxonomy_value or "").strip()
            if label:
                categories.append({"id": taxonomy_id, "label": label})
        return categories
    
    @staticmethod
    def get_product_by_id(product_id):
        product = Product.query.get(product_id)
        return product.to_dict() if product else None
    
    @staticmethod
    def create_product(form_data):
        name = form_data.get("name", "").strip()
        sku = form_data.get("sku", "").strip() or None
        taxonomy_id = form_data.get("taxonomy_id", "").strip() or None
        category = form_data.get("category", "").strip() or None
        attribute_combinations = (
            form_data.get("attribute_combinations", "").strip() or None
        )

        if taxonomy_id and not category:
            taxonomy = Taxonomy.query.get(taxonomy_id)
            if taxonomy:
                category = (taxonomy.name or taxonomy.value or "").strip() or None

        if not name:
            raise ValueError("Name is required")

        try:
            price = float(form_data.get("price", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Price must be a valid number")

        try:
            cost = float(form_data.get("cost", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Cost must be a valid number")

        try:
            tax_rate = float(form_data.get("tax_rate", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Tax rate must be a valid number")

        new_product = Product(
            name=name,
            price=price,
            cost=cost,
            sku=sku,
            category=category,
            tax_rate=tax_rate,
            taxonomy_id=taxonomy_id,
            attribute_combinations=attribute_combinations,
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
            cost = float(form_data.get("cost", product.cost if product.cost is not None else 0.0))
        except (TypeError, ValueError):
            raise ValueError("Cost must be a valid number")

        try:
            tax_rate = float(
                form_data.get(
                    "tax_rate", product.tax_rate if product.tax_rate is not None else 0.0
                )
            )
        except (TypeError, ValueError):
            raise ValueError("Tax rate must be a valid number")

        product.name = name
        product.sku = form_data.get("sku", "").strip() or None
        product.price = price
        product.cost = cost
        taxonomy_id = form_data.get("taxonomy_id", "").strip() or None
        category = form_data.get("category", "").strip() or None
        if taxonomy_id and not category:
            taxonomy = Taxonomy.query.get(taxonomy_id)
            if taxonomy:
                category = (taxonomy.name or taxonomy.value or "").strip() or None

        product.category = category
        product.tax_rate = tax_rate
        product.taxonomy_id = taxonomy_id
        product.attribute_combinations = (
            form_data.get("attribute_combinations", "").strip() or None
        )

        db.session.commit()
        return product.to_dict()

    @staticmethod
    def delete_product(product_id):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        db.session.delete(product)
        db.session.commit()
        return True