from django.urls import path
from . import views

app_name = 'stockassist'
urlpatterns = [
    path('', view=views.redirect_to_home, name='authcheck'),
    path('home/', view=views.homepage, name='homepage'),
    path('signup/', view=views.signup, name='signup'),
    path('login/', view=views.login_req, name='login'),
    path('logout/', view=views.logout_req, name='logout'),
    path('addstock/<str:stock_symbol>/<str:stock_name>/', view=views.add_stock_to_watchlist, name='addstock'),
    path('deletestock/<str:stock_symbol>/', view=views.delete_from_watchlist, name='deletestock'),
    path('ajax/requests/search/', view=views.search_stock, name='searchstock'),
    path('ajax/requests/fetch_price/', view=views.get_stock_price, name='fetch_price'),
    path('error/',view=views.error, name='error'),
    path('ajax/requests/get_opens/', view=views.fetch_open_market_price, name='getOpenPrices'),
    path('ajax/getInfo/', view=views.stock_info_module, name='getInfo'),
    path('ajax/getChartData', view=views.stockChartData, name='getChartData'),
    path('myportfolio/', view=views.myportfolio, name='myportfolio'),

]