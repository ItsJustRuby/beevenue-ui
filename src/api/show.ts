import { MimeType } from "../detail/media";

export type Rating = "u" | "s" | "q" | "e";

export interface PartialShowViewModel {
  id: number;
  hash: string;
  mimeType: MimeType;
  rating: Rating;
  tags: Array<string>;
  absentTags: Array<string>;
}

export interface ShowViewModel extends PartialShowViewModel {
  similar: PartialShowViewModel[];
}
