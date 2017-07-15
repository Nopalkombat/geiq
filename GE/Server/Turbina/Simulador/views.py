from django.shortcuts import render

# Create your views here.

def VistaSimulador(request):
	context = []
	return render(request, 'index.html', context)

def VistaLogin(request):
	context = []
	return render(request, 'login.html', context)

def VistaCompare(request):
	context = []
	return render(request, 'compare.html', context)

def VistaGrafica(request):
	context = []
	return render(request, 'chart.html', context)
