from django.shortcuts import redirect, render
from django.contrib.auth.models import User
import django.contrib.auth as auth

# Create your views here.
def homepage(request):
    if request.method == 'GET':
        context = {}
        return render(request, 'stockassist/index.html', context=context)

def signup(request):
    if request.method == 'GET':
        context = {}
        return render(request, 'stockassist/signup.html', context)
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
            return render(request, 'stockassist/index.html')
    else:
        return render(request, 'stockassist/index.html')

def login_req(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['pwd']
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return redirect('stockassist:homepage')
        else:
            return render(request, 'stockassist/index.html')
    else:
        return render(request, 'stockassist/index.html')

def logout_req(request):
    if request.method == 'GET':
        auth.logout(request)
        return redirect('stockassist:homepage')

