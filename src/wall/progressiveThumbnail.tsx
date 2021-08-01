import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SpeedTaggingItem } from "./speedTaggingItem";
import { backendUrl } from "../config.json";
import { useBeevenueSelector } from "../redux/selectors";

interface Medium {
  id: number;
  hash: string;
}

interface ProgressiveThumbnailProps {
  src?: string;
  medium: Medium;
}

const ProgressiveThumbnail = (props: ProgressiveThumbnailProps) => {
  const isSpeedTagging = useBeevenueSelector(
    store => store.speedTagging.isSpeedTagging
  );

  const [doBlur, setDoBlur] = useState(true);
  const [src, setSrc] = useState(props.src!);

  const isMounted = useRef(true);

  const thumbnailSize = useBeevenueSelector(state => state.client.thumbnailSize);

  useEffect(() => {
    new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img.src);
      };

      img.src = `${backendUrl}/thumbs/${props.medium.hash}.${thumbnailSize}.jpg`;
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

  if (isSpeedTagging) {
    const innerProps = {
      ...props.medium
    };

    return (
      <SpeedTaggingItem {...innerProps}>
        <div className="beevenue-thumb-container">
          <img width="50vw" className={className} src={src} />
        </div>
      </SpeedTaggingItem>
    );
  }

  return (
    <Link to={`/show/${props.medium.id}`}>
      <div className="beevenue-thumb-container">
        <img width="50vw" className={className} src={src} />
      </div>
    </Link>
  );
};

export { ProgressiveThumbnail };
