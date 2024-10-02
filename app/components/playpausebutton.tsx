"use client"
import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<{ videoId: string|null }> = ({ videoId }) => {
  
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isPlay , setIsPlaying] = useState<boolean>(false);
  let player: any;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(playerRef.current, {
        videoId,
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    console.log('Player is ready');
  };

  const playVideo = () => {
    if (player) player.playVideo();
  };

  const pauseVideo = () => {
    if (player) player.pauseVideo();
  };

  const togglePlayPause = () => {
    if (isPlay) {
      pauseVideo();
    } else {
      playVideo();
    }
    setIsPlaying(!isPlay);
  };

  return (
    <div>
      <Button 
        onClick={togglePlayPause}
        variant="outline"
        size="icon"
        className="bg-gray-800 hover:bg-gray-700 text-gray-300">
        {isPlay ? ( <PauseIcon className="h-4 w-4" /> ) : (<PlayIcon className="h-4 w-4" />)}
      </Button>
    </div>
  );
};

export default YouTubePlayer;
