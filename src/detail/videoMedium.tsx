import {
  DetailedHTMLProps,
  useCallback,
  useState,
  VideoHTMLAttributes,
} from "react";
import { useFullscreenOnGlobalHotkey } from "./hotkeys";
import { mediaSource } from "./media";
import { MediumProps } from "./mediumProps";

const VideoMedium = (props: MediumProps) => {
  const [hasFocus, setHasFocus] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHasFocus(true);
  }, [setHasFocus]);

  const onMouseLeave = useCallback(() => {
    setHasFocus(false);
  }, [setHasFocus]);

  const selfRef = useFullscreenOnGlobalHotkey<HTMLVideoElement>("f");

  const extraProps: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > = {};
  if (hasFocus) {
    extraProps.controls = true;
  }

  return (
    <video
      ref={selfRef}
      autoPlay={true}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      playsInline
      preload="auto"
      loop
      src={mediaSource(props)}
      {...extraProps}
    />
  );
};

export { VideoMedium };
