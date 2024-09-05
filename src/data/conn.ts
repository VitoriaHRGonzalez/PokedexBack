/* eslint-disable @typescript-eslint/no-var-requires */

// const mongoose = require('mongoose');

// mongoose
//   .connect('mongodb://localhost:27017/PokedexDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Could not connect to MongoDB', err));

const mongoose = require('mongoose');
const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/PokedexDB'; // Pegue a URL do MongoDB das variáveis de ambiente

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB', err));
