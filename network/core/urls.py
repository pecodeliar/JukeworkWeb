from django.urls import path
from . import views

app_name="core"

urlpatterns = [

   path("", views.index, name="index"),
   path("search", views.search, name="search"),
   path("following", views.following, name="following"),

   # API Routes
   path("api/search/posts/<str:input>", views.posts, name="posts"),
   path("api/search/users/<str:input>", views.users, name="users"),
   path("test", views.test, name="test")
]