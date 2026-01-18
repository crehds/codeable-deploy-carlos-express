// Base de datos -- Tabla productos
const products = [
  { id: 1, nombre: 'Laptop', precio: 999, categoria: 'Electrónica' },
  { id: 2, nombre: 'Mouse', precio: 25, categoria: 'Electrónica' },
  { id: 3, nombre: 'Teclado', precio: 45, categoria: 'Electrónica' },
  { id: 4, nombre: 'Webcam', precio: 299, categoria: 'Electrónica' },
  { id: 5, nombre: 'Monitor', precio: 79, categoria: 'Electrónica' }
];

const obtenerTodos = () => {
  return products;
};

export default {
  obtenerTodos
};
