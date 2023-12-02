import { getAccessToken } from '@/actions/auth';

const requireAccessToken = (handler) => async (req, res) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return res.redirect('/masterkey');
  }

  return handler(req, res);
};

export default requireAccessToken;