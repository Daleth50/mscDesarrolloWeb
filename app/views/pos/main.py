from app.view_model.contact.main import ContactViewModel


class PosView:
    def __init__(self):
        self.contact_service = ContactViewModel()

    def create_contact(self, form_data):
        return self.contact_service.create_contact(form_data)
