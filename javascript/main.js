// const agregarBolsaProductoBoton = document.querySelectorAll('.productos_link-button');
// agregarBolsaProductoBoton.forEach((addToCartButton) => {
//     addToCartButton.addEventListener('click', addToCartClicked);
// });

// const shoppingCartItemContainer = document.querySelector(
//     '.header__search-button'
// );

// function addToCartClicked(event) {
//     const button = event.target;
//     const item = button.closest('.productos_pulsera-collar');

//     const itemTitle = item.querySelector('.itemTitle').textContent;
//     const itemPrice = item.querySelector('.itemPrice').textContent;
//     const itemImage = item.querySelector('.itemImage') .src;
    
//     addItemToShoppingCart(itemTitle, itemPrice, itemImage);
// }


// Array para almacenar los productos del carrito (inicialmente vacío o cargado desde localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para agregar productos al carrito
function addToCart(id, name, price, imageUrl) {
    const productIndex = cart.findIndex(item => item.id === id);
    
    if (productIndex === -1) {
        // Si el producto no está en el carrito, lo agregamos
        const product = { id, name, price, imageUrl, quantity: 1 };
        cart.push(product);
    } else {
        // Si el producto ya está en el carrito, incrementamos la cantidad
        cart[productIndex].quantity++;
    }
    
    saveCartToLocalStorage();
    updateCartDisplay();
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartList = document.getElementById('cartList');
    const totalPrice = document.getElementById('totalPrice');
    
    // Limpiar la lista de productos en el carrito
    cartList.innerHTML = '';

    // Agregar productos al carrito en la interfaz
    let total = 0;
    cart.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        
        // Crear el contenido del producto
        li.innerHTML = `
            <div class="cart-item-info">
                <img src="${product.imageUrl}" alt="${product.name}" class="cart-item-image">
                <span class="cart-item-name">${product.name}</span>
                <span class="cart-item-price">$${product.price}</span>
                <span class="cart-item-quantity">Cantidad: <span class="quantity">${product.quantity}</span></span>
                <button class="btn btn-primary btn-sm increase-quantity">+</button>
                <button class="btn btn-secondary btn-sm decrease-quantity">-</button>
            </div>
        `;
        
        // Agregar la fila del producto al carrito
        cartList.appendChild(li);

        // Calcular el total
        total += product.price * product.quantity;

        // Añadir eventos a los botones de aumentar y disminuir cantidad
        li.querySelector('.increase-quantity').addEventListener('click', () => changeQuantity(product.id, 1));
        li.querySelector('.decrease-quantity').addEventListener('click', () => changeQuantity(product.id, -1));
    });

    // Actualizar el precio total
    totalPrice.textContent = `Total: $${total}`;
}

// Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(id, change) {
    const productIndex = cart.findIndex(item => item.id === id);
    
    if (productIndex !== -1) {
        // Cambiar la cantidad
        cart[productIndex].quantity += change;
        
        // Si la cantidad es menor que 1, eliminar el producto del carrito
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }

        // Actualizar el localStorage y la interfaz
        saveCartToLocalStorage();
        updateCartDisplay();
    }
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    saveCartToLocalStorage();
    updateCartDisplay();
}

// Función para manejar el clic en los botones de "Agregar al carrito"
function handleAddToCart(event) {
    const button = event.target;
    const product = button.closest('.productos_pulsera-collar'); // Encontramos el contenedor del producto

    const id = product.querySelector('.itemTitle').textContent; // Usamos el nombre del producto como ID (por ejemplo, si el nombre es único)
    const name = product.querySelector('.itemTitle').textContent; 
    const price = parseFloat(product.querySelector('.itemPrice').textContent.replace('$', ''));
    const imageUrl = product.querySelector('.itemImage').src;

    addToCart(id, name, price, imageUrl);
}

// Función para abrir el modal del carrito cuando se hace clic en el icono de la bolsa
function openCartModal() {
    updateCartDisplay(); // Asegurarse de que el carrito está actualizado antes de abrir el modal
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

// Agregar un event listener a los botones de agregar al carrito
const addToCartButtons = document.querySelectorAll('.productos_link-button');
addToCartButtons.forEach(button => {
    button.addEventListener('click', handleAddToCart);
});

// Agregar un event listener para abrir el modal al hacer clic en el ícono de la bolsa de compras
const cartButton = document.querySelector('.header__search-button');
cartButton.addEventListener('click', openCartModal);

// Agregar un event listener para vaciar el carrito
document.getElementById('clearCartButton').addEventListener('click', clearCart);

// Cargar el carrito al cargar la página si hay productos en el localStorage
document.addEventListener('DOMContentLoaded', updateCartDisplay);
