class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'http://www.omdbapi.com/';
    }

    async search(title, type, page) {
        const url = `${this.baseUrl}?s=${title}&type=${type}&page=${page}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async getMovie(movieId) {
        const url = `${this.baseUrl}?i=${movieId}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
}

const movieService = new MovieService('4b3175f7');
let currentPage = 1;

function showLoadingIcon() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoadingIcon() {
    document.getElementById('loading').style.display = 'none';
}

function renderMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="showMovieDetails('${movie.imdbID}')">Details</button>
        `;
        movieList.appendChild(movieItem);
    });
}

function clearMovies() {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
}

async function searchMovies() {
    showLoadingIcon();
    const title = document.getElementById('search-title').value;
    const type = document.getElementById('search-type').value;
    const page = 1;
    const data = await movieService.search(title, type, page);
    hideLoadingIcon();
    clearMovies();
    if (data.Search) {
        renderMovies(data.Search);
        document.getElementById('more-button').style.display = 'block';
    }
}

async function loadMoreMovies() {
    showLoadingIcon();
    const title = document.getElementById('search-title').value;
    const type = document.getElementById('search-type').value;
    const page = currentPage + 1;
    const data = await movieService.search(title, type, page);
    hideLoadingIcon();
    if (data.Search) {
        renderMovies(data.Search);
        currentPage = page;
    }
}

async function showMovieDetails(movieId) {
    showLoadingIcon();
    const data = await movieService.getMovie(movieId);
    hideLoadingIcon();
    const modal = document.getElementById('movie-modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2>${data.Title}</h2>
        <p>${data.Plot}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Released:</strong> ${data.Released}</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('more-button').style.display = 'none';
});
