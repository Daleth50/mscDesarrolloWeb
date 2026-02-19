from app.database import db
from app.models.pos import Contact


class ContactViewModel:
    @staticmethod
    def list_contacts():
        return ContactViewModel.get_all_contacts()

    @staticmethod
    def get_all_contacts():
        contacts = Contact.query.all()
        return [contact.to_dict() for contact in contacts]

    @staticmethod
    def create_contact(form_data):
        name = form_data.get("name", "").strip()
        email = form_data.get("email", "").strip() or None
        phone = form_data.get("phone", "").strip() or None
        address = form_data.get("address", "").strip() or None

        if not name:
            raise ValueError("Name is required")

        new_contact = Contact(
            name=name,
            email=email,
            phone=phone,
            address=address,
        )
        db.session.add(new_contact)
        db.session.commit()
        return new_contact.to_dict()
