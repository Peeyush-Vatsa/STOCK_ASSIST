from django.urls import path
from . import views

app_name = 'stockassist'
urlpatterns = [
    path('', view=views.homepage, name='homepage'),
    path('signup/', view=views.signup, name='signup'),
    path('login/', view=views.login_req, name='login'),
    path('logout/', view=views.logout_req, name='logout'),
    path('ajax/requests/search', view=views.search_stock, name='searchstock'),
]