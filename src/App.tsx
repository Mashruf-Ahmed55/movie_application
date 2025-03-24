import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import Loader from './components/ui/Loader';
import Search from './components/ui/Search';

export interface MovieType {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface trandingMovieType {
  $id: string;
  $databaseId: string;
  $collectionId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  count: number;
  movie_id: number;
  poster_url: string;
  searchTerm: string;
}

axios.defaults.baseURL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState<trandingMovieType[]>([]);
  const [isError, setIsError] = useState('');
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const getData = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query
        ? `search/movie?query=${encodeURIComponent(query)}`
        : 'discover/movie?sort_by=popularity.desc';

      const response = await axios.get<{ results: MovieType[] }>(endpoint, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      setMovies(response.data.results || []);
      if (query && response.data.results.length > 0) {
        await updateSearchCount(query, response.data.results[0]);
      }
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const loadTrebingMovie = async () => {
    try {
      const movies = (await getTrendingMovies()) as trandingMovieType[];
      setTrendingMovies(movies || []);
      console.log(movies);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  };
  useEffect(() => {
    getData(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrebingMovie();
  }, []);
  return (
    <main className="pattern">
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassel
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt="" />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <p className="text-red-500">{isError}</p>
          ) : (
            <div className="movie_container">
              {movies.map((movie) => {
                return (
                  <div className="movie-card" key={movie.id}>
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : './no-movie.png'
                      }
                      alt=""
                    />
                    <div className="mt-4">
                      <h3>{movie.title}</h3>
                      <div className="content">
                        <div className="rating">
                          <img src="star.svg" alt="" />
                          <p>
                            {movie.vote_average
                              ? movie.vote_average.toFixed(1)
                              : 'N/A'}
                          </p>
                        </div>
                        <span>•</span>
                        <p className="lang">{movie.original_language}</p>
                        <span>•</span>
                        <p className="year">
                          {movie.release_date
                            ? movie.release_date.split('-')[0]
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
