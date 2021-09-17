from os import name
from django.urls import path
from . import views

app_name = 'stockassist'
urlpatterns = [
    path('', view=views.redirect_to_home),
    path('home/', view=views.homepage, name='homepage'),
    path('signup/', view=views.signup, name='signup'),
    path('login/', view=views.login_req, name='login'),
    path('logout/', view=views.logout_req, name='logout'),
    path('addstock/', view=views.add_stock_to_watchlist, name='addstock'),
    path('ajax/requests/search', view=views.search_stock, name='searchstock'),

]