import React, {useEffect} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useVisionStore} from './src/store/useVisionStore';
import {OpticalOverlay, GlaucomaOverlay, MacularOverlay, DryEyeOverlay, ColorBlindOverlay} from './src/components/overlays';
import PresetBar from './src/components/PresetBar';
import PrescriptionPanel from './src/components/PrescriptionPanel';
import BottomDock from './src/components/BottomDock';

const Tab = createBottomTabNavigator();

function CameraScreen() {
  const device = useCameraDevice('back');
  const {
    diopterPower, pupilSize, glaucomaSeverity, macularSeverity,
    dryEyeActive, colorBlindMode, showFps, mode
  } = useVisionStore();

  if (!device) {
    return <View style={styles.center}><Text style={styles.text}>No camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera device={device} isActive={true} style={StyleSheet.absoluteFill} enableZoomGesture />

      <OpticalOverlay diopter={diopterPower} pupil={pupilSize} />
      <GlaucomaOverlay severity={glaucomaSeverity} />
      <MacularOverlay severity={macularSeverity} />
      <DryEyeOverlay active={dryEyeActive} />
      <ColorBlindOverlay mode={colorBlindMode} />

      <PresetBar />

      {showFps && (
        <View style={styles.fps}>
          <Text style={styles.fpsText}>60 FPS</Text>
        </View>
      )}
    </View>
  );
}

function PrescriptionScreen() {
  return (
    <View style={[styles.center, {justifyContent: 'flex-start', paddingTop: 100}]}>
      <ScrollView contentContainerStyle={{padding: 16}}>
        <View style={{marginBottom: 24, alignItems: 'center'}}>
          <Text style={[styles.text, {fontSize: 22, fontWeight: '300', marginBottom: 4}]}>Prescription</Text>
          <Text style={[styles.text, {fontSize: 13, color: '#888'}]}>Adjust diopter and astigmatism</Text>
        </View>
        <PrescriptionPanel />
      </ScrollView>
    </View>
  );
}

function ConditionsScreen() {
  const {cataractIntensity, glaucomaSeverity, macularSeverity, dryEyeActive, colorBlindMode, nightVisionActive,
    setCataract, setGlaucoma, setMacular, setDryEye, setColorBlind, setNightVision} = useVisionStore();

  const modes = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'monochromacy'] as const;
  const labels: Record<string, string> = {none: 'Normal', protanopia: 'Protanopia', deuteranopia: 'Deuteranopia', tritanopia: 'Tritanopia', monochromacy: 'Monochromacy'};

  return (
    <View style={[styles.center, {justifyContent: 'flex-start', paddingTop: 100}]}>
      <ScrollView contentContainerStyle={{padding: 16}}>
        <View style={{marginBottom: 24, alignItems: 'center'}}>
          <Text style={[styles.text, {fontSize: 22, fontWeight: '300', marginBottom: 4}]}>Conditions</Text>
          <Text style={[styles.text, {fontSize: 13, color: '#888'}]}>Simulate eye conditions</Text>
        </View>
        <View style={styles.panel}>
          {[
            ['Cataract', cataractIntensity, setCataract],
            ['Glaucoma', glaucomaSeverity, setGlaucoma],
            ['Macular Degeneration', macularSeverity, setMacular],
          ].map(([label, val, fn]: any) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <View style={styles.sliderRow}><View style={[styles.miniTrack, {width: `${val * 100}%`}]} /></View>
              <View style={styles.sliderRow} onTouchEnd={() => {
                const el = document; /* placeholder - this will use pan responder */
              }} />
              <Text style={styles.rowVal}>{Math.round(val * 100)}%</Text>
            </View>
          ))}
          <View style={styles.divider} />
          {[['Dry Eye', dryEyeActive, setDryEye], ['Night Vision', nightVisionActive, setNightVision]].map(([label, val, fn]: any) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <View style={[styles.toggle, val && styles.toggleOn]} onTouchEnd={() => fn(!val)}>
                <View style={[styles.toggleThumb, val && styles.toggleThumbOn]} />
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <Text style={[styles.rowLabel, {marginBottom: 8}]}>Color Vision</Text>
          <View style={styles.cbGrid}>
            {modes.map((m) => (
              <View key={m} style={[styles.cbChip, colorBlindMode === m && styles.cbChipOn]} onTouchEnd={() => setColorBlind(m)}>
                <Text style={[styles.cbText, colorBlindMode === m && styles.cbTextOn]}>{labels[m]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function CaptureScreen() {
  const {showFps} = useVisionStore();
  return (
    <View style={[styles.center, {justifyContent: 'flex-start', paddingTop: 100}]}>
      <View style={{marginBottom: 24, alignItems: 'center'}}>
        <Text style={[styles.text, {fontSize: 22, fontWeight: '300', marginBottom: 4}]}>Capture</Text>
        <Text style={[styles.text, {fontSize: 13, color: '#888'}]}>Save original, simulated, or comparison photos</Text>
      </View>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.captureBtn} onPress={() => {}}>
          <Text style={styles.captureBtnText}>◎  Capture Frame</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.saveRow}>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>Original</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>Simulated</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>Side-by-Side</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CompareScreen() {
  const device = useCameraDevice('back');
  if (!device) return <View style={styles.center}><Text style={styles.text}>No camera</Text></View>;
  return (
    <View style={styles.container}>
      <View style={styles.compareRow}>
        <View style={{flex: 1, overflow: 'hidden'}}>
          <Camera device={device} isActive={true} style={StyleSheet.absoluteFill} />
          <View style={[styles.compareLabel, {right: 8}]}>
            <Text style={styles.compareLabelText}>NORMAL</Text>
          </View>
        </View>
        <View style={{width: 30, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 2, height: 40, backgroundColor: '#FFF', borderRadius: 1, opacity: 0.5}} />
        </View>
        <View style={{flex: 1, overflow: 'hidden'}}>
          <Camera device={device} isActive={false} style={StyleSheet.absoluteFill} />
          <View style={[styles.compareLabel, {left: 8, right: undefined}]}>
            <Text style={styles.compareLabelText}>SIMULATED</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function SettingsScreen() {
  const {showFps, toggleFps, resetAll} = useVisionStore();
  return (
    <View style={[styles.center, {justifyContent: 'flex-start', paddingTop: 100}]}>
      <View style={{marginBottom: 24, alignItems: 'center'}}>
        <Text style={[styles.text, {fontSize: 22, fontWeight: '300', marginBottom: 4}]}>Settings</Text>
      </View>
      <View style={styles.panel}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Show FPS</Text>
          <View style={[styles.toggle, showFps && styles.toggleOn]} onTouchEnd={toggleFps}>
            <View style={[styles.toggleThumb, showFps && styles.toggleThumbOn]} />
          </View>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity onPress={resetAll} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 40, alignItems: 'center'}}>
        <Text style={[styles.text, {fontSize: 18, fontWeight: '300'}]}>VisionX</Text>
        <Text style={[styles.text, {fontSize: 12, color: '#666', marginTop: 4}]}>v1.0.0 — APK Prototype</Text>
      </View>
    </View>
  );
}

function App() {
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FFF" /></View>;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={{dark: true, colors: {primary: '#FFF', background: '#000', card: '#000', text: '#FFF', border: 'transparent', notification: '#007AFF'}}}>
        <Tab.Navigator tabBar={(props) => <BottomDock {...props} />} screenOptions={{headerShown: false, tabBarStyle: {display: 'none'}}}>
          <Tab.Screen name="Camera" component={CameraScreen} options={{tabBarLabel: 'Camera'}} />
          <Tab.Screen name="Prescription" component={PrescriptionScreen} options={{tabBarLabel: 'Prescription'}} />
          <Tab.Screen name="Conditions" component={ConditionsScreen} options={{tabBarLabel: 'Conditions'}} />
          <Tab.Screen name="Compare" component={CompareScreen} options={{tabBarLabel: 'Compare'}} />
          <Tab.Screen name="Capture" component={CaptureScreen} options={{tabBarLabel: 'Capture'}} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarLabel: 'Settings'}} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  center: {flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'},
  text: {color: '#FFF', fontFamily: 'System', fontSize: 16, fontWeight: '400'},
  fps: {position: 'absolute', top: 50, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4},
  fpsText: {color: '#34C759', fontFamily: 'monospace', fontSize: 12, fontWeight: '700'},
  panel: {padding: 16, backgroundColor: 'rgba(20,20,20,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', width: '100%', maxWidth: 400, minWidth: 300},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10},
  rowLabel: {color: '#FFF', fontFamily: 'System', fontSize: 14, fontWeight: '400'},
  rowVal: {color: '#AAA', fontFamily: 'monospace', fontSize: 13, fontWeight: '500', width: 40, textAlign: 'right'},
  sliderRow: {flex: 1, marginHorizontal: 12},
  miniTrack: {height: 4, backgroundColor: '#FFF', borderRadius: 9999},
  togglerow: {flex: 1, marginHorizontal: 12, height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 9999},
  toggle: {width: 48, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', paddingHorizontal: 2},
  toggleOn: {backgroundColor: '#007AFF'},
  toggleThumb: {width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF'},
  toggleThumbOn: {alignSelf: 'flex-end'},
  divider: {height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 4},
  cbGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  cbChip: {paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'},
  cbChipOn: {backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)'},
  cbText: {color: '#666', fontFamily: 'System', fontSize: 12, fontWeight: '500'},
  cbTextOn: {color: '#FFF'},
  resetBtn: {paddingVertical: 12, alignItems: 'center'},
  resetText: {color: '#FF3B30', fontFamily: 'System', fontSize: 14, fontWeight: '500'},
  compareRow: {flex: 1, flexDirection: 'row'},
  compareLabel: {position: 'absolute', top: 60},
  compareLabelText: {color: 'rgba(255,255,255,0.7)', fontFamily: 'System', fontSize: 10, fontWeight: '700', letterSpacing: 2},
  captureBtn: {paddingVertical: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'},
  captureBtnText: {color: '#FFF', fontFamily: 'System', fontSize: 16, fontWeight: '500'},
  saveRow: {flexDirection: 'row', gap: 8, marginTop: 8},
  saveBtn: {flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'},
  saveBtnText: {color: '#AAA', fontFamily: 'System', fontSize: 13, fontWeight: '500'},
});

export default App;
