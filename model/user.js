import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const usersPath = path.join(__dirname, '../db/users.json');

const leerUsuarios = async () => {
  try {
    const data = await fs.readFile(usersPath, { encoding: 'utf8' });
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const guardarUsuarios = async (data) => {
  try {
    await fs.writeFile(usersPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(error);
  }
};

const obtenerUsers = async () => {
  return await leerUsuarios();
};

const obtenerUser = async (userId) => {
  const users = await leerUsuarios();
  return users.find((user) => user.id === parseInt(userId));
};

const agregarAlCarrito = async (userId, body) => {
  const users = await leerUsuarios();
  const user = users.find((user) => user.id === parseInt(userId));

  const itemExistente = user.carrito.find(
    (item) => item.productId === parseInt(body.productId)
  );

  if (itemExistente) {
    itemExistente.cantidad += body.cantidad || 1;
  } else {
    user.carrito.push({
      productId: body.productId,
      nombre: body.nombre,
      precio: body.precio,
      cantidad: body.cantidad || 1
    });
  }

  await guardarUsuarios(users);
  return user;
};

const actualizarCarrito = async (userId, productId, cantidad) => {
  const users = await leerUsuarios();
  const user = users.find((user) => user.id === parseInt(userId));

  if (cantidad <= 0) {
    user.carrito = user.carrito.filter(
      (item) => item.productId !== parseInt(productId)
    );
  } else {
    const item = user.carrito.find(
      (item) => item.productId === parseInt(productId)
    );
    item.cantidad = cantidad;
  }

  await guardarUsuarios(users);
  return user;
};

const eliminarDelCarrito = (userId, productId) => {
  const user = users.find((user) => user.id === parseInt(userId));

  user.carrito = user.carrito.filter(
    (item) => item.productId !== parseInt(productId)
  );

  return user;
};

const vaciarCarrito = async (userId) => {
  const users = await leerUsuarios();
  const user = users.find((user) => user.id === parseInt(userId));
  user.carrito = [];
  await guardarUsuarios(users);
  return user;
};

export default {
  obtenerUsers,
  obtenerUser,
  agregarAlCarrito,
  actualizarCarrito,
  eliminarDelCarrito,
  vaciarCarrito
};
