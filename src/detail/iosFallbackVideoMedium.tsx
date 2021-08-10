import React from "react";

import videoJs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import { mediaSource } from "./media";
import { MediumProps } from "./mediumProps";

const IOSFallback = (props: MediumProps) => {
  const videoRef = React.useRef(null);

  const VideoHtml = () => (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );

  React.useEffect(() => {
    const options: VideoJsPlayerOptions = {
      autoplay: true,
      controls: true,
      fluid: true,
      responsive: true,
      loop: true,
      preload: "auto",
      sources: [{ src: mediaSource(props), type: props.mimeType }],
    };

    const videoElement = videoRef.current;
    let player: VideoJsPlayer;
    if (videoElement) {
      player = videoJs(videoElement, options);
    }
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [props]);

  return <VideoHtml />;
};

export { IOSFallback };
export default IOSFallback;
