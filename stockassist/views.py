from django.contrib.auth import models
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
import django.contrib.auth as auth

from stockassist.cloudant_connect import fetch_current_prices, fetch_intraday_prices, get_open_prices
from stockassist.stock_operations import fetch_quote, is_market_open
from .ajax_templates import add_stock_to_db, remove_stock_from_db, search, topStocks, update_price_in_local_db
from stockassist.models import watchlist_stocks_current

# Create your views here.

def homepage(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return redirect('stockassist:authcheck')
        TOPSTOCKS = topStocks()
        context = {
            'stock_result': TOPSTOCKS
        }
        if request.user.is_authenticated:
            context['market_open'] = is_market_open()
            current_stock_price = fetch_current_prices()
            update_price_in_local_db(current_stock_price['prices'], request.user.username)
            my_stocks = watchlist_stocks_current.objects.filter(watchlist_user = request.user.username)
            context['watchlist_stocks'] = my_stocks
        return render(request, 'stockassist/index.html', context=context)
    else:
        error(request, 'Looks like you wandered off')

def redirect_to_home(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            context = {
                'notauthenticated': False
            }
            return render(request, 'stockassist/loginpage.html', context)
        return redirect('stockassist:homepage')
    else:
        error(request, 'Looks like you wandered off')
def signup(request):
    if request.method == 'GET':
        return render(request, 'stockassist/signup.html')
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['pwd']
        firstName = request.POST['fname']
        lastName = request.POST['lname']
        emailid = request.POST['emailid']
        userExist = False
        try:
            User.objects.get(username=username)
            userExist = True
        except:
            pass
        if not userExist:
            user = User.objects.create_user(username=username, password=password, first_name=firstName, last_name=lastName, email=emailid)
            auth.login(request, user)
            return redirect('stockassist:homepage')
        else:
            context = {
                'userExists': True,
                'fname': firstName,
                'lname': lastName,
                'emailid': emailid
            }
            return render(request, 'stockassist/signup.html', context=context)
    else:
        return redirect('stockassist:homepage')

def login_req(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['pwd']
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return redirect('stockassist:homepage')
        else:
            context = {
                'notauthenticated': True
            }
            return render(request, 'stockassist/loginpage.html', context)
    else:
        return render(request, 'stockassist/loginpage.html')

def logout_req(request):
    if request.method == 'GET':
        auth.logout(request)
        return redirect('stockassist:authcheck')
    else:
        error(request, 'Looks like you wandered off')

def search_stock(request):
    if request.method == 'GET':
        str = request.GET['searchStr']
        result = search(str)
        return JsonResponse({
            'stock_result': result
        })
    else:
        error(request, 'Looks like you wandered off')

def add_stock_to_watchlist(request, stock_symbol, stock_name):
    if request.method == 'GET':
        if request.user.is_authenticated:
            stock_in_watchlist = False
            try:
                stock = watchlist_stocks_current.objects.get(stk_symbol=stock_symbol, watchlist_user=request.user.username)
                stock_in_watchlist = True
            except:
                pass
            if not stock_in_watchlist:
                stk = watchlist_stocks_current(
                    stk_symbol=stock_symbol, stk_name=stock_name, 
                    watchlist_user=request.user.username)
                stk.save()
                add_stock_to_db(stock_symbol)
                return redirect('stockassist:homepage')
            else:
                return redirect('stockassist:homepage')
        else:
            return redirect('stockassist:authcheck')
    else:
        error(request, 'Looks like you wandered off')

def delete_from_watchlist(request, stock_symbol):
    if request.method == 'GET':
        try:
            watchlist_stocks_current.objects.get(stk_symbol=stock_symbol, watchlist_user=request.user.username).delete()
        except:
            pass
        try:
            stk = watchlist_stocks_current.objects.get(stk_symbol=stock_symbol)
        except:
            remove_stock_from_db(stock_symbol)
        finally:
            return redirect('stockassist:homepage')
    else:
        error(request, 'Looks like you wandered off')

def get_stock_price(request):
    if request.method == 'GET':
        if not is_market_open():
            return JsonResponse({'market':'closed'})
        else:
            current_stock_price = fetch_current_prices()
            return JsonResponse({'market':'open', 'prices': current_stock_price['prices'], 'time': current_stock_price['time']})

def fetch_open_market_price(request):
    if request.method == 'GET':
        prices = get_open_prices()
        return JsonResponse({'open': prices})
    else:
        error(request, 'Looks like you wandered off')

def stock_info_module(request):
    if request.method == 'GET':
        stock = (request.GET['stock']).format('.')
        data = fetch_quote(stock)
        chart_dataset = fetch_intraday_prices(stock)
        return JsonResponse({'fundamental':data, 'chart_data': chart_dataset})
    else:
        error(request, message='Looks like you wandered off')

def error(request, message):
    return render(request, 'stockassist/error.html', {'errormessage': message})