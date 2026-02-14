from flask import render_template
from app.view_model.contact.list import ContactListViewModel


class ContactListView:
    def __init__(self):
        self.contact_list_view_model = ContactListViewModel()

    def render(self):
        contacts = self.contact_list_view_model.get_contacts_table_data()
        return render_template("contacts/list-contacts.html", contacts=contacts)
