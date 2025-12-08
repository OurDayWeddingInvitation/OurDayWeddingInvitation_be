import { z } from "zod";

export const MediaIdParam = z.object({
  mediaId: z.number().int(),
});
export const FileNameParam = z.object({
  fileName: z.string(),
});
export const MediaRequestSchema = z.object({
  mediaId: z.number().int(),
  imageType: z.string().nullable().optional(),
  displayOrder: z.number().int().nullable().optional(),
});
export const MediaResponseSchema = z.object({
  mediaId: z.number().int(),
  imageType: z.string().nullable(),
  displayOrder: z.number().int().nullable(),
  originalUrl: z.string().nullable(),
  editedUrl: z.string().nullable(),
  fileExtension: z.string().nullable(),
  fileSize: z.number().int().nullable(),
});

export type MediaRequest = z.infer<typeof MediaRequestSchema>;
export type MediaResponse = z.infer<typeof MediaResponseSchema>;