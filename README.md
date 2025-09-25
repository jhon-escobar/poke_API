# poke_API PAPUS

## 📚 Documentación de la PokeAPI

### Endpoints Principales

Lista de Pokémon: GET `https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}`

Pokémon específico: GET `https://pokeapi.co/api/v2/pokemon/{id-or-name}`
Tipos de Pokémon: GET `https://pokeapi.co/api/v2/type/{id-or-name}`

## Características de la API

<li > Sin autenticación: No requiere API key

<li >  Solo lectura: Solo métodos GET disponibles

<li > Sin límites estrictos: Pero se recomienda caché local

<li > Formato JSON: Todas las respuestas en JSON

## 🔧 Uso del Fetch API

### Estructura básica:

```javascript
async function fetchData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/1");
    if (!response.ok) throw new Error("Error en la respuesta");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## 🎯 Características Implementadas

<li > Tabla responsive con diseño moderno.

<li > Paginación con botones "Cargar Más"

<li > Búsqueda por cantidad de Pokémon a mostrar

<li > Tipos de Pokémon con colores representativos

<li > Estadísticas principales (HP, Ataque, Defensa)

<li > Manejo de errores robusto

<li > Interfaz responsive para móviles y desktop

<li >Indicadores de carga durante las peticiones
