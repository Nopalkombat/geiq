from __future__ import unicode_literals

from django.db import models

class Usuario(models.Model):
	username = models.CharField(max_length=45)
	password = models.CharField(max_length=45)

class Iteracion(models.Model):
	atmosferap = models.DecimalField(max_digits=30, decimal_places=20)
	atmosferat = models.DecimalField(max_digits=30, decimal_places=20)
	sigmain = models.DecimalField(max_digits=30, decimal_places=20)
	compic = models.DecimalField(max_digits=30, decimal_places=20)
	competa = models.DecimalField(max_digits=30, decimal_places=20)
	combetaburn = models.DecimalField(max_digits=30, decimal_places=20)
	combqn = models.DecimalField(max_digits=30, decimal_places=20)
	combtstagout = models.DecimalField(max_digits=30, decimal_places=20)
	turbineeta = models.DecimalField(max_digits=30, decimal_places=20)
	turbinep = models.DecimalField(max_digits=30, decimal_places=20)
	load = models.DecimalField(max_digits=30, decimal_places=20)
	sigmaout = models.DecimalField(max_digits=30, decimal_places=20)
	regenin = models.DecimalField(max_digits=30, decimal_places=20)
	regenout = models.DecimalField(max_digits=30, decimal_places=20)
	fecha = models.DateField()
	usuario = models.ForeignKey(Usuario)

class ResultadoIteracion(models.Model):
	load = models.DecimalField(max_digits=30, decimal_places=20)
	compt = models.DecimalField(max_digits=30, decimal_places=20)
	compp = models.DecimalField(max_digits=30, decimal_places=20)
	turbinet = models.DecimalField(max_digits=30, decimal_places=20)
	turbinep = models.DecimalField(max_digits=30, decimal_places=20)
	iteracion = models.ForeignKey(Iteracion)

