import productModel from '../model/product.js';

const obtenerProductos = (req, res) => {
  const products = productModel.obtenerTodos();
  res.json(products);
};

export default { obtenerProductos };
