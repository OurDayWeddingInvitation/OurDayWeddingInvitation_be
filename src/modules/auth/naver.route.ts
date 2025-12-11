import { Router } from 'express';

const router = Router();

/**
 * [1] 테스트용 네이버 로그인 시작 URL
 * 예: http://localhost:8000/api/v1/auth/naver/login
 */
router.get('/login', (req, res) => {
  const state = crypto.randomUUID();
  const redirectUri = encodeURIComponent('http://localhost:8000/api/v1/auth/naver/callback');
  const clientId = process.env.NAVER_CLIENT_ID;

  const naverAuthUrl =
    `https://nid.naver.com/oauth2.0/authorize?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${state}`;

  res.redirect(naverAuthUrl);
});

/**
 * [2] 콜백 엔드포인트
 * 네이버가 로그인 성공 시 여기로 code/state를 보냄
 * 예: http://localhost:8000/api/v1/auth/naver/callback?code=xxx&state=yyy
 */
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  console.log('✅ 네이버 콜백 수신');
  console.log('code:', code);
  console.log('state:', state);

  res.send(`
    <h2>네이버 로그인 콜백 도착 ✅</h2>
    <p>code: ${code}</p>
    <p>state: ${state}</p>
    <p>이제 이 code/state를 POST /v1/auth/social 로 전달하면 됩니다.</p>
  `);
});

export default router;
