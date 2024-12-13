import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (jwtToken: string) => {
  try {
    const exp = jwtDecode(jwtToken).exp;
    if (!exp) return true;
    return exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
};
