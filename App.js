import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator.jsx';

const App = () => {
  // -------------------------------------------------------
  // Estado de favoritos
  // En mobile no usamos localStorage (API del navegador).
  // Los favoritos viven en memoria durante la sesión.
  // Si se necesita persistencia, agregar AsyncStorage en una segunda etapa.
  // -------------------------------------------------------
  const [favoritos, setFavoritos] = useState([]);

  // -------------------------------------------------------
  // Función para agregar o quitar un favorito
  // Recibe el objeto completo de la película/serie.
  // Usa imdbID como identificador único (nunca el título).
  // Lógica idéntica a la versión web.
  // -------------------------------------------------------
  const toggleFavorito = (item) => {
    const existe = favoritos.some((fav) => fav.imdbID === item.imdbID);

    if (existe) {
      // Quitar: filter crea un nuevo array SIN el elemento
      const nuevosFavoritos = favoritos.filter(
        (fav) => fav.imdbID !== item.imdbID
      );
      setFavoritos(nuevosFavoritos);
    } else {
      // Agregar: spread operator copia los existentes + agrega el nuevo
      const nuevosFavoritos = [...favoritos, item];
      setFavoritos(nuevosFavoritos);
    }
  };

  return (
    // SafeAreaProvider es requerido en la raíz cuando se usa SafeAreaView
    // de react-native-safe-area-context en cualquier pantalla hija.
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator
          favoritos={favoritos}
          toggleFavorito={toggleFavorito}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
