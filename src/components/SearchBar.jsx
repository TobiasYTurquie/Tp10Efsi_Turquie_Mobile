import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

// SearchBar adaptado de la versión web.
// Cambios: <input> → <TextInput>, <button> → <Pressable>, className → StyleSheet
// La lógica de props (busqueda, setBusqueda) es idéntica.
const SearchBar = ({ busqueda, setBusqueda }) => {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.icono}>🔍</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar películas o series..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}   // onChangeText reemplaza onChange del input web
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Botón limpiar: solo aparece si hay texto (renderizado condicional idéntico al web) */}
      {busqueda.length > 0 && (
        <Pressable
          style={styles.clearButton}
          onPress={() => setBusqueda('')}
          accessibilityLabel="Limpiar búsqueda"
        >
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  icono: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 6,
    marginLeft: 4,
  },
  clearText: {
    color: '#888',
    fontSize: 16,
  },
});

export default SearchBar;

