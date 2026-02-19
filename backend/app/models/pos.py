from uuid import uuid4
from app.database import db


class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    address = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    def __repr__(self):
        return f"<Contact {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
        }


class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=True)
    location = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )


class Inventory(db.Model):
    __tablename__ = "inventories"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    warehouse_id = db.Column(db.String(36), db.ForeignKey("warehouses.id"), nullable=True)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=True)
    quantity = db.Column(db.Numeric(18, 4), nullable=True)
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    contact_id = db.Column(db.String(36), db.ForeignKey("contacts.id"), nullable=True)
    total = db.Column(db.Numeric(18, 4), nullable=True)
    subtotal = db.Column(db.Numeric(18, 4), nullable=True)
    tax = db.Column(db.Numeric(18, 4), nullable=True)
    discount = db.Column(db.Numeric(18, 4), nullable=True)
    status = db.Column(db.String(50), nullable=True)
    payment_status = db.Column(db.String(50), nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(50), nullable=True)
    extra_fields = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    def __repr__(self):
        return f"<Order {self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "contact_id": self.contact_id,
            "total": float(self.total) if self.total is not None else None,
            "subtotal": float(self.subtotal) if self.subtotal is not None else None,
            "tax": float(self.tax) if self.tax is not None else None,
            "discount": float(self.discount) if self.discount is not None else None,
            "status": self.status,
            "payment_status": self.payment_status,
            "payment_method": self.payment_method,
            "type": self.type,
            "extra_fields": self.extra_fields,
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=True)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=True)
    quantity = db.Column(db.Integer, nullable=True)
    price = db.Column(db.Numeric(18, 4), nullable=True)
    total = db.Column(db.Numeric(18, 4), nullable=True)


class BillAccount(db.Model):
    __tablename__ = "bill_accounts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(50), nullable=True)
    balance = db.Column(db.Numeric(18, 4), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )


class OrderBillAccount(db.Model):
    __tablename__ = "order_bill_accounts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=True)
    bill_account_id = db.Column(
        db.String(36), db.ForeignKey("bill_accounts.id"), nullable=True
    )
    amount = db.Column(db.Numeric(18, 4), nullable=True)
    movement_type = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
