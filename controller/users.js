import userModel from '../model/user.js';

const obtenerUsers = async (req, res) => {
  const users = await userModel.obtenerUsers();
  res.json(users);
};

const obtenerUser = async (req, res) => {
  const userId = req.params.id;
  const userSelected = await userModel.obtenerUser(userId);
  res.json(userSelected);
};

const agregarAlCarrito = async (req, res) => {
  const userId = req.params.id;
  const body = req.body;

  const userUpdated = await userModel.agregarAlCarrito(userId, body);
  res.json(userUpdated);
};

const actualizarCantidadCarrito = async (req, res) => {
  const { id: userId, productId } = req.params;
  const { cantidad } = req.body;
  const userUpdated = await userModel.actualizarCarrito(
    userId,
    productId,
    cantidad
  );

  res.json(userUpdated);
};

const eliminarDelCarrito = (req, res) => {
  const { id: userId, productId } = req.params;
  const userUpdated = userModel.eliminarDelCarrito(userId, productId);
  res.json(userUpdated);
};

const vaciarCarrito = async (req, res) => {
  const { id: userId } = req.params;
  const userUpdated = await userModel.vaciarCarrito(userId);
  res.json(userUpdated);
};

export default {
  obtenerUsers,
  obtenerUser,
  agregarAlCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  vaciarCarrito
};
