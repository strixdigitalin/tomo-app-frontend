import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { THEMES } from '../redux/reducer/theme';

const BLUE = '#0EA5E9';
const BLUE_LIGHT = '#38BDF8';
const KNOB = 26;
const MAX = 5;

// Slider-style 0–5 rating input (replaces the star widget, same as web's
// CreateReviewModal). Tap or drag along the bar to pick a whole number.
const RatingBar = ({ value, onChange }) => {
  const { selectedColorTheme } = useSelector(state => state.theme);
  const primary = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const pick = x => {
    const w = widthRef.current;
    if (!w) return;
    const v = Math.round((Math.max(0, Math.min(x, w)) / w) * MAX);
    onChangeRef.current(v);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => pick(e.nativeEvent.locationX),
      onPanResponderMove: e => pick(e.nativeEvent.locationX),
    }),
  ).current;

  const travel = Math.max(width - KNOB, 0);
  const knobLeft = (value / MAX) * travel;

  return (
    <View style={styles.wrap}>
      <View
        style={styles.touch}
        onLayout={e => {
          widthRef.current = e.nativeEvent.layout.width;
          setWidth(e.nativeEvent.layout.width);
        }}
        {...pan.panHandlers}>
        <View style={[styles.track, { backgroundColor: primary }]}>
          {value > 0 && (
            <LinearGradient
              colors={[BLUE, BLUE_LIGHT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: '100%', width: knobLeft + KNOB / 2, borderRadius: 8 }}
            />
          )}
        </View>
        <View
          pointerEvents="none"
          style={[styles.knob, { left: knobLeft, borderColor: value > 0 ? BLUE : primary }]}
        />
      </View>
      <View style={styles.labels}>
        {[1, 2, 3, 4, 5].map(n => (
          <CustomText key={n} style={{ fontSize: 12, color: n <= value ? BLUE : 'rgba(120,120,120,0.8)' }}>
            {n}
          </CustomText>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', paddingHorizontal: 4, marginVertical: 12 },
  touch: { height: KNOB + 10, justifyContent: 'center' },
  track: { height: 16, borderRadius: 8, overflow: 'hidden' },
  knob: {
    position: 'absolute',
    top: 5,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: 'white',
    borderWidth: 3,
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingHorizontal: 4 },
});

export default RatingBar;
