class Vehiculo {
    id;
    modelo;
    anoFabricacion;
    velMax;

    constructor(id, modelo, anoFabricacion, velocidad) {
        this.id = id;
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velocidad;
    }
    toString() {
        return `${this.modelo} ${this.anoFabricacion}, ${this.velMax} k/h`;
    }

    toJson() {
        return JSON.stringify({ id: this.id, modelo: this.modelo, anoFabricacion: this.anoFabricacion, velocidadMax: this.velMax });
    }

}

class Auto extends Vehiculo {
    cantPuertas;
    asientos;

    constructor(id, modelo, anoFabricacion, velocidad, cantPuertas, asientos) {
        super(id, modelo, anoFabricacion, velocidad);
        this.cantPuertas = cantPuertas;
        this.asientos = asientos;
    }

    toString() {
        return `${super.toString()}, cantidad de puertas: ${this.cantPuertas}, asientos: ${this.asientos}`;
    }

    toJson() {
        const json = JSON.parse(super.toJson());
        json.cantPuertas = this.cantPuertas;
        json.asientos = this.asientos;
        return JSON.stringify(json);
    }
}

class Camion extends Vehiculo {
    carga;
    autonomia;

    constructor(id, modelo, anoFabricacion, velocidad, carga, autonomia) {
        super(id, modelo, anoFabricacion, velocidad);
        this.carga = carga;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()}, carga: ${this.carga}, autonomia: ${this.autonomia}`;
    }

    toJson() {
        const json = JSON.parse(super.toJson());
        json.carga = this.carga;
        json.autonomia = this.autonomia;
        return JSON.stringify(json);
    }
}

function obtenerObjetos(callback) {
    var xhttp = new XMLHttpRequest();
    let datosObj = [];
    let error = document.getElementById("error");
    let imagen = document.getElementById("imagenError");
    let tabla = document.getElementById("tabla");

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 200) {
                error.style.display = "none";
                try {
                    let json = JSON.parse(xhttp.responseText);

                    json.forEach(elemento => {
                        if (elemento.cantPuertas != undefined && elemento.asientos != undefined) {
                            let auto = new Auto(elemento.id, elemento.modelo, elemento.anoFabricacion, elemento.velMax, elemento.cantPuertas, elemento.asientos);
                            datosObj.push(auto);
                        } else if (elemento.carga != undefined && elemento.autonomia != undefined) {
                            let camion = new Camion(elemento.id, elemento.modelo, elemento.anoFabricacion, elemento.velMax, elemento.carga, elemento.autonomia);
                            datosObj.push(camion);
                        }
                    });

                    cargarDatos(datosObj);
                    callback(datosObj);
                } catch (e) {
                    console.log("error al cargar el json".e);
                }
            } else if (xhttp.status === 404) {
                console.log("Recurso no encontrado");

                error.style.display = "block";
                tabla.style.display = "none";

                imagen.setAttribute("src", "https://www.web-leb.com/assets/img/notfound.webp");

            } else if (xhttp.status === 0) {

                tabla.style.display = "none";
                error.style.display = "block";
                imagen.setAttribute("src", "https://media.istockphoto.com/id/1399588872/es/vector/icono-de-archivo-de-p%C3%ADxel-da%C3%B1ado-da%C3%B1ar-el-s%C3%ADmbolo-del-documento-firmar-vector-de-datos-roto.jpg?s=612x612&w=0&k=20&c=2qJtLfhVkCNhjuJJX1iMFJqlAzYWRskSn-pgYo18QzE=");
                imagen.setAttribute("height", "200px");

                document.getElementById("tituloError").textContent = "Error de conexión";

            } else {
                console.error("Error en la solicitud:", xhttp.statusText);
            }
        }
    };

    xhttp.open("GET", "https://examenesutn.vercel.app/api/VehiculoAutoCamion", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

var json;
obtenerObjetos(function (datos) {
    json = datos;
});

function crearCelda(texto, tr) {
    let td = document.createElement("td");
    td.textContent = texto;
    tr.appendChild(td);
}

function crearBoton(texto, tr, ReferenciaFuncion, valor) {
    let td = document.createElement("td");

    let boton = document.createElement("button");
    boton.textContent = texto;
    boton.value = valor;
    boton.class = texto;
    boton.addEventListener("click", ReferenciaFuncion);

    td.appendChild(boton);
    tr.appendChild(td);
}

function cargarDatos(datos) {
    document.getElementById("tabla").style.display = "block";
    let tbody = document.getElementById("datos");
    tbody.innerHTML = "";

    datos.forEach((elemento) => {
        let tr = document.createElement("tr");

        crearCelda(elemento.id, tr);
        crearCelda(elemento.modelo, tr);
        crearCelda(elemento.anoFabricacion, tr);
        crearCelda(elemento.velMax, tr);

        if (elemento instanceof Camion) {
            crearCelda("--", tr);
            crearCelda("--", tr);
            crearCelda(elemento.carga, tr);
            crearCelda(elemento.autonomia, tr);
        }

        if (elemento instanceof Auto) {
            crearCelda(elemento.asientos, tr);
            crearCelda(elemento.cantPuertas, tr);
            crearCelda("--", tr);
            crearCelda("--", tr);
        }
        crearBoton("modificar", tr, cargarId, parseInt(elemento.id));
        crearBoton("eliminar", tr, cargarId, parseInt(elemento.id));
        tbody.appendChild(tr);
    });
}

var form = document.getElementById("form");
function mostrarForm() {

    let tabla = document.getElementById("tabla");

    if (form.style.display === "none") {
        form.style.display = "block";
        tabla.style.display = "none";
    } else {
        form.style.display = "none";
        tabla.style.display = "block";
    }
}

function mostrarCampos() {
    let tipoSeleccionado = document.getElementById('tipo').value;

    let input1 = document.getElementById('txtDinamico1');
    let input2 = document.getElementById('txtDinamico2');
    let label1 = document.getElementById("lblDinamico1");
    let label2 = document.getElementById("lblDinamico2");

    input1.style.display = "block";
    input2.style.display = "block";
    label1.style.display = "block";
    label2.style.display = "block";

    if (tipoSeleccionado === 'auto') {
        label1.textContent = 'asientos:';
        label2.textContent = 'cantPuertas:';

    } else if (tipoSeleccionado === 'camion') {
        label1.textContent = 'carga';
        label2.textContent = 'autonomia';
    } else {
        input1.style.display = "none";
        input2.style.display = "none";
        label1.style.display = "none";
        label2.style.display = "none";
    }
}

var btnAgregar = document.getElementById("agregar");
btnAgregar.addEventListener("click", e => {
    document.getElementById("actividad").textContent = "alta";
    mostrarForm();
});

// abm
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let actividad = document.getElementById("actividad").textContent;
    let id = document.getElementById("txtId");
    let modelo = document.getElementById("txtModelo");
    let anoFabricacion = document.getElementById("txtAnoFabricacion");
    let velMax = document.getElementById("txtVelMax");
    let dinamico1 = document.getElementById("txtDinamico1");
    let dinamico2 = document.getElementById("txtDinamico2");
    let tipo = document.getElementById("tipo");

    if (actividad == "alta" && verificar(modelo.value, anoFabricacion.value, velMax.value, dinamico1.value, dinamico2.value)) {
        let data;
        let idObtenida;
        let nuevoObj;

        if (tipo.value == "camion") {
            data = {
                "modelo": modelo.value, "anoFabricacion": anoFabricacion.value, "velMax": velMax.value,
                "carga": dinamico1.value, "autonomia": dinamico2.value
            };

            darAlta(data).then(dataResponse => {
                idObtenida = dataResponse.id;

                nuevoObj = new Camion(idObtenida, modelo.value, anoFabricacion.value, velMax.value, dinamico1.value, dinamico2.value);
                json.push(nuevoObj);
                cargarDatos(json);

            }).catch(error => {
                document.getElementById("spinner").style.display = "none";
                alert(error);
            });

        } else if (tipo.value == "auto") {
            data = {
                "modelo": modelo.value, "anoFabricacion": anoFabricacion.value, "velMax": velMax.value,
                "cantidadPuertas": dinamico2.value, "asientos": dinamico1.value
            };

            darAlta(data).then(dataResponse => {
                idObtenida = dataResponse.id;

                nuevoObj = new Auto(idObtenida, modelo.value, anoFabricacion.value, velMax.value, dinamico1.value, dinamico2.value);
                json.push(nuevoObj);
                cargarDatos(json);
            }).catch(error => {
                document.getElementById("spinner").style.display = "none";
                alert(error);
            });
        }
        mostrarForm();
    }
    if (actividad == "eliminar") {

        document.getElementById("spinner").style.display = "block";
        if (tipo.value == "auto") {
            darBaja({
                id: id.value, modelo: modelo.value, anoFabricacion: anoFabricacion.value, velMax: velMax.value,
                asientos: dinamico1.value, cantidadPuertas: dinamico2.value
            }).then(() => {
                json = json.filter(vehiculo => vehiculo.id != (id.value));
                cargarDatos(json);
            }).finally(() => {
                document.getElementById("spinner").style.display = "none";
            });
        } else {
            darBaja({
                id: id.value, modelo: modelo.value, anoFabricacion: anoFabricacion.value, velMax: velMax.value,
                carga: dinamico1.value, autonomia: dinamico2.value
            }).then(() => {
                json = json.filter(vehiculo => vehiculo.id != (id.value));
                cargarDatos(json);
            }).catch((e) => {
                alert(e);
            }).finally(() => {
                document.getElementById("spinner").style.display = "none";
            });
        }
        mostrarForm();

    }
    if (actividad == "modificar" && verificar(modelo.value, anoFabricacion.value, velMax.value, dinamico1.value, dinamico2.value)) {
        let data;
        if (tipo.value == "camion") {   
            data = {
                "id": id.value, "modelo": modelo.value, "anoFabricacion": anoFabricacion.value, "velMax": velMax.value,
                "carga": dinamico1.value, "autonomia": dinamico2.value
            }
        } else if (tipo.value == "auto") {
            data = {
                "id": id.value, "modelo": modelo.value, "anoFabricacion": anoFabricacion.value, "velMax": velMax.value,
                "cantidadPuertas": dinamico2.value, "asientos": dinamico1.value
            }
        }
        console.log(data);
        let vehiculo = json.find(vehiculo => vehiculo.id == id.value);
        json.map(async (elemento, index) => {

            if (elemento.id === parseInt(vehiculo.id)) {
                modificar(vehiculo).then(() => {
                    json.splice(index, 1);

                    elemento.modelo = modelo.value;
                    elemento.anoFabricacion = anoFabricacion.value;
                    elemento.velMax = velMax.value;
                    elemento.dinamico1 = dinamico1.value;
                    elemento.dinamico2 = dinamico2.value;

                    json.push(elemento);
                    ordenar("id");
                    cargarDatos(json);

                }).catch((e) => {
                    alert(e);
                });
                await mostrarSpiner(3000);
            }
        });
        mostrarForm();
    }
});

function verificar(modelo, anoFabricacion, velMax, dinamico1, dinamico2) {

    let errorModelo = document.getElementById("errorModelo");
    let errorAnoFabricacion = document.getElementById("errorAnoFabricacion");
    let errorVelMax = document.getElementById("errorVelMax");
    let errorDinamico1 = document.getElementById("errorDinamico1");
    let errorDinamico2 = document.getElementById("errorDinamico2");
    let errorTipo = document.getElementById("errorTipo");
    let tipo = document.getElementById("tipo").value;

    let error = false;

    if (tipo == "") {
        errorTipo.style.display = "block";
        errorTipo.textContent = "Este campo no puede estar vacío";
        error = true;

    } else {
        errorTipo.style.display = "none";
    }

    if (modelo.trim() == "") {
        errorModelo.style.display = "block";
        errorModelo.textContent = "Este campo no puede estar vacío";
        error = true;

    } else {
        errorModelo.style.display = "none";
    }

    if (anoFabricacion.trim() == "") {
        errorAnoFabricacion.style.display = "block";
        errorAnoFabricacion.textContent = "Este campo no puede estar vacío";
        error = true;

    } else if (isNaN(parseInt(anoFabricacion))) {
        errorAnoFabricacion.style.display = "block";
        errorAnoFabricacion.textContent = "Este campo no puede estar vacío";
        error = true;

    } else if (parseInt(anoFabricacion) < 1985 || parseInt(anoFabricacion) > 2025) {
        errorAnoFabricacion.style.display = "block";
        errorAnoFabricacion.textContent = "año invalido";
        error = true;
    } else {
        errorAnoFabricacion.style.display = "none";
    }

    if (velMax.trim() == "") {
        errorVelMax.style.display = "block";
        errorVelMax.textContent = "Este campo no puede estar vacío";
        error = true;

    } else if (isNaN(parseInt(velMax))) {
        errorVelMax.style.display = "block";
        errorVelMax.textContent = "Este campo debe ser un número";
        error = true;

    } else if (parseInt(velMax) < 0) {
        errorVelMax.style.display = "block";
        errorVelMax.textContent = "velocidad invalida";
        error = true;

    } else {
        errorVelMax.style.display = "none";
    }

    if (dinamico1.trim() == "") {
        errorDinamico1.style.display = "block";
        errorDinamico1.textContent = "Este campo no puede estar vacío";
        error = true;

    } else if (isNaN(parseInt(dinamico1))) {
        errorDinamico1.style.display = "block";
        errorDinamico1.textContent = "Este campo debe ser numerico";
        error = true;

    } else if (parseInt(dinamico1) <= 0 && tipo == "camion") {
        errorDinamico1.style.display = "block";
        errorDinamico1.textContent = "valor invalido";
        error = true;
    } else if (parseInt(dinamico1) <= 2 && tipo == "auto") {
        errorDinamico1.style.display = "block";
        errorDinamico1.textContent = "valor invalido";
        error = true;

    } else {
        errorDinamico1.style.display = "none";
    }

    if (dinamico2.trim() == "") {
        errorDinamico2.style.display = "block";
        errorDinamico2.textContent = "Este campo no puede estar vacío";
        error = true;
    } else if (isNaN(parseInt(dinamico2))) {
        errorDinamico2.style.display = "block";
        errorDinamico2.textContent = "Este campo debe ser un número";
        error = true;

    } else if (tipo == "auto" && parseInt(dinamico2) < 2) {
        errorDinamico2.style.display = "block";
        errorDinamico2.textContent = "valor invalido";
        error = true;

    } else if (tipo == "camion" && parseInt(dinamico2) <= 0) {
        errorDinamico2.style.display = "block";
        errorDinamico2.textContent = "valor invalido";
        error = true;

    } else {
        errorDinamico2.style.display = "none";
    }

    return !error;
}

function cargarId(evento) {
    let indice = evento.target.value;
    document.getElementById("txtId").value = indice;

    buscarvehiculo(indice, evento);
}

function buscarvehiculo(indice, evento) {
    document.getElementById("actividad").textContent = evento.target.class;
    let vehiculo = json.find(vehiculo => vehiculo.id == indice);

    console.log(indice);
    mostrarDatosvehiculo(vehiculo);
    mostrarForm();
}

function mostrarDatosvehiculo(vehiculoEncontrado) {

    let txtId = document.getElementById("txtId");
    let txtModelo = document.getElementById("txtModelo");
    let txtAnoFabricacion = document.getElementById("txtAnoFabricacion");
    let velMax = document.getElementById("txtVelMax");
    let txtDinamico1 = document.getElementById("txtDinamico1");
    let TxtDinamico2 = document.getElementById("txtDinamico2");
    let labelDinamico1 = document.getElementById("lblDinamico1");
    let labelDinamico2 = document.getElementById("lblDinamico2");
    let tipo = document.getElementById("tipo");

    txtId.value = vehiculoEncontrado.id;
    txtModelo.value = vehiculoEncontrado.modelo;
    txtAnoFabricacion.value = vehiculoEncontrado.anoFabricacion;
    velMax.value = vehiculoEncontrado.velMax;

    if (vehiculoEncontrado instanceof Auto) {
        tipo.value = "auto";
        txtDinamico1.value = vehiculoEncontrado.asientos;
        TxtDinamico2.value = vehiculoEncontrado.cantidadPuertas;
        labelDinamico1.textContent = "asientos";
        labelDinamico2.textContent = "cantidadPuertas";
    }
    if (vehiculoEncontrado instanceof Camion) {
        tipo.value = "camion";
        txtDinamico1.value = vehiculoEncontrado.carga;
        txtDinamico2.value = vehiculoEncontrado.autonomia;
        labelDinamico1.textContent = "carga";
        labelDinamico2.textContent = "autonomia";
    }
    labelDinamico1.style.display = "block";
    labelDinamico2.style.display = "block";
    txtDinamico1.style.display = "block";
    txtDinamico2.style.display = "block";
}

async function mostrarSpiner(duracion) {
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'flex';
    document.body.style.pointerEvents = 'none';

    return new Promise((resolve) => {
        setTimeout(() => {
            spinner.style.display = 'none';
            document.body.style.pointerEvents = 'auto';
            resolve();
        }, duracion);
    });
}

window.onload = async function () {
    await mostrarSpiner(3000);
    obtenerObjetos();
    if (json.length < 0) {
        document.getElementById("tabla").style.display = "none";
    }
};

function darAlta(data) {
    return mostrarSpiner(1000).then(() => {
        return fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => {
            
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("No se pudo realizar la operación");
            }
        });
    });
}

function darBaja(data) {
    return fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    }).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error(`Error: ${response.status} - No se pudo realizar la operación`);
        }
    });
}

async function modificar(data) {
    let response = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        let result = await response.text();
        return result;
    } else {
        let textoError = await response.text();
        throw new Error(textoError);
    }
}

function ordenar(ordenarPor) {
    let jsonOrdenado = json.sort((a, b) => {
        if (a[ordenarPor] > b[ordenarPor]) {
            return 1;
        } else if (a[ordenarPor] < b[ordenarPor]) {
            return -1;
        } else {
            return 0;
        }
    });
    cargarDatos(jsonOrdenado);
}

function cancelar() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtModelo").value = "";
    document.getElementById("txtAnoFabricacion").value = "";
    document.getElementById("txtVelMax").value = "";
    document.getElementById("txtDinamico1").value = "";
    document.getElementById("txtDinamico2").value = "";
    document.getElementById("lblDinamico1").value = "";
    document.getElementById("lblDinamico2").value = "";
    document.getElementById("tipo").value = "";

    document.getElementById("errorModelo").style.display = "none";
    document.getElementById("errorAnoFabricacion").style.display = "none";
    document.getElementById("errorVelMax").style.display = "none";
    document.getElementById("errorDinamico1").style.display = "none";
    document.getElementById("errorDinamico2").style.display = "none";
    document.getElementById("errorTipo").style.display = "none";


    mostrarForm();
}

function recargarPagina() {
    location.reload();
}