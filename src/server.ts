/**
 * @file 서버 구동 엔트리 (SpringApplication.run 유사)
 */
import app from './app';

const PORT = Number(process.env.PORT || 8000);

/**
 * 서버 시작
 */
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
