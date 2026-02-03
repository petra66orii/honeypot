from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path(
        'password-reset/confirm/<uid>/<token>/',
        RedirectView.as_view(
            url=f"{settings.URL_FRONTEND}/password-reset/confirm/%(uid)s/%(token)s/",
            permanent=False,
        ),
        name='password_reset_confirm',
    ),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/profiles/', include('userprofile.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/home/', include('home.urls')),
    path('api/', include('products.urls')),
    path('bag/', include('bag.urls')),
    path('api/checkout/', include('checkout.urls')),
    path('api/blog/', include('blog.urls')),
    path('summernote/', include('django_summernote.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
