from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api
from . import views
from knox import views as knox_views

app_name = "users"

router = DefaultRouter()
router.register(r"users", api.UserViewSet, basename="user")

urlpatterns = [

   path("auth/login", views.login_view, name="login"),
   path("auth/logout", views.logout_view, name="logout"),
   path("auth/register", views.register, name="register"),
   path("<int:id>", views.profile_redirect, name="profile_redirect"),
   path("<int:id>/<str:page>", views.profile, name="profile"),

   # API Routes
   path('api/', include(router.urls)),
   path('api/auth/', include('knox.urls')),
   path('api/auth/logout', knox_views.LogoutView.as_view(), name="knox-logout"),
   path('api/auth/register', api.RegisterView.as_view()),
   path('api/auth/login', api.LoginView.as_view()),
   path("api/users/<int:user_id>/follow", api.follow, name="follow"),


]