document.addEventListener("DOMContentLoaded", function() {
  let carrito = [];

  const carritoIcon = document.getElementById('carritoIcon');
  const carritoCount = document.getElementById('carritoCount');
  const modalContainer = document.getElementById('modalContainer');
  const tarjetaContainer = document.getElementById('tarjeta');
  console.log(modalCloseButton);
  let filter = '';

 
  if (document.location.pathname.includes('collares.html')) {
    filter = 'collar';
  } else if (document.location.pathname.includes('pulseras.html')) {
    filter = 'pulsera';
  }


  fetch('../data.json')
    .then(response => response.json())
    .then(productos => {
      const productosFiltrados = productos.filter(producto => producto.categoria === filter);

    
      productosFiltrados.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
          <img src="${producto.img}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;
        tarjetaContainer.appendChild(productoDiv);
      });

   
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
          const productoId = e.target.getAttribute('data-id');
          agregarAlCarrito(productoId, productos);
        }
      });
    });

  
  const agregarAlCarrito = (productoId, productos) => {
    const producto = productos.find(p => p.id == productoId);
    const productoEnCarrito = carrito.find(p => p.id == productoId);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
      Swal.fire({
        title: '¡Cantidad actualizada!',
        text: `La cantidad de "${producto.nombre}" se ha incrementado.`,
        icon: 'info',
        position: 'bottom-end',
        timer: 2000,
        customClass: {
          popup: 'swal-popup',
        },
        confirmButtonText: 'Aceptar'
      });
    } else {
      carrito.push({ ...producto, cantidad: 1 });
      Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: 'El producto ha sido añadido a tu carrito.',
        position: 'bottom-end',
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'swal-popup',
        }
      });
    }

    actualizarCarrito();
    mostrarModal();
  }

 
  const actualizarCarrito = () => {
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    carritoCount.textContent = cantidadTotal; 
  }

  const modalCloseButton = document.querySelector('.modal-close');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });
  }
  
  
  const mostrarModal = () => {
    modalContainer.style.display = 'flex';
    const modalContent = document.querySelector('.modal-content');
    
    let totalCompra = 0;
    modalContent.innerHTML = `
      <h2>Tu Carrito</h2>
      <div id="carritoItems">
        ${carrito.map(producto => {
          totalCompra += producto.precio * producto.cantidad;
          return `
            <div class="carrito-item">
              <img src="${producto.img}" alt="${producto.nombre}">
              <div class="item-info">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio} x ${producto.cantidad}</p>
              </div>
              <button class="btn-restar" data-id="${producto.id}">-</button>
              <button class="btn-agregar" data-id="${producto.id}">+</button>
              <button class="btn-quitar" data-id="${producto.id}">Quitar</button>
            </div>
          `;
        }).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn-vaciar">Vaciar carrito</button>
        <h3>Total: $${totalCompra}</h3>
      </div>
    `;

    document.querySelectorAll('.btn-restar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productoId = e.target.getAttribute('data-id');
        restarCantidad(productoId);
      });
    });

    document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productoId = e.target.getAttribute('data-id');
        agregarCantidad(productoId);
      });
    });

    document.querySelectorAll('.btn-quitar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productoId = e.target.getAttribute('data-id');
        quitarProducto(productoId);
      });
    });

    document.querySelector('.btn-vaciar').addEventListener('click', vaciarCarrito);
    modalCloseButton.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });
  }


  const restarCantidad = (productoId) => {
    const producto = carrito.find(p => p.id == productoId);
    if (producto.cantidad > 1) {
      producto.cantidad--;
      Swal.fire({
        title: '¡Cantidad reducida!',
        text: `La cantidad de "${producto.nombre}" ha sido reducida.`,
        icon: 'info',
        position: 'bottom-end',
        timer: 2000,
        customClass: {
          popup: 'swal-popup',
        },
        confirmButtonText: 'Aceptar'
      });
    } else {
      quitarProducto(productoId);
      Swal.fire({
        title: 'Producto eliminado',
        text: `"${producto.nombre}" ha sido eliminado del carrito.`,
        icon: 'warning',
        position: 'bottom-end',
        timer: 2000,
        customClass: {
          popup: 'swal-popup',
        },
        confirmButtonText: 'Aceptar'
      });
    }
    actualizarCarrito();
    mostrarModal();
  }

  const agregarCantidad = (productoId) =>{
    const producto = carrito.find(p => p.id == productoId);
    producto.cantidad++;
    Swal.fire({
      title: 'Cantidad incrementada',
      text: `La cantidad de "${producto.nombre}" ha sido incrementada.`,
      icon: 'success',
      position: 'bottom-end',
      timer: 2000,
      customClass: {
        popup: 'swal-popup',
      },
      confirmButtonText: 'Aceptar'
    });
    actualizarCarrito();
    mostrarModal();
  }

  const quitarProducto = (productoId) => {
    carrito = carrito.filter(p => p.id != productoId);
    Swal.fire({
      title: 'Producto eliminado',
      text: `"${producto.nombre}" ha sido eliminado del carrito.`,
      icon: 'error',
      position: 'bottom-end',
      timer: 2000,
      customClass: {
        popup: 'swal-popup',
      },
      confirmButtonText: 'Aceptar'
    });
    actualizarCarrito();
    mostrarModal();
  }

  const vaciarCarrito = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres vaciar el carrito?",
      icon: 'warning',
      position: 'bottom-end',
      timer: 2000,
      customClass: {
        popup: 'swal-popup',
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        actualizarCarrito();
        mostrarModal();
        Swal.fire({
          title: 'Carrito vacío',
          text: 'El carrito ha sido vaciado.',
          icon: 'success',
          position: 'bottom-end',
          timer: 2000,
          customClass: {
            popup: 'swal-popup',
          },
          confirmButtonText: 'Aceptar',
        });
      }
    });
  };

  
  carritoIcon.addEventListener('click', () => {
    mostrarModal();
  });

  actualizarCarrito();
});
