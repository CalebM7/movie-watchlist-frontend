import { useState, useEffect } from 'react';
// Routes and Route define paths. /:List page. /movies/:id detail page
// Link is used to navigate between pages
import { Routes, Route, Link } from 'react-router-dom';
import MovieDetail from './MovieDetail';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3020/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Movie Watchlist</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Movie Watchlist</h1>
      <Routes>
        <Route
          path="/"
          element={
            <ul className="space-y-4">
              {movies.length === 0 ? (
                <li>No movies found</li>
              ) : (
                movies.map(movie => (
                  <li key={movie.id} className="p-4 bg-gray-100 rounded shadow">
                    <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">
                      {movie.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          }
        />
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </div>
  );
}

export default App;