from django.contrib.auth import models
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
import django.contrib.auth as auth
from .ajax_templates import add_stock_to_db, remove_stock_from_db, search, search_for_id, topStocks
from stockassist.models import watchlist_stocks_current

# Create your views here.
def homepage(request):
    if request.method == 'GET':
        TOPSTOCKS = topStocks()
        context = {
            'stock_result': TOPSTOCKS,
        }
        if request.user.is_authenticated:
            my_stocks = watchlist_stocks_current.objects.filter(watchlist_user = request.user.username)
            context['watchlist_stocks'] = my_stocks
        return render(request, 'stockassist/index.html', context=context)

def redirect_to_home(request):
    return redirect('stockassist:homepage')

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
            TOPSTOCKS = topStocks()
            context = {
                'notauthenticated': True,
                'stock_result': TOPSTOCKS,
            }
            return render(request, 'stockassist/index.html', context)
    else:
        return render(request, 'stockassist/index.html')

def logout_req(request):
    if request.method == 'GET':
        auth.logout(request)
        return redirect('stockassist:homepage')

def search_stock(request):
    if request.method == 'GET':
        str = request.GET['searchStr']
        result = search(str)
        return JsonResponse({
            'stock_result': result
        })

def add_stock_to_watchlist(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            stock_symbol = request.GET['symbol']
            if stock_symbol.split('.')[1] == 'BSE':
                stock_id = search_for_id(stock_symbol)
            else:
                stock_id = 0
            stock_in_watchlist = False
            try:
                stock = watchlist_stocks_current.objects.get(stk_symbol=stock_symbol, watchlist_user=request.user.username)
                stock_in_watchlist = True
            except:
                pass
            if not stock_in_watchlist:
                stk = watchlist_stocks_current(
                    stk_symbol=stock_symbol, stk_name=request.GET['stock_name'], 
                    stk_id = stock_id, watchlist_user=request.user.username)
                stk.save()
                add_stock_to_db(stock_symbol)
                return JsonResponse({'issuccessful': True})
            else:
                return JsonResponse({'issuccessful': False})
        else:
            return redirect('stockassist:homepage')

def delete_from_watchlist(request, stock_symbol):
    if request.method == 'GET':
        watchlist_stocks_current.objects.get(stk_symbol=stock_symbol, watchlist_user=request.user.username).delete()
        try:
            stk = watchlist_stocks_current.objects.get(stk_symbol=stock_symbol)
        except:
            remove_stock_from_db(stock_symbol)
        finally:
            return redirect('stockassist:homepage')

def get_stock_price(request):
    pass