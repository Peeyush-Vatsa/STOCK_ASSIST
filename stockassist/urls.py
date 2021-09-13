from django.urls import path
from .views import homepage, login_req, logout_req, signup

app_name = 'stockassist'
urlpatterns = [
    path('', view=homepage, name='homepage'),
    path('signup/', view=signup, name='signup'),
    path('login/', view=login_req, name='login'),
    path('logout/', view=logout_req, name='logout'),
]