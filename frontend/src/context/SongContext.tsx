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
  albums: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}
interface ISongContext {
  songs: Song[];
  song: Song | null;
  isplaying: boolean;
  setIsplaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setSelectedSong: (id: string) => void;
  albums: Album[];
  nextSong: () => void;
  prevSong: () => void;
  fetchSingleSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsongs: (id: string) => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchSongs: () => Promise<void>;
}
const SongContext = createContext<ISongContext | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setsongs] = useState<Song[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isplaying, setIsplaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const fetchSongs = useCallback(async () => {
    setloading(true);
    try {
      const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`);
      setsongs(data);
      if (data.length > 0) setSelectedSong(data[0].id.toString());
      setIsplaying(false);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    setloading(true);
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);
  const [song, setSong] = useState<Song | null>(null);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;

    try {
      const { data } = await axios.get<Song>(
        `${server}/api/v1/song/${selectedSong}`,
      );

      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);
  const [index, setIndex] = useState<number>(0);
  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id.toString());
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index == 0) {
      setIndex(songs?.length);
      setSelectedSong(songs[index - 1]?.id.toString());
    } else {
      setIndex((prev) => prev - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  const fetchAlbumsongs = useCallback(async (id: string) => {
    setloading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/v1/album/${id}`,
      );

      setAlbumData(data.album);
      setAlbumSong(data.songs);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    prevSong();
    nextSong();
  }, []);

  return (
    <>
      <SongContext.Provider
        value={{
          songs,
          selectedSong,
          isplaying,
          setIsplaying,
          setSelectedSong,
          loading,
          albums,
          song,
          nextSong,
          prevSong,
          fetchSingleSong,
          fetchAlbumsongs,
          albumData,
          albumSong,
          fetchAlbums,
          fetchSongs,
        }}
      >
        {children}
      </SongContext.Provider>
    </>
  );
};

export const useSongData = (): ISongContext => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("UseSongData must be within a Songprovider");
  }
  return context;
};
