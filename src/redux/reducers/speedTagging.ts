import {
  SET_SPEED_TAGGING,
  SET_SPEED_TAGGING_ABSENT,
  TOGGLE_SPEED_TAGGING_ITEM,
  CLEAR_SPEED_TAGGING_ITEMS,
} from "../actionTypes";
import { SpeedTaggingStore } from "../storeTypes";

const initialState: SpeedTaggingStore = {
  isSpeedTagging: false,
  isAbsent: false,
  speedTaggingItems: [],
};

const speedTagging = (
  state: SpeedTaggingStore = initialState,
  action: any
): SpeedTaggingStore => {
  switch (action.type) {
    case SET_SPEED_TAGGING_ABSENT:
      return { ...state, isAbsent: !state.isAbsent };
    case SET_SPEED_TAGGING:
      const newIsSpeedTagging = !state.isSpeedTagging;
      const result = { ...state, isSpeedTagging: newIsSpeedTagging };

      if (!newIsSpeedTagging) {
        result.speedTaggingItems = [];
      }

      return result;
    case CLEAR_SPEED_TAGGING_ITEMS:
      return {
        ...state,
        speedTaggingItems: [],
      };
    case TOGGLE_SPEED_TAGGING_ITEM: {
      const speedTaggingItems = state.speedTaggingItems;
      const newItem = action.payload;

      const maybeIdx = speedTaggingItems.indexOf(newItem);
      if (maybeIdx > -1) {
        speedTaggingItems.splice(maybeIdx, 1);
      } else {
        speedTaggingItems.push(newItem);
      }

      return {
        ...state,
        speedTaggingItems,
      };
    }
    default:
      return state;
  }
};

export default speedTagging;
