import {create} from 'zustand';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';

interface VisionState {
  mode: 'myopia' | 'hyperopia' | null;
  diopterPower: number;
  astigmatismStrength: number;
  astigmatismAngle: number;
  cataractIntensity: number;
  glaucomaSeverity: number;
  macularSeverity: number;
  dryEyeActive: boolean;
  colorBlindMode: ColorBlindMode;
  nightVisionActive: boolean;
  pupilSize: number;
  showFps: boolean;
  activePanel: string | null;

  setMode: (mode: 'myopia' | 'hyperopia' | null) => void;
  setDiopter: (v: number) => void;
  setAstigmatism: (strength: number, angle: number) => void;
  setCataract: (v: number) => void;
  setGlaucoma: (v: number) => void;
  setMacular: (v: number) => void;
  setDryEye: (v: boolean) => void;
  setColorBlind: (v: ColorBlindMode) => void;
  setNightVision: (v: boolean) => void;
  setPupilSize: (v: number) => void;
  toggleFps: () => void;
  setActivePanel: (v: string | null) => void;
  applyPreset: (preset: string) => void;
  resetAll: () => void;
}

export const useVisionStore = create<VisionState>((set) => ({
  mode: null,
  diopterPower: 0,
  astigmatismStrength: 0,
  astigmatismAngle: 0,
  cataractIntensity: 0,
  glaucomaSeverity: 0,
  macularSeverity: 0,
  dryEyeActive: false,
  colorBlindMode: 'none',
  nightVisionActive: false,
  pupilSize: 1.5,
  showFps: false,
  activePanel: null,

  setMode: (mode) => set({mode}),
  setDiopter: (diopterPower) => set({diopterPower}),
  setAstigmatism: (strength, angle) => set({astigmatismStrength: strength, astigmatismAngle: angle}),
  setCataract: (cataractIntensity) => set({cataractIntensity}),
  setGlaucoma: (glaucomaSeverity) => set({glaucomaSeverity}),
  setMacular: (macularSeverity) => set({macularSeverity}),
  setDryEye: (dryEyeActive) => set({dryEyeActive}),
  setColorBlind: (colorBlindMode) => set({colorBlindMode}),
  setNightVision: (nightVisionActive) => set({nightVisionActive}),
  setPupilSize: (pupilSize) => set({pupilSize}),
  toggleFps: () => set((s) => ({showFps: !s.showFps})),
  setActivePanel: (activePanel) => set({activePanel}),
  applyPreset: (preset) => {
    const presets: Record<string, Partial<VisionState>> = {
      '20/20': {diopterPower: 0, mode: null, cataractIntensity: 0, glaucomaSeverity: 0, macularSeverity: 0, astigmatismStrength: 0, colorBlindMode: 'none', nightVisionActive: false, dryEyeActive: false},
      '-1': {diopterPower: -1, mode: 'myopia'},
      '-2': {diopterPower: -2, mode: 'myopia'},
      '-4': {diopterPower: -4, mode: 'myopia'},
      '-6': {diopterPower: -6, mode: 'myopia'},
      '+2': {diopterPower: 2, mode: 'hyperopia'},
      'Astig': {astigmatismStrength: 1.5, astigmatismAngle: 90},
      'Cataract': {cataractIntensity: 0.8},
      'Glaucoma': {glaucomaSeverity: 0.7},
      'Macular': {macularSeverity: 0.8},
      'Night': {nightVisionActive: true, cataractIntensity: 0.3},
    };
    set(presets[preset] || {});
  },
  resetAll: () => set({
    mode: null, diopterPower: 0, astigmatismStrength: 0, astigmatismAngle: 0,
    cataractIntensity: 0, glaucomaSeverity: 0, macularSeverity: 0,
    dryEyeActive: false, colorBlindMode: 'none', nightVisionActive: false,
    pupilSize: 1.5,
  }),
}));
