
from django.conf.urls import include, url
from django.contrib import admin

from API import views

urlpatterns = [
	url(r'^default', views.VistaDefault),
	url(r'^simulacion', views.VistaSimulacion),
	url(r'^login', views.VistaLogin),
	url(r'^registro', views.VistaRegistro),
	url(r'^iteraciones', views.VistaIteraciones),
	url(r'^iteracion', views.VistaIteracion),
	url(r'^resultado', views.VistaResultado),
]