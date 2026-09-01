import { FlatList } from 'react-native';
import ItemCard from './ItemCard.jsx';

// ItemList: .map() reemplazado por FlatList para virtualización en mobile.
// ✅ FIX: style={{ flex: 1 }} en FlatList para que pueda scrollear correctamente
//    dentro de un contenedor flex. Sin esto, FlatList no tiene altura limitada
//    y no activa el scroll.
const ItemList = ({ items, favoritos, toggleFavorito }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={items}
      keyExtractor={(item) => item.imdbID}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          esFavorito={favoritos.some((fav) => fav.imdbID === item.imdbID)}
          toggleFavorito={toggleFavorito}
        />
      )}
      contentContainerStyle={{ paddingVertical: 8, paddingBottom: 20 }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
};

export default ItemList;
