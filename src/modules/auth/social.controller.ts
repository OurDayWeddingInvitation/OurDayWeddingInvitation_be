import { Request, Response } from 'express';
import * as socialService from './social.service';
import logger from '@/config/logger';

export async function postSocialAuth(req: Request, res: Response) {
  const providerName = req.params.provider;
  const { code, state } = req.body;
  logger.info("[social.controller.ts][postSocialAuth] Start", { providerName, code, state })
  const data = await socialService.socialLogin(providerName, code, state);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "소셜 로그인 성공",
    data: data,
  });
}
