import { btnBaja, btnGuardar, btnModificar } from "./index.js";





function crearTabla(lista) {
    const tabla = document.createElement('table');
    tabla.appendChild(crearCabecera(lista[0]));
    tabla.appendChild(crearCuerpo(lista));
    return tabla;
}

function crearCabecera(item) {
    const tHead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (const key in item) {
        const th = document.createElement('th');
        const texto = document.createTextNode(key);
        th.appendChild(texto);
        tHead.appendChild(th);
    }
    return tHead;
}

function crearCuerpo(lista) {
    const tBody = document.createElement('tbody');

    lista.forEach(element => {
        const tr = document.createElement('tr');

        for (const key in element) {

           const td = document.createElement('td');
            const texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
            agregarManejadorTR(tr, lista , element['id']);
        }
        if (element.hasOwnProperty('id')) {
            tr.dataset.id = element['id'];

        }
        

        tBody.appendChild(tr);
        console.log(tr);



    });

    return tBody;
}

function agregarManejadorTR(tr, lista, idAnuncio) {
    

    if (tr) {

        tr.addEventListener('click', (e) => {
            e.preventDefault();
            idAnuncio = parseInt(idAnuncio);
            cargarDatosForm(lista, idAnuncio);

        });
    }
}


function cargarDatosForm(lista, id) {

    for (const entidad of lista) {

        if (entidad.id === id) {
            document.getElementById('txtId').value = entidad.id;
            document.getElementById('txtTitulo').value = entidad.titulo;
            document.getElementById('txtDescripcion').value = entidad.descripcion;
            document.getElementById('numbPrecio').value = entidad.precio;
            if (entidad.transaccion === "alquiler") {
                document.getElementById('rdoA').checked = true;
            } else {
                document.getElementById('rdoV').checked = true;
            }
            document.getElementById('numbPuertas').value = entidad.puertas;
            document.getElementById('numbKMs').value = entidad.KMS;
            document.getElementById('numbPotencia').value = entidad.potencia;

            document.getElementById('frenos_ok').checked =cbTildado(entidad.frenos);
            document.getElementById('luces_ok').checked = cbTildado(entidad.luces);
            document.getElementById('aceite_ok').checked = cbTildado(entidad.aceite);
            btnBaja.classList.remove('deshabilitar');
            btnModificar.classList.remove('deshabilitar');
            btnGuardar.classList.add('deshabilitar');
            if (entidad.estado === "Usado") {
                document.getElementById('rdoU').checked = true;
            } else {
                document.getElementById('rdoN').checked = true;
            }
            break;
        }
    }
};

function cbTildado(bool)
{
    if (bool === "SI")
    {
        return true;
    }else
    {
        return false;
    }
}

export default crearTabla;
