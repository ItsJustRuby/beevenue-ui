import { Api } from "api";
import { ShowViewModel } from "api/show";
import { Rating } from "types";
import { useEffect, useReducer } from "react";

// Take this API Response and use it as the new ground truth.
interface Overwrite {
  action: "overwrite";
  payload: ShowViewModel;
}

interface NewRating {
  action: "setRating";
  rating: Rating;
}

interface ReplaceTags {
  action: "replaceTags";
  tags: string[];
}

interface ReplaceAbsentTags {
  action: "replaceAbsentTags";
  absentTags: string[];
}

interface AddTag {
  action: "addTag";
  tag: string;
}

interface AddAbsentTag {
  action: "addAbsentTag";
  absentTag: string;
}

export type ImmediateUpdate =
  | Overwrite
  | NewRating
  | ReplaceTags
  | ReplaceAbsentTags
  | AddTag
  | AddAbsentTag;

const immediateUpdateReducer = (
  state: TemporaryViewModel,
  action: ImmediateUpdate
): TemporaryViewModel => {
  switch (action.action) {
    case "overwrite":
      return {
        ...action.payload,
        isCanonical: true,
      };
    case "setRating":
      return {
        ...state,
        isCanonical: false,
        rating: action.rating,
      };
    case "addAbsentTag": {
      const absentTags = state.absentTags.slice();
      absentTags.push(action.absentTag);
      return {
        ...state,
        isCanonical: false,
        absentTags,
      };
    }
    case "addTag": {
      const tags = state.tags.slice();
      tags.push(action.tag);
      return {
        ...state,
        isCanonical: false,
        tags,
      };
    }
    case "replaceTags":
      return {
        ...state,
        isCanonical: false,
        tags: action.tags,
      };
    case "replaceAbsentTags":
      return {
        ...state,
        isCanonical: false,
        absentTags: action.absentTags,
      };
    default:
      return state;
  }
};

export interface TemporaryViewModel extends ShowViewModel {
  isCanonical: boolean;
}

const useImmediateUpdates = (initialViewModel: ShowViewModel): any => {
  const [currentViewModel, immediateUpdateDispatch] = useReducer(
    immediateUpdateReducer,
    {
      ...initialViewModel,
      isCanonical: true,
    }
  );

  // Whenever we update the currently visible viewmodel, we send that update
  // to the API. When we get a response from there that differs from our own
  // opinion, we set that as our actual newly validated viewmodel.
  // This way, we get a very reactive UI which might "jump back" a bit if the
  // user makes invalid changes.
  useEffect(() => {
    let isMounted = true;

    if (currentViewModel.isCanonical) {
      return () => {
        isMounted = true;
      };
    }

    Api.Medium.update(currentViewModel).then((res) => {
      if (!isMounted) return;
      const apiViewModel = res.data;

      immediateUpdateDispatch({
        action: "overwrite",
        payload: apiViewModel,
      });
    });

    return () => {
      isMounted = true;
    };
  }, [currentViewModel]);

  return {
    currentViewModel,
    dispatch: immediateUpdateDispatch,
  };
};

export { useImmediateUpdates };
