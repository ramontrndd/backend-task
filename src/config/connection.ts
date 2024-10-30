import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

console.log('Tentando conectar ao banco de dados com a seguinte configuração:');

const connection = mysql.createConnection(dbConfig);

connection.connect((err: any) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conexão com MySQL estabelecida com sucesso');
});

export default connection;