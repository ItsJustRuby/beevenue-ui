import React from "react";
import { ShowViewModel } from "api/show";
import { useBeevenueSelector } from "redux/selectors";
import { Medium } from "./medium";
import { DetailPageTagsCard } from "./detailPageTagsCard";
import { DetailPageRatingCard } from "./detailPageRatingCard";
import { DetailPageAdminCard } from "./detailPageAdminCard";
import { ImmediateUpdate, useImmediateUpdates } from "./immediateUpdateReducer";

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
        <DetailPageAdminCard
          {...{ viewModel: currentViewModel, userIsAdmin }}
        />
      </ImmediateUpdateDispatch.Provider>
    </>
  );
};

export { DetailPageInner };
