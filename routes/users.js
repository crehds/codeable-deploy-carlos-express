import express from 'express';
import usersController from '../controller/users.js';
const router = express.Router();

router.get('/', usersController.obtenerUsers);
router.get('/:id', usersController.obtenerUser);
router.post('/:id/cart', usersController.agregarAlCarrito);
router.put('/:id/cart/:productId', usersController.actualizarCantidadCarrito);
router.delete('/:id/cart/:productId', usersController.eliminarDelCarrito);
router.delete('/:id/cart', usersController.vaciarCarrito);
export default router;
