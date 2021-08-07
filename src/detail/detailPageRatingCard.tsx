import React, { useContext } from "react";
import { Rating } from "../types";
import { ImmediateUpdateDispatch } from "./detailPageInner";
import { ImmediateUpdate } from "./immediateUpdateReducer";

const fullRating = (r: Rating): string => {
  const dict = {
    u: "Unknown",
    s: "Safe",
    q: "Questionable",
    e: "Explicit",
  };

  return dict[r];
};

interface DetailPageRatingCardProps {
  rating: Rating;
  userIsAdmin: boolean;
}

const ratingElementFor = (
  dispatch: React.Dispatch<ImmediateUpdate>,
  props: DetailPageRatingCardProps,
  r: Rating
): JSX.Element => {
  const rating = fullRating(r);
  const id = `currentRating${rating}`;
  return (
    <div className="beevenue-Ratings-Rating" key={id}>
      <input
        className="is-checkradio"
        type="radio"
        disabled={props.userIsAdmin ? undefined : true}
        checked={props.rating === r}
        aria-label={`medium-set-rating-${r}`}
        name="currentRating"
        onChange={(e) => {
          dispatch({
            action: "setRating",
            rating: r,
          });
        }}
        value={r}
        id={id}
      />
      <label htmlFor={id}>{rating}</label>
    </div>
  );
};

const DetailPageRatingCard = (props: DetailPageRatingCardProps) => {
  const dispatch = useContext(ImmediateUpdateDispatch)!;

  const ratings: Rating[] = ["s", "q", "e"];

  return (
    <div className="card beevenue-ShowPage-Card">
      <div className="card-content">
        <div className="content">
          <div className="field beevenue-Ratings">
            {ratings.map((r) => ratingElementFor(dispatch, props, r))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailPageRatingCard };
