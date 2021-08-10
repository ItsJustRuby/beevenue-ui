import { SET_CLIENT_OS, SET_CLIENT_THUMBNAIL_SIZE } from "../actionTypes";
import { ClientStore } from "../storeTypes";

const initialState: ClientStore = { os: "unknown", thumbnailSize: "unknown" };

const client = (
  state: ClientStore = initialState,
  action: any
): ClientStore => {
  switch (action.type) {
    case SET_CLIENT_THUMBNAIL_SIZE:
      return {
        ...state,
        thumbnailSize: action.payload,
      };
    case SET_CLIENT_OS:
      return {
        ...state,
        os: action.payload,
      };
    default: {
      return state;
    }
  }
};

export default client;
