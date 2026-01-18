import express from 'express';
import productsController from '../controller/products.js';
const router = express.Router();

router.get('/', productsController.obtenerProductos);

export default router;
