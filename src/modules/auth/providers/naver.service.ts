import logger from '@/config/logger';
import axios from 'axios';

// 네이버 인증
export async function naverAuth({ code, state }: { code: string; state?: string }) {
  logger.info("[naver.service.ts][naverAuth] Start", { code, state })
  logger.info("[naver.service.ts][naverAuth] Try post naver login api", { code, state })
  const tokenRes = await axios.post(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code` +
      `&client_id=${process.env.NAVER_CLIENT_ID}` +
      `&client_secret=${process.env.NAVER_CLIENT_SECRET}` +
      `&code=${code}&state=${state}`
  );
  const { access_token, refresh_token, expires_in } = tokenRes.data;
  logger.info("[naver.service.ts][naverAuth] Complete post naver login", { code, state, access_token, refresh_token, expires_in })

  logger.info("[naver.service.ts][naverAuth] Try get naver login", { access_token })
  const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  logger.info("[naver.service.ts][naverAuth] Complete get naver login", { access_token, userInfo: userRes.data.response })
  logger.info("[naver.service.ts][naverAuth] Complete ", { userInfo: userRes.data.response })
  return {
    tokens: { access_token, refresh_token, expires_in },
    userInfo: userRes.data.response,
  };
}
