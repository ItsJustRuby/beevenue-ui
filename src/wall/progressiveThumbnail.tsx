import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SpeedTaggingItem } from "./speedTaggingItem";
import CONFIG from "../config";
import { useBeevenueSelector } from "../redux/selectors";
import { MimeType } from "detail/media";

interface Medium {
  id: number;
  hash: string;
  mimeType: MimeType;
}

interface ThumbContainerProps {
  mimeType: MimeType;
  className: string;
  src: string;
}

const ThumbContainer = (props: ThumbContainerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);

  if (!props.mimeType.startsWith("video/") && props.mimeType !== "image/gif") {
    return (
      <div className="beevenue-thumb-container">
        <img width="50vw" className={props.className} src={props.src} />
      </div>
    );
  }

  const onMouseEnter = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setIsMouseInside(true);
  };

  const onMouseLeave = () => {
    setIsMouseInside(false);
  };

  const videoSrc = props.src.replace(".jpg", ".mp4");

  let videoClassName = props.className;
  if (isMouseInside) {
    videoClassName += " is-hovered";
  }

  return (
    <div
      className="beevenue-thumb-container"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img className={props.className} src={props.src} width="50vw" />
      <video
        className={videoClassName}
        preload="none"
        src={videoSrc}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        ref={videoRef}
      />
    </div>
  );
};

interface ProgressiveThumbnailProps {
  src?: string;
  medium: Medium;
}

const ProgressiveThumbnail = (props: ProgressiveThumbnailProps) => {
  const isSpeedTagging = useBeevenueSelector(
    (store) => store.speedTagging.isSpeedTagging
  );

  const [doBlur, setDoBlur] = useState(true);
  const [src, setSrc] = useState(props.src!);

  const isMounted = useRef(true);

  const thumbnailSize = useBeevenueSelector(
    (state) => state.client.thumbnailSize
  );

  useEffect(() => {
    new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img.src);
      };

      img.src = `${CONFIG.backendUrl}/thumbs/${props.medium.hash}.${thumbnailSize}.jpg`;
    }).then((resSrc: any) => {
      if (!isMounted.current) return;
      setSrc(resSrc);
      setDoBlur(false);
      isMounted.current = false;
    });

    return () => {
      isMounted.current = false;
    };
  }, [props.medium.hash, thumbnailSize]);

  let className = "beevenue-thumb";
  if (doBlur) {
    className = `${className} beevenue-tiny-thumb`;
  }

  const thumbContainer = (
    <ThumbContainer
      src={src}
      className={className}
      mimeType={props.medium.mimeType}
    />
  );

  if (isSpeedTagging) {
    const innerProps = {
      ...props.medium,
    };

    return (
      <SpeedTaggingItem {...innerProps}>{thumbContainer}</SpeedTaggingItem>
    );
  }

  return (
    <Link
      to={`/show/${props.medium.id}`}
      aria-label={`medium-${props.medium.id}`}
    >
      {thumbContainer}
    </Link>
  );
};

export { ProgressiveThumbnail };
