import express from 'express';
import { AuthService } from './auth.service';

const AuthController = express.Router();

AuthController.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await AuthService.signin({
      email,
      password,
    });
    res.status(200).json(token);
  } catch (err) {
    if (err instanceof Error) res.status(401).json({ message: err.message });
    else throw err;
  }
});

AuthController.get('/token', async (req, res) => {
  const { refreshToken } = req.query;

  const token = await AuthService.validateAndRefreshToken(
    refreshToken as string
  );

  res.status(200).json(token);
});

export default AuthController;
