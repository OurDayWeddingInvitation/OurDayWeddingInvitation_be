import prisma from '../../config/prisma';
import { AppError } from '../../core/errors/AppError';
import path, { join } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { v4 as uuid } from "uuid";
import { MediaReorderRequest, MediaRequest } from './media.schema';
import logger from '@/config/logger';

/**
 * 여러 파일과 메타데이터를 받아 백업용으로 weddMedia를 생성하거나 업데이트합니다.
 * 트랜잭션 내에서 파일별로 기존 레코드가 있으면 업데이트, 없으면 mediaId를 계산해 생성합니다.
 * @param param0.weddingId - 대상 웨딩 ID
 * @param param0.files - 업로드된 파일 배열
 * @param param0.media - 파일별 메타데이터 배열
 * @returns 전달된 media 객체를 그대로 반환
 */
export async function uploadMediaBackup({
  weddingId,
  files,
  media,
}: {
  weddingId: string;
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
        // 기존 최대 mediaId를 조회해 다음 mediaId 계산
        const maxMedia = await tx.weddMedia.aggregate({
          _max: { mediaId: true },
          where: { weddingId },
        });

        const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;

        weddMedia[i] = await tx.weddMedia.create({
          data: {
            weddingId: weddingId,
            mediaId: nextMediaId,
            imageType: mediaData.imageType,
            displayOrder: mediaData.displayOrder,
            originalUrl: `/uploads/draft/${weddingId}/${file.filename}`,
            editedUrl: `/uploads/draft/${weddingId}/${file.filename}`,
            fileExtension: path.extname(file.originalname).replace('.', ''),
            fileSize: file.size,
          },
        });
      }
    };
  });
  
  return media;
}

/**
 * 특정 웨딩에 속한 모든 미디어를 조회합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns weddMedia 레코드 배열
 */
export const getAllMediaEdit = async (userId: string, weddingId: string) => {
  logger.info("[media.service.ts][getAllMediaEdit] Start", { userId, weddingId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const result = await prisma.weddDraftMedia.findMany({
    where: { weddingId }
  })
  logger.info("[media.service.ts][getAllMediaEdit] Complete", { userId, weddingId });
  return result;
}

/**
 * 특정 웨딩에 속한 모든 미디어를 조회합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns weddMedia 레코드 배열
 */
export const getAllMedia = async (userId: string, weddingId: string) => {
  logger.info("[media.service.ts][getAllMedia] Start", { userId, weddingId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const result = await prisma.weddMedia.findMany({
    where: { weddingId }
  })
  logger.info("[media.service.ts][getAllMedia] Complete", { userId, weddingId });
  return result;
}

/**
 * 단일 파일을 업로드하고 weddMedia 레코드를 생성합니다.
 * 파일을 업로드 폴더로 이동하고 mediaId를 계산하여 DB에 저장합니다.
 * @param weddingId - 대상 웨딩 ID
 * @param metadata - 업로드 메타데이터 (imageType, displayOrder 등)
 * @param file - multer로 받은 파일 객체
 * @returns 생성된 weddMedia 레코드
 */
export const uploadMedia = async (
  userId: string,
  weddingId: string,
  metadata: MediaRequest,
  file: Express.Multer.File
) => {
  logger.info("[media.service.ts][uploadMedia] Start", { userId, weddingId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const tempPath = file.path;
  const newUUID = uuid();
  const ext = path.extname(file.originalname);
  const newPath = `/uploads/draft/${weddingId}/${newUUID}${ext}`
  const absoluteNewPath = join(process.cwd(), newPath);

  // 업로드 디렉토리 생성 및 임시 파일을 대상 경로로 이동
  fs.mkdirSync(join(process.cwd(), `/uploads/draft/${weddingId}`), { recursive: true });
  logger.info("[media.service.ts][uploadMedia] Directory made", { userId, weddingId });

  await fsp.copyFile(tempPath, absoluteNewPath);
  logger.info("[media.service.ts][uploadMedia] File copied", { userId, weddingId, tempPath, uploadPath: absoluteNewPath });
  await fsp.unlink(tempPath);
  logger.info("[media.service.ts][uploadMedia] Temp file remove", { userId, weddingId });

  return await prisma.$transaction(async (tx) => {
    // 현재 최대 mediaId를 조회하여 다음 mediaId 계산
    const maxMedia = await tx.weddDraftMedia.aggregate({
      _max: { mediaId: true },
      where: { weddingId },
    });

    const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;
    logger.info("[media.service.ts][uploadMedia] Read nextMediaId", { userId, weddingId, nextMediaId, uploadPath: absoluteNewPath });

    const media = await tx.weddDraftMedia.create({
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
    logger.info("[media.service.ts][uploadMedia] weddDraftMedia created", { userId, weddingId, mediaId: nextMediaId });
    logger.info("[media.service.ts][uploadMedia] Complete", { userId, weddingId, mediaId: nextMediaId, uploadPath: absoluteNewPath });
    return media;
  });
}

/**
 * 기존 media 레코드의 크롭 이미지를 생성, 교체합니다.
 * 기존 레코드가 없으면 에러를 반환합니다. 파일 경로 결정 및 덮어쓰기를 수행합니다.
 * @param weddingId - 대상 웨딩 ID
 * @param mediaId - 교체할 mediaId
 * @param file - multer로 받은 파일 객체
 * @returns 업데이트된 weddMedia 레코드
 */
export const croppedMedia = async (
  userId: string,
  weddingId: string,
  mediaId: number,
  file: Express.Multer.File
) => {
  logger.info("[media.service.ts][croppedMedia] Start", { userId, weddingId, mediaId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const existing = await prisma.weddDraftMedia.findUnique({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });

  if(!existing)
    throw new AppError(400, '이미지가 존재하지 않습니다.');
  
  const tempPath = file.path;
  const newPath = existing.editedUrl;
  let absoluteNewPath;

  // 기존 editedUrl이 있으면 덮어쓰고, 없으면 새로운 파일명을 만들어 저장
  if(!newPath) {
    const UUID = uuid();
    const ext = path.extname(file.originalname);
    absoluteNewPath = join(process.cwd(), `/uploads/draft/${weddingId}/${UUID}${ext}`);
  } else {
    absoluteNewPath = join(process.cwd(), newPath);
  }

  await fsp.copyFile(tempPath, absoluteNewPath);
  logger.info("[media.service.ts][croppedMedia] File copied", { userId, weddingId, mediaId, tempPath, uploadPath: absoluteNewPath });
  await fsp.unlink(tempPath);
  logger.info("[media.service.ts][croppedMedia] Temp flie removed", { userId, weddingId, mediaId, tempPath });

  const media = await prisma.weddDraftMedia.update({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
    data: { editedUrl: newPath }
  })
  logger.info("[media.service.ts][croppedMedia] weddDraftMedia updated", { userId, weddingId, mediaId });
  logger.info("[media.service.ts][croppedMedia] Complete", { userId, weddingId, mediaId });
  return media;
}

/**
 * 미디어의 순서를 일괄로 변경합니다.
 * @param weddingId - 대상 웨딩 ID
 * @param metadatas - mediaId와 새 displayOrder를 담은 배열
 */
export const reorderMedia = async (userId: string,weddingId: string, metadatas: MediaReorderRequest[]) => {
  logger.info("[media.service.ts][reorderMedia] Start", { userId, weddingId, metadatas });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  console.log(metadatas)
  const result = await prisma.$transaction(async (tx) => {
    const result = metadatas.map((metadata: MediaReorderRequest) => {
      return tx.weddDraftMedia.update({
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
  logger.info("[media.service.ts][reorderMedia] weddDraftMedia updated", { userId, weddingId });
  logger.info("[media.service.ts][reorderMedia] Complete", { userId, weddingId });

  return result;
}

/**
 * 특정 미디어를 삭제합니다. 파일 시스템의 원본/편집본 파일을 삭제한 뒤 DB 레코드를 제거합니다.
 * @param weddingId - 대상 웨딩 ID
 * @param mediaId - 삭제할 mediaId
 * @returns 삭제된 weddMedia 레코드
 */
export const deleteMedia = async (userId: string, weddingId: string, mediaId: number) => {
  logger.info("[media.service.ts][deleteMedia] Start", { userId, weddingId, mediaId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const media = await prisma.weddDraftMedia.findUnique({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });

  if(!media)
    throw new AppError(400, '이미지가 존재하지 않습니다.');

  // 파일 경로가 존재하면 실제 파일을 삭제
  const originalPath = media.originalUrl ? join(process.cwd(), media.originalUrl) : '';
  const croppedPath = media.editedUrl ? join(process.cwd(), media.editedUrl) : '';

  if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
  logger.info("[media.service.ts][deleteMedia] orginal media removed", { userId, weddingId, mediaId, originalPath });
  if (fs.existsSync(croppedPath)) fs.unlinkSync(croppedPath);
  logger.info("[media.service.ts][deleteMedia] cropped media removed", { userId, weddingId, mediaId, croppedPath });

  const result = await prisma.weddDraftMedia.delete({
    where: {
      weddingId_mediaId: {
        weddingId: weddingId,
        mediaId: mediaId
      }
    },
  });
  logger.info("[media.service.ts][deleteMedia] weddDraftMedia deleted", { userId, weddingId, mediaId });
  logger.info("[media.service.ts][deleteMedia] Complete", { userId, weddingId, mediaId });
  return result;
}

/**
 * 특정 이미지 타입의 미디어를 모두 삭제합니다. 파일 시스템의 원본/편집본 파일을 삭제한 뒤 DB 레코드를 제거합니다.
 * @param weddingId - 대상 웨딩 ID
 * @param imageType - 삭제할 이미지 타입
 * @returns 삭제된 weddMedia 레코드
 */
export const deleteByTypeMedia = async (userId: string, weddingId: string, imageType: string) => {
  logger.info("[media.service.ts][deleteByTypeMedia] Start", { userId, weddingId, imageType });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const media = await prisma.weddDraftMedia.findMany({
    where: { weddingId, imageType },
  });

  if(!media)
    throw new AppError(400, '이미지가 존재하지 않습니다.');

  // 파일 경로가 존재하면 실제 파일을 삭제
  for (const m of media) {
    const originalPath = m.originalUrl ? join(process.cwd(), m.originalUrl) : '';
    const croppedPath = m.editedUrl ? join(process.cwd(), m.editedUrl) : '';

    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
  logger.info("[media.service.ts][deleteByTypeMedia] orginal media removed", { userId, weddingId, imageType, originalPath });
    if (fs.existsSync(croppedPath)) fs.unlinkSync(croppedPath);
  logger.info("[media.service.ts][deleteByTypeMedia] cropped media removed", { userId, weddingId, imageType, croppedPath });
  }

  const result = await prisma.weddDraftMedia.deleteMany({
    where: { weddingId, imageType },
  });
  logger.info("[media.service.ts][deleteMedia] weddDraftMedia deleted", { userId, weddingId, imageType });
  logger.info("[media.service.ts][deleteMedia] Complete", { userId, weddingId, imageType });
  return result;
}