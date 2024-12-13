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

  try {
    const token = AuthService.validateAndRefreshToken(refreshToken as string);

    res.status(200).json(token);
    return;
  } catch (err) {
    res.status(401).json({
      message: '리프레쉬 토큰 만료',
      statusCode: 401,
      errorCode: 5555,
    });
    return;
  }
});

AuthController.get('/myinfo', async (req, res) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (typeof accessToken !== 'string') {
    res.status(401).json({ message: '토큰이 없습니다' });
    return;
  }

  try {
    const myInfo = await AuthService.getMyInfo(accessToken);
    res.status(200).json(myInfo);
    return;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === '토큰 만료') {
        res.status(401).json({
          message: '액세스 토큰 만료',
          statusCode: 401,
          errorCode: 4444,
        });
        return;
      }
    }
  }
});

export default AuthController;
