import prisma from '../../config/prisma';
import path, { join } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

export async function uploadMediaBackup({
  weddingId,
  files,
  media,
}: {
  weddingId: number;
  files: Express.Multer.File[];
  media: any;
}) {
  const weddMedia = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaData = media[i];

      // 이미지 존재 확인
      const existing = await tx.weddMedia.findUnique({
        where: {
          weddingId_mediaId: {
            weddingId: weddingId,
            mediaId: mediaData.mediaId
          }
        },
      });

      if (existing) {
        weddMedia[i] = await tx.weddMedia.update({
          where: {
            weddingId_mediaId: {
              weddingId: weddingId,
              mediaId: mediaData.mediaId
            }
          },
          data: {
            weddingId: weddingId,
            displayOrder: mediaData.displayOrder,
          },
        });
      } else {
        const maxMedia = await tx.weddMedia.aggregate({
          _max: { mediaId: true },
          where: { weddingId: 1 },
        });

        const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;

        weddMedia[i] = await tx.weddMedia.create({
          data: {
            weddingId,
            mediaId: nextMediaId,
            imageType: mediaData.imageType,
            displayOrder: mediaData.displayOrder,
            originalUrl: `/uploads/${file.filename}`,
            editedUrl: `/uploads/${file.filename}`,
            fileExtension: path.extname(file.originalname).replace('.', ''),
            fileSize: file.size,
          },
        });

      }
    };
  });
  
  return media;
}

export const getAllMedia = async (weddingId: number) => {
  return await prisma.weddMedia.findMany({
    where: { weddingId }
  })
}

export const uploadMedia = async (
  weddingId: number,
  metadata: any,
  file: Express.Multer.File
) => {
  const tempPath = file.path;
  const ext = path.extname(file.originalname);
  const newPath = join(process.cwd(), `/uploads/${weddingId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`);

  fs.mkdirSync(join(process.cwd(), `/uploads/${weddingId}`), { recursive: true });
  await fsp.copyFile(tempPath, newPath);
  await fsp.unlink(tempPath);

  return await prisma.$transaction(async (tx) => {
    const maxMedia = await tx.weddMedia.aggregate({
      _max: { mediaId: true },
      where: { weddingId },
    });

    const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;

    const media = await tx.weddMedia.create({
      data: {
        weddingId,
        mediaId: nextMediaId,
        imageType: metadata.imageType,
        displayOrder: Number(metadata.displayOrder),
        originalUrl: newPath,
        fileExtension: path.extname(file.originalname).replace('.', ''),
        fileSize: file.size,
      },
    });

    return media;
  });
}

export const replaceMedia = async (
  weddingId: number,
  mediaId: number,
  file: Express.Multer.File
) => {
  const existing = await prisma.weddMedia.findUnique({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });

  if(!existing)
    throw new Error('잘못된 요청입니다.');
  
  const tempPath = file.path;
  let newPath = existing.editedUrl;

  if(!newPath){
    const ext = path.extname(file.originalname);
    newPath = join(process.cwd(), `uploads/${weddingId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`);
  }

  await fsp.copyFile(tempPath, newPath);
  await fsp.unlink(tempPath);

  const media = await prisma.weddMedia.update({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
    data: { editedUrl: newPath }
  })

  return media;
}

export const updateMedia = async (weddingId: number, metadatas: any) => {
  console.log(metadatas)
  await prisma.$transaction(async (tx) => {
    const result = metadatas.map((metadata: any) => {
      return tx.weddMedia.update({
        where: {
          weddingId_mediaId: {
            weddingId: weddingId,
            mediaId: metadata.mediaId
          }
        },
        data: { displayOrder: metadata.displayOrder }
      })
    });

    await Promise.all(result);
  });
}

export const deleteMedia = async (weddingId: number, mediaId: number) => {
  const media = await prisma.weddMedia.findUnique({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });

  if(!media)
    throw new Error('잘못된 요청입니다.');

  const originalPath = media.originalUrl || '';
  const croppedPath = media.editedUrl || '';

  if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
  if (fs.existsSync(croppedPath)) fs.unlinkSync(croppedPath);

  return await prisma.weddMedia.delete({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });
}