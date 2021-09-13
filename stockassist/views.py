from django.shortcuts import render

# Create your views here.
def homepage(request):
    if request.method == 'GET':
        context = {}
        return render(request, 'stockassist/index.html', context=context)

def signup(request):
    if request.method == 'GET':
        context = {}
        return render(request, 'stockassist/signup.html', context)