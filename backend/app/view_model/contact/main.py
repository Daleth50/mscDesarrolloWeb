from app.database import db
from app.models.pos import Contact


class ContactViewModel:
    ALLOWED_KINDS = {"customer", "supplier"}

    @staticmethod
    def normalize_kind(kind):
        if kind is None:
            return None
        normalized = str(kind).strip().lower()
        if not normalized:
            return None
        if normalized not in ContactViewModel.ALLOWED_KINDS:
            raise ValueError("Kind must be 'customer' or 'supplier'")
        return normalized

    @staticmethod
    def list_contacts():
        return ContactViewModel.get_all_contacts()

    @staticmethod
    def get_all_contacts():
        contacts = Contact.query.all()
        return [contact.to_dict() for contact in contacts]

    @staticmethod
    def get_contacts_by_kind(kind):
        normalized_kind = ContactViewModel.normalize_kind(kind)
        if not normalized_kind:
            return ContactViewModel.get_all_contacts()

        contacts = Contact.query.filter(Contact.kind == normalized_kind).all()
        return [contact.to_dict() for contact in contacts]

    @staticmethod
    def get_contact_by_id(contact_id):
        contact = Contact.query.get(contact_id)
        if not contact:
            return None
        return contact.to_dict()

    @staticmethod
    def create_contact(form_data):
        form_data = form_data or {}
        name = form_data.get("name", "").strip()
        email = form_data.get("email", "").strip() or None
        phone = form_data.get("phone", "").strip() or None
        address = form_data.get("address", "").strip() or None
        kind = ContactViewModel.normalize_kind(form_data.get("kind") or "customer")

        if not name:
            raise ValueError("Name is required")
        if kind not in ContactViewModel.ALLOWED_KINDS:
            raise ValueError("Kind must be 'customer' or 'supplier'")

        new_contact = Contact(
            name=name,
            email=email,
            phone=phone,
            address=address,
            kind=kind,
        )
        db.session.add(new_contact)
        db.session.commit()
        return new_contact.to_dict()

    @staticmethod
    def create_supplier(form_data):
        data = dict(form_data or {})
        data["kind"] = "supplier"
        return ContactViewModel.create_contact(data)

    @staticmethod
    def update_contact(contact_id, form_data):
        form_data = form_data or {}
        contact = Contact.query.get(contact_id)
        if not contact:
            raise ValueError("Contact not found")

        name = (form_data.get("name") or "").strip()
        email = (form_data.get("email") or "").strip() or None
        phone = (form_data.get("phone") or "").strip() or None
        address = (form_data.get("address") or "").strip() or None

        if not name:
            raise ValueError("Name is required")

        kind = ContactViewModel.normalize_kind(form_data.get("kind") or contact.kind)
        if kind not in ContactViewModel.ALLOWED_KINDS:
            raise ValueError("Kind must be 'customer' or 'supplier'")

        contact.name = name
        contact.email = email
        contact.phone = phone
        contact.address = address
        contact.kind = kind

        db.session.commit()
        return contact.to_dict()

    @staticmethod
    def delete_contact(contact_id):
        contact = Contact.query.get(contact_id)
        if not contact:
            raise ValueError("Contact not found")

        db.session.delete(contact)
        db.session.commit()
        return True
