import React from "react";
import { useDispatch } from "react-redux";
import { toggleSpeedTaggingItem } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";

interface SpeedTaggingItemProps {
  id: number;
  children: any[] | any;
}

const SpeedTaggingItem = (props: SpeedTaggingItemProps) => {
  const speedTaggingItems = useBeevenueSelector((store) =>
    store.speedTagging.speedTaggingItems.slice()
  );
  const dispatch = useDispatch();

  const toggle = (e: any) => {
    e.preventDefault();
    dispatch(toggleSpeedTaggingItem(props.id));
  };

  const isSelected = speedTaggingItems.indexOf(props.id) > -1;

  const className = (() => {
    if (isSelected) {
      return "beevenue-u-SpeedTagger beevenue-u-SpeedTaggerSelected";
    }

    return "beevenue-u-SpeedTagger";
  })();

  return (
    <div className={className} key={props.id}>
      <a
        aria-label={`speed-tagger-medium-${props.id}`}
        className={
          isSelected ? "beevenue-speed-tagger-medium-selected" : "null"
        }
        onClick={(e) => toggle(e)}
      >
        {props.children}
      </a>
    </div>
  );
};

export { SpeedTaggingItem };
