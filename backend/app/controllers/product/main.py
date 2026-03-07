from sqlalchemy import func
from app.database import db
from app.models.inventory.product import Product, ProductTaxonomy, Taxonomy
from app.models.pos import Inventory

class ProductViewModel:
    @staticmethod
    def _clean_str(value):
        if value is None:
            return ""
        return str(value).strip()

    @staticmethod
    def _serialize_category(category):
        name = (category.name or category.value or "").strip()
        return {
            "id": category.id,
            "name": name,
            "label": name,
            "value": category.value,
        }

    @staticmethod
    def _parse_bounded_int(value, field_name, default, min_value, max_value):
        if value in (None, ""):
            return default

        try:
            parsed_value = int(value)
        except (TypeError, ValueError):
            raise ValueError(f"{field_name} must be an integer")

        if parsed_value < min_value or parsed_value > max_value:
            raise ValueError(f"{field_name} must be between {min_value} and {max_value}")

        return parsed_value

    @staticmethod
    def _serialize_inventory_movement(movement):
        quantity = float(movement.quantity) if movement.quantity is not None else 0.0
        return {
            "id": movement.id,
            "product_id": movement.product_id,
            "quantity": quantity,
            "movement_type": "in" if quantity >= 0 else "out",
            "occurred_at": movement.updated_at.isoformat() if movement.updated_at else None,
        }

    @staticmethod
    def _get_stock_map(product_ids):
        if not product_ids:
            return {}

        rows = (
            db.session.query(
                Inventory.product_id,
                func.coalesce(func.sum(Inventory.quantity), 0),
            )
            .filter(Inventory.product_id.in_(product_ids))
            .group_by(Inventory.product_id)
            .all()
        )

        stock_map = {product_id: float(stock or 0) for product_id, stock in rows}
        for product_id in product_ids:
            stock_map.setdefault(product_id, 0.0)
        return stock_map

    @staticmethod
    def list_products():
        return ProductViewModel.get_all_products()

    @staticmethod
    def _serialize_product(product, category=None, stock_available=0.0):
        category_name = None
        category_id = None
        if category:
            category_name = (category.name or category.value or "").strip() or None
            category_id = category.id

        return {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "price": float(product.price) if product.price is not None else None,
            "cost": float(product.cost) if product.cost is not None else None,
            "category_name": category_name,
            "tax_rate": float(product.tax_rate) if product.tax_rate is not None else None,
            "category_id": category_id,
            "stock_available": float(stock_available) if stock_available is not None else 0.0,
            "attribute_combinations": product.attribute_combinations,
        }

    @staticmethod
    def _get_product_category_map(product_ids):
        if not product_ids:
            return {}

        rows = (
            db.session.query(ProductTaxonomy.product_id, Taxonomy)
            .join(Taxonomy, Taxonomy.id == ProductTaxonomy.taxonomy_id)
            .filter(
                ProductTaxonomy.product_id.in_(product_ids),
                Taxonomy.kind == "category",
            )
            .all()
        )

        category_map = {}
        for product_id, taxonomy in rows:
            if product_id not in category_map:
                category_map[product_id] = taxonomy
        return category_map

    @staticmethod
    def _ensure_category_exists(category_id):
        if not category_id:
            return None

        category = (
            Taxonomy.query
            .filter(Taxonomy.id == category_id, Taxonomy.kind == "category")
            .first()
        )
        if not category:
            raise ValueError("Category not found")
        return category

    @staticmethod
    def get_all_products():
        products = Product.query.all()
        product_ids = [product.id for product in products]
        category_map = ProductViewModel._get_product_category_map(product_ids)
        stock_map = ProductViewModel._get_stock_map(product_ids)
        return [
            ProductViewModel._serialize_product(
                product,
                category_map.get(product.id),
                stock_map.get(product.id, 0.0),
            )
            for product in products
        ]

    @staticmethod
    def get_categories():
        categories = (
            Taxonomy.query
            .filter(Taxonomy.kind == "category")
            .order_by(Taxonomy.name.asc())
            .all()
        )
        return [
            ProductViewModel._serialize_category(category)
            for category in categories
            if (category.name or category.value or "").strip()
        ]

    @staticmethod
    def create_category(form_data):
        name = ProductViewModel._clean_str(form_data.get("name", ""))
        if not name:
            raise ValueError("Category name is required")

        existing = (
            Taxonomy.query
            .filter(
                Taxonomy.kind == "category",
                db.func.lower(Taxonomy.name) == name.lower(),
            )
            .first()
        )
        if existing:
            raise ValueError("Category already exists")

        new_category = Taxonomy(
            name=name,
            value=name,
            kind="category",
        )
        db.session.add(new_category)
        db.session.commit()
        return ProductViewModel._serialize_category(new_category)

    @staticmethod
    def update_category(category_id, form_data):
        category = (
            Taxonomy.query
            .filter(Taxonomy.id == category_id, Taxonomy.kind == "category")
            .first()
        )
        if not category:
            raise ValueError("Category not found")

        name = ProductViewModel._clean_str(form_data.get("name", ""))
        if not name:
            raise ValueError("Category name is required")

        duplicate = (
            Taxonomy.query
            .filter(
                Taxonomy.id != category_id,
                Taxonomy.kind == "category",
                db.func.lower(Taxonomy.name) == name.lower(),
            )
            .first()
        )
        if duplicate:
            raise ValueError("Category already exists")

        category.name = name
        category.value = name

        db.session.commit()
        return ProductViewModel._serialize_category(category)

    @staticmethod
    def delete_category(category_id):
        category = (
            Taxonomy.query
            .filter(Taxonomy.id == category_id, Taxonomy.kind == "category")
            .first()
        )
        if not category:
            raise ValueError("Category not found")

        has_product_taxonomies = ProductTaxonomy.query.filter(
            ProductTaxonomy.taxonomy_id == category_id
        ).first()
        if has_product_taxonomies:
            raise ValueError("Cannot delete a category with related taxonomy records")

        db.session.delete(category)
        db.session.commit()
        return True
    
    @staticmethod
    def get_product_by_id(product_id):
        product = Product.query.get(product_id)
        if not product:
            return None

        category_map = ProductViewModel._get_product_category_map([product.id])
        stock_map = ProductViewModel._get_stock_map([product.id])
        return ProductViewModel._serialize_product(
            product,
            category_map.get(product.id),
            stock_map.get(product.id, 0.0),
        )

    @staticmethod
    def get_product_inventory_movements(product_id, page=None, per_page=None):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        parsed_page = ProductViewModel._parse_bounded_int(
            page,
            "Page",
            default=1,
            min_value=1,
            max_value=100000,
        )
        parsed_per_page = ProductViewModel._parse_bounded_int(
            per_page,
            "Per page",
            default=10,
            min_value=1,
            max_value=100,
        )

        base_query = Inventory.query.filter(Inventory.product_id == product_id)
        total_items = base_query.count()
        total_pages = (total_items + parsed_per_page - 1) // parsed_per_page if total_items > 0 else 1
        offset = (parsed_page - 1) * parsed_per_page

        movements = (
            base_query
            .order_by(Inventory.updated_at.desc(), Inventory.id.desc())
            .offset(offset)
            .limit(parsed_per_page)
            .all()
        )

        return {
            "items": [
                ProductViewModel._serialize_inventory_movement(movement)
                for movement in movements
            ],
            "pagination": {
                "page": parsed_page,
                "per_page": parsed_per_page,
                "total_items": total_items,
                "total_pages": total_pages,
                "has_next": parsed_page < total_pages,
                "has_prev": parsed_page > 1,
            },
        }
    
    @staticmethod
    def create_product(form_data):
        name = ProductViewModel._clean_str(form_data.get("name", ""))
        sku = ProductViewModel._clean_str(form_data.get("sku", "")) or None
        category_id = ProductViewModel._clean_str(form_data.get("category_id", "")) or None
        attribute_combinations = (
            ProductViewModel._clean_str(form_data.get("attribute_combinations", "")) or None
        )

        ProductViewModel._ensure_category_exists(category_id)

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
            tax_rate=tax_rate,
            attribute_combinations=attribute_combinations,
        )
        db.session.add(new_product)
        db.session.flush()

        if category_id:
            db.session.add(
                ProductTaxonomy(product_id=new_product.id, taxonomy_id=category_id)
            )

        db.session.commit()
        return ProductViewModel.get_product_by_id(new_product.id)

    @staticmethod
    def update_product(product_id, form_data):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        name = ProductViewModel._clean_str(form_data.get("name", ""))
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
        product.sku = ProductViewModel._clean_str(form_data.get("sku", "")) or None
        product.price = price
        product.cost = cost
        category_id = ProductViewModel._clean_str(form_data.get("category_id", "")) or None
        ProductViewModel._ensure_category_exists(category_id)

        product.tax_rate = tax_rate
        product.attribute_combinations = (
            ProductViewModel._clean_str(form_data.get("attribute_combinations", "")) or None
        )

        ProductTaxonomy.query.filter(ProductTaxonomy.product_id == product_id).delete(
            synchronize_session=False
        )
        if category_id:
            db.session.add(ProductTaxonomy(product_id=product_id, taxonomy_id=category_id))

        db.session.commit()
        return ProductViewModel.get_product_by_id(product.id)

    @staticmethod
    def delete_product(product_id):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        raise ValueError("Definitive deletion of products is not allowed")