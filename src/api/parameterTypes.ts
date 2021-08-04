import { Rating } from "types";

export interface LoginParameters {
  username: string;
  password: string;
}

export interface PaginationParameters {
  pageNumber: number;
  pageSize: number;
}

export interface SearchParameters extends PaginationParameters {
  q: string;
}

export interface UpdateMediumParameters {
  id: number;
  rating: Rating;

  absentTags: Array<string>;
  tags: Array<string>;
}
