var yaPuestos = [];

function cargarItems()
{
  yaPuestos = JSON.parse(localStorage.getItem("arregloElementos"));
  if(yaPuestos.length != 0)
  {
    pintarElementos();
  }
}

function cargarGrafica()
{
  yaPuestos = JSON.parse(localStorage.getItem("arregloElementos"));
  if(yaPuestos.length == 0)
  {
    alert("No hay elementos para graficar");
    window.location = "compare";
  }
  else
  {
    elementos = [];
    yaPuestos.forEach(function(element){
      element = JSON.parse(element);
      jsonData = {
        id : element.id
      }
      jsonData = JSON.stringify(jsonData);
      $.ajax({
        url:"/API/resultado/",
        type:"POST",
        data:{json: jsonData},
        success:function(data){
          dataa = JSON.parse(data);
          arrayElementos = [];
          arrayElementos.push(parseFloat(dataa.load));
          arrayElementos.push(parseFloat(dataa.compt));
          arrayElementos.push(parseFloat(dataa.compp));
          arrayElementos.push(parseFloat(dataa.turbinet));
          arrayElementos.push(parseFloat(dataa.turbinep));
          jsonElement = {
            name : element.id,
            data : arrayElementos
          }
          elementos.push(jsonElement);
          console.log(JSON.stringify(elementos));
          Highcharts.chart('chart', {
      chart: {
          type: 'area'
      },
      title: {
          text: 'Últimas dos Iteraciones'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
          allowDecimals: false,
          labels: {
              formatter: function () {
                  return this.value; // clean, unformatted number for year
              }
          }
      },
      yAxis: {
          title: {
              text: 'Valores'
          },
          labels: {
              formatter: function () {
                  return this.value / 1000 + 'k';
              }
          }
      },
      tooltip: {
          pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      plotOptions: {
          area: {
              pointStart: 1940,
              marker: {
                  enabled: false,
                  symbol: 'circle',
                  radius: 2,
                  states: {
                      hover: {
                          enabled: true
                      }
                  }
              }
          }
      },
      series: elementos
  });
        }
      });
    });
  }
}

function cargarIteraciones(){
  cargarItems();
  yaPuestos = [];
  jsonData = {
      username:localStorage.getItem("usuarioGE")
    }
  
  jsonData = JSON.stringify(jsonData);
  $.ajax({
    url:"/API/iteraciones/",
    type:"POST",
    data:{json:jsonData},
    success: function(data){
      data = JSON.parse(data);
      if(data.estado == 1){
        for(i = 0; i < data.iteraciones.length; i++){
          $('#tabla_errorse').append('<tr onclick="cargarIteracion(' + data.iteraciones[i].id + ')"><td>' + data.iteraciones[i].id + '</td><td>' + data.iteraciones[i].fecha +'</td></tr>');
        }
      }
    }
  });
}

function cargarIteracion(id){
  bandera = false;
  index = 0;
  yaPuestos.forEach(function(element){
    elementp = JSON.parse(element);
    if(elementp.id == id){
      bandera = true;
      index = yaPuestos.indexOf(element);
    }
  });
  if(bandera == false){
    addElemento(id);
    
  }
  else
  {
    yaPuestos.splice(index, 1);
    pintarElementos();
    localStorage.setItem("arregloElementos", JSON.stringify(yaPuestos)); 
  }
}

function addElemento(id){
  jsonData = {
    id:id,
    username:localStorage.getItem("usuarioGE")
  }
  jsonData = JSON.stringify(jsonData);
  $.ajax({
    url:"/API/iteracion/",
    type:"POST",
    data:{json:jsonData},
    success: function(data){
      data = JSON.parse(data);
      jsonData = {
        id:data.id,
        atmosferap:data.atmosferap,
        atmosferat:data.atmosferat,
        sigmain:data.sigmain,
        compic:data.compic,
        competa:data.competa,
        combetaburn:data.combetaburn,
        combqn:data.combqn,
        combtstagout:data.combtstagout,
        turbineeta:data.turbineeta,
        turbinep:data.turbinep,
        load:data.load,
        sigmaout:data.sigmaout,
        regenin:data.regenin,
        regenout:data.regenout  
      }
      jsonData = JSON.stringify(jsonData);
      yaPuestos.push(jsonData);
      localStorage.setItem("arregloElementos", JSON.stringify(yaPuestos)); 
      pintarElementos();
    }
  });
}

function pintarElementos(){
  $("#div-scroll").empty();
  yaPuestos.forEach(function(element){
    element = JSON.parse(element);
    $("#div-scroll").append('<div class="tar_form_res_scroll">'+
      '<div class="scroll1">'+
      '<h3 id="itera">Iteration #' + element.id + '</h3>' +
      '<h2>Total pressure</h2><input type        ="text" id="atmosferap" value = "' + element.atmosferap + '">' +
      '<h2>Total temperature</h2><input type     ="text" id="atmosferat" value = "' + element.atmosferat + '">' +
      '<h2>Pressure ratio out/in</h2><input type                ="text" id="sigmain" value = "' + element.sigmain + '">' +
      '<h2>Pressure ratio</h2><input type                  ="text" id="compic" value = "' + element.compic + '">' +
      '</div>' +
      '<div class="scroll1">' +
      '<h2>Polytropic efficiency</h2><input type             ="text" id="competa" value = "' + element.competa + '">' +
      '<h2>Combustion efficiency</h2><input type      ="text" id="combetaburn" value = "' + element.combetaburn + '">' +
      '<h2>Low Heating Value</h2><input type           ="text" id="combqn" value = "' + element.combqn + '">' +
      '<h2>Output total temperature</h2><input type    ="text" id="combtstagout" value = "' + element.combtstagout + '">' +
      '</div>' +
      '<div class="scroll1">' +
      '<h2>Turbine polytropic efficiency</h2><input type         ="text" id="turbineeta" value = "' + element.turbineeta + '">' +
      '<h2>Turbine output total pressure</h2><input type         ="text" id="turbinep" value = "' + element.turbinep + '">' +
      '<h2>Power demand</h2><input type                 ="text" id="load" value = "' + element.load + '">' +
      '<h2>Outlet pressure ratio out/in</h2><input type               ="text" id="sigmaout" value = "' + element.sigmaout + '">' +
      '</div>' +
      '<div class="scroll1">' +
      '<h2>Total temperature of gases at inlet</h2><input type  ="text" id="regenin" value = "' + element.regenin + '">' +
      '<h2>Total temperature of gases at outlet</h2><input type ="text" id="regenout" value = "' + element.regenout + '">' +
      '</div>' +

      '</div>');
  });
}

function simular(){
    atmosferap = $("#atmosferap").val();
    atmosferat = $("#atmosferat").val();
    sigmain = $("#sigmain").val();
    compic = $("#compic").val();
    competa = $("#competa").val();
    combetaburn = $("#combetaburn").val();
    combqn = $("#combqn").val();
    combtstagout = $("#combtstagout").val();
    turbineeta = $("#turbineeta").val();
    turbinep = $("#turbinep").val();
    load = $("#load").val();
    sigmaout = $("#sigmaout").val();
    regenin = $("#regenin").val();
    regenout = $("#regenout").val();

    if(atmosferap == "") atmosferap = 100000;
    if(atmosferat == "") atmosferat = 288;
    if(sigmain == "") sigmain = 0.98;
    if(compic == "") compic = 5;
    if(competa == "") competa = 0.89;
    if(combetaburn == "") combetaburn = 0.98;
    if(combqn == "") combqn = 43000000;
    if(combtstagout == "") combtstagout = 1600;
    if(turbineeta == "") turbineeta = 0.91;
    if(turbinep == "") turbinep = 170000;
    if(load == "") load = 2300000;
    if(sigmaout == "") sigmaout = 0.99;
    if(regenin == "") regenin = 1100;
    if(regenout == "") regenout = 900;

	jsonDatos = {
    username:localStorage.getItem("usuarioGE"),
		atmosferap:atmosferap,
		atmosferat:atmosferat,
		sigmain:sigmain,
		compic:compic,
		competa:competa,
		combetaburn:combetaburn,
		combqn:combqn,
		combtstagout:combtstagout,
		turbineeta:turbineeta,
		turbinep:turbinep,
		load:load,
		sigmaout:sigmaout,
		regenin:regenin,
		regenout:regenout
	}
	jsonDatos = JSON.stringify(jsonDatos);
	$.ajax({
		url:'/API/simulacion/',
		type:'POST',
		data:{json:jsonDatos},
		success:function(data){
      data = JSON.parse(data);
      $("#oload").val(data["load.G_air"]);
      $("#ocompt").val(data["comp.T_stag_out"]);
      $("#ocompp").val(data["comp.p_stag_out"]);
      $("#oturbinet").val(data["turbine.T_stage_out"]);
			$("#oturbinep").val(data["turbine.p_stage_out"]);
      lastData = data["last"];
      $("#lload").val(lastData["load.G_air"]);
      $("#lcompt").val(lastData["comp.T_stag_out"]);
      $("#lcompp").val(lastData["comp.p_stag_out"]);
      $("#lturbinet").val(lastData["turbine.T_stage_out"]);
      $("#lturbinep").val(lastData["turbine.p_stage_out"]);

      /*google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var datos = google.visualization.arrayToDataTable([
          ['Salidas', 'Actual', 'Ultima'],
          ['load.G_air', parseFloat(data["load.G_air"]), parseFloat(lastData["load.G_air"])],
          ['comp.T_stag_out', parseFloat(data["comp.T_stag_out"]), parseFloat(lastData["comp.T_stag_out"])],
          ['comp.p_stag_out', parseFloat(data["comp.p_stag_out"]), parseFloat(lastData["comp.p_stag_out"])],
          ['turbine.T_stage_out', parseFloat(data["turbine.T_stage_out"]), parseFloat(lastData["turbine.T_stage_out"])],
          ['turbine.p_stage_out', parseFloat(data["turbine.p_stage_out"]), parseFloat(lastData["turbine.p_stage_out"])]
        ]);

        var options = {
          title: 'Grafica Perrona',
          curveType: 'function',
          pointSize:10,
          legend: { position: 'bottom' },
          pointShape:'square'
        };

        var chart = new google.charts.Line(document.getElementById('curve_chart'));

        chart.draw(datos, google.charts.Line.convertOptions(options));
		  }*/

      Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Últimas dos Iteraciones'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        allowDecimals: false,
        labels: {
            formatter: function () {
                return this.value; // clean, unformatted number for year
            }
        }
    },
    yAxis: {
        title: {
            text: 'Valores'
        },
        labels: {
            formatter: function () {
                return this.value / 1000 + 'k';
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: 1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        name: 'Actual',
        data: [parseFloat(data["load.G_air"]), parseFloat(data["comp.T_stag_out"]), parseFloat(data["comp.p_stag_out"]),
        parseFloat(data["turbine.T_stage_out"]), parseFloat(data["turbine.p_stage_out"])]
    }, {
        name: 'Ultima',
        data: [parseFloat(lastData["load.G_air"]), parseFloat(lastData["comp.T_stag_out"]), parseFloat(lastData["comp.p_stag_out"]),
        parseFloat(lastData["turbine.T_stage_out"]), parseFloat(lastData["turbine.p_stage_out"])]
    }]
});

    }
	});
}

var frecuenciaA = [];
var mejorPronosticoA = [];
var seA = [];
var periodoA = [];
/**
* Function registrar_form
* muestra del lado del front el formulario para poder registrarse
*
*/
$(function(){
  $("#registrar_form").click(function(){
    $("#login_contenedor").addClass("ocultar_form");
    $("#registro_contenedor").removeClass("ocultar_form");
    $("#registro_contenedor").addClass("mostrar_form");
  });
  $("#login_form").click(function(){
    $("#registro_contenedor").addClass("ocultar_form");
    $("#login_contenedor").removeClass("ocultar_form");
    $("#login_contenedor").addClass("mostrar_form");
  });
});

/**
* Function notificacion
* esta funcion muestra la notificacion lateral del index cuando se sube un documento
*
*/
function notificacion(texto){
  $("#notificaciones").css("transition","0.8s");
  $("#notificaciones").css("right","0");
  $("#notificaciones").find("h1").html(texto);
  setTimeout(function(){
    $("#notificaciones").css("right","-30%");
  },3000);
}

/**
* Function notificacion
* esta funcion muestra la notificacion superior la cual manda los resultados de las
* validaciones de login y registro
*
*/
function notificacion_login(texto){
  $("#notificaciones_login").css("transition","0.8s");
  $("#notificaciones_login").css("top","0");
  $("#notificaciones_login").find("h1").html(texto);
  setTimeout(function(){
    $("#notificaciones_login").css("top","-20%");
  },4000);
}

/**
* Function btn_registrar
* obtiene los datos del registro y por medio del controlador hace las validaciones
* y las guarda registrando un nuevo usuario
*/
$(function(){
  $("#btn_registrar").click(function(){
    var form = $("#form_registro")[0];
    if (form.password_registro.value != form.confirmar_password_registro.value) {
      notificacion_login("Password Distintas");
    } else {
      jsonDatos = {
        username:form.username_registro.value,
        password:form.password_registro.value
      }
      jsonDatos = JSON.stringify(jsonDatos);
      $.ajax({
      url: '/API/registro/',
      type: 'POST',
      data: {json:jsonDatos},
      success: function(data){
        data = JSON.parse(data);
        if(data.estado == 2){
          notificacion_login("Usuario No Disponible");
        }else{
          notificacion_login("Usuario registrado correctamente");
          setTimeout(function(){  $("#login_form").click();},4000);
        }
      }
     });
    }
  });
});

/**
* Function btn_login
* obtine los datos del formulario y por medio del controlador hace las validaciones
* para poder entrar al sistema
*/
$(function(){
  $("#btn_login").click(function(){
      var form = $("#form_login")[0];
      var username = form.username_login.value;
      var password = form.password_login.value;
      if (username != "" && password !="") {
        jsonDatos = {
          username : username,
          password : password,
        }
        jsonDatos = JSON.stringify(jsonDatos);
        $.ajax({
          url: '/API/login/',
          type: 'POST',
          data: {json:jsonDatos},
          success: function(data){
            data = JSON.parse(data)
              if(data.estado == 1){
                localStorage.setItem("usuarioGE", username);
                window.location = "Simulador";
              }
            }
        });
      } else {
        notificacion_login("Falta completar campo");
      }
  });
});

$(function(){
  $("#btn_img").click(function(){
    document.getElementById("file").click();
  });
});

$(function(){
  $("#file").change(function(){
    var val = $("#file").val();
    var file_type = val.substr(val.lastIndexOf('.')).toLowerCase();
    if (file_type  === '.jpg' || file_type  === '.png') {
      var formData = new FormData($('#form_img')[0]);
      var elemento = document.getElementById("file");
        $.ajax({
          url: 'ajax/subir_img.php',
          type: 'POST',
          processData : false,
          contentType: false,
          data:formData,
          success: function(data){
            if (data == "Ok"){
                readURL(elemento);
            }
          }
        });
    }else{
      $("#file").val("");
    }
  });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        $("#img_apo").css("opacity","0");
        $("#img_apo_men").css("opacity","0");
        reader.onload = function (e) {
            setTimeout(function(){$('#img_apo').attr('src', e.target.result);
            $("#img_apo").css("transition","1s");
            $("#img_apo").css("opacity","1");
          },1000);
          setTimeout(function(){$('#img_apo_men').attr('src', e.target.result);
          $("#img_apo_men").css("transition","1s");
          $("#img_apo_men").css("opacity","1");
        },1000);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function calcular_pronostico(tipo){
  var k = $("#valor_k").val();
  var j = $("#valor_j").val();
  var m = $("#valor_m").val();
  if(k != "" && j != "" && m != ""){
    $.ajax({
      url: 'ajax/calcular_pronostico.php',
      type: 'POST',
      data: {k:k, j:j, m:m, tipo:tipo},
      success: function(data){
        console.log(data);
        if (data == "Datos invalidos")
        {
            
        }
        else
        {
          limpiarTablas();
          var tabla = $.parseJSON(data);
          var rows = Object.keys(tabla).length;

          //Relleno Tabla Promedios
          var periodo = "";
          var frecuencia = "";
          var ps = "";
          var eps = "";
          var pms = "";
          var epms = "";
          var pmd = "";
          var epmd = "";
          var ptmac = "";
          var eptmac = "";
          var pmda = "";
          var epmda = "";
          for(var i = 0; i < (rows - 2); i++)
          {
            periodo = tabla[i][0] + "";
            frecuencia = tabla[i][1];
            ps = parseFloat(tabla[i][2]).toFixed(2);
            eps = parseFloat(tabla[i][3]).toFixed(2);
            pms = parseFloat(tabla[i][4]).toFixed(2);
            epms = parseFloat(tabla[i][5]).toFixed(2);
            pmd = parseFloat(tabla[i][6]).toFixed(2);
            epmd = parseFloat(tabla[i][7]).toFixed(2);
            ptmac = parseFloat(tabla[i][9]).toFixed(2);
            eptmac = parseFloat(tabla[i][10]).toFixed(2);
            pmda = parseFloat(tabla[i][13]).toFixed(2);
            epmda = parseFloat(tabla[i][14]).toFixed(2);
            if((i % 2) == 0)
            {
              agregarFilaP(periodo, frecuencia, ps, eps, pms, epms, pmd, epmd, pmda, epmda, ptmac, eptmac, "uno");
            }
            else
            {
              agregarFilaP(periodo, frecuencia, ps, eps, pms, epms, pmd, epmd, pmda, epmda, ptmac, eptmac, "dos");
            }
          }

          //Relleno tabla SE

          periodo = "";
          frecuencia = "";
          var seps = "";
          var eseps = "";
          var sepms = "";
          var esepms = "";
          var sepmd = "";
          var esepmd = "";
          var septmac = "";
          var eseptmac = "";
          var sepmda = "";
          var esepmda = "";
          for(var i = 0; i < (rows - 2); i++)
          {
            periodo = tabla[i][0] + "";
            frecuencia = tabla[i][1];
            seps = parseFloat(tabla[i][15]).toFixed(2);
            eseps = parseFloat(tabla[i][16]).toFixed(2);
            sepms = parseFloat(tabla[i][17]).toFixed(2);
            esepms = parseFloat(tabla[i][18]).toFixed(2);
            sepmd = parseFloat(tabla[i][19]).toFixed(2);
            esepmd = parseFloat(tabla[i][20]).toFixed(2);
            septmac = parseFloat(tabla[i][21]).toFixed(2);
            eseptmac = parseFloat(tabla[i][22]).toFixed(2);
            sepmda = parseFloat(tabla[i][23]).toFixed(2);
            esepmda = parseFloat(tabla[i][24]).toFixed(2);
            if((i % 2) == 0)
            {
              agregarFilaSE(periodo, frecuencia, seps, eseps, sepms, esepms, sepmd, esepmd, sepmda, esepmda, septmac, eseptmac, "uno");
            }
            else
            {
              agregarFilaSE(periodo, frecuencia, seps, eseps, sepms, esepms, sepmd, esepmd, sepmda, esepmda, septmac, eseptmac, "dos");
            }
          }

          //relleno tabla errores promedios
          var newRow = document.createElement('tr');
          newRow.appendChild(createCell("Medio"));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][3]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][5]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][7]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][14]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][10]).toFixed(2)));
          newRow.className = "resultados_uno";
          document.getElementById("tabla_errores").appendChild(newRow);

          newRow = null;
          newRow = document.createElement('tr');
          newRow.appendChild(createCell("Relativo"));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][3]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][5]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][7]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][14]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][10]).toFixed(2)));
          newRow.className = "resultados_dos";
          document.getElementById("tabla_errores").appendChild(newRow);

          //relleno tabla errores suavizados
          newRow = null;
          newRow = document.createElement('tr');
          newRow.appendChild(createCell("Medio"));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][16]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][18]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][20]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][24]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 2][22]).toFixed(2)));
          newRow.className = "resultados_uno";
          document.getElementById("tabla_errorse").appendChild(newRow);

          newRow = null;
          newRow = document.createElement('tr');
          newRow.appendChild(createCell("Relativo"));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][16]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][18]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][20]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][24]).toFixed(2)));
          newRow.appendChild(createCell(parseFloat(tabla[rows - 1][22]).toFixed(2)));
          newRow.className = "resultados_dos";
          document.getElementById("tabla_errorse").appendChild(newRow);

          //obtenemos el mejor resultado
          var mejorpronostico = tabla[rows-2][3];
          var valorpronostico = tabla[rows-3][2];
          var tag = "PS";
          calculoMejorPronostico(tabla, (rows - 3), 2, 15);
          if(mejorpronostico > tabla[rows-2][5]){
            mejorpronostico = tabla[rows-2][5];
            valorpronostico = tabla[rows-3][4];
            calculoMejorPronostico(tabla, (rows - 3), 4, 17);
            tag = "PMS";
          }
          if(mejorpronostico > tabla[rows-2][7]){
            mejorpronostico = tabla[rows-2][7];
            valorpronostico = tabla[rows-3][6];
            calculoMejorPronostico(tabla, (rows - 3), 6, 19);
            tag = "PMD";
          }
          if(mejorpronostico > tabla[rows-2][10]){
            mejorpronostico = tabla[rows-2][10];
            valorpronostico = tabla[rows-3][9];
            calculoMejorPronostico(tabla, (rows - 3), 9, 23);
            tag = "PMDA";
          }
          if(mejorpronostico > tabla[rows-2][14]){
            mejorpronostico = tabla[rows-2][14];
            valorpronostico = tabla[rows-3][13];
            calculoMejorPronostico(tabla, (rows - 3), 2, 21);
            tag = "PTMAC";
          }

          document.getElementById("valor_mp").value = valorpronostico;
          document.getElementById("valor_mu").value = tag;
          document.getElementById("valor_em").value = parseFloat(mejorpronostico).toFixed(2);
        }
      }
    });
  }else{
    notificacion_login("Completar Campos");
  }
}

function agregarFilaP(periodo, frecuencia, ps, eps, pms, epms, pmd, epmd, pmda, epmda, ptmac, eptmac, clases)
{
  var newRow = document.createElement('tr');
  newRow.appendChild(createCell(periodo));
  newRow.appendChild(createCell(frecuencia));
  newRow.appendChild(createCell(ps));
  newRow.appendChild(createCell(eps));
  newRow.appendChild(createCell(pms));
  newRow.appendChild(createCell(epms));
  newRow.appendChild(createCell(pmd));
  newRow.appendChild(createCell(epmd));
  newRow.appendChild(createCell(pmda));
  newRow.appendChild(createCell(epmda));
  newRow.appendChild(createCell(ptmac));
  newRow.appendChild(createCell(eptmac));
  if(clases == "uno")
  {
    newRow.className = "resultados_uno";
  }
  else
  {
    newRow.className = "resultados_dos";
  }
  document.getElementById("tabla_pronosticos").appendChild(newRow);
}

function agregarFilaSE(periodo, frecuencia, seps, eps, sepms, epms, sepmd, epmd, sepmda, epmda, septmac, eptmac, clases)
{
  var newRow = document.createElement('tr');
  newRow.appendChild(createCell(periodo));
  newRow.appendChild(createCell(frecuencia));
  newRow.appendChild(createCell(seps));
  newRow.appendChild(createCell(eps));
  newRow.appendChild(createCell(sepms));
  newRow.appendChild(createCell(epms));
  newRow.appendChild(createCell(sepmd));
  newRow.appendChild(createCell(epmd));
  newRow.appendChild(createCell(sepmda));
  newRow.appendChild(createCell(epmda));
  newRow.appendChild(createCell(septmac));
  newRow.appendChild(createCell(eptmac));
  if(clases == "uno")
  {
    newRow.className = "resultados_uno";
  }
  else
  {
    newRow.className = "resultados_dos";
  }
  document.getElementById("tabla_se").appendChild(newRow);
}

function createCell(text) 
{
  var td = document.createElement('td');
  if(text) {
    td.innerText = text;
  }
  return td;
}

function limpiarTablas()
{
  var myTable = document.getElementById("tabla_errorse");
  var rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    myTable.deleteRow(x);
  }

  myTable = document.getElementById("tabla_errores");
  rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    myTable.deleteRow(x);
  }

  myTable = document.getElementById("tabla_pronosticos");
  rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    myTable.deleteRow(x);
  }

  myTable = document.getElementById("tabla_se");
  rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    myTable.deleteRow(x);
  }

}

function calculoMejorPronostico(matriz, elementos, posicion, posicionse)
{
  for(var i = 0; i < elementos; i++)
  {
    periodoA[i] = matriz[0][i];
    frecuenciaA[i] = matriz[1][i];
    mejorPronosticoA[i] = matriz[posicion][i];
    seA[i] = matriz[posicionse][i];
  }
}


function logout(){
  localStorage.removeItem("usuarioGE");
  window.location("login");
}