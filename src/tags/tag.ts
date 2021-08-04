import { Rating } from "../types";

export interface Tag {
  rating: Rating;
  tag: string;
  impliedByThisCount: number;
  implyingThisCount: number;
  mediaCount: number;
}
