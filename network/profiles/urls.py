from django.urls import path
from . import views

app_name = "profiles"

urlpatterns = [

    path("", views.profile, name="")

   # API Routes
   # path("api/<int:id>", views.profile, name="profile"),
]