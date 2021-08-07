import React from "react";
import qs from "qs";
import Masonry from "react-masonry-css";

import { BeevenuePagination } from "./beevenuePagination";
import { ProgressiveThumbnail } from "./progressiveThumbnail";
import {
  MediumWallPagination,
  MediumWallPaginationItem,
} from "./mediumWallTypes";
import { useHistory, useLocation } from "react-router-dom";
import { paginationParamsFromQuery } from "./pagination";
import { PaginationParameters } from "api/parameterTypes";

type PaginationChange = Partial<
  Pick<MediumWallPagination, "pageNumber" | "pageSize">
>;

interface MediumWallProps {
  media: MediumWallPagination;
  onMediaChange: (p: PaginationChange) => void;
  onPaginationChange: (paginationParams: PaginationParameters) => void;
}

const MediumWall = (props: MediumWallProps) => {
  const { media, onMediaChange, onPaginationChange } = props;

  const history = useHistory();
  const location = useLocation();

  const onPaginationChangeWrapper = (change: PaginationChange) => {
    onMediaChange(change);

    let q = qs.parse(location.search, { ignoreQueryPrefix: true });
    const paginationParams = paginationParamsFromQuery(q);

    const newPaginationParams = { ...paginationParams, ...change };
    const newQs = qs.stringify(newPaginationParams, { addQueryPrefix: true });
    history.push(newQs);

    onPaginationChange(newPaginationParams);
  };

  const onPageSelect = (n: number) => {
    onPaginationChangeWrapper({ pageNumber: n });
  };

  const onPageSizeSelect = (n: number) => {
    // Example calculation:
    // * We are currently on pageNumber == 2, pageSize == 20.
    //   so we are showing images with 1-indices 21-40.
    // * When switching to pageSize == 10, we *still* want to show images
    //   starting at 1-index 21. That would put us on page *3*.
    // * Thus, we figure out on which pageNr our first visible image index
    //   would land (using the new pageSize), and switch pageNumber to that
    //   value as well.

    const previousFirstVisibleImageIndex =
      (media.pageNumber - 1) * media.pageSize + 1;

    const newPageNumber = Math.ceil(previousFirstVisibleImageIndex / n);

    onPaginationChangeWrapper({ pageNumber: newPageNumber, pageSize: n });
  };

  const imageLinks = media.items.map((r: MediumWallPaginationItem) => {
    const maybeSrc = r.tinyThumbnail
      ? `data:image/png;base64, ${r.tinyThumbnail}`
      : undefined;

    return (
      <div className="beevenue-masonry-item" key={r.id}>
        <ProgressiveThumbnail src={maybeSrc} medium={r} />
      </div>
    );
  });

  return (
    <BeevenuePagination
      page={media}
      onPageSelect={onPageSelect}
      onPageSizeSelect={onPageSizeSelect}
    >
      <Masonry
        breakpointCols={{
          default: 4,
          1600: 2,
          500: 1,
        }}
        className="beevenue-masonry"
        data-testid="beevenue-masonry"
        columnClassName="beevenue-masonry-column"
      >
        {imageLinks}
      </Masonry>
    </BeevenuePagination>
  );
};

export { MediumWall };
export default MediumWall;
export type { PaginationChange };
