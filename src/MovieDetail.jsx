import { useState, useEffect} from 'react';
// useParams grabs the id from the URL (e.g from /movies/1)
// Fetches http://localhost:3020/movies/:id and displays the movie’s details.
// Handles loading and errors (e.g., 404 from backend).

import { useParams } from 'react-router-dom';

function MovieDetail() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3020/movies/${id}`)
      .then(response => response.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  if (!movie || movie.error) {
    return <div className="p-6 text-center text-red-500">Movie not found</div>  
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{movie.title}</h1>
      <p className="text-lg text-gray-600 mb-2"><strong>Director:</strong> {movie.director}</p>
      <p className="text-lg text-gray-600"><strong>Year:</strong>{movie.year}</p>
      <p className="text-lg text-gray-600"><strong>Status:</strong> {movie.status}</p>
    </div>
  );
}

export default MovieDetail;