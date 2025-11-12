import prisma from '../../../config/prisma';
import path from 'path';

export async function uploadMedia({
  weddId,
  imgType,
  file,
  displayOrdr = 0,
}: {
  weddId: number;
  imgType: string;
  file: Express.Multer.File;
  displayOrdr?: number;
}) {
  // ✅ 1. 중복 업로드 체크
  const existing = await prisma.weddMedia.findFirst({
    where: { weddId },
  });

  let media;

  if (existing) {
    return { alreadyExists: true, data: existing };

    media = await prisma.weddMedia.update({
      data: {
        weddId,
        mediaId: nextMediaId,
        imgType,
        displayOrdr,
        orgUrl: `/uploads/${file.filename}`,
        editUrl: `/uploads/${file.filename}`,
        fileExtsn: path.extname(file.originalname).replace('.', ''),
        fileSize: file.size,
      },
    });
  } else {
    await prisma.$transaction(async (tx) => {
      const maxMedia = await tx.weddMedia.aggregate({
        _max: { mediaId: true },
        where: { weddId: 1 },
      });

      const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;


      // ✅ 2. 신규 저장
      media = await prisma.weddMedia.create({
        data: {
          weddId,
          mediaId: nextMediaId,
          imgType,
          displayOrdr,
          orgUrl: `/uploads/${file.filename}`,
          editUrl: `/uploads/${file.filename}`,
          fileExtsn: path.extname(file.originalname).replace('.', ''),
          fileSize: file.size,
        },
      });

    });
  }
  return media;
}
