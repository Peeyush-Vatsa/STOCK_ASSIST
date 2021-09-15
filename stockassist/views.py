from typing import ContextManager
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
import django.contrib.auth as auth
from .ajax_templates import topStocks

# Create your views here.
def homepage(request):
    if request.method == 'GET':
        TOPSTOCKS = topStocks()
        context = {
            'TOPSTOCKS': TOPSTOCKS
        }
        return render(request, 'stockassist/index.html', context=context)

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
        print("Preparing to authenticate user...")
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            print("User is authenticated"+'\n'+"Logging user in...")
            auth.login(request, user)
            return redirect('stockassist:homepage')
        else:
            print("User authentication failed")
            print("Redirecting to homepage...")
            TOPSTOCKS = topStocks()
            context = {
                'notauthenticated': True,
                'TOPSTOCKS': TOPSTOCKS
            }
            return render(request, 'stockassist/index.html', context)
    else:
        return render(request, 'stockassist/index.html')

def logout_req(request):
    if request.method == 'GET':
        auth.logout(request)
        return redirect('stockassist:homepage')

