// Variables globales
let currentOffset = 0;
let currentLimit = 20;

// Elementos del DOM
const pokemonTable = document.getElementById('pokemon-table');
const pokemonTbody = document.getElementById('pokemon-tbody');
const loadPokemonBtn = document.getElementById('load-pokemon');
const loadMoreBtn = document.getElementById('load-more');
const limitInput = document.getElementById('limit');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');

// Colores para los tipos de Pokémon (coincide con CSS)
const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

// Función principal para cargar Pokémon
async function loadPokemon(loadMore = false) {
    try {
        // Mostrar loading y ocultar error
        showLoading();
        hideError();
        
        if (!loadMore) {
            currentOffset = 0;
            pokemonTbody.innerHTML = '';
        }
        
        currentLimit = parseInt(limitInput.value) || 20;
        
        // Hacer petición a la PokeAPI para obtener lista de Pokémon
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${currentLimit}&offset=${currentOffset}`
        );
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Obtener datos detallados de cada Pokémon
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const detailResponse = await fetch(pokemon.url);
                if (!detailResponse.ok) {
                    throw new Error(`Error al obtener detalles de ${pokemon.name}`);
                }
                return await detailResponse.json();
            })
        );
        
        // Mostrar Pokémon en la tabla
        displayPokemon(pokemonDetails);
        
        // Actualizar offset para la próxima carga
        currentOffset += currentLimit;
        
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        showError('Error al cargar los datos: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Función para mostrar Pokémon en la tabla
function displayPokemon(pokemonList) {
    pokemonList.forEach(pokemon => {
        const row = document.createElement('tr');
        
        // Obtener estadísticas principales
        const hpStat = pokemon.stats.find(stat => stat.stat.name === 'hp');
        const attackStat = pokemon.stats.find(stat => stat.stat.name === 'attack');
        const defenseStat = pokemon.stats.find(stat => stat.stat.name === 'defense');
        
        row.innerHTML = `
            <td>#${pokemon.id.toString().padStart(3, '0')}</td>
            <td>
                <div class="pokemon-image">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" 
                         title="${pokemon.name}">
                </div>
            </td>
            <td>${capitalizeFirstLetter(pokemon.name)}</td>
            <td>
                <div class="types">
                    ${pokemon.types.map(typeInfo => `
                        <span class="type type-${typeInfo.type.name}" 
                              style="background-color: ${typeColors[typeInfo.type.name] || '#777'}">
                            ${typeInfo.type.name}
                        </span>
                    `).join('')}
                </div>
            </td>
            <td>${(pokemon.height / 10).toFixed(1)} m</td>
            <td>${(pokemon.weight / 10).toFixed(1)} kg</td>
            <td>${hpStat ? hpStat.base_stat : 'N/A'}</td>
            <td>${attackStat ? attackStat.base_stat : 'N/A'}</td>
            <td>${defenseStat ? defenseStat.base_stat : 'N/A'}</td>
        `;
        
        pokemonTbody.appendChild(row);
    });
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funciones para manejar estados de la UI
function showLoading() {
    loadingElement.style.display = 'block';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    errorElement.innerHTML = `<p>${message}</p>`;
    errorElement.style.display = 'block';
}

function hideError() {
    errorElement.style.display = 'none';
}

// Event Listeners
loadPokemonBtn.addEventListener('click', () => loadPokemon(false));
loadMoreBtn.addEventListener('click', () => loadPokemon(true));

limitInput.addEventListener('change', () => {
    currentLimit = parseInt(limitInput.value) || 20;
});

// Cargar Pokémon al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadPokemon(false);
});

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    showError('Ha ocurrido un error inesperado. Por favor, recarga la página.');
});