import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';

export const setAccessToken = (token) => {
  // Set the access token as a secure, HTTP-only cookie
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 7, // Token expiration (adjust as needed)
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Enforce same-site cookie attribute
    httpOnly: true, // Ensure the cookie is only accessible via HTTP(S)
  });
};

export const getAccessToken = () => {
  // Retrieve the access token from the secure cookie
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = () => {
  // Clear the access token by removing the secure cookie
  Cookies.remove(ACCESS_TOKEN_KEY, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
  });
};