from datetime import date, datetime, time
from sqlalchemy import func

from app.database import db
from app.models.inventory.product import Product
from app.models.pos import Contact, Order, OrderBillAccount, OrderItem


class ReportViewModel:
    DEFAULT_TOP_LIMIT = 10
    MAX_TOP_LIMIT = 50

    @staticmethod
    def _to_float(value):
        return float(value or 0)

    @staticmethod
    def _parse_date(value, field_name):
        if value in (None, ""):
            return None
        try:
            return datetime.strptime(str(value), "%Y-%m-%d").date()
        except (TypeError, ValueError):
            raise ValueError(f"{field_name} must use YYYY-MM-DD format")

    @staticmethod
    def _resolve_date_range(from_value, to_value):
        today = date.today()
        month_start = today.replace(day=1)

        from_date = ReportViewModel._parse_date(from_value, "from") or month_start
        to_date = ReportViewModel._parse_date(to_value, "to") or today

        if from_date > to_date:
            raise ValueError("'from' date must be earlier than or equal to 'to'")

        return from_date, to_date

    @staticmethod
    def _resolve_top_limit(raw_limit):
        if raw_limit in (None, ""):
            return ReportViewModel.DEFAULT_TOP_LIMIT

        try:
            parsed = int(raw_limit)
        except (TypeError, ValueError):
            raise ValueError("top_limit must be a valid integer")

        if parsed <= 0:
            raise ValueError("top_limit must be greater than 0")

        return min(parsed, ReportViewModel.MAX_TOP_LIMIT)

    @staticmethod
    def _query_order_totals(order_type, start_at, end_at):
        count, total, average = (
            db.session.query(
                func.count(Order.id),
                func.coalesce(func.sum(Order.total), 0),
                func.coalesce(func.avg(Order.total), 0),
            )
            .filter(
                Order.type == order_type,
                Order.created_at >= start_at,
                Order.created_at <= end_at,
            )
            .one()
        )

        return {
            "count": int(count or 0),
            "total": ReportViewModel._to_float(total),
            "average": ReportViewModel._to_float(average),
        }

    @staticmethod
    def _query_daily_totals(order_type, start_at, end_at):
        rows = (
            db.session.query(
                func.date(Order.created_at).label("day"),
                func.count(Order.id).label("orders_count"),
                func.coalesce(func.sum(Order.total), 0).label("total"),
            )
            .filter(
                Order.type == order_type,
                Order.created_at >= start_at,
                Order.created_at <= end_at,
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
            .all()
        )

        payload = []
        for day, orders_count, total in rows:
            payload.append(
                {
                    "date": day.isoformat() if hasattr(day, "isoformat") else str(day),
                    "orders_count": int(orders_count or 0),
                    "total": ReportViewModel._to_float(total),
                }
            )

        return payload

    @staticmethod
    def _query_top_products(start_at, end_at, limit):
        rows = (
            db.session.query(
                Product.id,
                Product.name,
                Product.sku,
                func.coalesce(func.sum(OrderItem.quantity), 0).label("quantity"),
                func.coalesce(func.sum(OrderItem.total), 0).label("total"),
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(
                Order.type == "sale",
                Order.created_at >= start_at,
                Order.created_at <= end_at,
            )
            .group_by(Product.id, Product.name, Product.sku)
            .order_by(
                func.coalesce(func.sum(OrderItem.quantity), 0).desc(),
                func.coalesce(func.sum(OrderItem.total), 0).desc(),
            )
            .limit(limit)
            .all()
        )

        payload = []
        for product_id, product_name, sku, quantity, total in rows:
            payload.append(
                {
                    "product_id": product_id,
                    "product_name": product_name,
                    "sku": sku,
                    "quantity": int(quantity or 0),
                    "total": ReportViewModel._to_float(total),
                }
            )

        return payload

    @staticmethod
    def _query_top_contacts(order_type, start_at, end_at, limit):
        rows = (
            db.session.query(
                Order.contact_id,
                Contact.name,
                func.count(Order.id).label("orders_count"),
                func.coalesce(func.sum(Order.total), 0).label("total"),
            )
            .outerjoin(Contact, Contact.id == Order.contact_id)
            .filter(
                Order.type == order_type,
                Order.created_at >= start_at,
                Order.created_at <= end_at,
            )
            .group_by(Order.contact_id, Contact.name)
            .order_by(func.coalesce(func.sum(Order.total), 0).desc())
            .limit(limit)
            .all()
        )

        payload = []
        for contact_id, contact_name, orders_count, total in rows:
            payload.append(
                {
                    "contact_id": contact_id,
                    "contact_name": contact_name or "Sin contacto",
                    "orders_count": int(orders_count or 0),
                    "total": ReportViewModel._to_float(total),
                }
            )

        return payload

    @staticmethod
    def _query_payment_methods(start_at, end_at):
        rows = (
            db.session.query(
                Order.payment_method,
                func.count(Order.id).label("orders_count"),
                func.coalesce(func.sum(Order.total), 0).label("total"),
            )
            .filter(
                Order.type == "sale",
                Order.created_at >= start_at,
                Order.created_at <= end_at,
            )
            .group_by(Order.payment_method)
            .order_by(func.coalesce(func.sum(Order.total), 0).desc())
            .all()
        )

        payload = []
        for payment_method, orders_count, total in rows:
            payload.append(
                {
                    "payment_method": payment_method or "sin_metodo",
                    "orders_count": int(orders_count or 0),
                    "total": ReportViewModel._to_float(total),
                }
            )

        return payload

    @staticmethod
    def _query_bill_flow(start_at, end_at):
        rows = (
            db.session.query(
                OrderBillAccount.movement_type,
                func.coalesce(func.sum(OrderBillAccount.amount), 0).label("total"),
            )
            .filter(
                OrderBillAccount.created_at >= start_at,
                OrderBillAccount.created_at <= end_at,
            )
            .group_by(OrderBillAccount.movement_type)
            .all()
        )

        in_total = 0.0
        out_total = 0.0

        for movement_type, total in rows:
            if movement_type == "in":
                in_total += ReportViewModel._to_float(total)
            elif movement_type == "out":
                out_total += ReportViewModel._to_float(total)

        return {
            "in_total": in_total,
            "out_total": out_total,
            "net_total": in_total - out_total,
        }

    @staticmethod
    def get_overview(from_value=None, to_value=None, top_limit=None):
        from_date, to_date = ReportViewModel._resolve_date_range(from_value, to_value)
        resolved_limit = ReportViewModel._resolve_top_limit(top_limit)

        start_at = datetime.combine(from_date, time.min)
        end_at = datetime.combine(to_date, time.max)

        sales = ReportViewModel._query_order_totals("sale", start_at, end_at)
        purchases = ReportViewModel._query_order_totals("purchase", start_at, end_at)

        return {
            "range": {
                "from": from_date.isoformat(),
                "to": to_date.isoformat(),
            },
            "totals": {
                "sales_count": sales["count"],
                "sales_total": sales["total"],
                "sales_avg_ticket": sales["average"],
                "purchases_count": purchases["count"],
                "purchases_total": purchases["total"],
                "purchases_avg_ticket": purchases["average"],
                "net_total": sales["total"] - purchases["total"],
            },
            "sales_by_day": ReportViewModel._query_daily_totals("sale", start_at, end_at),
            "purchases_by_day": ReportViewModel._query_daily_totals("purchase", start_at, end_at),
            "top_products": ReportViewModel._query_top_products(start_at, end_at, resolved_limit),
            "top_customers": ReportViewModel._query_top_contacts("sale", start_at, end_at, resolved_limit),
            "top_suppliers": ReportViewModel._query_top_contacts("purchase", start_at, end_at, resolved_limit),
            "payment_methods": ReportViewModel._query_payment_methods(start_at, end_at),
            "bill_flow": ReportViewModel._query_bill_flow(start_at, end_at),
        }
