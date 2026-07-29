import React, {useRef} from 'react';
import {View, StyleSheet, PanResponder, LayoutChangeEvent} from 'react-native';
import {useVisionStore} from '../../store/useVisionStore';

function Slider({label, sublabel, value, min, max, step, formatter, onChange}: {
  label: string; sublabel?: string; value: number; min: number; max: number; step: number;
  formatter: (v: number) => string; onChange: (v: number) => void;
}) {
  const width = useRef(0);
  const clamp = (v: number) => Math.max(min, Math.min(max, Math.round(v / step) * step));
  const toPercent = (v: number) => ((v - min) / (max - min)) * width.current;

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => { const p = Math.max(0, Math.min(1, g.moveX / width.current)); onChange(clamp(min + p * (max - min))); },
  })).current;

  const pos = toPercent(value);
  return (
    <View style={s.slider}>
      <View style={s.labelRow}>
        <View style={{height: 18, overflow: 'hidden'}}><View><View style={s.label}>{label}</View></View></View>
        <View style={{height: 18, overflow: 'hidden'}}><View><View style={s.value}>{formatter(value)}</View></View></View>
      </View>
      <View style={s.track} onLayout={(e: LayoutChangeEvent) => { width.current = e.nativeEvent.layout.width; }} {...pan.panHandlers}>
        <View style={s.trackBg} />
        <View style={[s.trackFill, {width: pos}]} />
        <View style={[s.thumb, {left: pos - 14}]}>
          <View style={s.thumbInner} />
        </View>
      </View>
    </View>
  );
}

export default function PrescriptionPanel() {
  const {mode, diopterPower, astigmatismStrength, astigmatismAngle, pupilSize, setMode, setDiopter, setAstigmatism, setPupilSize} = useVisionStore();

  return (
    <View style={s.panel}>
      <View style={s.modeRow}>
        <View style={[s.chip, mode === 'myopia' && s.chipOn]} onTouchEnd={() => setMode(mode === 'myopia' ? null : 'myopia')}>
          <View style={{height: 18, overflow: 'hidden'}}><View><View style={[s.chipText, mode === 'myopia' && s.chipTextOn]}>Myopia (−)</View></View></View>
        </View>
        <View style={[s.chip, mode === 'hyperopia' && s.chipOn]} onTouchEnd={() => setMode(mode === 'hyperopia' ? null : 'hyperopia')}>
          <View style={{height: 18, overflow: 'hidden'}}><View><View style={[s.chipText, mode === 'hyperopia' && s.chipTextOn]}>Hyperopia (+)</View></View></View>
        </View>
      </View>

      <Slider label="Diopter Power" sublabel="Refractive error" value={diopterPower} min={-10} max={10} step={0.5}
        formatter={(v) => v === 0 ? '0 (20/20)' : `${v > 0 ? '+' : ''}${v.toFixed(1)} D`} onChange={setDiopter} />

      <Slider label="Astigmatism" value={astigmatismStrength} min={0} max={3} step={0.5}
        formatter={(v) => `${v.toFixed(1)} D`} onChange={(v) => setAstigmatism(v, astigmatismAngle)} />

      <View style={s.angleRow}>
        {[0, 45, 90, 135].map((a) => (
          <View key={a} style={[s.angleChip, astigmatismAngle === a && s.angleOn]} onTouchEnd={() => setAstigmatism(astigmatismStrength, a)}>
            <View style={{height: 16, overflow: 'hidden'}}><View><View style={[s.angleText, astigmatismAngle === a && s.angleTextOn]}>{a}°</View></View></View>
          </View>
        ))}
      </View>

      <Slider label="Pupil Size" value={pupilSize} min={0.5} max={3} step={0.5}
        formatter={(v) => v <= 0.5 ? 'Small' : v <= 1.5 ? 'Medium' : 'Large'} onChange={setPupilSize} />
    </View>
  );
}

const s = StyleSheet.create({
  panel: {padding: 16, backgroundColor: 'rgba(20,20,20,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4, marginHorizontal: 16},
  modeRow: {flexDirection: 'row', gap: 12, marginBottom: 8},
  chip: {flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center'},
  chipOn: {backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)'},
  chipText: {color: '#888', fontFamily: 'System', fontSize: 14, fontWeight: '500'},
  chipTextOn: {color: '#FFF'},
  slider: {gap: 6},
  labelRow: {flexDirection: 'row', justifyContent: 'space-between'},
  label: {color: '#FFF', fontFamily: 'System', fontSize: 14, fontWeight: '500', letterSpacing: -0.1},
  value: {color: '#AAA', fontFamily: 'monospace', fontSize: 13, fontWeight: '500'},
  track: {height: 36, justifyContent: 'center'},
  trackBg: {height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 9999},
  trackFill: {position: 'absolute', height: 4, backgroundColor: '#FFF', borderRadius: 9999},
  thumb: {position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center'},
  thumbInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF'},
  angleRow: {flexDirection: 'row', gap: 8, marginTop: 4},
  angleChip: {flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center'},
  angleOn: {backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)'},
  angleText: {color: '#666', fontFamily: 'monospace', fontSize: 14, fontWeight: '500'},
  angleTextOn: {color: '#FFF'},
});
