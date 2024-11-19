import express from 'express';

const router = express.Router();

router.post('/signin', (req, res) => {
  res.json({
    accessToken: '!@#$!@#$!@#$',
  });
});

router.post('/signup', (req, res) => {
  res.send('Sign up');
});

export default router;
