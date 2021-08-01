import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import { Api } from "api";
import { ShowViewModel, Rating } from "../api/show";
import { Medium } from "./medium";
import { useDispatch } from "react-redux";
import { addNotLoggedInNotification, setTitle } from "../redux/actions";
import pick from "lodash-es/pick";
import { BeevenueSpinner } from "../beevenueSpinner";

import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { DetailPageTagsCard } from "./detailPageTagsCard";
import { DetailPageRatingCard } from "./detailPageRatingCard";
import { DetailPageAdminCard } from "./detailPageAdminCard";
import { forceRedirect } from "../redirect";
import { useHistory } from "react-router-dom";

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
    store => store.search.searchQuery
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
          forceRedirect(history, `/search/${globalSearchTerms.replaceAll(" ", "/")}`);
        }
      }
    );
  }, [dispatch, globalSearchTerms, history, id, isSessionSfw, setViewModel]);

  return id;
};

const updateMedium = (
  setViewModel: (vm: ShowViewModel) => void,
  newViewModel: ShowViewModel
): void => {
  const params = pick(newViewModel, ["id", "absentTags", "tags", "rating"]);
  setViewModel(newViewModel);
  Api.Medium.update(params).then((res) => {
    setViewModel(res.data as ShowViewModel);
  });
};

const onChange = (
  viewModel: ShowViewModel | null,
  setViewModel: (vm: ShowViewModel) => void
) => {
  const cleanTags = (unclean: string[]) => {
    // Technically, the user can't manually enter these characters.
    // However, by pasting them, they can still occur in here.
    return unclean.map(s => s.replace(/[\t\r\n ]/g, ""));
  }

  const tagChangeHelper = (setter: ((vm: ShowViewModel, tags: string[]) => void)) => {
    const f = (tags: string[]) => {
      const cleanedTags = cleanTags(tags);
      const newViewModel = { ...viewModel } as ShowViewModel;
      setter(newViewModel, cleanedTags);
      updateMedium(setViewModel, newViewModel);
    }
    return f;
  }

  const onTagsChange = tagChangeHelper((vm, t) => { vm.tags = t});
  const onAbsentTagsChange = tagChangeHelper((vm, t) => { vm.absentTags = t});

  const onRatingChange = (value: string) => {
    const newRating = value as Rating;
    if (!newRating) return;

    const newViewModel = { ...viewModel } as ShowViewModel;
    newViewModel.rating = newRating;
    updateMedium(setViewModel, newViewModel);
  };
  return { onAbsentTagsChange, onTagsChange, onRatingChange };
};

const useSetup = () => {
  const [viewModel, setViewModel] = useState<ShowViewModel | null>(null);
  const id = useRefreshOnUpdate(setViewModel);
  useClosePageOnSfw(viewModel);

  const { onAbsentTagsChange, onTagsChange, onRatingChange } = onChange(viewModel, setViewModel);
  return { viewModel, setViewModel, id, onAbsentTagsChange, onTagsChange, onRatingChange };
};

const DetailPage = () => {
  const loggedInRole = useBeevenueSelector((store) => store.login.loggedInRole);
  const {
    viewModel,
    setViewModel,
    id,
    onAbsentTagsChange,
    onTagsChange,
    onRatingChange,
  } = useSetup();
  const userIsAdmin = loggedInRole === "admin";
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle(`${id}`));
  }, [dispatch, id]);

  let view;
  if (viewModel !== null) {
    view = (
      <>
        <Medium {...viewModel} />
        <DetailPageTagsCard {...{ className: "beevenue-medium-tags", tags: viewModel.tags, userIsAdmin, onTagsChange, placeholder: "Add tags" }} />
        <DetailPageTagsCard {...{ className: "beevenue-medium-absent-tags", tags: viewModel.absentTags, userIsAdmin, onTagsChange: onAbsentTagsChange, placeholder: "Add absent tags" }} />
        <DetailPageRatingCard {...{ viewModel, userIsAdmin, onRatingChange }} />
        <DetailPageAdminCard
          {...{ viewModel, setViewModel, userIsAdmin, mediumId: id }}
        />
      </>
    );
  } else {
    view = <BeevenueSpinner />;
  }

  return <div className="beevenue-show-page">{view}</div>;
};

export { DetailPage };
export default DetailPage;
