import { MimeType } from "./media";
import { PartialShowViewModel } from "../api/show";

export interface MediumProps {
  hash: string;
  mimeType: MimeType;
  similar: PartialShowViewModel[];
}
