import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  toggleSpeedTagging,
  toggleSpeedTaggingAbsent,
  setShouldRefresh,
  clearSpeedTaggingItems,
} from "../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { Api } from "api";
import { useBeevenueSelector } from "../../redux/selectors";

const useTagsInputField = () => {
  const [tags, setTags] = useState("");

  const tagsInputField = (
    <div className="field">
      <input
        className="input"
        type="text"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.currentTarget.value)}
      />
    </div>
  );

  return { tagsInputField, tags };
};

const useMarkCheckbox = (dispatch: (x: any) => void) => {
  const toggle = () => {
    dispatch(toggleSpeedTagging());
  };

  const isSpeedTagging = useBeevenueSelector(
    (store) => store.speedTagging.isSpeedTagging
  );

  return (
    <div className="field">
      <input
        type="checkbox"
        id="speed-tagger-switch"
        name="speed-tagger-switch"
        className="switch"
        defaultChecked={isSpeedTagging}
        onChange={(_) => toggle()}
      />
      <label htmlFor="speed-tagger-switch">Mark</label>
    </div>
  );
};

const useAbsentCheckbox = (dispatch: (x: any) => void) => {
  const toggle = () => {
    dispatch(toggleSpeedTaggingAbsent());
  };

  const isSpeedTagging = useBeevenueSelector(
    (store) => store.speedTagging.isSpeedTagging
  );

  const isSpeedTaggingAbsent = useBeevenueSelector(
    (store) => store.speedTagging.isAbsent
  );

  return (
    <div className="field">
      <input
        type="checkbox"
        id="speed-tagger-absent-switch"
        name="speed-tagger-absent-switch"
        className="switch"
        disabled={!isSpeedTagging}
        defaultChecked={isSpeedTaggingAbsent}
        onChange={(_) => toggle()}
      />
      <label htmlFor="speed-tagger-absent-switch">Absent</label>
    </div>
  );
};

const go = (
  isAbsent: boolean,
  speedTaggingItems: any[],
  tags: string,
  dispatch: (x: any) => void
) => {
  const items = speedTaggingItems;
  if (items.length < 1) {
    return;
  }

  const tagNames = tags.split(" ");
  if (tagNames.length < 1) {
    return;
  }

  Api.Tags.batchAdd(isAbsent, tagNames, items).finally(() => {
    dispatch(clearSpeedTaggingItems());
    dispatch(setShouldRefresh(true));
  });
};

const useGoButton = (
  speedTaggingItems: any[],
  tags: string,
  dispatch: (x: any) => void
) => {

  const isAbsent = useBeevenueSelector(
    (store) => store.speedTagging.isAbsent
  );

  return (
    <div className="field">
      <a
        className="button"
        onClick={(_) => go(isAbsent, speedTaggingItems, tags, dispatch)}
      >
        <FontAwesomeIcon icon={faCheck} />
      </a>
    </div>
  );
};

const useForm = (speedTaggingItems: any[]) => {
  const dispatch = useDispatch();
  const markCheckbox = useMarkCheckbox(dispatch);
  const absentCheckbox = useAbsentCheckbox(dispatch);
  const { tagsInputField, tags } = useTagsInputField();
  const goButton = useGoButton(speedTaggingItems, tags, dispatch);

  return (
    <form>
      {tagsInputField}
      {markCheckbox}
      {absentCheckbox}
      {goButton}
    </form>
  );
};

const SpeedTaggerPanel = () => {
  const speedTaggingItems = useBeevenueSelector((store) =>
    store.speedTagging.speedTaggingItems.slice()
  );

  const form = useForm(speedTaggingItems);

  const getCardTitle = () => {
    if (speedTaggingItems && speedTaggingItems.length > 0) {
      return `Speed tagger (${speedTaggingItems.length} selected)`;
    }
    return "Speed tagger";
  };

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-header">
        <p className="card-header-title">{getCardTitle()}</p>
      </div>
      <div className="card-content">
        <div className="content">{form}</div>
      </div>
    </div>
  );
};

export { SpeedTaggerPanel };
