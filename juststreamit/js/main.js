document.addEventListener('DOMContentLoaded', () => {
    chargerMeilleurFilm();
    chargerFilmsPopulaires();
    chargerCategories();
});
const API_BASE_URL = 'http://localhost:8000/api/v1/';
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(API_BASE_URL + endpoint);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête API:', error);
    }
}
 async function chargerMeilleurFilm() {
    const data = await fetchAPI('titles/?sort_by=-imdb_score');
    if (data && data.results.length > 0) {
        afficherFilmUne(data.results[0]);
    }
}
function afficherFilmUne(film) {
    const filmUneElement = document.getElementById('film-une');
    filmUneElement.innerHTML = `
        <h3>${film.title}</h3>
        <img src="${film.image_url}" alt="${film.title}">
        <p>${film.description}</p>
        <button onclick="ouvrirModal('${film.id}')">Plus
d'infos</button>
    `;
}
async function chargerFilmsPopulaires() {
    const data = await
fetchAPI('titles/?sort_by=-imdb_score&page_size=7');
    if (data && data.results.length > 0) {
        afficherCarousel(data.results, 'carousel-populaires');
    }
}
function afficherCarousel(films, elementId) {
    const carouselElement = document.getElementById(elementId);
    carouselElement.innerHTML = films.map(film => `
        <div class="carousel-item">
            <img src="${film.image_url}" alt="${film.title}">
            <h4>${film.title}</h4>
            <button
onclick="ouvrirModal('${film.id}')">Détails</button>
        </div>
    `).join('');
}
async function chargerCategories() {
    const data = await fetchAPI('genres/');
    if (data && data.results) {

         afficherCategories(data.results.slice(0, 3));
    }
}
function afficherCategories(categories) {
    const categoriesElement =
document.getElementById('liste-categories');
    categoriesElement.innerHTML = categories.map(categorie => `
        <div>
            <h3>${categorie}</h3>
            <div id="carousel-${categorie}" class="carousel"></div>
        </div>
    `).join('');
    categories.forEach(chargerFilmsParCategorie);
}
async function chargerFilmsParCategorie(categorie) {
    const data = await
fetchAPI(`titles/?genre=${categorie}&sort_by=-imdb_score&page_size=7
`);
    if (data && data.results) {
        afficherCarousel(data.results, `carousel-${categorie}`);
} }
async function ouvrirModal(filmId) {
    const film = await fetchAPI(`titles/${filmId}`);
    if (film) {
        const modalContenu =
document.getElementById('modal-contenu');
        modalContenu.innerHTML = `
            <h2>${film.title}</h2>
            <img src="${film.image_url}" alt="${film.title}">
            <p>Genre: ${film.genres.join(', ')}</p>
            <p>Date de sortie: ${film.date_published}</p>
            <p>Note: ${film.rated}</p>
            <p>Score IMDb: ${film.imdb_score}</p>
            <p>Réalisateur: ${film.directors.join(', ')}</p>
            <p>Acteurs: ${film.actors.join(', ')}</p>
            <p>Durée: ${film.duration} minutes</p>

<p>Pays d'origine: ${film.countries.join(', ')}</p>
            <p>Résultat au Box Office: ${film.worldwide_gross_income
|| 'Non disponible'}</p>
            <p>Description: ${film.long_description}</p>
        `;
        document.getElementById('modal').style.display = 'block';
    }
}
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
}
