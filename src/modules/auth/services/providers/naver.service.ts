import axios from 'axios';

export async function naverAuth({ code, state }: { code: string; state?: string }) {
  const tokenRes = await axios.post(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code` +
      `&client_id=${process.env.NAVER_CLIENT_ID}` +
      `&client_secret=${process.env.NAVER_CLIENT_SECRET}` +
      `&code=${code}&state=${state}`
  );
  const { access_token, refresh_token, expires_in } = tokenRes.data;

  const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return {
    tokens: { access_token, refresh_token, expires_in },
    userInfo: userRes.data.response,
  };
}
