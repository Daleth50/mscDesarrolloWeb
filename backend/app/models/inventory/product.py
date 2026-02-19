from uuid import uuid4
from app.database import db


class Taxonomy(db.Model):
    __tablename__ = "taxonomies"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=True)
    value = db.Column("value", db.Text, nullable=True)
    slug = db.Column(db.String(255), nullable=True)
    kind = db.Column(db.String(50), nullable=True)
    ordering = db.Column(db.Integer, nullable=True)
    icon = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    parent_id = db.Column(db.String(36), db.ForeignKey("taxonomies.id"), nullable=True)


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=False)
    sku = db.Column(db.String(100), nullable=True)
    price = db.Column(db.Numeric(18, 4), nullable=True)
    cost = db.Column(db.Numeric(18, 4), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    tax_rate = db.Column(db.Numeric(5, 2), nullable=True)
    taxonomy_id = db.Column(db.String(36), db.ForeignKey("taxonomies.id"), nullable=True)
    attribute_combinations = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    def __repr__(self):
        return f"<Product {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "price": float(self.price) if self.price is not None else None,
            "cost": float(self.cost) if self.cost is not None else None,
            "category": self.category,
            "tax_rate": float(self.tax_rate) if self.tax_rate is not None else None,
            "taxonomy_id": self.taxonomy_id,
            "attribute_combinations": self.attribute_combinations,
        }


class ProductTaxonomy(db.Model):
    __tablename__ = "product_taxonomies"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=True)
    taxonomy_id = db.Column(db.String(36), db.ForeignKey("taxonomies.id"), nullable=True)


class ProductComponent(db.Model):
    __tablename__ = "product_components"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    parent_product_id = db.Column(
        db.String(36), db.ForeignKey("products.id"), nullable=True
    )
    component_product_id = db.Column(
        db.String(36), db.ForeignKey("products.id"), nullable=True
    )
    quantity = db.Column(db.Numeric(18, 4), nullable=True)
