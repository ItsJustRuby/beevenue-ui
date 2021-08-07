import React, { useState } from "react";
import { Api } from "api";
import { BeevenueSpinner } from "../beevenueSpinner";

const usePickCount = () => {
  const [pickCount, setPickCount] = useState(5);

  const pickCountSelect = (
    <div className="select">
      <select
        aria-label="medium-alternate-thumbnail-pick-count-select"
        defaultValue="5"
        value={pickCount}
        onChange={(e) => setPickCount(Number(e.currentTarget.value))}
      >
        <option>3</option>
        <option>5</option>
        <option>10</option>
      </select>
    </div>
  );

  return { pickCountSelect, pickCount };
};

const usePicks = (id: number, pickCount: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [picks, setPicks] = useState<string[] | null>(null);

  const onClick = () => {
    setIsLoading(true);
    Api.Medium.generateThumbnailPicks(id, pickCount).then((success) => {
      setIsLoading(false);
      setPicks(success.data.thumbs);
    });
  };

  const choosePick = (i: number) => {
    if (!picks) return;

    setIsLoading(true);
    Api.Medium.selectThumbnailPick(id, i, pickCount).then((success) => {
      setIsLoading(false);
      setPicks(null);
    });
  };

  const goButton = (
    <button
      aria-label="medium-alternate-thumbnail-go-button"
      className="button is-primary"
      onClick={(e) => onClick()}
    >
      Go
    </button>
  );

  return { goButton, picks, choosePick, isLoading };
};

const renderPicks = (picks: string[] | null, choosePick: (p: any) => void) => {
  if (!picks) {
    return null;
  }

  return (
    <div className="beevenue-picks">
      {picks.map((p: any, i: number) => {
        return (
          <img
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
  pickCountSelect: JSX.Element,
  goButton: JSX.Element,
  picks: string[] | null,
  choosePick: (p: any) => void
) => {
  if (isLoading) {
    return <BeevenueSpinner />;
  }

  return (
    <>
      <div>
        Generate&nbsp;
        {pickCountSelect}
        &nbsp;new thumbnails:&nbsp;
        {goButton}
      </div>
      <div>{renderPicks(picks, choosePick)}</div>
    </>
  );
};

interface PickAlternateThumbnailWidgetProps {
  id: number;
  mimeType: string;
}

const PickAlternateThumbnailWidget = (
  props: PickAlternateThumbnailWidgetProps
) => {
  const { pickCount, pickCountSelect } = usePickCount();
  const { goButton, picks, choosePick, isLoading } = usePicks(
    props.id,
    pickCount
  );

  if (!/^video/.test(props.mimeType)) {
    return null;
  }

  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Pick alternate thumbnail</p>
      </header>
      <div className="card-content">
        <div className="content">
          {renderContent(
            isLoading,
            pickCountSelect,
            goButton,
            picks,
            choosePick
          )}
        </div>
      </div>
    </div>
  );
};

export { PickAlternateThumbnailWidget };
