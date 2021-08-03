import { QuickFixKind } from "api/api";
import { useEffect, useReducer } from "react";

interface ViolationAction {
  type: QuickFixKind;
  tag: string;
}

interface ViolationReducerState {
  actions: any;
}

const useViolationReducer = (
  viewModel: any,
  setViewModel: any,
  onTagsChange: any,
  onAbsentTagsChange: any
) => {
  const violationReducer = (
    state: ViolationReducerState,
    action: ViolationAction
  ) => {
    const newActions = state.actions.slice();
    newActions.push(action);
    return { ...state, actions: newActions };
  };

  const [violationsState, violationsDispatch] = useReducer(violationReducer, {
    actions: [],
  });

  useEffect(() => {
    const addTag = (newTag: string) => {
      if (viewModel === null) return;
      const newTags = viewModel.tags.slice();
      newTags.push(newTag);
      onTagsChange(newTags);
    };

    const addAbsentTag = (newTag: string) => {
      if (viewModel === null) return;
      const newTags = viewModel.absentTags.slice();
      newTags.push(newTag);
      onAbsentTagsChange(newTags);
    };

    if (violationsState.actions.length > 0) {
      const action = violationsState.actions.pop();

      if (action.type === "addTag") {
        addTag(action.tag);
      } else {
        addAbsentTag(action.tag);
      }
    }
  }, [
    violationsState,
    setViewModel,
    viewModel,
    onTagsChange,
    onAbsentTagsChange,
  ]);

  return violationsDispatch;
};

export { useViolationReducer };
