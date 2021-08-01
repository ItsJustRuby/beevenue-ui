import { NEW_TITLE } from "../actionTypes";
import { TitleStore } from "../storeTypes";

const initialState: TitleStore = { title: "" };

const title = (state: TitleStore = initialState, action: any): TitleStore => {
  switch (action.type) {
    case NEW_TITLE: {
      return {
        title: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default title;
