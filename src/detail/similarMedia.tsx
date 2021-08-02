import React from "react";
import { Link } from "react-router-dom";
import { useBeevenueSelector } from "redux/selectors";

import { backendUrl } from "../config.json";

interface TinyShowModel {
  id: number;
  hash: string;
}

interface SimilarMediaProps {
  media: TinyShowModel[];
}

const SimilarMedia = (props: SimilarMediaProps) => {
  const thumbnailSize = useBeevenueSelector(
    (state) => state.client.thumbnailSize
  );

  return (
    <div className="beevenue-similar-media">
      {props.media.map((s) => (
        <div className="beevenue-similar-medium" key={s.id}>
          <Link to={`/show/${s.id}`}>
            <img src={`${backendUrl}/thumbs/${s.hash}.${thumbnailSize}.jpg`} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export { SimilarMedia };
