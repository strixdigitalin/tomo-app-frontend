# Text-to-Speech (TTS) Implementation - Home Page

## Overview
Added **react-native-tts** integration to the Home page with a beautiful palm icon button and language selection menu. This feature is only available on the Home tab.

## Features Implemented

### 1. **TTS Button (Palm Icon)**
- **Location**: Bottom-right corner of the screen (below FAB)
- **Icon**: FontAwesome5 `hand-paper` (palm icon) - changes to `volume-up` when reading
- **Visual States**:
  - **Default**: Blue glow (#21B7FF) with hand icon
  - **Reading**: Green glow (#00FF00) with volume-up icon
  - **Animated**: Spring entrance animation on page load
  - **Tap Animation**: Menu appears with smooth spring transition

### 2. **Language Selection Menu**
Appears when user taps the TTS button. Supports 5 languages with emoji flags:
- 🇺🇸 English (en-US) - Default
- 🇪🇸 Spanish (es-ES)
- 🇫🇷 French (fr-FR)
- 🇩🇪 German (de-DE)
- 🇮🇳 Hindi (hi-IN)

Active language is highlighted with blue background (dark mode) or light blue background (light mode).

### 3. **Stop Reading Button**
- Appears only while TTS is actively reading
- Red button (#FF5252) to stop current playback
- Positioned at bottom of menu

## Code Structure

### State Variables
```javascript
const [isTtsEnabled, setIsTtsEnabled] = useState(false)      // TTS initialization status
const [isTtsReading, setIsTtsReading] = useState(false)      // Currently reading status
const [ttsMenuVisible, setTtsMenuVisible] = useState(false)  // Menu visibility
const [ttsLanguage, setTtsLanguage] = useState('en-US')     // Selected language
const ttsInitialAnimScale = useSharedValue(0)               // Button entrance animation
const ttsMenuAnimScale = useSharedValue(0)                  // Menu popup animation
```

### Core Functions

#### `initializeTts()`
- Initializes TTS on component mount
- Sets default language, rate (0.5), and pitch (1.0)
- Registers event listeners for: `tts-start`, `tts-finish`, `tts-cancel`
- Shows success toast notification
- Animates button entrance with spring effect

#### `handleTtsMenuToggle()`
- Toggles menu visibility
- Animates menu in/out with spring animation

#### `handleReadPost(post)`
- Reads post caption using current selected language
- Format: "Username posted: caption"
- Updates `isTtsReading` state
- Shows warning if TTS not initialized

#### `handleStopReading()`
- Stops ongoing TTS playback
- Updates `isTtsReading` to false

#### `handleLanguageChange(lang)`
- Changes TTS language
- Closes menu after selection
- Updates `ttsLanguage` state

### Styling
All TTS-related styles are in `styles` object:
- `ttsContainer`: Positioned absolutely, bottom: 180px, right: 20px
- `ttsButton`: 56x56 circular button with gradient border
- `ttsMenuContainer`: Rounded menu with shadow and border
- `ttsMenuOption`: Language options with padding and borders
- `ttsMenuActive`: Highlight color for selected language

## User Experience Flow

1. **Page Load**
   - TTS initializes automatically
   - Palm icon appears with spring animation
   - Success toast shows "Text-to-Speech Ready!"

2. **User Taps Palm Icon**
   - Menu pops up with spring animation
   - Shows 5 language options
   - Currently selected language is highlighted

3. **User Selects Language**
   - Language changes immediately
   - Menu closes
   - Icon updates for next read

4. **User Taps Post (Future Enhancement)**
   - Can trigger post reading (currently requires manual integration with FeedCard component)
   - Button shows volume-up icon with green glow
   - "Stop Reading" option appears in menu

## Platform-Specific Notes

### Android
- Uses native TTS engine
- Supports multiple languages via system language settings
- `androidParams` configured with:
  - `KEY_PARAM_PAN`: -1 (stereo center)
  - `KEY_PARAM_VOLUME`: 0.5 (moderate volume)
  - `KEY_PARAM_STREAM`: 'STREAM_MUSIC'

### iOS
- Uses native AVSpeechSynthesis
- Language selection handled by system
- Same interface works across both platforms

## Integration Points

### Visibility Condition
```javascript
{selectedTab === 'home' && (
  // TTS UI only shows on Home tab
)}
```

### Color Theming
- Dark mode: #1a1a1a background, #fff text
- Light mode: #fff background, #000 text
- Primary color: #21B7FF (blue gradient)
- Reading color: #00FF00 (green)
- Stop color: #FF5252 (red)

## Future Enhancements

1. **Post-Level Integration**
   - Add read button to each post card (FeedCard component)
   - Pass post caption to `handleReadPost()`

2. **Speed Control**
   - Add menu option to adjust reading speed (0.5 - 2.0)
   - Use `Tts.setDefaultRate(value)`

3. **Accessibility**
   - Add VoiceOver/TalkBack labels
   - Implement keyboard shortcuts

4. **Storage**
   - Persist language preference to AsyncStorage
   - Restore on app restart

5. **Analytics**
   - Track TTS usage
   - Log language preferences

## Package Dependencies
- `react-native-tts`: ^4.1.1 (already in package.json)
- `react-native-vector-icons`: ^10.2.0 (already in package.json)
- `react-native-reanimated`: ~3.16.7 (already in package.json)

## Testing Checklist

- [ ] Button appears on page load with correct animation
- [ ] Menu opens/closes with smooth animation
- [ ] All 5 languages are selectable
- [ ] Selected language is highlighted
- [ ] TTS can read text successfully
- [ ] Stop button appears while reading and works
- [ ] Button hides when switching to other tabs
- [ ] Dark mode colors are correct
- [ ] Light mode colors are correct
- [ ] Works on both Android and iOS

