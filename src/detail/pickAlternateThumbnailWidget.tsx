import React, { useState } from "react";
import { Api } from "api";
import { BeevenueSpinner } from "../beevenueSpinner";

const usePicks = (id: number, temporaryThumbnails: string[] | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [picks, setPicks] = useState<string[]>(temporaryThumbnails || []);

  const onClick = () => {
    setIsLoading(true);
    Api.Medium.generateThumbnailPicks(id).then((success) => {
      setIsLoading(false);

      setIsGeneratingThumbnails(true);
    });
  };

  const choosePick = (i: number) => {
    setIsLoading(true);
    Api.Medium.selectThumbnailPick(id, i).then((success) => {
      setIsLoading(false);
      setPicks([]);
    });
  };

  const goButton = (
    <button
      aria-label="medium-alternate-thumbnail-go-button"
      className="button is-primary"
      onClick={(e) => onClick()}
    >
      Generate new thumbnails
    </button>
  );

  const widgetContent =
    isGeneratingThumbnails || temporaryThumbnails === null ? (
      <p>
        New thumbnails are being generated! Refresh this page in a few minutes.
      </p>
    ) : (
      goButton
    );

  return { widgetContent, picks, choosePick, isLoading };
};

const renderPicks = (picks: string[], choosePick: (p: any) => void) => {
  if (picks.length === 0) {
    return null;
  }

  return (
    <div className="beevenue-ThumbnailPicks">
      {picks.map((p: any, i: number) => {
        return (
          <img
            className="beevenue-ThumbnailPicks-Item"
            key={`pick${i}`}
            aria-label={`medium-alternate-thumbnail-pick-${i}`}
            onClick={(_) => choosePick(i)}
            src={`data:image/png;base64, ${p}`}
          />
        );
      })}
    </div>
  );
};

const renderContent = (
  isLoading: boolean,
  widgetContent: JSX.Element,
  picks: string[],
  choosePick: (p: any) => void
) => {
  if (isLoading) {
    return <BeevenueSpinner />;
  }

  return (
    <>
      <div>{picks.length === 0 ? widgetContent : null}</div>
      <div>{renderPicks(picks, choosePick)}</div>
    </>
  );
};

interface PickAlternateThumbnailWidgetProps {
  id: number;
  mimeType: string;
  temporaryThumbnails: string[] | null;
}

const PickAlternateThumbnailWidget = (
  props: PickAlternateThumbnailWidgetProps
) => {
  const { widgetContent, picks, choosePick, isLoading } = usePicks(
    props.id,
    props.temporaryThumbnails
  );

  if (!/^video/.test(props.mimeType)) {
    return null;
  }

  return (
    <div className="card beevenue-ShowPage-Card">
      <header className="card-header">
        <p className="card-header-title">Pick alternate thumbnail</p>
      </header>
      <div className="card-content">
        <div className="content">
          {renderContent(isLoading, widgetContent, picks, choosePick)}
        </div>
      </div>
    </div>
  );
};

export { PickAlternateThumbnailWidget };
