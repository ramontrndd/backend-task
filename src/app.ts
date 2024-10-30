import  express  from "express";
import cors from 'cors';
import router from "./routes";

const app = express()

app.use(cors())


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Rota de teste funcionando corretamente!' });
  });
app.use(express.json());
app.use('/api', router)

export default app;