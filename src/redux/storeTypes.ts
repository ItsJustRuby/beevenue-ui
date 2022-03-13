import { Store } from "redux";
import { BeevenueNotificationMap } from "../notifications";

export interface FileUploadStore {
  lastFileUploaded: number;
}

interface IAnonymous {}
export const Anonymous: IAnonymous = {};
interface IUnknown {}
export const Unknown: IUnknown = {};

export type BeevenueUser = string | number | IAnonymous | IUnknown;

export type ClientThumbnailSize = "s" | "l" | "unknown";

export interface ClientStore {
  thumbnailSize: ClientThumbnailSize;
}

export interface LoginStore {
  doAutoLogin: boolean;
  loggedInUser: BeevenueUser;
  loggedInRole: string | null;
  sfwSession: boolean;

  serverVersion: string;
}

export interface NotificationStore {
  notifications: BeevenueNotificationMap;
}

export interface RedirectInfo {
  target: string;
  doReplace: boolean;
}

export interface RefreshStore {
  shouldRefresh: boolean;
}

export interface SearchStore {
  searchQuery: string;
}

export interface TitleStore {
  title: string;
}

export interface SpeedTaggingStore {
  isSpeedTagging: boolean;
  isAbsent: boolean;
  speedTaggingItems: any[];
}

export interface BeevenueStore extends Store {
  client: ClientStore;
  fileUpload: FileUploadStore;
  login: LoginStore;
  notifications: NotificationStore;
  refresh: RefreshStore;
  search: SearchStore;
  speedTagging: SpeedTaggingStore;
  title: TitleStore;
}
