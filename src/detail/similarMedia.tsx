import React from "react";
import { Link } from "react-router-dom";
import { useBeevenueSelector } from "redux/selectors";

import CONFIG from "../config";

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
    <div className="beevenue-SimilarMedia">
      {props.media.map((s) => (
        <div className="beevenue-SimilarMedia-SimilarMedium" key={s.id}>
          <Link to={`/show/${s.id}`}>
            <img
              src={`${CONFIG.backendUrl}/thumbs/${s.hash}.${thumbnailSize}.jpg`}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export { SimilarMedia };
