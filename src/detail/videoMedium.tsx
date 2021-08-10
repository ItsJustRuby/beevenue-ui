import {
  DetailedHTMLProps,
  useCallback,
  useState,
  VideoHTMLAttributes,
} from "react";
import { useFullscreenOnGlobalHotkey } from "./hotkeys";
import { mediaSource, MediumContext } from "./media";

const VideoMedium = (props: MediumContext) => {
  const [hasFocus, setHasFocus] = useState(false);
  const fullscreenRef = useFullscreenOnGlobalHotkey<any>("f");

  const onMouseEnter = useCallback(() => {
    setHasFocus(true);
  }, [setHasFocus]);

  const onMouseLeave = useCallback(() => {
    setHasFocus(false);
  }, [setHasFocus]);

  const extraProps: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > = {};
  if (hasFocus) {
    extraProps.controls = true;
  }

  return (
    <video
      autoPlay={true}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      playsInline
      preload="auto"
      loop
      src={mediaSource(props)}
      {...extraProps}
      ref={fullscreenRef}
    />
  );
};

export { VideoMedium };
