import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useCallback,
} from "react";
const server = "http://localhost:8000";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}
interface ISongContext {
  songs: Song[];
}
const SongContext = createContext<ISongContext | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setsongs] = useState<Song[]>([]);
  const [loading,setloading]=useState<boolean>(true)
  const [selectedSong,setSelectedSong]=useState<string | null>(null)
  const[isplaying,setIsplaying]=useState<boolean>(false)
  const fetchSongs=useCallback(async()=>{
    setloading(true)
    try {
        const {data}=await axios.get<Song[]>(`${server}/api/v1/song/all`);
        setsongs(data)
        if(songs.length>0){
            setSelectedSong(data[0].id.toString())
            setIsplaying(false)
        }
    } catch (error) {
        console.log(error)
    }
    finally{
        setloading(false)
    }
  },[])
  useEffect(()=>{
    fetchSongs()
  },[])
  return (
    <>
      <SongContext.Provider value={{ songs }}>{children}</SongContext.Provider>
    </>
  );
};

export const useSongData=():ISongContext=>{
    const context = useContext(SongContext);
    if(!context){
        throw new Error ("UseSongData must be within a Songprovider")
    }
    return context
}
