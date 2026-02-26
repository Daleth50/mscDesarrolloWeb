from app.database import db
from sqlalchemy import func
from app.models.inventory.product import Product
from app.models.pos import Contact, Inventory, Order, OrderItem


class OrderViewModel:
    ALLOWED_PAYMENT_STATUSES = {"pending", "unpaid", "paid", "partial"}

    @staticmethod
    def _clean_str(value):
        if value is None:
            return ""
        return str(value).strip()

    @staticmethod
    def _parse_float(value, field_name):
        try:
            return float(value)
        except (TypeError, ValueError):
            raise ValueError(f"{field_name} must be a valid number")

    @staticmethod
    def _parse_positive_int(value, field_name):
        try:
            parsed = int(value)
        except (TypeError, ValueError):
            raise ValueError(f"{field_name} must be a valid integer")
        if parsed <= 0:
            raise ValueError(f"{field_name} must be greater than 0")
        return parsed

    @staticmethod
    def _validate_payment_status(payment_status):
        if payment_status and payment_status not in OrderViewModel.ALLOWED_PAYMENT_STATUSES:
            raise ValueError("Invalid payment status for cart")

    @staticmethod
    def _get_stock_available(product_id):
        stock_sum = (
            db.session.query(func.coalesce(func.sum(Inventory.quantity), 0))
            .filter(Inventory.product_id == product_id)
            .scalar()
        )
        return float(stock_sum or 0)

    @staticmethod
    def _recalculate_cart_totals(cart):
        subtotal = (
            db.session.query(func.coalesce(func.sum(OrderItem.total), 0))
            .filter(OrderItem.order_id == cart.id)
            .scalar()
        )
        subtotal_value = float(subtotal or 0)
        cart.subtotal = subtotal_value
        cart.tax = 0.0
        cart.discount = 0.0
        cart.total = subtotal_value

    @staticmethod
    def _get_cart_or_raise(cart_id):
        cart = Order.query.filter(Order.id == cart_id, Order.type == "cart").first()
        if not cart:
            raise ValueError("Cart not found")
        return cart

    @staticmethod
    def _serialize_order_item(item, product_name=None, stock_available=None):
        return {
            "id": item.id,
            "order_id": item.order_id,
            "product_id": item.product_id,
            "product_name": product_name,
            "quantity": int(item.quantity) if item.quantity is not None else 0,
            "price": float(item.price) if item.price is not None else 0.0,
            "total": float(item.total) if item.total is not None else 0.0,
            "stock_available": stock_available,
        }

    @staticmethod
    def _serialize_cart(cart):
        rows = (
            db.session.query(OrderItem, Product)
            .join(Product, Product.id == OrderItem.product_id)
            .filter(OrderItem.order_id == cart.id)
            .all()
        )

        items = []
        for item, product in rows:
            items.append(
                OrderViewModel._serialize_order_item(
                    item,
                    product_name=product.name,
                    stock_available=OrderViewModel._get_stock_available(product.id),
                )
            )

        payload = cart.to_dict()
        payload["items"] = items
        return payload

    @staticmethod
    def list_pos_products():
        products = Product.query.order_by(Product.name.asc()).all()
        data = []
        for product in products:
            data.append(
                {
                    "id": product.id,
                    "name": product.name,
                    "sku": product.sku,
                    "price": float(product.price) if product.price is not None else 0.0,
                    "stock_available": OrderViewModel._get_stock_available(product.id),
                }
            )
        return data

    @staticmethod
    def list_orders():
        return OrderViewModel.get_all_orders()

    @staticmethod
    def get_all_orders():
        orders = Order.query.all()
        return [order.to_dict() for order in orders]

    @staticmethod
    def create_order(form_data):
        contact_id = form_data.get("contact_id", "").strip() or None
        status = form_data.get("status", "").strip() or None
        payment_status = form_data.get("payment_status", "").strip() or None
        payment_method = form_data.get("payment_method", "").strip() or None
        order_type = form_data.get("type", "").strip() or None
        extra_fields = form_data.get("extra_fields", "").strip() or None

        total = OrderViewModel._parse_float(form_data.get("total", 0.0), "Total")
        subtotal = OrderViewModel._parse_float(form_data.get("subtotal", 0.0), "Subtotal")
        tax = OrderViewModel._parse_float(form_data.get("tax", 0.0), "Tax")
        discount = OrderViewModel._parse_float(form_data.get("discount", 0.0), "Discount")

        new_order = Order(
            contact_id=contact_id,
            total=total,
            subtotal=subtotal,
            tax=tax,
            discount=discount,
            status=status,
            payment_status=payment_status,
            payment_method=payment_method,
            type=order_type,
            extra_fields=extra_fields,
        )
        db.session.add(new_order)
        db.session.commit()
        return new_order.to_dict()

    @staticmethod
    def create_cart(form_data):
        form_data = form_data or {}
        contact_id = OrderViewModel._clean_str(form_data.get("contact_id", "")) or None
        payment_status = (
            OrderViewModel._clean_str(form_data.get("payment_status", "pending")) or "pending"
        )
        OrderViewModel._validate_payment_status(payment_status)

        if contact_id:
            contact = Contact.query.get(contact_id)
            if not contact:
                raise ValueError("Contact not found")

        cart = Order(
            contact_id=contact_id,
            status="pending",
            payment_status=payment_status,
            type="cart",
            subtotal=0.0,
            tax=0.0,
            discount=0.0,
            total=0.0,
        )
        db.session.add(cart)
        db.session.commit()
        return OrderViewModel._serialize_cart(cart)

    @staticmethod
    def get_cart(cart_id):
        cart = OrderViewModel._get_cart_or_raise(cart_id)
        return OrderViewModel._serialize_cart(cart)

    @staticmethod
    def update_cart(cart_id, form_data):
        form_data = form_data or {}
        cart = OrderViewModel._get_cart_or_raise(cart_id)

        if "contact_id" in form_data:
            contact_id = OrderViewModel._clean_str(form_data.get("contact_id", "")) or None
            if contact_id:
                contact = Contact.query.get(contact_id)
                if not contact:
                    raise ValueError("Contact not found")
            cart.contact_id = contact_id

        if "payment_status" in form_data:
            payment_status = OrderViewModel._clean_str(form_data.get("payment_status", ""))
            OrderViewModel._validate_payment_status(payment_status)
            cart.payment_status = payment_status

        OrderViewModel._recalculate_cart_totals(cart)
        db.session.commit()
        return OrderViewModel._serialize_cart(cart)

    @staticmethod
    def add_cart_item(cart_id, form_data):
        form_data = form_data or {}
        cart = OrderViewModel._get_cart_or_raise(cart_id)

        product_id = OrderViewModel._clean_str(form_data.get("product_id", ""))
        if not product_id:
            raise ValueError("Product id is required")

        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        quantity = OrderViewModel._parse_positive_int(form_data.get("quantity", 0), "Quantity")
        stock_available = OrderViewModel._get_stock_available(product_id)

        current_quantity = (
            db.session.query(func.coalesce(func.sum(OrderItem.quantity), 0))
            .filter(OrderItem.order_id == cart.id, OrderItem.product_id == product_id)
            .scalar()
        )
        final_quantity = int(current_quantity or 0) + quantity
        if final_quantity > stock_available:
            raise ValueError("Insufficient stock for the requested quantity")

        price = float(product.price) if product.price is not None else 0.0
        item_total = price * quantity
        item = OrderItem(
            order_id=cart.id,
            product_id=product.id,
            quantity=quantity,
            price=price,
            total=item_total,
        )
        db.session.add(item)
        OrderViewModel._recalculate_cart_totals(cart)
        db.session.commit()
        return OrderViewModel._serialize_cart(cart)

    @staticmethod
    def update_cart_item(cart_id, item_id, form_data):
        form_data = form_data or {}
        cart = OrderViewModel._get_cart_or_raise(cart_id)

        item = OrderItem.query.filter(OrderItem.id == item_id, OrderItem.order_id == cart.id).first()
        if not item:
            raise ValueError("Cart item not found")

        quantity = OrderViewModel._parse_positive_int(form_data.get("quantity", 0), "Quantity")
        stock_available = OrderViewModel._get_stock_available(item.product_id)

        other_items_quantity = (
            db.session.query(func.coalesce(func.sum(OrderItem.quantity), 0))
            .filter(
                OrderItem.order_id == cart.id,
                OrderItem.product_id == item.product_id,
                OrderItem.id != item.id,
            )
            .scalar()
        )
        if int(other_items_quantity or 0) + quantity > stock_available:
            raise ValueError("Insufficient stock for the requested quantity")

        item.quantity = quantity
        item.total = (float(item.price) if item.price is not None else 0.0) * quantity

        OrderViewModel._recalculate_cart_totals(cart)
        db.session.commit()
        return OrderViewModel._serialize_cart(cart)

    @staticmethod
    def remove_cart_item(cart_id, item_id):
        cart = OrderViewModel._get_cart_or_raise(cart_id)
        item = OrderItem.query.filter(OrderItem.id == item_id, OrderItem.order_id == cart.id).first()
        if not item:
            raise ValueError("Cart item not found")

        db.session.delete(item)
        OrderViewModel._recalculate_cart_totals(cart)
        db.session.commit()
        return OrderViewModel._serialize_cart(cart)
