document.getElementById("carritoIcon").addEventListener("click", () => {
    document.getElementById("modalCarrito").classList.toggle("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modalCarrito").classList.remove("active");
});

window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("modalCarrito")) {
        document.getElementById("modalCarrito").classList.remove("active");
    }
});

document.getElementById("vaciarCarrito").addEventListener("click", () => {
    vaciarCarrito();
});


const Carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosBijou = [
    { id: 1, nombre: "Collar Plata", categoria: "Collares", img: "../img/Collar_Plata_1.jpg", precio: 9000 },
    { id: 2, nombre: "Collar Dorado", categoria: "Collares", img: "../img/Collar_Dorado_2.jpg", precio: 8000 },
    { id: 3, nombre: "Collar Gris", categoria: "Collares", img: "../img/Collar_Gris_3.jpg", precio: 9000 },
    { id: 4, nombre: "Collar Choker", categoria: "Collares", img: "../img/Collar_Choker_4.jpg", precio: 8000 },
    { id: 5, nombre: "Collar Multi", categoria: "Collares", img: "../img/Collar_Multi_5.jpg", precio: 9000 },
    { id: 6, nombre: "Collar Totem", categoria: "Collares", img: "../img/Collar_Totem_6.jpg", precio: 8000 },
    { id: 7, nombre: "Collar Varios", categoria: "Collares", img: "../img/Collar_Varios_7.jpg", precio: 9000 },
    { id: 8, nombre: "Collar Arena", categoria: "Collares", img: "../img/Collar_Arena_8.jpg", precio: 8000 }
];

const productosCarrito = document.getElementById("productosCarrito");
const total = document.getElementById("total");
const carritoIcon = document.getElementById("carritoIcon");

function actualizarCarrito() {
    productosCarrito.innerHTML = "";

    Carrito.forEach(el => {
        productosCarrito.innerHTML += `
            <div class="producto">
                <img src="${el.img}" alt="${el.nombre}" />
                <h3>${el.nombre}</h3>
                <p>Precio: $<span>${el.precio}</span></p>
                <p>Cantidad: ${el.cantidad}</p>
                <button class="botonesEliminar">Eliminar</button>
            </div>
        `;
    });

    total.innerText = "Total: $" + Carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    carritoIcon.querySelector("#carritoCount").innerText = Carrito.reduce((acc, el) => acc + el.cantidad, 0);
    localStorage.setItem("carrito", JSON.stringify(Carrito));

    agregarEventosEliminar();
}


function agregarAlCarrito(idProducto) {
    const producto = productosBijou.find(p => p.id == idProducto);
    let productoEnCarrito = Carrito.find(p => p.id == producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        Carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            img: producto.img,
            precio: producto.precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
}


function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".botonesEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const productoElement = evento.target.closest(".producto");
            const productoNombre = productoElement.querySelector("h3").textContent;
            let productoAEliminar = Carrito.find(el => el.nombre === productoNombre);

            if (productoAEliminar.cantidad === 1) {
                const index = Carrito.indexOf(productoAEliminar);
                Carrito.splice(index, 1);
            } else {
                productoAEliminar.cantidad--;
            }

            actualizarCarrito();
        });
    });
}

function vaciarCarrito() {
    Carrito.length = 0; 
    
    actualizarCarrito();
};

document.querySelectorAll(".productos_link-button").forEach(boton => {
    boton.addEventListener("click", () => {
        const idProducto = boton.closest(".productos_pulsera-collar").getAttribute("data-id");
        agregarAlCarrito(idProducto);
    });
});


actualizarCarrito();
