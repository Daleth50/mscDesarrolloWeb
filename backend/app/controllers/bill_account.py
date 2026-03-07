from app.database import db
from app.models.pos import BillAccount, OrderBillAccount


class BillAccountViewModel:
    ALLOWED_TYPES = {"cash", "debt"}
    ALLOWED_MOVEMENT_TYPES = {"in", "out"}

    @staticmethod
    def _clean_str(value):
        if value is None:
            return ""
        return str(value).strip()

    @staticmethod
    def _parse_balance(value):
        if value is None or value == "":
            return 0.0
        try:
            return float(value)
        except (TypeError, ValueError):
            raise ValueError("Balance must be a valid number")

    @staticmethod
    def _parse_positive_amount(value):
        try:
            amount = float(value)
        except (TypeError, ValueError):
            raise ValueError("Amount must be a valid number")

        if amount <= 0:
            raise ValueError("Amount must be greater than 0")
        return amount

    @staticmethod
    def _normalize_type(value):
        account_type = BillAccountViewModel._clean_str(value).lower()
        if not account_type:
            raise ValueError("Type is required")
        if account_type not in BillAccountViewModel.ALLOWED_TYPES:
            raise ValueError("Type must be 'cash' or 'debt'")
        return account_type

    @staticmethod
    def _normalize_movement_type(value):
        movement_type = BillAccountViewModel._clean_str(value).lower()
        if not movement_type:
            raise ValueError("Movement type is required")
        if movement_type not in BillAccountViewModel.ALLOWED_MOVEMENT_TYPES:
            raise ValueError("Movement type must be 'in' or 'out'")
        return movement_type

    @staticmethod
    def _serialize(account):
        return {
            "id": account.id,
            "name": account.name,
            "type": account.type,
            "balance": float(account.balance) if account.balance is not None else 0.0,
        }

    @staticmethod
    def _serialize_movement(movement):
        return {
            "id": movement.id,
            "order_id": movement.order_id,
            "bill_account_id": movement.bill_account_id,
            "amount": float(movement.amount) if movement.amount is not None else 0.0,
            "movement_type": movement.movement_type,
            "created_at": movement.created_at.isoformat() if movement.created_at else None,
        }

    @staticmethod
    def get_all_bill_accounts():
        accounts = BillAccount.query.order_by(BillAccount.name.asc()).all()
        return [BillAccountViewModel._serialize(account) for account in accounts]

    @staticmethod
    def get_bill_accounts_by_type(account_type):
        normalized = BillAccountViewModel._normalize_type(account_type)
        accounts = (
            BillAccount.query
            .filter(BillAccount.type == normalized)
            .order_by(BillAccount.name.asc())
            .all()
        )
        return [BillAccountViewModel._serialize(account) for account in accounts]

    @staticmethod
    def get_bill_account_by_id(account_id):
        account = BillAccount.query.get(account_id)
        if not account:
            return None
        return BillAccountViewModel._serialize(account)

    @staticmethod
    def get_bill_account_movements(account_id):
        account = BillAccount.query.get(account_id)
        if not account:
            raise ValueError("Bill account not found")

        movements = (
            OrderBillAccount.query
            .filter(OrderBillAccount.bill_account_id == account.id)
            .order_by(OrderBillAccount.created_at.desc(), OrderBillAccount.id.desc())
            .all()
        )
        return [BillAccountViewModel._serialize_movement(movement) for movement in movements]

    @staticmethod
    def create_bill_account_movement(account_id, form_data):
        form_data = form_data or {}
        account = BillAccount.query.get(account_id)
        if not account:
            raise ValueError("Bill account not found")

        amount = BillAccountViewModel._parse_positive_amount(form_data.get("amount"))
        movement_type = BillAccountViewModel._normalize_movement_type(form_data.get("movement_type"))

        movement = OrderBillAccount(
            order_id=None,
            bill_account_id=account.id,
            amount=amount,
            movement_type=movement_type,
        )
        db.session.add(movement)

        current_balance = float(account.balance or 0)
        delta = amount if movement_type == "in" else (amount * -1)
        account.balance = current_balance + delta

        db.session.commit()
        return {
            "account": BillAccountViewModel._serialize(account),
            "movement": BillAccountViewModel._serialize_movement(movement),
        }

    @staticmethod
    def create_bill_account(form_data):
        form_data = form_data or {}
        name = BillAccountViewModel._clean_str(form_data.get("name"))
        account_type = BillAccountViewModel._normalize_type(form_data.get("type"))
        balance = BillAccountViewModel._parse_balance(form_data.get("balance"))

        if not name:
            raise ValueError("Name is required")

        account = BillAccount(name=name, type=account_type, balance=balance)
        db.session.add(account)
        db.session.commit()
        return BillAccountViewModel._serialize(account)

    @staticmethod
    def update_bill_account(account_id, form_data):
        form_data = form_data or {}
        account = BillAccount.query.get(account_id)
        if not account:
            raise ValueError("Bill account not found")

        name = BillAccountViewModel._clean_str(form_data.get("name"))
        account_type = BillAccountViewModel._normalize_type(form_data.get("type"))

        if not name:
            raise ValueError("Name is required")

        account.name = name
        account.type = account_type

        db.session.commit()
        return BillAccountViewModel._serialize(account)

    @staticmethod
    def delete_bill_account(account_id):
        account = BillAccount.query.get(account_id)
        if not account:
            raise ValueError("Bill account not found")

        db.session.delete(account)
        db.session.commit()
        return True
