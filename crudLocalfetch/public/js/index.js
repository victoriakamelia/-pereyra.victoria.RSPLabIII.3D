import Anuncio_Auto from "./Anuncio_Auto.js";
import crearTabla from "./gestionTablas.js";

let listaEntidades = [];
const divTabla = fnGet("divTabla");
const Divcustom = fnGet("custom");
const txtFiltro = fnGet("txtFiltro");
const botonTodos = fnGet("btnTodos");
const botonAlquiler = fnGet("btnAlquiler");
const botonVenta = fnGet("btnVenta");

export const btnLimpiarTabla = fnGet("btnLimpiarTabla");
export const btnBaja = fnGet("btnBaja");
export const btnModificar = fnGet("btnModificar");
export const btnCancelar = fnGet("btnCancelar");
export const btnGuardar = fnGet("btnGuardar");
const form = document.forms[0];

export const $allInputs = document.querySelectorAll('.cbox');




window.addEventListener('load', inicializarManejadores);

window.addEventListener("load", function () {
    document.getElementById("filtroTransaccion").addEventListener("change", filtrarTransaccion);
    $allInputs.forEach(el => { mapearTabla(el); });


});


function filtrarTransaccion() {

    var tipoAuto = document.getElementById("filtroTransaccion").value;

    if (tipoAuto == "Alquiler") {

        var filtrados = listaEntidades.filter(item => item.transaccion == "Alquiler");
        let hora = Date.now();
        calcularPromedio(filtrados);
        actualizarLista(filtrados, " Filtrado Alquiler " + hora);
    } else {

        var filtrados = listaEntidades.filter(item => item.transaccion == "Venta");
        let hora = Date.now();
        calcularPromedio(filtrados);
        actualizarLista(filtrados, " Filtrado Venta " + hora);
    }

}

function calcularPromedio(lista) {
    let promedioPrecio = lista.map(l => l.precio);
    let promedioPotencia = lista.map(l => l.potencia);
    let acumuladorPrecio = 0;
    let acumuladorPotencia = 0;

    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;

    const resultMin = lista.filter(auto => {
        tmp = auto.potencia;
        if (tmp < lowest) lowest = tmp;
    }); 

    const resultMax = lista.filter(auto => {
        tmp = auto.potencia;
        if (tmp > highest) highest = tmp;
    }); 
      
      

    promedioPrecio.forEach(p => {
        acumuladorPrecio += parseInt(p, 10);
    });

    promedioPotencia.forEach(p => {
        acumuladorPotencia += parseInt(p, 10);
    });

    document.getElementById("txtFiltroPrecios").value = acumuladorPrecio / promedioPrecio.length;
    document.getElementById("txtFiltroPotencia").value = acumuladorPotencia / promedioPotencia.length;

    document.getElementById("txtFiltroPotenciaMax").value = resultMax;
    document.getElementById("txtFiltroPotenciaMin").value =resultMin;


}




function inicializarManejadores() {

    obtenerEntidades();

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        if (confirm("Este anuncio será dado de alta, ¿Desea Continuar?")) {
            AltaEntidad();
        }

    });

    botonTodos.addEventListener('click', (e) => {
        obtenerEntidades();
        filtroTodos(listaEntidades);
    })

    botonAlquiler.addEventListener('click', (e) => {
        obtenerEntidades();
        filtroAlquiler(listaEntidades);
    })

    botonVenta.addEventListener('click', (e) => {
        obtenerEntidades();
        filtroVenta(listaEntidades);
    })

}

btnLimpiarTabla.addEventListener('click', function (e) {

    btnBaja.classList.add('deshabilitar');
    btnModificar.classList.add('deshabilitar');
    btnGuardar.classList.remove('deshabilitar');
    obtenerEntidades();

});

btnModificar.addEventListener('click', (e) => {
    e.preventDefault();
    let camposCompletos = document.forms[0].checkValidity();
    if (camposCompletos) {
        if (confirm("Este anuncio será modificado, ¿Desea Continuar?")) {
            modificarEntidad();

        }
    } else {
        alert("Debe completar todos los campos");
    }

});

btnBaja.addEventListener('click', (e) => {
    if (confirm("Este anuncio será dado de baja, ¿Desea Continuar?")) {
        bajaEntidad();

    }
});

btnCancelar.addEventListener('click', (e) => {

    window.location.reload();
    limpiarCampos();

});

function modificarEntidad() {

    let idAnuncio = parseInt(fnGet("txtId").value);
    let listaFiltrada = listaEntidades.filter(l => l.id == idAnuncio);

    listaFiltrada[0].titulo = fnGet('txtTitulo').value;
    listaFiltrada[0].descripcion = fnGet('txtDescripcion').value;
    listaFiltrada[0].precio = parseInt(fnGet('numbPrecio').value);
    if (fnGet('rdoV').checked) {
        listaFiltrada[0].transaccion = "Venta";
    } else {
        listaFiltrada[0].transaccion = "Alquiler";
    }
    listaFiltrada[0].puertas = fnGet('numbPuertas').value;
    listaFiltrada[0].KMS = fnGet('numbKMs').value;
    listaFiltrada[0].potencia = fnGet('numbPotencia').value;
    listaFiltrada[0].frenos = checkboxTildado(fnGet('frenos_ok').checked);
    listaFiltrada[0].luces = checkboxTildado(fnGet('luces_ok').checked);
    listaFiltrada[0].aceite = checkboxTildado(fnGet('aceite_ok').checked);
    if (fnGet('rdoU').checked) {
        listaFiltrada[0].estado = "Usado";
    } else {
        listaFiltrada[0].estado = "Nuevo";
    }

    const options = {
        method: 'PUT',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(listaFiltrada[0])
    }


    fetch('http://localhost:3000/entidades/' + idAnuncio, options)
        .then(res => {
            if (!res.ok) return Promise.reject(res);
            return res.json();
        })
        .then(data => {

            let hora = Date.now();

            actualizarLista(listaEntidades, " modi funcionando " + hora);

        })
        .catch(err => {
            console.log(err.status)
        });

}

function bajaEntidad() {
    let idAnuncio = parseInt(fnGet("txtId").value);
    for (let i = 0; i < listaEntidades.length; i++) {
        if (listaEntidades[i].id === idAnuncio) {
            listaEntidades.splice(i, 1);
            break;
        }
    }

    let listaFiltrada = listaEntidades.filter(l => l.id == idAnuncio);


    const options = {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(listaFiltrada[0])
    }


    fetch('http://localhost:3000/entidades/' + idAnuncio, options)
        .then(res => {
            if (!res.ok) return Promise.reject(res);
            return res.json();
        })
        .then(data => {

            let hora = Date.now();

            actualizarLista(listaEntidades, " BAJA funcionando " + hora);

        })
        .catch(err => {
            console.log(err.status)
        });


}

function AltaEntidad() {

    var txtTitulo = fnGet('txtTitulo').value;
    var txtTranVenta = fnGet('rdoV').checked;
    var transaccion = "Venta";
    if (txtTranVenta === false) {
        transaccion = "Alquiler";
    }
    var kilometros = fnGet('numbKMs').value;
    var txtDescripcion = fnGet('txtDescripcion').value;
    var txtPrecio = fnGet('numbPrecio').value;
    var txtPuertas = fnGet('numbPuertas').value;
    var txtPotencia = fnGet('numbPotencia').value;
    var frenos_ok = checkboxTildado(fnGet('frenos_ok').checked);

    var luces_ok = checkboxTildado(fnGet('luces_ok').checked);
    var aceite_ok = checkboxTildado(fnGet('aceite_ok').checked);

    var estado = fnGet('rdoU').checked;
    var tipoEstado = "Usado";
    if (estado === false) {
        transaccion = "Nuevo";
    }

    let nuevaEntidad = new Anuncio_Auto(0, txtTitulo, transaccion, txtDescripcion, txtPrecio, txtPuertas, kilometros, txtPotencia, frenos_ok, luces_ok, aceite_ok, tipoEstado);

    let config =
    {
        method: "POST",
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(nuevaEntidad)
    }

    console.log(JSON.stringify(nuevaEntidad));
    fetch('http://localhost:3000/entidades', config)
        .then(res => {
            if (!res.ok) return Promise.reject(res);

            return res.json();
        })
        .then(data => {

            let hora = Date.now();

            listaEntidades = data;
            actualizarLista(listaEntidades, "Ultima actualización " + hora);

        })
        .catch(err => {
            console.log(err.status)
        });

}

function fnGet(id) {
    return document.getElementById(id);
}

function actualizarLista(data, msg) {
    if (divTabla) {
        if (localStorage.length !== 0) {
            divTabla.textContent = "";
        }
    }
    if (Divcustom) {
        Divcustom.innerHTML = "";
        let msgEnviar = document.createElement('p');

        msgEnviar.textContent = msg;
        Divcustom.appendChild(msgEnviar);
    }
    divTabla.innerHTML = "";
    let table = crearTabla(data);
    divTabla.appendChild(Spinner());

    setTimeout(() => {
        divTabla.innerHTML = "";
        divTabla.appendChild(table);

    }, 3000);

}

function limpiarCampos() {
    fnGet('txtTitulo').value = '';
    fnGet('txtDescripcion').value = '';
    fnGet('numbPrecio').value = '';
    fnGet('rdoV').checked = true;
    fnGet('rdoA').checked = false;
    fnGet('numbPuertas').value = '';
    fnGet('numbKMs').value = '';
    fnGet('numbPotencia').value = '';
    fnGet('frenos_ok').checked = false;
    fnGet('luces_ok').checked = false;
    fnGet('aceite_ok').checked = false;
    fnGet('rdoU').checked = true;
    fnGet('rdoN').checked = false;

}

function Spinner() {
    var spinner = document.createElement('img');
    spinner.setAttribute('src', './images/AUTO.gif');
    spinner.setAttribute('alt', 'spinner');
    spinner.width = 200;
    return spinner;
}

function obtenerEntidades() {

    listaEntidades = [];
    fetch('http://localhost:3000/entidades')
        .then(res => {
            if (!res.ok) return Promise.reject(res);
            return res.json();
        })
        .then(data => {

            let hora = Date.now();
            listaEntidades = data;
            actualizarLista(data, "Ultima actualización " + hora);


        })
        .catch(err => {
            console.log(err.status)
        });

}

function checkboxTildado(checkBox) {
    if (checkBox === true) {
        return "SI";
    } else {
        return "NO";
    }
}



function filtroTodos(listaEntidades) {

    const precios = listaEntidades.map(x => x.precio);
    const cantidadPrecios = precios.length;
    const totalPrecios = precios.reduce((acu, ele) => acu + ele, 0);
    const resultado = totalPrecios / cantidadPrecios;
    txtFiltro.value = resultado;

}

function filtroAlquiler(listaEntidades) {

    const alquiler = listaEntidades.filter(x => x.transaccion === 'Alquiler');
    const precios = alquiler.map(x => x.precio);
    const cantidadPrecios = precios.length;
    const totalPrecios = precios.reduce((acu, ele) => acu + ele, 0);
    const resultado = parseInt(totalPrecios) / parseInt(cantidadPrecios);
    txtFiltro.value = parseInt(resultado);

}

function filtroVenta(listaEntidades) {


    const venta = listaEntidades.filter(x => x.transaccion === 'Venta');
    const precios = venta.map(x => x.precio);
    const cantidadPrecios = precios.length;
    const totalPrecios = precios.reduce((acc, el) => acc + el, 0);
    const resultado = parseInt(totalPrecios) / parseInt(cantidadPrecios);
    txtFiltro.value = parseInt(resultado);

}


