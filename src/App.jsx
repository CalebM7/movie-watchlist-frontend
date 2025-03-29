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

  // Effect to fetch movies from the backend on component mount
  useEffect(() => {
    // Fetch movies from the local API endpoint
    fetch('http://localhost:3020/movies')
      .then(response => response.json()) // Parse JSON response
      .then(data => {
        setMovies(data); // Update movies state with fetched data
        setLoading(false); // Set loading to false once data is received
      })
      .catch(error => {
        console.error('Error fetching movies:', error); // Log any fetch errors
        setLoading(false); // Stop loading even if there’s an error
      });
  }, []); // Empty dependency array means this runs once on mount

  // Effect to toggle the 'dark' class on the body for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark'); // Add 'dark' class when isDarkMode is true
    } else {
      document.body.classList.remove('dark'); // Remove 'dark' class when false
    }
  }, [isDarkMode]); // Runs whenever isDarkMode changes

  // Render a loading state while fetching data
  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Movie Watchlist</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // Main render with movie list and routing
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Movie Watchlist</h1>
        {/* Button to toggle dark/light mode */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)} // Toggle isDarkMode state on click
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'} {/* Text changes based on mode */}
        </button>
      </div>
      {/* Define routes for the app */}
      <Routes>
        {/* Route for the movie list page */}
        <Route
          path="/"
          element={
            <ul className="space-y-4">
              {/* Conditional rendering based on movies array */}
              {movies.length === 0 ? (
                <li>No movies found</li> // Show if no movies exist
              ) : (
                // Map over movies to create a list item for each
                movies.map(movie => (
                  <li key={movie.id} className="flex items-center p-4 bg-blue-50 dark:bg-gray-800 rounded shadow">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded mr-4"
                    />
                    {/* Link to the movie’s detail page */}
                    <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">
                      {movie.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          }
        />
        {/* Route for individual movie detail pages */}
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </div>
  );
}

// Export the App component as the default export
export default App;