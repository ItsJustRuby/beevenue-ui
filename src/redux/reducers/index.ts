import { combineReducers } from "redux";
import client from "./client";
import fileUpload from "./fileUpload";
import login from "./login";
import search from "./search";
import title from "./title";
import notifications from "./notifications";
import speedTagging from "./speedTagging";
import refresh from "./refresh";

const rootStore = {
  client,
  fileUpload,
  login,
  search,
  title,
  notifications,
  speedTagging,
  refresh,
};

export const rootReducer = combineReducers(rootStore);
