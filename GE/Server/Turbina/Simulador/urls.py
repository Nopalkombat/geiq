from django.conf.urls import url
from django.contrib import admin

from Simulador import views

urlpatterns = [
	url(r'^Simulador', views.VistaSimulador),
	url(r'^login', views.VistaLogin),
	url(r'^compare', views.VistaCompare),
]