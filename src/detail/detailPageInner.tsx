import React from "react";
import "bulma-tagsinput/dist/css/bulma-tagsinput.min.css";
import "react-tagsinput/react-tagsinput.css";

import { ShowViewModel } from "api/show";
import { useBeevenueSelector } from "redux/selectors";
import { Medium } from "./medium";
import { DetailPageOtpLinks } from "./detailPageOtpLinks";
import { DetailPageTagsCard } from "./detailPageTagsCard";
import { DetailPageRatingCard } from "./detailPageRatingCard";
import { DetailPageAdminCard } from "./detailPageAdminCard";
import { ImmediateUpdate, useImmediateUpdates } from "./immediateUpdateReducer";
import { useClosePageOnSfw } from "hooks/closePageOnSfw";
import { useRefreshOnSfwChange } from "hooks/refreshOnSfwChange";
import { useEffect } from "react";

interface DetailPageInnerProps {
  initialViewModel: ShowViewModel;
}

export interface ExtendedShowViewModel extends ShowViewModel {
  isValidated: boolean;
}

export const ImmediateUpdateDispatch =
  React.createContext<React.Dispatch<ImmediateUpdate> | null>(null);

const DetailPageInner = (props: DetailPageInnerProps) => {
  const loggedInRole = useBeevenueSelector((store) => store.login.loggedInRole);
  const userIsAdmin = loggedInRole === "admin";

  const { currentViewModel, dispatch } = useImmediateUpdates(
    props.initialViewModel
  );

  useEffect(() => {
    dispatch({
      action: "overwrite",
      payload: props.initialViewModel,
    });
  }, [props.initialViewModel, dispatch]);

  useClosePageOnSfw(currentViewModel);
  useRefreshOnSfwChange(currentViewModel.id, dispatch);

  const { hash, mimeType, rating, similar } = currentViewModel;
  const mediumProps = { hash, mimeType, similar };

  return (
    <>
      <ImmediateUpdateDispatch.Provider value={dispatch}>
        <Medium {...mediumProps} />
        <DetailPageTagsCard
          {...{
            isAbsentTags: false,
            tags: currentViewModel.tags,
            userIsAdmin,
          }}
        />
        <DetailPageTagsCard
          {...{
            isAbsentTags: true,
            tags: currentViewModel.absentTags,
            userIsAdmin,
          }}
        />
        <DetailPageRatingCard rating={rating} userIsAdmin={userIsAdmin} />
        <DetailPageOtpLinks
          mimeType={currentViewModel.mimeType}
          id={currentViewModel.id}
        />
        <DetailPageAdminCard
          {...{ viewModel: currentViewModel, userIsAdmin }}
        />
      </ImmediateUpdateDispatch.Provider>
    </>
  );
};

export { DetailPageInner };
