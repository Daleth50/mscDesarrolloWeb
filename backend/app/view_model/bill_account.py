from app.database import db
from app.models.pos import BillAccount


class BillAccountViewModel:
    ALLOWED_TYPES = {"cash", "debt"}

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
    def _normalize_type(value):
        account_type = BillAccountViewModel._clean_str(value).lower()
        if not account_type:
            raise ValueError("Type is required")
        if account_type not in BillAccountViewModel.ALLOWED_TYPES:
            raise ValueError("Type must be 'cash' or 'debt'")
        return account_type

    @staticmethod
    def _serialize(account):
        return {
            "id": account.id,
            "name": account.name,
            "type": account.type,
            "balance": float(account.balance) if account.balance is not None else 0.0,
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
        balance = BillAccountViewModel._parse_balance(form_data.get("balance"))

        if not name:
            raise ValueError("Name is required")

        account.name = name
        account.type = account_type
        account.balance = balance

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
