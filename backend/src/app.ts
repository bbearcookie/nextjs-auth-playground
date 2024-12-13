import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import AuthController from './auth/auth.controller';

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
    credentials: true,
  })
);

app.use('/auth', AuthController);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
});

app.listen(5010, () => {
  console.log('Server running on port 5010');
});
