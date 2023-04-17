from django.urls import path
from . import views

urlpatterns = [

   path("", views.index, name="index"),
   path("search", views.search, name="search"),

   # API Routes
   path("api/search/posts/<str:input>", views.posts, name="posts"),
   path("api/search/users/<str:input>", views.users, name="users"),
   path("test", views.test, name="test")
]