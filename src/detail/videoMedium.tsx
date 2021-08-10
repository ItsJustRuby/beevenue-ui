import React from "react";

import { MediumProps } from "./mediumProps";
import { mediaSource } from "./media";
import { useBeevenueSelector } from "redux/selectors";

// Make sure that the js bundle which includes this
// huge dependency is only requested when it is actually needed
// for rendering.
const IOSFallback = React.lazy(() => import("./iosFallbackVideoMedium"));

const VideoMedium = (props: MediumProps) => {
  const os = useBeevenueSelector((state) => state.client.os);

  return os !== "iOS" ? (
    <video
      className="beevenue-VideoMedium"
      autoPlay={true}
      controls
      playsInline
      loop
      src={mediaSource(props)}
    />
  ) : (
    <IOSFallback {...props} />
  );
};

export { VideoMedium };
