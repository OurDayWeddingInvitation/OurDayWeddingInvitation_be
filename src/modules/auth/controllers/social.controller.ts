import { Request, Response } from 'express';
import * as authService from '../services/social.service';

export async function postSocialAuth(req: Request, res: Response) {
  try {
    const { provider, code, state } = req.body;
    const data = await authService.socialLogin(provider, code, state);
    res.status(200).json({ success: true, data });
  } catch (e: any) {
    res.status(200).json({ success: false, message: e.message });
  }
}