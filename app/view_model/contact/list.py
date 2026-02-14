from app.view_model.contact.main import ContactViewModel


class ContactListViewModel:
    def __init__(self):
        self.contact_service = ContactViewModel()

    def get_contacts_table_data(self):
        return self.contact_service.list_contacts()
