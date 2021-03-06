import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";

import { useDispatch } from "react-redux";

import { setShouldRefresh } from "../redux/actions";

import { MediumWallPagination } from "./mediumWallTypes";
import { paginationParamsFromQuery } from "./pagination";
import { BeevenueSpinner } from "../beevenueSpinner";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { MediumWall, PaginationChange } from "./mediumWall";
import { AxiosPromise } from "axios";
import { PaginationParameters } from "api/parameterTypes";

interface AlbumProps {
  apiCall: (params: PaginationParameters) => AxiosPromise<any>;
}

const Album = (props: AlbumProps) => {
  const { apiCall } = props;

  const dispatch = useDispatch();
  const location = useLocation();

  const shouldRefresh = useBeevenueSelector(
    (store) => store.refresh.shouldRefresh
  );
  const lastFileUploaded = useBeevenueSelector(
    (store) => store.fileUpload.lastFileUploaded
  );
  const isSessionSfw = useIsSessionSfw();

  const [doShowSpinner, setDoShowSpinner] = useState(true);
  const [paginationParams, setPaginationParams] =
    useState<PaginationParameters>(() => {
      const q = qs.parse(location.search, { ignoreQueryPrefix: true });
      const paginationParams = paginationParamsFromQuery(q);
      return paginationParams;
    });

  useEffect(() => {
    if (shouldRefresh) {
      dispatch(setShouldRefresh(false));
    }
  }, [dispatch, shouldRefresh]);

  const loadMedia = useCallback(
    (
      getIsMounted: () => boolean,
      basePaginationParams: PaginationParameters
    ) => {
      if (!getIsMounted()) return;
      setDoShowSpinner(true);
      apiCall(basePaginationParams).then(
        (res) => {
          if (!getIsMounted()) return;
          setMedia(res.data);
          setDoShowSpinner(false);
        },
        (_) => {}
      );
    },
    [apiCall]
  );

  const defaultMedia = useMemo(() => {
    let q = qs.parse(location.search, { ignoreQueryPrefix: true });
    const paginationParams = paginationParamsFromQuery(q);

    return {
      items: [],
      pageNumber: paginationParams.pageNumber,
      pageSize: paginationParams.pageSize,
      pageCount: paginationParams.pageNumber,
    };
  }, [location.search]);

  const [media, setMedia] = useState<MediumWallPagination>(defaultMedia);

  useEffect(() => {
    let isMounted = true;
    loadMedia(() => isMounted, paginationParams);
    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    lastFileUploaded,
    loadMedia,
    isSessionSfw,
    paginationParams,
    shouldRefresh,
  ]);

  useEffect(() => {
    let isMounted = true;
    if (
      location.pathname === "/" &&
      location.search === "" &&
      location.hash === ""
    ) {
      loadMedia(() => isMounted, {
        pageNumber: 1,
        pageSize: 10,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [location, loadMedia]);

  const changeWrapper = (change: PaginationChange) => {
    setMedia({
      ...media,
      ...change,
    });
  };

  let inner = null;

  if (media.items.length === 0 && doShowSpinner) {
    inner = () => <BeevenueSpinner />;
  } else if (media.items.length === 0 && !doShowSpinner) {
    inner = () => <h2 className="title is-2">No results found.</h2>;
  } else {
    inner = () => (
      <MediumWall
        media={media}
        onMediaChange={changeWrapper}
        onPaginationChange={setPaginationParams}
      />
    );
  }

  return inner();
};

export { Album };
export default Album;
