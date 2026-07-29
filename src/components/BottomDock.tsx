import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

interface BottomDockProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function BottomDock({state, descriptors, navigation}: BottomDockProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.dock}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const focused = state.index === index;
          const icons: Record<string, string> = {Camera: '◉', Prescription: '⧩', Conditions: '⊚', Compare: '⇔', Capture: '◎', Settings: '⚙'};
          return (
            <TouchableOpacity key={route.key} onPress={() => navigation.navigate(route.name)} activeOpacity={0.6} style={styles.tab}>
              <View style={{height: 12, overflow: 'hidden'}}>
                <View><View style={[styles.icon, focused && styles.iconActive]}>{icons[label] || '●'}</View></View>
              </View>
              <View style={{height: 10, overflow: 'hidden'}}>
                <View><View style={[styles.label, focused && styles.labelActive]}>{label}</View></View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 24, paddingHorizontal: 20, paddingTop: 8},
  dock: {flexDirection: 'row', backgroundColor: 'rgba(20,20,20,0.65)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'space-around'},
  tab: {flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4},
  icon: {color: '#666', fontFamily: 'System', fontSize: 14, textAlign: 'center'},
  iconActive: {color: '#FFF'},
  label: {color: '#666', fontFamily: 'System', fontSize: 9, fontWeight: '500', letterSpacing: 0.3, textAlign: 'center'},
  labelActive: {color: '#FFF', fontWeight: '600'},
});
