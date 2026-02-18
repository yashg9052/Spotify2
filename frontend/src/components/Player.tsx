import React, { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isplaying,
    setIsplaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isplaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsplaying(!isplaying);
    }
  };

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);
  return (
    <div>
      {song && (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          <div className="flex items-center gap-4 w-[220px] sm:w-[250px] md:w-[280px] flex-shrink-0 overflow-hidden">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded-md">
              <img
                src={song.thumbnail ? song.thumbnail : "/download.jpeg"}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden md:block overflow-hidden">
              <p className="text-sm font-semibold truncate">{song.title}</p>
              <p className="text-xs text-gray-400 truncate">
                {song.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 m-auto">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isplaying} />
            )}

            <div className="w-full items-center flex font-thin text-green-400">
              <input
                type="range"
                min={"0"}
                max={"100"}
                className="progress-bar w-[120px] md:w-[300px]"
                value={(progress / duration) * 100 || 0}
                onChange={durationChange}
              />
            </div>
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer" onClick={prevSong}>
                <GrChapterPrevious />
              </span>

              <button
                className="bg-white text-black rounded-full p-2 cursor-pointer"
                onClick={handlePlayPause}
              >
                {isplaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="cursor-pointer" onClick={nextSong}>
                <GrChapterNext />
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="range"
              className="w-16 md:w-32"
              min={"0"}
              max={"100"}
              step={"0.01"}
              value={volume * 100}
              onChange={volumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
