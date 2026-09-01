import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

// ItemCard adaptado de la versión web.
// Cambios: <div>→<View>, <p><h3>→<Text>, <img>→<Image source={{uri}}>, <button>→<Pressable>
const ItemCard = ({ item, esFavorito, toggleFavorito }) => {
  const { Title, Year, Poster, Genre, imdbRating } = item;

  // Verificamos si el poster es válido (OMDb puede devolver "N/A")
  const tienePoster = Poster && Poster !== 'N/A';

  return (
    <View style={styles.card}>
      {/* Poster — dimensiones fijas para que Image tenga bounds definidos */}
      <View style={styles.posterContainer}>
        {tienePoster ? (
          <Image
            source={{ uri: Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderIcon}>🎬</Text>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>

      {/* Información */}
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={2}>
          {Title}
        </Text>

        <Text style={styles.year}>{Year}</Text>

        {Genre && Genre !== 'N/A' && (
          <Text style={styles.genero} numberOfLines={2}>{Genre}</Text>
        )}

        {imdbRating && imdbRating !== 'N/A' && (
          <Text style={styles.rating}>⭐ {imdbRating}</Text>
        )}

        <Pressable
          style={[styles.btnFavorito, esFavorito && styles.btnFavoritoActivo]}
          onPress={() => toggleFavorito(item)}
        >
          <Text style={[styles.btnFavoritoText, esFavorito && styles.btnFavoritoTextActivo]}>
            {esFavorito ? '★ Quitar' : '☆ Favorito'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e30',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // ✅ FIX: ancho y altura fijos — Image necesita dimensiones definidas en el padre
  posterContainer: {
    width: 90,
    height: 140,
  },
  // ✅ FIX: dimensiones absolutas en lugar de '100%' para evitar height:0 con minHeight
  poster: {
    width: 90,
    height: 140,
  },
  posterPlaceholder: {
    width: 90,
    height: 140,
    backgroundColor: '#2a2a3e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 28,
  },
  placeholderText: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
  info: {
    flex: 1,
    padding: 10,
    gap: 4,
  },
  titulo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  year: {
    color: '#aaa',
    fontSize: 12,
  },
  genero: {
    color: '#ccc',
    fontSize: 11,
  },
  rating: {
    color: '#f5c518',
    fontSize: 12,
  },
  btnFavorito: {
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  btnFavoritoActivo: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  btnFavoritoText: {
    color: '#ccc',
    fontSize: 11,
  },
  btnFavoritoTextActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemCard;
