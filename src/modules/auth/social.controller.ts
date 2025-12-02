import { Request, Response } from 'express';
import * as socialService from './social.service';
import { respondSuccess } from '../../core/utils/response.util'

export async function postSocialAuth(req: Request, res: Response) {
  const providerName = req.params.provider;
  const { code, state } = req.body;
  const data = await socialService.socialLogin(providerName, code, state);
  respondSuccess(res, 200, null, data);
}
