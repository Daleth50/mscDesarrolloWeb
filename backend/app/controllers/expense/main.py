from app.database import db
from app.models.pos import Expense, EXPENSE_STATUSES, EXPENSE_DEFAULT_STATUS


class ExpenseViewModel:

    @staticmethod
    def get_all_expenses():
        expenses = Expense.query.order_by(Expense.created_at.desc()).all()
        return [e.to_dict() for e in expenses]

    @staticmethod
    def get_expense_by_id(expense_id):
        expense = Expense.query.get(expense_id)
        return expense.to_dict() if expense else None

    @staticmethod
    def create_expense(data):
        amount = data.get("amount")
        if amount is None:
            raise ValueError("amount is required")
        try:
            amount = float(amount)
        except (TypeError, ValueError):
            raise ValueError("amount must be a valid number")
        if amount <= 0:
            raise ValueError("amount must be greater than zero")

        status = (data.get("status") or EXPENSE_DEFAULT_STATUS).strip().lower()
        if status not in EXPENSE_STATUSES:
            raise ValueError(f"status must be one of: {', '.join(sorted(EXPENSE_STATUSES))}")

        note = (data.get("note") or "").strip() or None

        latitude = data.get("latitude")
        longitude = data.get("longitude")
        if latitude is not None:
            try:
                latitude = float(latitude)
            except (TypeError, ValueError):
                raise ValueError("latitude must be a valid number")
        if longitude is not None:
            try:
                longitude = float(longitude)
            except (TypeError, ValueError):
                raise ValueError("longitude must be a valid number")

        expense = Expense(
            amount=amount,
            status=status,
            note=note,
            latitude=latitude,
            longitude=longitude,
        )
        db.session.add(expense)
        db.session.commit()
        return expense.to_dict()

    @staticmethod
    def update_expense(expense_id, data):
        expense = Expense.query.get(expense_id)
        if not expense:
            raise ValueError("Expense not found")

        if "amount" in data:
            try:
                amount = float(data["amount"])
            except (TypeError, ValueError):
                raise ValueError("amount must be a valid number")
            if amount <= 0:
                raise ValueError("amount must be greater than zero")
            expense.amount = amount

        if "status" in data:
            status = (data["status"] or "").strip().lower()
            if status not in EXPENSE_STATUSES:
                raise ValueError(f"status must be one of: {', '.join(sorted(EXPENSE_STATUSES))}")
            expense.status = status

        if "note" in data:
            expense.note = (data["note"] or "").strip() or None

        if "latitude" in data:
            lat = data["latitude"]
            if lat is not None:
                try:
                    lat = float(lat)
                except (TypeError, ValueError):
                    raise ValueError("latitude must be a valid number")
            expense.latitude = lat

        if "longitude" in data:
            lng = data["longitude"]
            if lng is not None:
                try:
                    lng = float(lng)
                except (TypeError, ValueError):
                    raise ValueError("longitude must be a valid number")
            expense.longitude = lng

        db.session.commit()
        return expense.to_dict()

    @staticmethod
    def delete_expense(expense_id):
        expense = Expense.query.get(expense_id)
        if not expense:
            raise ValueError("Expense not found")
        db.session.delete(expense)
        db.session.commit()
