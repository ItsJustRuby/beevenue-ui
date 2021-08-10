import { backendUrl } from "../config.json";

type ImageMimeType = "image/gif" | "image/png" | "image/jpeg" | "image/jpg";

type VideoMimeType = "video/mp4" | "video/webm" | "video/x-matroska";

export type MimeType = ImageMimeType | VideoMimeType;

export type Extension = string;

export const MimeTypeToExtension = (id: MimeType): Extension => {
  const dict = {
    "image/png": ".png",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/x-matroska": ".mkv",
  };

  return dict[id];
};

export interface MediumContext {
  mimeType: MimeType;
  hash: string;
}

export const mediaSource = (ctx: MediumContext) => {
  const extension = MimeTypeToExtension(ctx.mimeType);
  return `${backendUrl}/files/${ctx.hash}${extension}`;
};
