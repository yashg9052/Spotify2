import AlbumCard from "../components/AlbumCard";
import { Layout } from "../components/Layout";
import { useSongData } from "../context/SongContext";
export const Home = () => {
  const { albums, songs } = useSongData();
  return (
    <div>
      <Layout>
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>

          <div className="flex overflow-auto">
            {albums?.map((e, i) => {
              return (
                <AlbumCard
                  key={i}
                  image={e.thumbnail}
                  name={e.title}
                  desc={e.description}
                  id={e.id}
                />
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Today's Biggest Hits</h1>

          <div className="flex overflow-auto">
            {albums?.map((e, i) => {
              return (
                <AlbumCard
                  key={i}
                  image={e.thumbnail}
                  name={e.title}
                  desc={e.description}
                  id={e.id}
                />
              );
            })}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
