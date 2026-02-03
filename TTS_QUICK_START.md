# Quick Start - TTS Feature

## What Was Added?

A **Text-to-Speech (TTS) assistant button** on your Home page that:
- 🎙️ Reads posts aloud in multiple languages
- 🌍 Supports 5 languages with language selection menu
- 📱 Only appears on the Home tab
- ✨ Features smooth animations and dark mode support

---

## Visual Elements

### TTS Button (Bottom-Right)
```
┌─────────────────────────────┐
│                             │
│        Home Feed            │
│                             │
│                        ⊕ (FAB)
│                        ✋ (TTS)
└─────────────────────────────┘
```

### When You Tap the TTS Button
```
┌─────────────────────────────┐
│    Language Menu:           │
│  • 🇺🇸 English (selected)   │
│  • 🇪🇸 Spanish              │
│  • 🇫🇷 French               │
│  • 🇩🇪 German               │
│  • 🇮🇳 Hindi                │
│                        ✋ ←─┘
└─────────────────────────────┘
```

### While Reading (TTS is speaking)
```
Icon changes to: 🔊 (with green glow)
Menu shows: "Stop Reading ⏹️" button
```

---

## Usage

### 1. **First Load**
   - App loads → "Text-to-Speech Ready!" toast appears
   - Palm icon (✋) appears with animation at bottom-right

### 2. **Select Language**
   - Tap the palm icon → Menu pops up
   - Tap your preferred language (e.g., Spanish 🇪🇸)
   - Menu closes automatically

### 3. **Ready to Read**
   - Your language is selected (highlighted in menu)
   - Next time you read a post, it will use this language
   - *Note: Post reading integration requires FeedCard component update*

### 4. **Stop Reading (When Active)**
   - While TTS is reading, icon shows 🔊 (volume icon)
   - Menu shows "Stop Reading ⏹️" button
   - Tap it to stop playback

---

## Code Location

**Main File**: `src/screens/Home/Home.js`

**Key Additions**:
- **Line ~74**: TTS imports (Tts, FontAwesome5)
- **Line ~147**: TTS state variables
- **Line ~364**: TTS initialization function
- **Line ~388**: TTS menu and language change functions
- **Line ~2060-2150**: TTS styling
- **Line ~2185-2270**: TTS UI component

**Documentation Files**:
- `TTS_IMPLEMENTATION.md` - Complete technical documentation
- `.github/copilot-instructions.md` - AI agent guidance
- `IMPLEMENTATION_SUMMARY.md` - Overview and next steps

---

## Supported Languages

| Language | Code | Emoji | Native Name |
|----------|------|-------|-------------|
| English | en-US | 🇺🇸 | English |
| Spanish | es-ES | 🇪🇸 | Español |
| French | fr-FR | 🇫🇷 | Français |
| German | de-DE | 🇩🇪 | Deutsch |
| Hindi | hi-IN | 🇮🇳 | हिंदी |

---

## Visual Design

### Button States

**Idle State** (Not Reading):
- Icon: ✋ (hand-paper)
- Color: Blue (#21B7FF)
- Glow: Blue shadow
- Size: 56x56 circular

**Reading State** (TTS Active):
- Icon: 🔊 (volume-up)
- Color: Green (#00FF00)
- Glow: Green shadow (more intense)
- Size: 56x56 circular

**Hover/Press State**:
- Spring animation effect
- Opacity reduces

### Menu Styling

**Light Mode**:
- Background: White (#fff)
- Text: Black (#000)
- Active Option: Light blue (#E3F2FD)
- Border: Light gray (#E5E5E5)

**Dark Mode**:
- Background: Dark gray (#1a1a1a)
- Text: White (#fff)
- Active Option: Dark blue (#0a4d7f)
- Border: Dark gray (#333)

---

## Technical Details

### Platform Support
- ✅ Android (native TTS)
- ✅ iOS (native TTS)
- ✅ Both dark and light modes

### Animations Used
- **Button Entrance**: Spring animation (damping: 12, stiffness: 100)
- **Menu Popup**: Spring animation with opacity
- **Menu Close**: Timing animation (200ms)

### Performance
- Memoized with `useCallback()` to prevent unnecessary re-renders
- Only visible on Home tab (reduces DOM)
- Non-blocking TTS operations

### Dependencies
All packages already installed! ✅
- `react-native-tts`: ^4.1.1
- `react-native-vector-icons`: ^10.2.0
- `react-native-reanimated`: ~3.16.7

---

## Testing Checklist

Before deploying:
- [ ] Button appears on Home page load
- [ ] Menu opens with animation on tap
- [ ] All 5 languages appear in menu
- [ ] Selected language is highlighted
- [ ] Menu closes after language selection
- [ ] Button hides when scrolling to other tabs
- [ ] Dark mode colors work correctly
- [ ] Light mode colors work correctly
- [ ] Android device: Test TTS voice output
- [ ] iOS device: Test TTS voice output

---

## Future Integration

### To Enable Post Reading (Currently Manual)

In `FeedCard.js` component, add:
```javascript
<TouchableOpacity 
  onPress={() => handleReadPost(post)}
  style={styles.readButton}
>
  <FontAwesome5 name="headphones" size={18} color="#21B7FF" />
</TouchableOpacity>
```

Then update `handleReadPost()` to receive post object and read it.

---

## Troubleshooting

### "TTS not initialized" warning
- **Cause**: TTS failed to initialize on load
- **Fix**: Check device TTS settings, ensure microphone permissions are granted

### Button doesn't appear
- **Cause**: Only visible on Home tab
- **Fix**: Navigate to Home tab, verify selectedTab === 'home'

### Menu doesn't open
- **Cause**: Animation state not updating
- **Fix**: Clear React Native cache: `npm start -- --reset-cache`

### TTS not reading
- **Cause**: Language not supported by device
- **Fix**: Change language or check system TTS settings

---

## Questions?

Refer to:
1. **Feature Details**: `TTS_IMPLEMENTATION.md`
2. **Code Guidelines**: `.github/copilot-instructions.md`
3. **Overall Status**: `IMPLEMENTATION_SUMMARY.md`

