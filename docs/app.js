const API_URL =
  'https://codeable-deploy-carlos-express-production.up.railway.app';

const productsContainer = document.getElementById('productos-container');
const selectorUsuarioEl = document.getElementById('selector-usuario');
const spanUsuarios = document.getElementById('usuario-nombre');
const carritoCount = document.getElementById('carrito-count');
let usuarioActual = null;
let carritoActual = [];

async function fetchHealth() {
  const response = await fetch(`${API_URL}/api`);
  const message = await response.text();
  return message;
}

async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  const products = await response.json();
  return mostrarProductos(products);
}

async function mostrarProductos(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `<div class="producto-card">
      <h3>${product.nombre}</h3>
      <p class="precio">$${product.precio}</p>
      <span class="categoria">${product.categoria}</span>
      <button class="btn-agregar" onclick="agregarAlCarrito(${product.id}, '${product.nombre}', ${product.precio})">
        Agregar al Carrito
      </button>
    </div>`
    )
    .join('');
}

async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/api/users`);
    const users = await response.json();

    users.forEach((user) => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.nombre;
      selectorUsuarioEl.appendChild(option);
    });

    if (users.length > 0) {
      usuarioActual = users[0];
      selectorUsuarioEl.value = users[0].id;
      carritoActual = usuarioActual.carrito;
      updateCartUI();
    }
    spanUsuarios.hidden = true;
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

selectorUsuarioEl.addEventListener('change', (event) => {
  const userId = event.target.value;
  if (userId) {
    selectUser(userId);
  }
});

async function selectUser(userId) {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`);
    usuarioActual = await response.json();

    carritoActual = usuarioActual.carrito;
    updateCartUI();
    showNotification(`Usuario cambiado`);
    renderCart();
  } catch (error) {
    console.error(error);
  }
}

async function agregarAlCarrito(productId, nombre, precio) {
  if (!usuarioActual) {
    alert('Por favor, selecciona un usuario primero');
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/users/${usuarioActual.id}/cart`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          nombre,
          precio,
          cantidad: 1
        })
      }
    );

    const userUpdated = await response.json();
    carritoActual = userUpdated.carrito;
    console.log(carritoActual);

    updateCartUI();
    showNotification(`Producto ${nombre} agregado correctamente`);
  } catch (error) {
    console.error(error);
    alert('Error al agregar producto al carrito');
  }
}

function showNotification(message) {
  const notify = document.createElement('div');
  notify.className = 'notificacion';
  notify.textContent = message;
  document.body.appendChild(notify);
  setTimeout(() => {
    notify.classList.add('show');
  }, 100);

  setTimeout(() => {
    notify.classList.remove('show');
    setTimeout(notify.remove(), 300);
  }, 2000);
}

function updateCartUI() {
  const totalItems = carritoActual.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );
  carritoCount.textContent = totalItems;
  if (totalItems > 0) {
    seeCartBtn.disabled = false;
  } else {
    seeCartBtn.disabled = true;
  }
}
const seeCartBtn = document.getElementById('ver-carrito');
const cartItems = document.getElementById('carrito-items');
const modalCart = document.getElementById('carrito-modal');
const closeModalBtn = document.querySelector('.close');
const cleanCartBtn = document.querySelector('#vaciar-carrito');
const finishPurchaseBtn = document.getElementById('finalizar-compra');

cleanCartBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/${usuarioActual.id}/cart`,
      {
        method: 'DELETE'
      }
    );

    const userUpdated = await response.json();
    // usuarioActual = userUpdated;
    carritoActual = userUpdated.carrito;
    updateCartUI();
    showNotification(`Carrito vacío`);
    renderCart();
  } catch (error) {
    console.error(error);
  }
});

function openModal() {
  modalCart.style.display = 'block';
  renderCart();
}

function closeModal() {
  modalCart.style.display = 'none';
}

seeCartBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

function renderCart() {
  if (carritoActual.length === 0) {
    cartItems.innerHTML = `<p class="carrito-vacio">El carrito está vacío</p>`;
    finishPurchaseBtn.disabled = true;
    return;
  }

  finishPurchaseBtn.disabled = false;

  cartItems.innerHTML = carritoActual.map(
    (item) => `
    <div class="carrito-item">
      <div class="item-info">
        <h3>${item.nombre}</h3>
        <p class="item-precio">$ ${item.precio}</p>
      </div>
      <div class="item-controles">
        <button 
          class="btn-cantidad" 
          onclick="changeAmount(${item.productId}, ${item.cantidad - 1})"
        >
        -
        </button>
        <span class="">${item.cantidad}</span>
        <button
          class="btn-cantidad" 
          onclick="changeAmount(${item.productId}, ${item.cantidad + 1})"
        >
        +
        </button>
        <span class="item-subtotal">${item.precio * item.cantidad}</span>
        <button 
          class="btn-eliminar" 
          onclick="deleteItem(${item.productId})"
        >
          🗑
        </button>
      </div>
    </div>
  `
  );
}

async function changeAmount(productId, newAmount) {
  if (newAmount <= 0) {
    await deleteItem(productId);
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/users/${usuarioActual.id}/cart/${productId}`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          cantidad: newAmount
        })
      }
    );

    const userUpdated = await response.json();
    carritoActual = userUpdated.carrito;
    console.log(carritoActual);

    updateCartUI();
    showNotification(`Producto actualizado correctamente`);
    renderCart();
  } catch (error) {
    console.error(error);
  }
}

async function deleteItem(productId) {
  try {
    const response = await fetch(
      `${API_URL}/api/users/${usuarioActual.id}/cart/${productId}`,
      {
        method: 'DELETE'
      }
    );

    const userUpdated = await response.json();
    carritoActual = userUpdated.carrito;
    updateCartUI();
    showNotification(`Producto eliminado correctamente`);
    renderCart();
  } catch (error) {}
}

fetchProducts();
fetchUsers();
