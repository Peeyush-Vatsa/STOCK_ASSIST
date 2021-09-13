from django.urls import path
from .views import homepage, signup

app_name = 'stockassist'
urlpatterns = [
    path('', view=homepage, name='homepage'),
    path('signup/', view=signup, name='signup'),
]