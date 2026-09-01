import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen.jsx';
import FavoritesScreen from '../screens/FavoritesScreen.jsx';

// createBottomTabNavigator: equivalente de React Router con UI nativa incluida.
const Tab = createBottomTabNavigator();

const AppNavigator = ({ favoritos, toggleFavorito }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#333',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🎬</Text>
          ),
        }}
      >
        {/* Render prop: única forma correcta de pasar props extras a una screen */}
        {(props) => (
          <HomeScreen
            {...props}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Favoritos"
        // ✅ FIX: options como función para que tabBarBadge se recalcule
        //    cada vez que favoritos cambia. Con objeto estático, el badge
        //    no se actualizaba reactivamente.
        options={() => ({
          tabBarBadge: favoritos.length > 0 ? favoritos.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#e50914',
            color: '#fff',
            fontSize: 10,
          },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⭐</Text>
          ),
        })}
      >
        {(props) => (
          <FavoritesScreen
            {...props}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
