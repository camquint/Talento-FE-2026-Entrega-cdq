
// LISTA DE PRODUCTOS
let productos = [
    {
        id: 1,
        nombre: "Batidor de acero inoxidable",
        precio: 8500
    },
    {
        id: 2,
        nombre: "Espátula de silicona",
        precio: 4300
    },
    {
        id: 3,
        nombre: "Molde desmontable 24 cm",
        precio: 16500
    },
    {
        id: 4,
        nombre: "Balanza digital",
        precio: 10900
    },
    {
        id: 5,
        nombre: "Rodillo de madera",
        precio: 1200
    },
    {
        id: 6,
        nombre: "Fuente para horno",
        precio: 13400
    },
    {
        id: 7,
        nombre: "Set de mangas pasteleras",
        precio: 7600
    },
    {
        id: 8,
        nombre: "Sartén antiadherente",
        precio: 28900
    }
];

let categorias = [
    "cake",
    "chicken",
    "pasta",
    "beef",
    "dessert",
    "vegetarian"
];

let carrito = [];

const CLAVE_CARRITO = "carritoUtensilios";

function guardarCarrito(){
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarrito(){
    let carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if(carritoGuardado){
        carrito = JSON.parse(carritoGuardado);
    }
}

function mostrarProductos(){
    const lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    for(let producto of productos){
        let item = document.createElement("li");
        item.classList.add("productoItem");

        item.innerHTML = `<span class="nombreProducto">${producto.nombre}</span>
        <span class="precioProducto">$${producto.precio}</span>
        <button class="btnAgregar">Agregar</button>`;

        lista.appendChild(item);
        let boton = item.querySelector(".btnAgregar");

        boton.addEventListener("click", function(){
            agregarProducto(producto);
        });
    }
}

function agregarProducto(producto){
    carrito.push(producto);
    actualizarCarrito();
}

function eliminarProducto(indice){
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function vaciarCarrito(){
    carrito = [];
    actualizarCarrito();
}

function actualizarCarrito(){
    let lista = document.getElementById("itemsCarrito");
    let cantidad = document.getElementById("cantidadCarrito");
    let total = document.getElementById("precioTotal");

    lista.innerHTML = "";

    if(carrito.length == 0){
        lista.innerHTML = "<li>El carrito está vacío.</li>";
    }
    else{

        for(let i = 0; i < carrito.length; i++){
            let producto = carrito[i];
            let item = document.createElement("li");
            item.className = "itemCarrito";
            item.innerHTML =
            "<span>" + producto.nombre + "</span>" +
            "<button class='btnEliminar' data-indice='" + i + "'>X</button>";
            lista.appendChild(item);
        }

        let botonesEliminar = document.querySelectorAll(".btnEliminar");

        for(let boton of botonesEliminar){
            boton.addEventListener("click", function(){
                let indice = boton.getAttribute("data-indice");
                eliminarProducto(indice);
            });

        }

    }

    cantidad.textContent = carrito.length;
    total.textContent = "$" + calcularTotal();
    guardarCarrito();
}

function calcularTotal(){
    let total = 0;

    for(let producto of carrito){
        total += producto.precio;
    }
    return total;
}

function comprar(){
    if(carrito.length == 0){
        Swal.fire({
            icon:"info",
            title:"Carrito vacío",
            text:"Agregá algún utensilio antes de comprar."
        });

        return;
    }

    Swal.fire({
        icon:"success",
        title:"¡Gracias por tu compra!",
        text:"Tu pedido fue registrado correctamente."
    });

    carrito = [];
    actualizarCarrito();
}

async function cargarRecetas(){
    try{
        let contenedor = document.getElementById("contenedorRecetasAPI");
        contenedor.innerHTML = "";

        for(let i = 0; i < 3; i++){
            let respuesta = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

            if(!respuesta.ok){
                throw new Error("Error al obtener las recetas.");
            }
            let datos = await respuesta.json();
            let receta = datos.meals[0];
            
            let card = document.createElement("div");
            card.className = "card cardAPI";
            
            let enlace;
            if(receta.strSource){
                enlace = "<a href='" + receta.strSource + "' target='_blank'>Ver receta completa</a>";
            }
            else{
                enlace = "<a href='#recetas'>Ver nuestras recetas</a>";
            }
            
            card.innerHTML =
            "<img src='" + receta.strMealThumb + "' alt='" + receta.strMeal + "'>" +
            "<div class='contenidoCard'>" +
            "<h3>" + receta.strMeal + "</h3>" +
            "<p><strong>Categoría:</strong> " + receta.strCategory + "</p>" +
            "<p><strong>Origen:</strong> " + receta.strArea + "</p>"
            + enlace +
            "</div>";

            contenedor.appendChild(card);
        }
    }
    catch(error){
        console.log(error);
        
        let contenedor = document.getElementById("contenedorRecetasAPI");
        contenedor.innerHTML = "<p>No fue posible cargar las recetas en este momento.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    cargarCarrito();
    mostrarProductos();
    actualizarCarrito();
    cargarRecetas();

    let botonVaciar = document.getElementById("btnVaciar");
    let botonComprar = document.getElementById("btnComprar");
    let botonNuevaReceta = document.getElementById("btnNuevaReceta");

    botonVaciar.addEventListener("click", vaciarCarrito);
    botonComprar.addEventListener("click", comprar);
    botonNuevaReceta.addEventListener("click", cargarRecetas);
});
