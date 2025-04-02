// Import React hooks for state and side effects
import { useState, useEffect } from 'react';
// Import routing components from React Router
import { Routes, Route, Link } from 'react-router-dom';
// Import the MovieDetail component for the detail page
import MovieDetail from './MovieDetail';
// Import global styles
import './index.css';

// Define the main App component
function App() {
  // State to store the list of movies fetched from the backend
  const [movies, setMovies] = useState([]);
  // State to track loading status during fetch
  const [loading, setLoading] = useState(true);
  // State to toggle dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for new movie form inputs
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    status: 'unwatched',
    poster_path: ''
  });

  // Effect to fetch movies from the backend on component mount
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

  // Effect to toggle the 'dark' class on the body for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new movie
  const handleAddMovie = (e) => {
    e.preventDefault();
    fetch('http://localhost:3020/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie)
    })
      .then(response => response.json())
      .then(data => {
        setMovies(prev => [...prev, data]); // Add new movie to state
        setNewMovie({ title: '', director: '', year: '', status: 'unwatched', poster_path: '' }); // Reset form
      })
      .catch(error => console.error('Error adding movie:', error));
  };

  // Handle deleting a movie
  const handleDeleteMovie = (id) => {
    fetch(`http://localhost:3020/movies/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setMovies(prev => prev.filter(movie => movie.id !== id)); // Remove movie from state
        }
      })
      .catch(error => console.error('Error deleting movie:', error));
  };

  // Render a loading state while fetching data
  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Movie Watchlist</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Movie Watchlist</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Form to add a new movie */}
      <form onSubmit={handleAddMovie} className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="title"
            value={newMovie.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="director"
            value={newMovie.director}
            onChange={handleInputChange}
            placeholder="Director"
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="year"
            value={newMovie.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={newMovie.status}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="watched">Watched</option>
            <option value="unwatched">Unwatched</option>
          </select>
          <input
            type="text"
            name="poster_path"
            value={newMovie.poster_path}
            onChange={handleInputChange}
            placeholder="Poster Path (e.g., /abc123.jpg)"
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Movie
        </button>
      </form>

      <Routes>
        <Route
          path="/"
          element={
            <ul className="space-y-4">
              {movies.length === 0 ? (
                <li>No movies found</li>
              ) : (
                movies.map(movie => (
                  <li key={movie.id} className="flex items-center p-4 bg-blue-50 dark:bg-gray-800 rounded shadow">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                      alt={movie.title}
                      className="w-16 h-24 max-w-16 max-h-24 object-cover rounded mr-4"
                    />
                    <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline flex-1">
                      {movie.title}
                    </Link>
                    {/* Delete button for each movie */}
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
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