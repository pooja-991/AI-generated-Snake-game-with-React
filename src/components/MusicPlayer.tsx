import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "NEURAL_NET_LULLABY.WAV",
    artist: "AI_CONSTRUCT_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CYBER_OVERDRIVE.MP3",
    artist: "GHOST_IN_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "SYNTH_DREAMS.FLAC",
    artist: "ALGO_7",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md border-glitch bg-black/90 p-6 flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan/10 blur-3xl rounded-full -ml-10 -mb-10 pointer-events-none"></div>

      <div className="flex justify-between items-center border-b border-cyan/30 pb-2">
        <h3 className="text-cyan text-xl tracking-widest glitch" data-text="AUD_SYS_V.9">AUD_SYS_V.9</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-none ${isPlaying ? 'bg-magenta animate-pulse' : 'bg-cyan/30'}`}></div>
          <span className="text-xs text-cyan/70">{isPlaying ? 'TX_ACTIVE' : 'IDLE'}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-magenta text-lg truncate" title={currentTrack.title}>
          &gt; {currentTrack.title}
        </div>
        <div className="text-cyan/70 text-sm">
          SRC: {currentTrack.artist}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-900 relative mt-2 border border-cyan/20">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={toggleMute}
          className="text-cyan hover:text-magenta transition-colors p-2"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="text-cyan hover:text-magenta transition-colors p-2 border border-transparent hover:border-magenta"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-black bg-cyan hover:bg-magenta transition-colors p-3 rounded-none border-2 border-cyan hover:border-magenta"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan hover:text-magenta transition-colors p-2 border border-transparent hover:border-magenta"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="text-cyan/50 text-xs font-mono">
          SEC {currentTrackIndex + 1}/{TRACKS.length}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
    </div>
  );
}
