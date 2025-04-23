from . import views
from django.urls import path

urlpatterns = [
    path('', views.BlogPostList.as_view(), name='blog'),
    path('create/', views.PostCreateView.as_view(), name='create_post'),
    path('<slug:slug>/', views.PostDetailView.as_view(), name='post'),
    path('<slug:slug>/edit', views.PostUpdateView.as_view(), name='edit_post'),
    path('<slug:slug>/delete', views.PostDeleteView.as_view(),
         name='delete_post'),
    path('<slug:slug>/edit_comment/<int:comment_id>',
         views.PostDetailView.edit_comment, name='edit_comment'),
    path('<slug:slug>/delete_comment/<int:comment_id>',
         views.PostDetailView.delete_comment, name='delete_comment'),
]
