from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess, json
import models

# Create your views here.
@csrf_exempt
def VistaDefault(request):
	if request.method == "POST":
		ruta = 'C:\Users\Sergio\Desktop\GE/turbinas'

		ejecutar = subprocess.Popen('cmd.exe', stdin = subprocess.PIPE, stdout = subprocess.PIPE)
		anstdout, anstderr = ejecutar.communicate("cd " + ruta + " && " + "turbine_lib.exe\n")
		print(anstdout)
		return HttpResponse(anstdout)

@csrf_exempt
def VistaSimulacion(request):
	if request.method == "POST":
		datos = request.POST.get("json")
		datos = json.loads(datos)
		comandos = {
			"atmosferap" : "--atmosphere-p0=",
			"atmosferat" : "--atmosphere-t0=",
			"sigmain" : "--inlet-sigma=",
			"compic" : "--comp-pi_c=",
			"competa" : "--comp-eta_stag_=",
			"combetaburn" : "--comb_chamber-eta_burn=",
			"combqn" : "--comb_chamber-Q_n=",
			"combtstagout" : "--comb_chamber-T_stag_out=",
			"turbineeta" : "--turbine-eta_stag_p=",
			"turbinep" : "--turbine-p_stag_out=",
			"load" : "--load-power=",
			"sigmaout" : "--outlet-sigma=",
			"regenin" : "--regenerator-T_stag_hot_in=",
			"regenout" : "--regenerator-T_stag_hot_out="
		}
		string_comandos = ""
		for key, value in datos.iteritems():
			if value != '' and key != "username":
				string_comandos = string_comandos + comandos[key] + value + " "
		
		ruta = 'C:\Users\Sergio\Desktop\GE/turbinas'

		ejecutar = subprocess.Popen('cmd.exe', stdin = subprocess.PIPE, stdout = subprocess.PIPE)
		anstdout, anstderr = ejecutar.communicate("cd " + ruta + " && " + "turbine_lib.exe " + string_comandos + " \n")
		salida = anstdout.splitlines();

		#Guardamos los datos
		usuarios = models.Usuario.objects.filter(username=datos["username"])
		print datos["username"]
		iteracion = models.Iteracion(
			atmosferap = float(datos["atmosferap"]),
			atmosferat = float(datos["atmosferat"]),
			sigmain = float(datos["sigmain"]),
			compic = float(datos["compic"]),
			competa = float(datos["competa"]),
			combetaburn = float(datos["combetaburn"]),
			combqn = float(datos["combqn"]),
			combtstagout = float(datos["combtstagout"]),
			turbineeta = float(datos["turbineeta"]),
			turbinep = float(datos["turbinep"]),
			load = float(datos["load"]),
			sigmaout = float(datos["sigmaout"]),
			regenin = float(datos["regenin"]),
			regenout = float(datos["regenout"]),
			fecha = "2017-01-31",
			usuario = usuarios[0]
			)
		iteracion.save()
		last = models.ResultadoIteracion.objects.all()
		print len(last)
		if len(last) is not 0:
			last = last[len(last) - 1]

			dataLast = {
				"load.G_air":str(last.load),
				"comp.T_stag_out":str(last.compt),
				"comp.p_stag_out":str(last.compp),
				"turbine.T_stage_out":str(last.turbinet),
				"turbine.p_stage_out":str(last.turbinep)
			}
		else:
			dataLast = {
				"load.G_air":str(0),
				"comp.T_stag_out":str(0),
				"comp.p_stag_out":str(0),
				"turbine.T_stage_out":str(0),
				"turbine.p_stage_out":str(0)
			}

		data = {
			"load.G_air":str(salida[4:-6]).split("=")[1][:-2],
			"comp.T_stag_out":str(salida[5:-5]).split("=")[1][:-2],
			"comp.p_stag_out":str(salida[6:-4]).split("=")[1][:-2],
			"turbine.T_stage_out":str(salida[7:-3]).split("=")[1][:-2],
			"turbine.p_stage_out":str(salida[8:-2]).split("=")[1][:-2],
			"last":dataLast
		}

		resultados = models.ResultadoIteracion(
			load = float(str(salida[4:-6]).split("=")[1][:-2]),
			compt = float(str(salida[5:-5]).split("=")[1][:-2]),
			compp = float(str(salida[6:-4]).split("=")[1][:-2]),
			turbinet  = float(str(salida[7:-3]).split("=")[1][:-2]),
			turbinep = float(str(salida[8:-2]).split("=")[1][:-2]),
			iteracion = iteracion)
		resultados.save()
		return HttpResponse(json.dumps(data))

@csrf_exempt
def VistaLogin(request):
	if request.method == "POST":
		datos = request.POST.get("json")
		datos = json.loads(datos)
		username = datos['username']
		password = datos['password']
		usuarios = models.Usuario.objects.filter(username=username, password=password)
		if len(usuarios) == 0:
			data = {
				'estado': 0,
				'mensaje': "No existe el usuario"
			}
			return HttpResponse(json.dumps(data))
		else:
			data = {
				'estado': 1,
				'mensaje': "Usuario Existente"
			}
			return HttpResponse(json.dumps(data))

@csrf_exempt
def VistaRegistro(request):
	if request.method == "POST":
		datos = request.POST.get("json")
		datos = json.loads(datos)
		username = datos['username']
		password = datos['password']
		usuarios = models.Usuario.objects.filter(username=username)
		if len(usuarios) == 0:
			usuario = models.Usuario(username=username, password=password)
			usuario.save()
			data = {
				'estado': 1,
				'mensaje': "Usuario Registrado"
			}
			return HttpResponse(json.dumps(data))
		else:
			data = {
				'estado': 2,
				'mensaje': "Usuario Existente"
			}
			return HttpResponse(json.dumps(data))

@csrf_exempt
def VistaIteraciones(request):
	if request.method == "POST":
		datos = request.POST.get("json")
		datos = json.loads(datos)
		usuario = datos["username"]
		usuario = models.Usuario.objects.filter(username=usuario)
		if len(usuario) is not 0:
			iteraciones = models.Iteracion.objects.filter(usuario=usuario[0])
			listaIteraciones = []
			for x in range(len(iteraciones)):
				jsonIt = {
					"id":str(iteraciones[x].id),
					"fecha":str(iteraciones[x].fecha)
				}
				listaIteraciones.append(jsonIt)
			data = {
				"estado": 1,
				"iteraciones": listaIteraciones
			}
			return HttpResponse(json.dumps(data))
		data = {
			"estado":0,
			"mensaje":"No hay iteraciones"
		}
		return HttpResponse(json.dumps(data))