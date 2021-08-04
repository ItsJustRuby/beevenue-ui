import React from "react";
import { MissingTags } from "./missingTags";
import { PickAlternateThumbnailWidget } from "./pickAlternateThumbnailWidget";
import { ReplaceMediumWidget } from "./replaceMediumWidget";
import { MediumDeleteButton } from "./mediumDeleteButton";
import { RegenerateThumbnailButton } from "./regenerateThumbnailButton";
import { TemporaryViewModel } from "./immediateUpdateReducer";

interface DetailPageAdminCardProps {
  viewModel: TemporaryViewModel;
  userIsAdmin: boolean;
}

const DetailPageAdminCard = (props: DetailPageAdminCardProps) => {
  const { viewModel, userIsAdmin } = props;

  return userIsAdmin ? (
    <>
      <MissingTags
        id={viewModel.id}
        isCanonical={viewModel.isCanonical}
        tags={viewModel.tags}
        rating={viewModel.rating}
      />
      <PickAlternateThumbnailWidget
        id={viewModel.id}
        mimeType={viewModel.mimeType}
      />
      <ReplaceMediumWidget id={viewModel.id} />

      <div className="card beevenue-sidebar-card">
        <div className="card-content">
          <div className="content">
            <MediumDeleteButton id={viewModel.id} />
            <RegenerateThumbnailButton id={viewModel.id} />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export { DetailPageAdminCard };
