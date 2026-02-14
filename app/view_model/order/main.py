from app.database import db
from app.models.pos import Order


class OrderViewModel:
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

        try:
            total = float(form_data.get("total", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Total must be a valid number")

        try:
            subtotal = float(form_data.get("subtotal", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Subtotal must be a valid number")

        try:
            tax = float(form_data.get("tax", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Tax must be a valid number")

        try:
            discount = float(form_data.get("discount", 0.0))
        except (TypeError, ValueError):
            raise ValueError("Discount must be a valid number")

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
