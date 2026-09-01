import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header.jsx';
import ItemList from '../components/ItemList.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';

// FavoritesScreen adaptado de FavoritesPage.jsx (web).
// Lógica idéntica: muestra cantidad de favoritos o mensaje vacío.
// Cambios solo de renderizado: <main> → <View>, <p> → <Text>, etc.
const FavoritesScreen = ({ favoritos, toggleFavorito }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Favoritos</Text>

        {favoritos.length === 0 ? (
          // Estado vacío: equivalente al div.favorites-vacio del web
          <View style={styles.vacioCointainer}>
            <Text style={styles.vacioIcono}>⭐</Text>
            <Text style={styles.vacioTexto}>No tenés favoritos todavía.</Text>
            <Text style={styles.vacioSub}>
              Explorá películas y series y agregá las que más te gusten.
            </Text>
          </View>
        ) : (
          // Lista de favoritos con cantidad
          <View style={styles.listaContainer}>
            <Text style={styles.cantidad}>
              {favoritos.length}{' '}
              {favoritos.length === 1 ? 'favorito' : 'favoritos'}
            </Text>
            <ItemList
              items={favoritos}
              favoritos={favoritos}
              toggleFavorito={toggleFavorito}
            />
          </View>
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
    marginBottom: 8,
  },
  vacioCointainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  vacioIcono: {
    fontSize: 48,
    marginBottom: 12,
  },
  vacioTexto: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  vacioSub: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
  listaContainer: {
    flex: 1,
  },
  cantidad: {
    color: '#aaa',
    fontSize: 13,
    marginHorizontal: 16,
    marginBottom: 4,
  },
});

export default FavoritesScreen;

