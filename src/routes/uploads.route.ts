import { Router } from "express";
import { authenticateJWT } from "../core/middlewares/auth.middleware";
import path from "path";
import prisma from "../config/prisma";
import fs from "fs";

const router = Router();

router.get(
  "/uploads/draft/:weddingId/:fileName",
  authenticateJWT,
  async (req, res) => {
    const { weddingId, fileName } = req.params;

    // 소유자 검증
    const isOwner = await prisma.weddDraft.findFirst({
      where: { weddingId: weddingId, userId: req.user.userId }
    });
    if (!isOwner) return res.sendStatus(403);

    const filePath = path.join(process.cwd(), "uploads/draft", weddingId, fileName);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);

    return res.sendFile(filePath);
  }
);

export default router;
