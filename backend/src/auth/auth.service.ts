import jwt from 'jsonwebtoken';

type AuthTokenPayload = {
  email: string;
};

const JWT_SECRET = 'MY_JWT_SECRET';

export class AuthService {
  static async signin(signinDTO: { email: string; password: string }) {
    if (signinDTO.email !== 'bear@naver.com' || signinDTO.password !== '1234')
      throw new Error('계정 인증 실패');

    const authToken = await this.generateAuthToken({
      email: signinDTO.email,
    });

    return authToken;
  }

  static async validateAndRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload &
        AuthTokenPayload;

      const authToken = await this.generateAuthToken({
        email: decoded.email,
      });

      return authToken;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new Error('토큰 만료');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new Error('토큰 변조');
      } else if (err instanceof jwt.NotBeforeError) {
        throw new Error('토큰 활성화 시간 이전');
      } else if (err instanceof Error) {
        throw new Error('알 수 없는 에러');
      }
    }
  }

  static async generateAuthToken(payload: AuthTokenPayload) {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
