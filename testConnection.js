import mongoose from 'mongoose';

const uri =
  'mongodb+srv://vitoriagonzalez:OgwNE2emoWL4aG82@cluster0.qfg5s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
async function testConnection() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão com MongoDB Atlas estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar com MongoDB Atlas:', error);
  } finally {
    mongoose.connection.close();
  }
}

testConnection();
