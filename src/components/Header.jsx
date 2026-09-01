import { View, Text, StyleSheet } from 'react-native';

// Header simplificado: solo muestra el logo/título de la app.
// La navegación (Inicio / Favoritos) la maneja el Tab Navigator,
// así que este componente ya no necesita NavLinks ni badges.
const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>🎬 CineExplorer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    // Sombra sutil para separar visualmente el header del contenido
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,  // Android
  },
  logo: {
    color: '#e50914',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Header;

