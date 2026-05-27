from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings

class CustomAccountAdapter(DefaultAccountAdapter):
    # This ensures the link in the email is http://localhost:5173/verify-email/<key>/
    def get_email_confirmation_url(self, request, emailconfirmation):
        url = settings.URL_FRONTEND # e.g. 'http://localhost:5173'
        return f"{url}/verify-email/{emailconfirmation.key}/"