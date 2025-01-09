import React, { useState } from "react";
import Image from "next/image";
import { Play, Square } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./video.module.scss";

const cx = classNames.bind(styles);

interface VideoStreamingProps {
  backendUrl?: string;
  onStreamToggle?: (isStreaming: boolean) => void;
}

const VideoStreaming: React.FC<VideoStreamingProps> = ({
  backendUrl = "http://localhost:5000",
  onStreamToggle,
}) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const toggleStream = () => {
    const newStreamingState = !isStreaming;
    setIsStreaming(newStreamingState);
    onStreamToggle?.(newStreamingState);
  };

  return (
    <div className={cx("video-streaming")}>
      <div className={cx("stream-controls")}>
        <button
          onClick={toggleStream}
          className={cx({
            streaming: isStreaming,
            "not-streaming": !isStreaming,
          })}
        >
          {isStreaming ? (
            <>
              <Square className={cx("icon")} />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Play className={cx("icon")} />
              <span>Start Camera</span>
            </>
          )}
        </button>
      </div>
      <div className={cx("card")}>
        <div className={cx("card-content")}>
          <div className={cx("video-container")}>
            {isStreaming ? (
              <div className={cx("video-wrapper")}>
                <Image
                  src={`${backendUrl}/video_feed`}
                  alt="Processed Video Feed"
                  fill
                  className={cx("video-feed")}
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div className={cx("camera-off")}>Camera is off</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStreaming;
