import { SET_CLIENT_THUMBNAIL_SIZE } from "../actionTypes";
import { ClientStore } from "../storeTypes";

const initialState: ClientStore = { thumbnailSize: "unknown" };

const client = (state: ClientStore = initialState, action: any): ClientStore => {
  switch (action.type) {
    case SET_CLIENT_THUMBNAIL_SIZE: {
      return {
        thumbnailSize: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default client;
