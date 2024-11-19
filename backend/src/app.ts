import express from 'express';
import cors from 'cors';
import authRouter from './router/auth';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && whitelist.indexOf(origin) !== -1) callback(null, true);
      else callback(null, false);
    },
  })
);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5010, () => {
  console.log('Server running on port 5010');
});
