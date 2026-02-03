# Text-to-Speech Feature - Setup Guide

## What Was Added

A Text-to-Speech (TTS) feature on your Home page that speaks text aloud in multiple languages.

---

## Where to Find It

**Location on Screen**: Bottom-right corner of the Home tab (below the "Add Post" button)

**Visual**: A blue circular button with a speaker/volume icon 🔊

---

## How to Use

### Step 1: Tap the Button
- Tap the blue button with the volume icon
- You should hear an English greeting speaking

### Step 2: Change Language (Optional)
- Long-press (hold down) the button
- A menu appears with 5 language options:
  - 🇺🇸 English
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇩🇪 German
  - 🇮🇳 Hindi
- Select your preferred language
- Device will speak a greeting in that language

### Step 3: Stop Speaking
- While the device is speaking, the icon changes to red with a STOP symbol
- Tap the button again to stop
- Button returns to blue with volume icon

---

## On-Screen Status Messages

You'll see text above the button showing:
- **"Ready - Tap button to speak"** → Initial state
- **"Now speaking..."** → Device is speaking
- **"Speaking... (Tap STOP to pause)"** → Currently speaking
- **"Stopped"** → You pressed stop
- **"Finished! Tap again to speak"** → Speech finished

---

## What You Should Hear

When you tap the button in English:
> "Welcome to Tomo. This is the text to speech feature. Now you can hear posts read aloud. Tap and hold the button to change language."

---

## Troubleshooting

### Nothing Happens When I Tap
**Check:**
1. Are you on the Home tab? (Not on other tabs)
2. Is your device volume turned up?
3. Check if device system TTS is enabled in Android settings
4. Look at the console logs (they show detailed status)

### Can't Hear Audio
**Try:**
1. Increase device volume (use physical buttons)
2. Change to English language first to test
3. Restart the app
4. Check Android Settings → Sound & Vibration → Text-to-Speech

### Button Not Appearing
**Make Sure:**
1. You're viewing the Home tab (with posts feed)
2. You're scrolled down enough to see it (below FAB button)
3. You've closed any modals or overlays

---

## Technical Details

- **Language Support**: 5 languages with native voices
- **Speed**: Moderate speed (0.5x)
- **Volume**: 80% device volume
- **Android Only**: Currently optimized for Android TTS engine
- **Console Logs**: Check browser console for detailed debugging

---

## What's Next

The feature is ready for production. Future improvements could include:
- Reading individual posts when you tap them
- Speed/pitch control
- Language preference persistence
- Accessibility improvements

---

## Console Debug Info

Open your React Native console and look for messages like:
- "TTS: Initializing with language: en-US"
- "TTS: Speaking greeting in language: en-US"
- "TTS: Started speaking"
- "TTS: Finished speaking"

These show exactly what's happening behind the scenes.

