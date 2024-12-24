import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Square } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/Card/Card';
import classNames from "classnames/bind";
import styles from "./video.module.scss";

const cx = classNames.bind(styles);

interface VideoStreamingProps {
    backendUrl?: string;
    onStreamToggle?: (isStreaming: boolean) => void;
}

const VideoStreaming: React.FC<VideoStreamingProps> = ({
    backendUrl = 'http://localhost:5000',
    onStreamToggle
}) => {
    const [isStreaming, setIsStreaming] = useState(false);

    const toggleStream = () => {
        const newStreamingState = !isStreaming;
        setIsStreaming(newStreamingState);
        onStreamToggle?.(newStreamingState);
    };

    return (
        <div className={cx('video-streaming')}>
            <div className={cx('stream-controls')}>
                <button
                    onClick={toggleStream}
                    className={cx({ streaming: isStreaming, 'not-streaming': !isStreaming })}
                >
                    {isStreaming ? (
                        <>
                            <Square className={cx('icon')} />
                            <span>Stop Camera</span>
                        </>
                    ) : (
                        <>
                            <Play className={cx('icon')} />
                            <span>Start Camera</span>
                        </>
                    )}
                </button>
            </div>

            <div className={cx('grid-container')}>
                <div className={cx('card')}>
                    <CardHeader className={cx('card-header')}>
                        <CardTitle className={cx('card-title')}>Hand Gesture Recognition</CardTitle>
                    </CardHeader>
                    <CardContent className={cx('card-content')}>
                        <div className={cx('video-container')}>
                            {isStreaming ? (
                                <div className={cx('video-wrapper')}>
                                    <Image 
                                        src={`${backendUrl}/video_feed`}
                                        alt="Processed Video Feed"
                                        fill
                                        className={cx('video-feed')}
                                        unoptimized
                                        priority 
                                    />
                                </div>
                            ) : (
                                <div className={cx('camera-off')}>
                                    Camera is off
                                </div>
                            )}
                        </div>
                    </CardContent>
                </div>

                <div className={cx('card')}>
                    <CardHeader className={cx('card-header')}>
                        <CardTitle className={cx('card-title')}>Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent className={cx('card-content')}>
                        <div className={cx('debug-info')}>
                            <div className={cx('info-row')}>
                                <span className={cx('label')}>Status:</span>
                                <span className={cx('value', { connected: isStreaming, disconnected: !isStreaming })}>
                                    {isStreaming ? "Connected" : "Disconnected"}
                                </span>
                            </div>
                            <div className={cx('info-row')}>
                                <span className={cx('label')}>Backend URL:</span>
                                <span className={cx('value', 'url')}>{backendUrl}</span>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </div>
        </div>
    );
};

export default VideoStreaming;