import { MediumProps } from "./mediumProps";
import { SimilarMedia } from "./similarMedia";
import { mediaSource } from "./media";
import { useState } from "react";
import { useEffect } from "react";
import { VideoMedium } from "./videoMedium";
import { useFullscreenOnGlobalHotkey } from "./hotkeys";

const Medium = (props: MediumProps) => {
  let kind = "";

  const [fitHeight, setFitHeight] = useState<boolean>(true);
  const [mediumClass, setMediumClass] = useState<string>("beevenue-medium");
  const fullscreenRef = useFullscreenOnGlobalHotkey<any>("f");

  const onClick = () => {
    if (kind !== "image") {
      return;
    }
    setFitHeight((f) => !f);
  };

  let innerComponent;
  switch (props.mimeType) {
    case "video/mp4":
    case "video/webm":
    case "video/x-matroska":
      kind = "video";
      innerComponent = (
        <VideoMedium hash={props.hash} mimeType={props.mimeType} />
      );
      break;
    case "image/jpeg":
    case "image/jpg":
    case "image/gif":
    case "image/png":
      kind = "image";
      innerComponent = (
        <img ref={fullscreenRef} src={mediaSource(props)} onClick={onClick} />
      );
      break;
  }

  useEffect(() => {
    if (fitHeight) {
      setMediumClass((c) => `${c} beevenue-MediumContainer-Medium--fit`);
    } else {
      setMediumClass("beevenue-MediumContainer-Medium");
    }
  }, [fitHeight]);

  return (
    <>
      <div className="beevenue-MediumContainer">
        <div className={mediumClass} aria-label="medium">
          {innerComponent}
        </div>
      </div>
      <SimilarMedia media={props.similar} />
    </>
  );
};

export { Medium };
