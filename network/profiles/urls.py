from django.urls import path
from . import views

app_name = "profiles"

urlpatterns = [

    path("", views.index, name=""),

   # API Routes
   path("api/profile/<int:id>", views.profile, name="profile"),
]