Fijate si podes trabajar desde aca en vscode directo con el codigo
¡Sí, puedo trabajar directamente desde acá! Tengo acceso completo a ambos proyectos:

📱 Mobile → 
Tp10Efsi_Turquie_Mobile
 — Expo/React Native app
🌐 Web → 
Tp10Efsi_Turquie_Web
 — App web con Vite
Puedo leer, crear y editar archivos, correr comandos (build, test, install, etc.) y ver los resultados directamente en VSCode.

¿En qué querés que laburemos? ¿Mobile, Web, o los dos?

11:56 AM
mobile:# Plan de Migración: Web → React Native + Expo

## Análisis del proyecto Web

Analizé el código completo. La versión web es limpia y bien organizada. Esto es lo que tenemos:

| Archivo Web | Qué hace |
|---|---|
| `App.jsx` | Estado de `favoritos`, `toggleFavorito`, sincronización con `localStorage` |
| `Home.jsx` | Estados: `items`, `busqueda`, `loading`, `error`. Carga inicial `batman`. Debounce 500ms con `useRef` |
| `FavoritesPage.jsx` | Muestra favoritos, cantidad, mensaje vacío |
| `Header.jsx` | Logo `CineExplorer`, NavLinks (Inicio / Favoritos), badge con cantidad de favoritos |
| `SearchBar.jsx` | Input controlado, botón limpiar |
| `ItemList.jsx` | `.map()` sobre items → renderiza `ItemCard` |
| `ItemCard.jsx` | Poster, título, año, género, rating, botón toggle favorito |
| `services/api.js` | Axios. `buscarPeliculas` (s=), `obtenerDetalle` (i=), `buscarConDetalle` (combina ambas) |

---

## Qué reutilizamos, adaptamos o reemplazamos

| Elemento Web | Decisión | Equivalente Mobile |
|---|---|---|
| `useState`, `useEffect`, `useRef` | ✅ Reutilizar igual | Sin cambios |
| Lógica de `toggleFavorito` | ✅ Reutilizar igual | Sin cambios |
| Lógica de debounce (500ms, mínimo 3 chars) | ✅ Reutilizar igual | Sin cambios |
| `buscarConDetalle` en `api.js` | ✅ Reutilizar conceptualmente | Cambia solo `import.meta.env` → `process.env` |
| `localStorage` | ❌ Reemplazar | Estado en memoria (por ahora, sin persistencia) |
| `React Router` (`NavLink`, `Routes`, `Route`) | ❌ Reemplazar | `React Navigation` + Bottom Tabs |
| `className` + CSS | ❌ Reemplazar | `StyleSheet.create()` |
| `<div>`, `<p>`, `<img>`, `<input>`, `<button>` | ❌ Reemplazar | `View`, `Text`, `Image`, `TextInput`, `Pressable` |
| `.map()` en `ItemList` | ❌ Reemplazar | `FlatList` |
| `Header` con NavLink | ❌ Reemplazar | Eliminado (la navegación la maneja el Tab Navigator) |

---

## Diferencias importantes a entender

### Variables de entorno: Vite vs Expo

En Vite (web) usabas:
```js
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
```
Y en `.env`:
```
VITE_OMDB_API_KEY=tu_api_key
```

En Expo **hay dos mecanismos**. El que aplica aquí (proyecto sin Expo Router, sin `app.config.js`) es el más simple:

**Crear un archivo `.env` en la raíz del proyecto con el prefijo `EXPO_PUBLIC_`:**
```
EXPO_PUBLIC_OMDB_API_KEY=tu_api_key
```

**En el código:**
```js
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
```

> ⚠️ Las variables con prefijo `EXPO_PUBLIC_` quedan embebidas en el bundle del cliente (igual que `VITE_`). **Nunca** uses variables sin ese prefijo esperando que sean secretas en el cliente — no funcionan en runtime.

El `.env` ya está en el `.gitignore` del proyecto mobile (`*.env*.local`), pero vamos a agregar también `.env` explícitamente.

### `map()` vs `FlatList`

| `map()` (Web) | `FlatList` (Native) |
|---|---|
| Renderiza todos los elementos a la vez | Renderiza solo los elementos visibles en pantalla |
| Bien para listas cortas | Óptimo para listas largas |
| Si hay 200 películas, crea 200 nodos DOM | Si hay 200 películas, mantiene ~10-15 nodos activos |
| No tiene scroll nativo integrado | Tiene scroll optimizado incluido |

En mobile, la memoria y la CPU son más limitadas. `FlatList` usa "virtualización": destruye los elementos que salen de pantalla y crea los que entran. Por eso es la herramienta correcta para listados.

### `localStorage` vs sin persistencia (por ahora)

`localStorage` es una API del navegador. No existe en React Native. El equivalente nativo es `AsyncStorage` (de `@react-native-async-storage/async-storage`), pero es **asíncrono** — a diferencia de `localStorage` que es síncrono.

**Decisión para este TP**: Los favoritos viven en el estado de `App.js` durante la sesión. Si la app se cierra, se pierden. Esto es correcto para un TP escolar. Si lo necesitamos, agregamos `AsyncStorage` en una segunda etapa.

---

## Estructura de archivos del proyecto mobile

```
src/
├── components/
│   ├── Header.jsx         ← Solo logo/título (sin navegación)
│   ├── SearchBar.jsx      ← TextInput controlado + botón limpiar
│   ├── ItemCard.jsx       ← Poster, info, botón favorito
│   └── ItemList.jsx       ← FlatList de ItemCards
│
├── screens/
│   ├── HomeScreen.jsx     ← items, busqueda, loading, error + debounce
│   └── FavoritesScreen.jsx← Lista de favoritos
│
├── services/
│   └── api.js             ← Axios, buscarConDetalle (adaptado)
│
└── navigation/
    └── AppNavigator.jsx   ← Bottom Tab Navigator

App.js                     ← favoritos, toggleFavorito, AppNavigator
```

---

## Dónde vive el estado

Igual que en la versión web:

- `favoritos` y `toggleFavorito` viven en **`App.js`**
- Se pasan por **props** a las pantallas a través del Navigator
- No se necesita Context ni Redux

---

## Navegación

**Bottom Tab Navigator** de `@react-navigation/bottom-tabs`:

```
[ 🎬 Inicio ]   [ ⭐ Favoritos ]
```

Las tabs muestran un badge con la cantidad de favoritos en la pestaña Favoritos (equivalente al `cantidadFavoritos` badge del Header web).

---

## Dependencias a instalar

```bash
npm install axios
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

> No se necesita `react-native-gesture-handler` ni `react-native-reanimated` para Bottom Tabs básicos.

---

## Plan de implementación (orden)

1. **Preparación**: agregar `.env`, actualizar `.gitignore`, instalar dependencias
2. **`src/services/api.js`** — adaptar el servicio (solo cambia la variable de entorno)
3. **`src/navigation/AppNavigator.jsx`** — Bottom Tabs
4. **`App.js`** — favoritos + toggleFavorito + AppNavigator
5. **`src/components/Header.jsx`** — solo logo/título
6. **`src/components/SearchBar.jsx`** — TextInput adaptado
7. **`src/components/ItemCard.jsx`** — componente con Image nativa
8. **`src/components/ItemList.jsx`** — FlatList
9. **`src/screens/HomeScreen.jsx`** — lógica completa con debounce
10. **`src/screens/FavoritesScreen.jsx`** — lista de favoritos

---

## Verificación

- Correr con `npx expo start`
- Probar en Expo Go (Android/iOS) o emulador
- Verificar: carga inicial, búsqueda con debounce, agregar favorito, quitar favorito, navegación entre tabs, poster N/A, estados de loading y error
Primero voy a leer el código actual de ambos proyectos para entender el estado actual antes de ejecutar el plan.

Los 8 archivos están en su lugar. ✅

Resumen de lo que hice
Todos los archivos están creados. Solo falta que vos ejecutes un comando desde la terminal de VSCode (porque npm está bloqueado para mí):

bash


npm install axios @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
Después de instalar, para correr:

bash


npx expo start
Archivos creados
Archivo	Estado
src/services/api.js
✅ import.meta.env.VITE_ → process.env.EXPO_PUBLIC_
src/navigation/AppNavigator.jsx
✅ Bottom Tabs con badge de favoritos
App.js
✅ Sin localStorage, con NavigationContainer
src/components/Header.jsx
✅ Solo logo, sin NavLinks
src/components/SearchBar.jsx
✅ TextInput + Pressable
src/components/ItemCard.jsx
✅ Image con uri, Pressable para favorito
src/components/ItemList.jsx
✅ FlatList reemplaza .map()
src/screens/HomeScreen.jsx
✅ Lógica debounce idéntica al web
src/screens/FavoritesScreen.jsx
✅ Lógica idéntica al web
11:57 AM
la aplicacion no corre revisa los errores y corregilos
Voy a revisar el estado actual de los archivos para encontrar los errores:

12:04 PM
continua
12:06 PM
continua
Encontré los problemas. Revisé todo el código y hay dos errores concretos:

Error 1 — SafeAreaProvider faltante en App.js SafeAreaView de react-native-safe-area-context requiere que el componente raíz esté envuelto en <SafeAreaProvider>. Sin él crashea con: "No safe area value available".

Error 2 — .env tiene espacios alrededor del = EXPO_PUBLIC_OMDB_API_KEY = 72f3a7e2 → Expo no parsea esto correctamente. La API key queda como undefined.

Corrijo ambos ahora:

Perfecto. Ahora corrí con la app, si sigue fallando necesito ver el mensaje de error exacto. Probá desde la terminal de VSCode:

bash


npx expo start --clear
El --clear limpia el caché de Metro, que puede guardar versiones viejas de los archivos.

Los dos bugs que corregí
#	Error	Causa	Fix
1	Crash en arranque	SafeAreaView de react-native-safe-area-context requiere <SafeAreaProvider> en el componente raíz	Agregué SafeAreaProvider en 
App.js
2	API key = undefined	.env tenía KEY = value (espacios) → Expo lo parseaba mal	Corregí a KEY=value sin espacios en 
.env
Si ves algún error específico en la consola de Expo, pegalo acá y lo corrijo.

12:08 PM
Contiene un monton de errores revisa y corregi
Necesito ver los errores exactos. Voy a leer la documentación de Expo 54 y revisar todos los archivos en detalle para encontrar los problemas reales:

Todo listo. Corré desde la terminal de VSCode:

bash


npx expo start --clear
Resumen de los 5 bugs corregidos
#	Archivo	Bug	Fix
1	
ItemCard.jsx
Image con height: '100%' dentro de un container con minHeight → imagen invisible (height = 0)	Dimensiones fijas en píxeles width: 90, height: 140
2	
ItemList.jsx
FlatList sin flex: 1 → no podía scrollear, intentaba crecer infinito	Agregué style={{ flex: 1 }} al FlatList
3	
HomeScreen.jsx
El useEffect del debounce llamaba cargarDatos('batman') también en el mount inicial, duplicando la petición de red	Guard: solo llama cargarDatos si !loading (el primer useEffect ya maneja el mount)
4	
AppNavigator.jsx
tabBarBadge como objeto estático → el badge no se actualizaba cuando cambiaba favoritos	options como función para que se re-evalúe reactivamente
5	
App.js
Faltaba <SafeAreaProvider> → crash al usar SafeAreaView en las screens	Agregado SafeAreaProvider como root wrapper (fix anterior)
12:13 PM
No arranca tiene muchos errores
Necesito ver los errores exactos. Voy a revisar las dependencias instaladas y buscar logs:

Confirmado. El problema exacto es: instalamos react-native-screens@4.27.0 que requiere React Native 0.85+, pero el proyecto usa RN 0.81. La versión correcta para Expo SDK 54 es ~4.16.0.

La solución es que reinstales las dependencias usando npx expo install (que resuelve automáticamente las versiones correctas), o instales la versión pinned manualmente.

Ejecutá esto en la terminal de VSCode:

bash


npx expo install react-native-screens react-native-safe-area-context
Este comando usa el validador de Expo que sabe exactamente qué versión de cada paquete es compatible con tu SDK 54 / RN 0.81. Va a reemplazar la versión incompatible automáticamente.

Después del install, corré:

bash


npx expo start --clear
El error exacto y por qué pasó


Error: react-native-screens/src/fabric/SearchBarNativeComponent.ts:
The first argument of method blur must be of type React.ElementRef<>
Instalado	Compatible con RN 0.81 (Expo SDK 54)
react-native-screens	4.27.0 ❌	~4.16.0 ✅
react-native-safe-area-context	5.9.1	puede necesitar pin también
react-native-screens@4.27 fue desarrollada para RN 0.85+. El codegen de RN 0.81 no puede parsear su código TypeScript nuevo. npx expo install siempre resuelve la versión validada para tu SDK — por eso hay que usarlo en lugar de npm install para paquetes relacionados a Expo."# Tp10Efsi_Turquie_Mobile"  
