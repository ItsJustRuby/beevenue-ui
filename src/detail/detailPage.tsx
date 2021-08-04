import React, { useState, useEffect, useMemo } from "react";
import { useRouteMatch } from "react-router";

import { Api } from "api";
import { ShowViewModel } from "../api/show";
import { useDispatch } from "react-redux";
import { addNotLoggedInNotification, setTitle } from "../redux/actions";
import { BeevenueSpinner } from "../beevenueSpinner";

import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { forceRedirect } from "../redirect";
import { useHistory } from "react-router-dom";
import { DetailPageInner } from "./detailPageInner";

interface DetailPageParams {
  id: string;
}

const useClosePageOnSfw = (viewModel: ShowViewModel | null) => {
  const dispatch = useDispatch();
  const isSessionSfw = useIsSessionSfw();
  const history = useHistory();

  useEffect(() => {
    if (isSessionSfw && viewModel !== null) {
      if (viewModel.rating !== "s") {
        forceRedirect(history, "/");
      }
    }
  }, [history, isSessionSfw, viewModel, dispatch]);
};

const useRefreshOnUpdate = (setViewModel: (vm: ShowViewModel) => void) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isSessionSfw = useIsSessionSfw();

  const globalSearchTerms = useBeevenueSelector(
    (store) => store.search.searchQuery
  );

  const match = useRouteMatch<DetailPageParams>();
  const id = parseInt(match.params.id, 10);

  useEffect(() => {
    Api.Medium.show(id).then(
      (res) => {
        setViewModel(res.data as ShowViewModel);
      },
      (err) => {
        if (err.response.status === 401) {
          dispatch(addNotLoggedInNotification());
        }

        if (globalSearchTerms === "") {
          forceRedirect(history, "/");
        } else {
          forceRedirect(
            history,
            `/search/${globalSearchTerms.replaceAll(" ", "/")}`
          );
        }
      }
    );
  }, [dispatch, globalSearchTerms, history, id, isSessionSfw, setViewModel]);

  return id;
};

const useSetup = () => {
  const [initialViewModel, setInitialViewModel] =
    useState<ShowViewModel | null>(null);

  const id = useRefreshOnUpdate(setInitialViewModel);
  useClosePageOnSfw(initialViewModel);

  return { id, initialViewModel };
};

const DetailPage = () => {
  const { initialViewModel, id } = useSetup();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle(`${id}`));
  }, [dispatch, id]);

  const inner = useMemo(() => {
    if (initialViewModel === null) return null;
    return <DetailPageInner initialViewModel={initialViewModel} />;
  }, [initialViewModel]);

  let view;
  if (initialViewModel !== null) {
    view = inner;
  } else {
    view = <BeevenueSpinner />;
  }

  return <div className="beevenue-show-page">{view}</div>;
};

export { DetailPage };
export default DetailPage;
