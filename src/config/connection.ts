import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig = {
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const connection = mysql.createConnection(dbConfig)

const port = process.env.DB_PORT

connection.connect((err: any) => {
  if (!err) {
    console.log(`Conexão com MySQL estabelecida com sucesso na porta ${port}`)
    return
  }
  console.log(err)
})

export default connection
