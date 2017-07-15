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
      $.ajax({
      url: 'ajax/usuarios.php',
      type: 'POST',
      data: datos = {
        username:form.username_registro.value, email:form.email_registro.value,
        password:form.password_registro.value, tipo:"registro"
      },
      success: function(data){
        if(data == "error"){
          notificacion_login("Usuario No Disponible");
        } else if( data == "Passwords no coinciden") {
          notificacion_login("Password Distintas");
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
        $.ajax({
          url: 'ajax/usuarios.php',
          type: 'POST',
          data: {username:username, password:password, tipo:"login"},
          success: function(data){
              if (data == "Existe") {
                  window.location = "index.php";
              }else{
                notificacion_login("usuario o contraseña incorrecta");
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
