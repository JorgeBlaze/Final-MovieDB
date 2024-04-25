document.addEventListener('DOMContentLoaded', () => {
    const addMovieForm = document.getElementById('addMovieForm');
    const movieList = document.getElementById('movieList');

    // Function to fetch movies from the backend and display them
    const fetchMovies = async () => {
        try {
            console.log('Fetching movies...'); // Log fetching movies
            const response = await fetch('http://localhost:8000/movies/');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            
            const movies = await response.json();
            console.log('Fetched movies:', movies); // Log fetched movies
            
            movieList.innerHTML = ''; // Clear previous movie list

            movies.forEach(movie => {
                renderMovieItem(movie);
            });
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    // Function to render a movie item
    const renderMovieItem = (movie) => {
        const movieItem = document.createElement('div');
        movieItem.innerHTML = `
            <div>
                <strong>${movie.name} (${movie.year}) - ${movie.runtime} minutes</strong>
                <button class="edit-button" data-movie-id="${movie.id}">Edit</button>
                <button class="delete-button" data-movie-id="${movie.id}">Delete</button>
            </div>
            <div id="editForm-${movie.id}" style="display: none;">
                <input type="text" id="editName-${movie.id}" value="${movie.name}" placeholder="Enter movie name">
                <input type="number" id="editYear-${movie.id}" value="${movie.year}" placeholder="Enter year of release">
                <input type="number" id="editRuntime-${movie.id}" value="${movie.runtime}" placeholder="Enter runtime (minutes)">
                <input type="text" id="editFilepath-${movie.id}" value="${movie.filepath}" placeholder="Enter filepath">
                <button onclick="updateMovie(${movie.id})">Update</button>
            </div>
        `;
        movieList.appendChild(movieItem);

        // Bind edit button click event
        const editButton = movieItem.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            editMovie(movie.id);
        });
    };

    // Function to handle movie addition
    const addMovie = async (event) => {
        event.preventDefault();

        const movieName = document.getElementById('movieName').value;
        const movieYear = document.getElementById('movieYear').value;
        const movieRuntime = document.getElementById('movieRuntime').value;
        const movieFilepath = document.getElementById('movieFilepath').value;

        const movieData = {
            name: movieName,
            year: parseInt(movieYear),
            runtime: parseInt(movieRuntime),
            filepath: movieFilepath
        };

        try {
            const response = await fetch('http://localhost:8000/movies/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) {
                throw new Error('Failed to add movie');
            }

            fetchMovies(); // Refresh movie list after addition
            addMovieForm.reset(); // Clear form inputs
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    
    // Function to handle movie update
    const updateMovie = async (movieId) => {
        const movieName = document.getElementById(`editName-${movieId}`).value;
        const movieYear = document.getElementById(`editYear-${movieId}`).value;
        const movieRuntime = document.getElementById(`editRuntime-${movieId}`).value;
        const movieFilepath = document.getElementById(`editFilepath-${movieId}`).value;

        const movieData = {
            name: movieName,
            year: parseInt(movieYear),
            runtime: parseInt(movieRuntime),
            filepath: movieFilepath
        };

        try {
            const response = await fetch(`http://localhost:8000/movies/${movieId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) {
                throw new Error('Failed to update movie');
            }

            fetchMovies(); // Refresh movie list after update
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to delete a movie
    const deleteMovie = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:8000/movies/${movieId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
    
            fetchMovies(); // Refresh movie list after deletion
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to toggle edit form display
    const editMovie = (movieId) => {
        const editForm = document.getElementById(`editForm-${movieId}`);
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    };

    // Event listener for edit and delete button clicks
    movieList.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('edit-button')) {
            const movieId = event.target.getAttribute('data-movie-id');
            editMovie(movieId);
        }

        if (event.target && event.target.classList.contains('delete-button')) {
            const movieId = event.target.getAttribute('data-movie-id');
            deleteMovie(movieId);
        }
    });

    // Event listener for form submission
    addMovieForm.addEventListener('submit', addMovie);

 

    // Drag and Drop functionality
    dragDropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dragDropZone.classList.add('dragging');
    });

    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.classList.remove('dragging');
    });

    dragDropZone.addEventListener('drop', async (event) => {
        event.preventDefault();
        dragDropZone.classList.remove('dragging');

        const file = event.dataTransfer.files[0];
        if (file && file.type.includes('video/mp4')) {
            const movieName = file.name.replace('.mp4', '');
            const movieRuntime = Math.floor(file.size / (1024 * 1024)); // Approximating runtime based on file size
            const movieFilepath = file.name;

            const movieData = {
                name: movieName,
                year: new Date().getFullYear(),
                runtime: movieRuntime,
                filepath: movieFilepath
            };

            try {
                const response = await fetch('http://localhost:8000/movies/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(movieData),
                });

                if (!response.ok) {
                    throw new Error('Failed to add movie');
                }

                fetchMovies(); // Refresh movie list after addition
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('Please upload a valid .mp4 file');
        }
    });


    // Fetch and display initial movie list
    fetchMovies();
});
