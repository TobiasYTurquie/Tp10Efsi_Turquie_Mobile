import { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buscarConDetalle } from '../services/api.js';
import Header from '../components/Header.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ItemList from '../components/ItemList.jsx';

// HomeScreen adaptado de Home.jsx (web).
// Lógica idéntica: useState, useEffect, useRef, debounce, cargarDatos.
const HomeScreen = ({ favoritos, toggleFavorito }) => {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useRef guarda el timer del debounce sin causar re-renders
  const debounceTimer = useRef(null);

  // -------------------------------------------------------
  // Función reutilizable para cargar datos desde OMDb
  // -------------------------------------------------------
  const cargarDatos = async (termino) => {
    try {
      setLoading(true);
      setError(null);
      const resultados = await buscarConDetalle(termino);
      setItems(resultados);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No fue posible obtener la información.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // Carga inicial: se ejecuta UNA SOLA VEZ al montar la pantalla.
  // -------------------------------------------------------
  useEffect(() => {
    cargarDatos('batman');
  }, []);

  // -------------------------------------------------------
  // Búsqueda con debounce (500ms, mínimo 3 caracteres).
  // ✅ FIX: el efecto NO se ejecuta en el mount inicial porque
  //    busqueda empieza como '' y el guard de trim() === '' lo detiene
  //    SIN llamar cargarDatos (esa responsabilidad ya la tiene el primer useEffect).
  //    Solo llama cargarDatos('batman') cuando el usuario BORRA el texto
  //    después de haber escrito algo (busqueda cambia de algo a '').
  // -------------------------------------------------------
  useEffect(() => {
    // En el primer render busqueda es '' pero este efecto también corre.
    // Para evitar duplicar la carga inicial, ignoramos si todavía está loading.
    if (busqueda.trim() === '') {
      // Solo recargamos batman si el usuario borró el texto (no en el mount)
      if (!loading) {
        cargarDatos('batman');
      }
      return;
    }

    // No buscamos si el texto es muy corto (mínimo 3 caracteres)
    if (busqueda.trim().length < 3) {
      return;
    }

    // Cancelar el timer anterior si todavía está activo
    clearTimeout(debounceTimer.current);

    // Iniciar un nuevo timer de 500ms
    debounceTimer.current = setTimeout(() => {
      cargarDatos(busqueda.trim());
    }, 500);

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(debounceTimer.current);
  }, [busqueda]);

  return (
    // SafeAreaView respeta notches y barra de estado. edges=['top'] evita
    // duplicar el inset inferior que ya maneja el Tab Navigator.
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      {/* ✅ FIX: container tiene flex:1 y estructura correcta:
           - Título y SearchBar ocupan su tamaño natural
           - El estado (loading/error/vacío) o la FlatList ocupan el resto
           gracias a flex:1 en estadoContainer e ItemList */}
      <View style={styles.container}>
        <Text style={styles.titulo}>Películas y Series</Text>

        <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />

        {/* Estado: cargando */}
        {loading && (
          <View style={styles.estadoContainer}>
            <ActivityIndicator size="large" color="#e50914" />
            <Text style={styles.estadoTexto}>Cargando información...</Text>
          </View>
        )}

        {/* Estado: error */}
        {error && (
          <View style={styles.estadoContainer}>
            <Text style={styles.errorTexto}>{error}</Text>
          </View>
        )}

        {/* Estado: sin resultados */}
        {!loading && !error && items.length === 0 && (
          <View style={styles.estadoContainer}>
            <Text style={styles.estadoTexto}>No encontramos resultados.</Text>
          </View>
        )}

        {/* Lista de resultados — FlatList con flex:1 ocupa el espacio restante */}
        {!loading && !error && items.length > 0 && (
          <ItemList
            items={items}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12122a',
  },
  container: {
    flex: 1,
    backgroundColor: '#12122a',
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  // ✅ FIX: flex:1 para que los estados de loading/error/vacío
  //    llenen el espacio restante sin colapsar el layout
  estadoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  estadoTexto: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  errorTexto: {
    color: '#e50914',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;
