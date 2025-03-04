import React, { useState } from "react";
import Image from "next/image";
import { Play, Square, ToggleLeft, ToggleRight } from "lucide-react";
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
  const [isCardActive, setIsCardActive] = useState(false);
  const [isWordMode, setIsWordMode] = useState(true);

  const toggleStream = () => {
    const newStreamingState = !isStreaming;
    setIsStreaming(newStreamingState);
    onStreamToggle?.(newStreamingState);
  };

  const toggleCardShadow = () => {
    setIsCardActive((prevState) => !prevState);
  };

  const toggleMode = () => {
    setIsWordMode((prevMode) => !prevMode);
  };

  return (
    <div className={cx("video-streaming")}>
      <div className={cx("stream-controls")} style={{ flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={() => {
            toggleStream();
            toggleCardShadow();
          }}
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
        <button onClick={toggleMode} className={cx("toggle-button")}>
          {isWordMode ? (
            <>
              <ToggleRight className={cx("icon")} />
              <span>Switch to Letter Mode</span>
            </>
          ) : (
            <>
              <ToggleLeft className={cx("icon")} />
              <span>Switch to Word Mode</span>
            </>
          )}
        </button>
      </div>
      <div className={cx("card", { active: isCardActive })}>
        <div className={cx("card-content")}>
          <div className={cx("video-container")}>
            {isStreaming ? (
              <div className={cx("video-wrapper")}>
                <Image
                  src={`${backendUrl}/${isWordMode ? "video_feed_word" : "video_feed_letter"}`}
                  alt="Processed Video Feed"
                  fill
                  className={cx("video-feed")}
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div className={cx("camera-off", "text-color")}>
                Camera is off
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStreaming;