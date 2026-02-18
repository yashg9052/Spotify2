import React from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserdata } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlaylist, isAuth } = useUserdata();

  const { setSelectedSong, setIsplaying } = useSongData();

  const saveToPlayListHanlder = () => {
    addToPlaylist(id);
  };
  return (
    <div className="min-w-[180px] sm:min-w-[200px] p-3 rounded-lg cursor-pointer hover:bg-[#ffffff14] transition">
  <div className="relative group">
    
    {/* Fixed Thumbnail Container */}
    <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] overflow-hidden rounded-lg">
      <img
        src={image ? image : "/download.jpeg"}
        alt={name}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>

    {/* Buttons */}
    <button
      className="absolute bottom-3 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-105"
      onClick={() => {
        setSelectedSong(id);
        setIsplaying(true);
      }}
    >
      <FaPlay />
    </button>

    {isAuth && (
      <button
        className="absolute bottom-3 right-3 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-105"
        onClick={saveToPlayListHanlder}
      >
        <FaBookmark />
      </button>
    )}
  </div>

  <p className="font-semibold mt-3 text-white truncate">{name}</p>
  <p className="text-slate-400 text-sm truncate">
    {desc}
  </p>
</div>

  );
};

export default SongCard;
