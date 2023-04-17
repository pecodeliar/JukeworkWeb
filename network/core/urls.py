from django.urls import path
from . import views

urlpatterns = [

   path("", views.index, name="index"),
   path("search", views.search, name="search"),

   # API Routes
   path("api/search/posts", views.posts, name="posts"),
   path("api/search/users", views.users, name="users")
]