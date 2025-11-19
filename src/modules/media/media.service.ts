import prisma from '../../config/prisma';
import path from 'path';
import fs from 'fs';

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

export const uploadMedia = async (
  weddingId: number,
  metadata: any,
  file: Express.Multer.File
) => {
  const tempPath = file.path;
  const newPath = `uploads/${weddingId}/${file.fieldname}`;

  fs.mkdirSync(`uploads/${weddingId}`, { recursive: true });
  fs.renameSync(tempPath, newPath);

  await prisma.$transaction(async (tx) => {
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
        displayOrder: metadata.displayOrder,
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
  
  const tempPath = file.path;
  let newPath = media.editedUrl;

  if(!newPath){
    fs.mkdirSync(`uploads/${weddingId}`, { recursive: true });
    newPath = `uploads/${weddingId}/${file.fieldname}`;
  }

  fs.renameSync(tempPath, newPath);

  return media;
}

export const updateMedia = async (weddingId: number, metadatas: any) => {
  await prisma.$transaction(async (tx) => {
    metadatas.map((metadata: any) => {
      tx.weddMedia.update({
        where: {
          weddingId_mediaId: {
            weddingId: weddingId,
            mediaId: metadata.mediaId
          }
        },
        data: { displayOrder: metadata.displayOrder }
      })
    });
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
}