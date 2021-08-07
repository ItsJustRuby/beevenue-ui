import React from "react";

import { MediumProps } from "./mediumProps";
import { SimilarMedia } from "./similarMedia";
import { mediaSource } from "./media";
import { useState } from "react";
import { useEffect } from "react";

const Medium = (props: MediumProps) => {
  let kind = "";

  let innerComponent;
  switch (props.mimeType) {
    case "video/mp4":
    case "video/webm":
    case "video/x-matroska":
      kind = "video";
      innerComponent = (
        <video autoPlay={true} controls loop src={mediaSource(props)} />
      );
      break;
    case "image/jpeg":
    case "image/jpg":
    case "image/gif":
    case "image/png":
      kind = "image";
      innerComponent = <img src={mediaSource(props)} />;
      break;
  }

  const [fitHeight, setFitHeight] = useState<boolean>(true);
  const [mediumClass, setMediumClass] = useState<string>("beevenue-medium");

  const onClick = () => {
    if (kind !== "image") {
      return;
    }
    setFitHeight((f) => !f);
  };

  useEffect(() => {
    if (fitHeight) {
      setMediumClass((c) => `${c} beevenue-MediumContainer-Medium--fit`);
    } else {
      setMediumClass("beevenue-MediumContainer-Medium");
    }
  }, [fitHeight]);

  return (
    <>
      <div className="beevenue-MediumContainer" onClick={onClick}>
        <div className={mediumClass} aria-label="medium">
          {innerComponent}
        </div>
      </div>
      <SimilarMedia media={props.similar} />
    </>
  );
};

export { Medium };
