import { MimeType } from "../detail/media";
import { Rating } from "../types";

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
