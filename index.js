import {moonPhases, candlesTypes} from "./utils.js"

const ESTILOS = {
    carta: "max-w-sm rounded overflow-hidden shadow-lg m-4",
    imagen: "w-full",
    titulo: "font-bold text-xl subpixel-antialiased my-2 ml-2",
    descripcion: "italic my-2 mx-1"
}

const generarLunas = (ordenar) => {
    // 
    crearBuscador()
    const elementos = moonPhases
    const articles = elementos.map((elem, _i) => {
        // Crear elementos
        let el = document.createElement("article")
        let img = document.createElement("img")
        let p = document.createElement("p")

        // Definir contenido
        img.src = elem.img
        img.alt = elem.title
        p.textContent = elem.title
        el.id = elem.id
        
        // Estilizar
        p.className = ESTILOS.titulo
        img.className = ESTILOS.imagen
        el.className = ESTILOS.carta

        // Agregarlos al article
        el.appendChild(img)
        el.appendChild(p)
        return el
    })
    if (ordenar) {
        return articles.sort((a,b) => a.textContent.localeCompare(b.textContent)) // Devuelve el array en orden alfabetico
    }
    return articles
}

const generarVelas = (ordenar) => {
    crearBuscador()
    const elementos = candlesTypes
    const articles = elementos.map((elem, _i) => {
        // Crear elementos
        let el = document.createElement("article")
        let color = document.createElement("h2")
        let description = document.createElement("p")

        // Definir contenido
        color.textContent = elem.color
        description.textContent = elem.description
        el.id = elem.id

        // Estilizar
        color.className = ESTILOS.titulo
        description.className = ESTILOS.descripcion
        el.className = ESTILOS.carta

        // Agregarlos al article
        el.appendChild(color)
        el.appendChild(description)
        return el
    })
    if (ordenar) {
        return articles.sort((a,b) => a.textContent.localeCompare(b.textContent)) // Devuelve el array en orden alfabetico
    }
    return articles

}

const generarDeseos = () => {
    // Eliminar barra de busqueda
    const barra = document.getElementById("barra-busqueda")
    barra.innerHTML = ""

    // Crear elementos
    const contenedor_input = document.createElement("div") // Va a contener el input y el button para no romper la grilla
    const input = document.createElement("input")
    const btn_enviar = document.createElement("button")

    contenedor_input.id = "agregar-deseo"
    btn_enviar.innerText = "Agregar"

    //Estilizar
    contenedor_input.className = "col-span-4 flex justify-center"
    btn_enviar.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"

    btn_enviar.onclick = () => {
        const mensaje = input.value
        if (!mensaje) return // Si no recibe nada en el input retorna

        // Crear elementos
        const lista_deseos = document.getElementById("contenedor")
        const deseo = document.createElement("article")
        const txt_deseo = document.createElement("p")

        // Estilizar 
        txt_deseo.className = ESTILOS.descripcion
        deseo.className = ESTILOS.carta
        
        txt_deseo.innerText = mensaje
        deseo.appendChild(txt_deseo)
        lista_deseos.appendChild(deseo)
    }

    contenedor_input.appendChild(input)
    contenedor_input.appendChild(btn_enviar)

    const articulos = document.getElementById("contenedor")
    articulos.parentNode.insertBefore(contenedor_input, articulos)

    return []
}

const cargarElementos = (elementos, titulo) => {

    // <titulo> es opcional porque al filtrar elementos no necesitamos cambiarlo, ni cuando carga por primera vez
    if (titulo) {
        // Cambiar el h1
        const h1 = document.getElementsByTagName("h1")[0]
        h1.textContent = titulo
    }

    // Agregarlos al div contenedor
    const contenedor = document.getElementById("contenedor")
    contenedor.className="columns-4"
    contenedor.innerHTML = '' // Para borrar los elementos dentro del div, no sé si es la mejor forma
    contenedor.append(...elementos)
}

const filtrar = (busqueda) => {
    const articulos = document.getElementsByTagName("article")
    let count = 0
    Array.from(articulos).map((articulo) => {
        const actual = articulo.innerText.toLowerCase()
        if (actual.includes(busqueda))
        {
            articulo.style.display = "contents"
            count++
        }
        else {
            articulo.style.display = "none"
        }
    })
    const aviso = document.getElementById("aviso") ?? document.createElement("span")
    aviso.innerText = count == 0 ? "No se ha encontrado nada" : ""
    aviso.id = "aviso"
    const buscador = document.getElementById("buscador")
    buscador.append(aviso)
}

const crearBuscador = () => {
    const input = document.getElementById("agregar-deseo")
    if (input) input.remove() // Si viene de Deseos borra la sección de agregar

    const existe_buscador = document.getElementById("buscador")
    if (existe_buscador) return // Si ya existe una barra de busqueda retorna

    const campo = document.createElement("input")
    const btn_buscar = document.createElement("button")
    const buscador = document.createElement("div")

    campo.placeholder = "Buscar..."
    btn_buscar.innerText = "🔎"
    btn_buscar.className = "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
    buscador.id = "buscador"
    buscador.className = "justify-self-center"

    btn_buscar.onclick = () => {
        const busqueda = campo.value.toLowerCase()
        filtrar(busqueda)
    }
    
    buscador.appendChild(campo)
    buscador.appendChild(btn_buscar)

    const barra = document.getElementById("barra-busqueda")
    barra.appendChild(buscador)
}

class Seccion {
    constructor(nombre, funcion){
    this.nombre = nombre,
    this.funcion = funcion
    }
}
const lunas = new Seccion("Fases lunares", generarLunas)
const velas = new Seccion("Tipos de velas", generarVelas)
const deseos = new Seccion("Deseos", generarDeseos)
const secciones = [lunas, velas, deseos]

const crearTabs = () => {
    const tabs = document.createElement("nav")
    secciones.map((elem) => {
        const btn = document.createElement("button")
        btn.onclick = () => {
            const elementos = elem.funcion()
            cargarElementos(elementos, elem.nombre)
        }
        btn.className = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        btn.innerText = elem.nombre
        tabs.appendChild(btn)
    })
    const main = document.getElementsByTagName("main")[0]
    main.prepend(tabs)
}

crearTabs()

const primeros_elementos = generarLunas(false) // Inicialmente sin ordenar
cargarElementos(primeros_elementos)
