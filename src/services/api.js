import axios from 'axios';

// La API key se lee desde la variable de entorno definida en .env
// En Expo, las variables con prefijo EXPO_PUBLIC_ quedan embebidas en el bundle
// (equivalente a VITE_ en el proyecto web)
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Busca películas/series en OMDb por término de búsqueda.
 * Usa el parámetro "s" que devuelve una lista de hasta 10 resultados.
 * Cada resultado tiene: Title, Year, imdbID, Type, Poster.
 * NO incluye Genre ni imdbRating (para eso se necesita buscar por ID).
 */
const buscarPeliculas = async (termino) => {
  const respuesta = await axios.get(BASE_URL, {
    params: {
      apikey: API_KEY,
      s: termino,
    },
  });
  return respuesta.data;
};

/**
 * Obtiene el detalle completo de una película/serie por su imdbID.
 * Usa el parámetro "i" y devuelve todos los campos:
 * Title, Year, Genre, Director, Plot, Poster, imdbRating, etc.
 */
const obtenerDetalle = async (imdbID) => {
  const respuesta = await axios.get(BASE_URL, {
    params: {
      apikey: API_KEY,
      i: imdbID,
    },
  });
  return respuesta.data;
};

/**
 * Busca películas y obtiene el detalle de cada una.
 * Combina buscarPeliculas (s=) + obtenerDetalle (i=) para tener
 * toda la información necesaria (Genre, imdbRating, etc.).
 *
 * Pasos:
 * 1. Busca con s= → obtiene lista básica (hasta 10 resultados)
 * 2. Para cada resultado, pide el detalle con i=
 * 3. Devuelve un array con los detalles completos
 */
const buscarConDetalle = async (termino) => {
  const busqueda = await buscarPeliculas(termino);

  // OMDb devuelve Response: "False" cuando no encuentra resultados
  if (busqueda.Response === 'False') {
    return [];
  }

  // Para cada película encontrada, obtenemos su detalle completo
  // Promise.all ejecuta todas las peticiones en paralelo (más rápido)
  const detalles = await Promise.all(
    busqueda.Search.map((item) => obtenerDetalle(item.imdbID))
  );

  return detalles;
};

export { buscarPeliculas, obtenerDetalle, buscarConDetalle };

