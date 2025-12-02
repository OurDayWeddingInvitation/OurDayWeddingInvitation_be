export interface MediaRequest {
  mediaId: number;
  imageType?: string | null;
  displayOrder: number | null;
}

export interface MediaResponse {
  mediaId: number;
  imageType: string | null;
  displayOrder: number | null;
  originalUrl: string | null;
  editedUrl: string | null;
  fileExtension: string | null;
  fileSize: number | null;
}