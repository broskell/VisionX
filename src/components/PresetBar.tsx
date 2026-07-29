import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useVisionStore} from '../../store/useVisionStore';

const PRESETS = [
  {key: '20/20', label: '20/20'},
  {key: '-1', label: '-1 Myopia'},
  {key: '-2', label: '-2 Myopia'},
  {key: '-4', label: '-4 Myopia'},
  {key: '-6', label: '-6 Myopia'},
  {key: '+2', label: '+2 Hyperopia'},
  {key: 'Astig', label: 'Astigmatism'},
  {key: 'Cataract', label: 'Cataract'},
  {key: 'Glaucoma', label: 'Glaucoma'},
  {key: 'Macular', label: 'Macular'},
  {key: 'Night', label: 'Night Driving'},
];

export default function PresetBar() {
  const {diopterPower, astigmatismStrength, cataractIntensity, glaucomaSeverity, macularSeverity, nightVisionActive, applyPreset, resetAll, mode} = useVisionStore();

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PRESETS.map((p) => (
          <View key={p.key}
            style={[styles.chip]}
            onTouchEnd={() => p.key === '20/20' ? resetAll() : applyPreset(p.key)}>
            <View><View style={styles.chipText}>{p.label}</View></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10},
  row: {paddingHorizontal: 12, gap: 8},
  chip: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.75)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {color: '#CCC', fontFamily: 'System', fontSize: 13, fontWeight: '500', letterSpacing: -0.1},
});
