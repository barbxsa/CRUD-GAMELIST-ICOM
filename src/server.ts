import express from 'express';
import cors from 'cors';
import jogoRoutes from './routes/jogoRoutes';
import logsRoutes from './routes/logsRoutes';
import { criarTabelas } from './db';

const app = express();

app.use(cors());
app.use(express.json());
app.use(jogoRoutes);
app.use('/api/logs',logsRoutes); 

criarTabelas().then(() => {
  app.listen(3000, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
  });
});
