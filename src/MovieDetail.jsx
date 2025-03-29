// Import React hooks for state and side effects
import { useState, useEffect } from 'react';
// Import useParams for route parameters and Link for navigation
import { useParams, Link } from 'react-router-dom';

// Define the MovieDetail component for displaying a single movie
function MovieDetail() {
  // State to store the movie data fetched from the backend
  const [movie, setMovie] = useState(null);
  // State to track loading status during fetch
  const [loading, setLoading] = useState(true);
  // Extract the movie ID from the URL parameters
  const { id } = useParams();

  // Effect to fetch movie details when the ID changes
  useEffect(() => {
    // Fetch movie data from the backend using the ID
    fetch(`http://localhost:3020/movies/${id}`)
      .then(response => response.json()) // Parse JSON response
      .then(data => {
        setMovie(data); // Update movie state with fetched data
        setLoading(false); // Set loading to false once data is received
      })
      .catch(error => {
        console.error('Error fetching movie:', error); // Log any fetch errors
        setLoading(false); // Stop loading even if there’s an error
      });
  }, [id]); // Runs when the ID changes (e.g., navigating to a different movie)

  // Render a loading state while fetching data
  if (loading) {
    return <div className="p-6 text-center text-gray-800 dark:text-white">Loading...</div>;
  }

  // Handle cases where the movie isn’t found or an error occurred
  if (!movie || movie.error) {
    return <div className="p-6 text-center text-red-500">Movie not found</div>;
  }

  // Main render with movie details and poster
  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-blue-50 dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Display the movie poster or a placeholder if no poster_path exists */}
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={movie.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{movie.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1"><strong>Director:</strong> {movie.director}</p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1"><strong>Year:</strong> {movie.year}</p>
          {/* Display status with conditional color based on watched/unwatched */}
          <p className="text-lg text-gray-600 dark:text-gray-300">
            <strong>Status:</strong>{' '}
            <span className={movie.status === 'watched' ? 'text-green-500' : 'text-yellow-500'}>
              {movie.status}
            </span>
          </p>
          {/* Link back to the movie list */}
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}

// Export the MovieDetail component as the default export
export default MovieDetail;