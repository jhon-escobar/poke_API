// Elementos del DOM
const pokemonSearch = document.getElementById('pokemon-search');
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const pokemonCard = document.getElementById('pokemon-card');
const errorMessage = document.getElementById('error-message');

// Elementos para mostrar la información del Pokémon
const pokemonImg = document.getElementById('pokemon-img');
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonStats = document.getElementById('pokemon-stats');
const pokemonAbilities = document.getElementById('pokemon-abilities');

// Colores para los tipos de Pokémon
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

// Función para obtener un Pokémon por nombre o ID
async function getPokemon(query) {
    try {
        // Limpiar mensajes de error
        hideError();
        
        // Hacer la petición a la API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        showError();
        console.error('Error al obtener el Pokémon:', error);
    }
}

// Función para obtener un Pokémon aleatorio
async function getRandomPokemon() {
    // Generar un ID aleatorio entre 1 y 898 (número total de Pokémon en la API)
    const randomId = Math.floor(Math.random() * 898) + 1;
    await getPokemon(randomId);
}

// Función para mostrar la información del Pokémon
function displayPokemon(pokemon) {
    // Mostrar la tarjeta del Pokémon
    pokemonCard.style.display = 'flex';
    
    // Imagen del Pokémon
    pokemonImg.src = pokemon.sprites.other['official-artwork'].front_default || 
                     pokemon.sprites.front_default;
    pokemonImg.alt = pokemon.name;
    
    // Nombre e ID
    pokemonName.textContent = pokemon.name;
    pokemonId.textContent = `ID: #${pokemon.id.toString().padStart(3, '0')}`;
    
    // Tipos
    pokemonTypes.innerHTML = '';
    pokemon.types.forEach(typeInfo => {
        const type = typeInfo.type.name;
        const typeElement = document.createElement('span');
        typeElement.classList.add('type');
        typeElement.textContent = type;
        typeElement.style.backgroundColor = typeColors[type] || '#777';
        pokemonTypes.appendChild(typeElement);
    });
    
    // Estadísticas
    pokemonStats.innerHTML = '';
    pokemon.stats.forEach(statInfo => {
        const statElement = document.createElement('div');
        statElement.classList.add('stat');
        
        const statName = document.createElement('span');
        statName.classList.add('stat-name');
        statName.textContent = statInfo.stat.name.replace('-', ' ');
        
        const statValue = document.createElement('span');
        statValue.classList.add('stat-value');
        statValue.textContent = statInfo.base_stat;
        
        statElement.appendChild(statName);
        statElement.appendChild(statValue);
        pokemonStats.appendChild(statElement);
    });
    
    // Habilidades
    pokemonAbilities.innerHTML = '';
    pokemon.abilities.forEach(abilityInfo => {
        const abilityElement = document.createElement('div');
        abilityElement.classList.add('ability');
        
        const abilityName = document.createElement('span');
        abilityName.classList.add('ability-name');
        abilityName.textContent = abilityInfo.ability.name.replace('-', ' ');
        
        abilityElement.appendChild(abilityName);
        pokemonAbilities.appendChild(abilityElement);
    });
}

// Función para mostrar mensaje de error
function showError() {
    pokemonCard.style.display = 'none';
    errorMessage.style.display = 'block';
}

// Función para ocultar mensaje de error
function hideError() {
    errorMessage.style.display = 'none';
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const query = pokemonSearch.value.trim();
    if (query) {
        getPokemon(query);
    }
});

randomBtn.addEventListener('click', getRandomPokemon);

pokemonSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = pokemonSearch.value.trim();
        if (query) {
            getPokemon(query);
        }
    }
});

// Cargar un Pokémon al iniciar (Pikachu por defecto)
window.addEventListener('load', () => {
    getPokemon('pikachu');
});