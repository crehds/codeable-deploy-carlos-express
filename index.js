import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
// Agregar ruta para usuarios

// app.use('/api', (req, res) => {
//   res.writeHead(200, { 'content-type': 'text/txt' });
//   res.end('Todo va bien');
// });

app.listen(4000, () => {
  console.log('Hola Mundo1');
});
