from app.view_model.contact.main import ContactViewModel
from app.view_model.order.main import OrderViewModel


class PosView:
    def __init__(self):
        self.contact_service = ContactViewModel()
        self.order_service = OrderViewModel()

    def create_contact(self, form_data):
        return self.contact_service.create_contact(form_data)

    def create_order(self, form_data):
        return self.order_service.create_order(form_data)
