import express from 'express'
import cors from 'cors'
import router from './routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Rota de teste funcionando corretamente!' })
})

app.use('/api', router)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.status || 500).json({
      message: err.message || 'Ocorreu um erro inesperado.'
    })
  }
)

export default app
