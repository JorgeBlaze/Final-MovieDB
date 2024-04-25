document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const movieList = document.getElementById('movieList');

    const fetchMoviesByTerm = async (term) => {
        try {
            const response = await fetch(`http://localhost:8000/movies/search/?term=${term}`);
            if (!response.ok) {
                const errorMessage = await response.text(); // Get the error message from the response
                throw new Error(`Server responded with status ${response.status}: ${errorMessage}`);
            }
    
            const movies = await response.json();
            console.log('Fetched movies:', movies);
    
            movieList.innerHTML = ''; // Clear previous movie list
    
            movies.forEach(movie => {
                renderMovieItem(movie);
            });
        } catch (error) {
            console.error('Error fetching movies:', error.message);
        }
    };
    

    const renderMovieItem = (movie) => {
        const movieItem = document.createElement('div');
        movieItem.innerHTML = `
            <div>
                <strong>${movie.name} (${movie.year}) - ${movie.runtime} minutes</strong>
            </div>
        `;
        movieList.appendChild(movieItem);
    };

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        if (searchTerm) {
            fetchMoviesByTerm(searchTerm);
        }
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value;
            if (searchTerm) {
                fetchMoviesByTerm(searchTerm);
            }
        }
    });
});
