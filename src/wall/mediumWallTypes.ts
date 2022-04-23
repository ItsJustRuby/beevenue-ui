import { MimeType } from "detail/media";

export interface MediumWallPaginationItem {
  tinyThumbnail: string | null;
  id: number;
  hash: string;
  mimeType: MimeType;
}

export interface MediumWallPagination {
  items: MediumWallPaginationItem[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}
