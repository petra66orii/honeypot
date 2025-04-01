from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_profile, name='userprofile'),
    path("edit-profile/", views.edit_profile, name="edit_profile"),
    path("delete-account/", views.delete_account, name="delete_account"),
    path("change-password/", views.change_password, name="change_password"),
]
