from django.apps import AppConfig


class UserprofileConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "userprofile"

    def ready(self):
        """
        Ensures that the signals are imported and
        connected when the app is ready.
        """
        import userprofile.signals
