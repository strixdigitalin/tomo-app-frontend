# Tomo App - AI Agent Instructions

## Project Overview
**Tomo** is a React Native social marketplace app (v0.77.0, React 18.3.1) built with TypeScript, Redux Toolkit, and Firebase. It combines social features (posts, stories, comments) with e-commerce (shops, products, buyer marketplace) and real-time messaging via Socket.io.

## Architecture & Key Concepts

### Redux State Management
- **Store**: `src/redux/store.js` uses Redux Toolkit with `configureStore`
- **Reducers** (in `src/redux/reducer/`):
  - `user.js`: userData, login status, isFirstTime, statusBarColor
  - `loader.js`: Global loader visibility state
  - `theme.js`: isDarkMode toggle
- **Pattern**: Use slices for new features; dispatchers like `setUser`, `removeUser`, `setIsFirstTime`
- Example: `useSelector(state => state.user.userData)` and `dispatch(setUser(JSON.stringify(...)))`

### API Architecture
- **Base URL**: `https://tomo-backend-app.vercel.app`
- **Auth**: Bearer token stored in AsyncStorage, auto-injected via `getHeaders()` in [Apis.js](src/utils/Apis.js)
- **Endpoints**: Centralized in [urls.js](src/config/urls.js) (40+ endpoints for posts, users, shops, comments, stories, etc.)
- **API Functions**: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()` handle requests/errors
- **Error Handling**: Show alerts via `showError()`, `showSuccess()`, `showWarning()` (react-native-flash-message)
- **Pattern**: Always use endpoint paths from urls.js; handle token refresh in getHeaders

### Navigation Structure
- **Root**: [App.tsx](App.tsx) wraps app in Redux Provider, PaperProvider, and SafeAreaView
- **Navigation**: React Navigation with StackNavigation + TabNavigation (commented structure in [route.js](src/routes/StackNavigation/route.js) ~470 lines)
- **Screens**: Located in `src/screens/` with folders for Auth, Home, Message, Seller, Buyer, etc.
- **Key Pattern**: Use `navigation.navigate()` and `navigation.replace()` for auth flows

### Animations & Performance
- **Animation Library**: react-native-reanimated (3.16.7) with shared values, animated styles, scroll handlers
- **Common Patterns**:
  - `useSharedValue()` for state, `useAnimatedStyle()` for transforms
  - `useAnimatedScrollHandler()` for scroll-linked animations (see [Home.js](src/screens/Home/Home.js) scroll collapsing header)
  - Preset animations: `FadeIn`, `ZoomIn`, `SlideInLeft`, `withSpring()`, `withTiming()`
- **Example**: FAB scale/rotate/opacity animations with `withRepeat()` + `withSequence()`
- **Performance**: Use `maxToRenderPerBatch={5}`, `windowSize={5}`, `removeClippedSubviews={true}` in FlatLists

### Component Library
- **UI Components**: react-native-paper (v5.13.1), react-native-linear-gradient, react-native-vector-icons
- **Custom Components** (in `src/components/`):
  - `TextComponent.js`: Reusable text with styling
  - `Button.js`: Standard button wrapper
  - `CustomInputField.js`: Form inputs
  - `BackHeader.js`: Navigation header
  - `Loader.js`: Global loading spinner (connected to Redux)
  - `PhotoSectionComponent.js`, `CustomCarousel.js`: Media handling
- **Skeletons**: Shimmer loaders in `Skeletons/` folder (FeedShimmerLoader, ActivityShimmer)

### Key Features & Patterns

#### Post/Feed System
- Posts include: media (image/video), caption, likes, unlikes, saves, comments, timestamps
- **Optimistic Updates**: Update local state immediately, revert on API error (see `onLikeUnlike`, `SavePost` in Home.js)
- **Video Handling**: Use `react-native-video` with muting support; track visible index for auto-pause
- **Double-tap Like**: Trigger with 300ms debounce (lastTapRef), show heart animation

#### Stories System
- Stories linked to users; fetchable via `followedUserStories` endpoint
- Display as horizontal carousel with gradient borders
- Navigation passes `allUsersStories` + `initialUserIndex` for swipe-through viewing

#### Advertisements
- Ads fetched from `/api/admin/GetAllActiveAdvertisement`
- **Carousel Logic**: Multiple images per ad, dots indicator, prev/next buttons
- **Merge Strategy**: Insert ads every 3 posts in feed via `mergeFeedWithAds()` utility
- **CTA**: "Learn More" button opens URL via `Linking.openURL()`

#### Location Management
- Custom `LocationManager` in [utils/LocationManager.js](src/utils/LocationManager.js)
- Auto-tracks user location on app focus; updateLocation endpoint syncs with backend
- **Pattern**: `initializeLocationTracking()`, `stopLocationTracking()`, `setLocationUpdateCallback()`

#### Firebase Messaging
- FCM token requested on app load (with Android 13+ notification permission)
- Token stored/synced via user profile endpoint
- **Pattern**: Call `messaging().getToken()`, handle `isDeviceRegisteredForRemoteMessages`

#### Dark Mode
- Toggle via Redux `theme.isDarkMode` state
- All colors use ternary: `isDarkMode ? '#000' : '#fff'`
- **Key Colors**: Primary (#21B7FF, #0084F8), dark bg (#1a1a1a), light (#fff)

#### Search & Hashtags
- Hashtag search debounced (300ms) via `/api/admin/SearchHashtags`
- **Pattern**: `SearchTags(tag)` with `setTimeout` + `clearTimeout` for cleanup
- Shows suggestions dropdown dynamically

### Code Conventions

**File Structure**:
- Screens: One folder per screen with related components (e.g., `Home/` has Home.js, CommentModel.js, PostDetailModel.js, FeedsCards.js)
- Utils: Helper functions (Apis.js, helperFunctions.js, DateFormat.js, LocationManager.js, KeyBoardHook.js, LoaderHook.js)
- Assets: Images (IMG), SVGs, Fonts indexed in `index.js` files
- Common: Shared values (Colors in `Colors/colors.js`)

**Naming**:
- Components: PascalCase (CustomInputField.js)
- Functions: camelCase (onLikeUnlike, fetchData)
- Constants: UPPER_SNAKE_CASE (FONTS_FAMILY.SourceSans3_Medium)
- Exported functions: Lowercase modules (urls.js, helperFunctions.js)

**Styling**:
- StyleSheet.create() with useMemo() inside component for dynamic themes
- Flexbox-first layout; borderRadius in 10s/20s increments
- Reusable wrapper components: `SpaceBetweenRow`, custom row/column in `wrapper/`

**State Management**:
- Prefer Redux for global (user, theme, loader)
- Use local useState for component-specific (searchText, isModalVisible)
- Combine with useCallback() for memoized event handlers
- useEffect cleanup: return cleanup function, clear timeouts/listeners

**Error Handling**:
- Always wrap API calls in try-catch
- Show user feedback: `showError("Message")` or `showSuccess()`
- Log errors to console for debugging: `console.error('Error:', error)`
- Revert optimistic updates on API failure

### Build & Development

**Commands**:
- `npm start` - Start Metro dev server
- `npm run android` - Build & run Android app
- `npm run ios` - Build & run iOS app (requires `bundle install && bundle exec pod install` first)
- `npm run lint` - ESLint check
- `npm test` - Jest tests (see jest.config.js)

**Config Files**:
- `babel.config.js`: Presets + react-native-reanimated plugin (MUST be last)
- `metro.config.js`: SVG transformer enabled; filter SVG from assetExts
- `tsconfig.json`: TypeScript settings
- `app.json`, `android/`, `ios/`: Native configs

**Common Issues**:
- SVG imports: Use SVG transformer, import as `<SVGComponent />`
- Metro cache: `npm start -- --reset-cache`
- Android build: Check `android/local.properties` for SDK path
- iOS pods: Always reinstall after dependency updates

### Best Practices for This Codebase

1. **Before adding features**: Check urls.js for existing endpoints; reuse API functions
2. **Performance**: Memoize callbacks with useCallback(); avoid inline styles in FlatList renderItem
3. **Dark mode**: Always test with both themes; use ternary for colors
4. **Animation timing**: Use `scrollEventThrottle={16}` for 60 FPS; prefer reanimated over state updates
5. **Cleanup**: Remove event listeners, cancel timeouts in useEffect cleanup
6. **Accessibility**: Include actionOpacity on touch targets; use semantic names for icons
7. **Testing**: Jest setup in place; test API mocks via AsyncStorage and Apis.js stubs

---

## Quick Reference: Common Tasks

- **Add new API endpoint**: Add to urls.js, import in screen, call with apiGet/Post/Put/Delete
- **Add Redux state**: Create slice in src/redux/reducer/, export actions, use in components
- **Create reusable component**: Place in src/components/, export, import with destructure
- **Add animation**: Use useSharedValue + useAnimatedStyle, trigger with withTiming/withSpring
- **Handle dark mode**: Check `isDarkMode` from selector, use ternary for theme-dependent colors
- **Optimize FlatList**: Add getItemLayout, use maxToRenderPerBatch, enable removeClippedSubviews

