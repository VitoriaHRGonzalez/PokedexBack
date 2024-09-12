import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://vitoriagonzalez:OgwNE2emoWL4aG82@cluster0.qfg5s.mongodb.net/Pokedex?retryWrites=true&w=majority&appName=Cluster0'; // Substitua pelo URI de conexão do MongoDB Atlas

async function testQuery() {
  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Conexão com MongoDB Atlas estabelecida com sucesso!');

    const database = client.db('Pokedex');
    const collection = database.collection('pokedextrainers');
    const pokemons = await collection.find({}).toArray();
    console.log('Pokémons encontrados:');
    console.log(pokemons);

    if (pokemons.length === 0) {
      console.log('Nenhum Pokémon encontrado na coleção.');
    }
  } catch (error) {
    console.error('Erro ao conectar ou consultar o MongoDB Atlas:', error);
  } finally {
    await client.close();
  }
}

testQuery();
