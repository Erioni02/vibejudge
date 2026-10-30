import {loadFont as loadDisplay} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadSans} from '@remotion/google-fonts/Inter';

// The same three families as vibejudge.app (app/layout.tsx).
export const display = loadDisplay('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const serif = loadSerif('italic', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const sans = loadSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;

// VibeJudge tokens (tailwind.config.ts), plus a deeper "night" ink for the cinematic stage.
export const C = {
  night: '#0b0907',
  ink: '#16130f',
  ink2: '#3d3730',
  ink3: '#6f675c',
  paper: '#f7f4ee',
  paper2: '#efeae1',
  line: '#e5dfd4',
  lineStrong: '#cfc6b6',
  ember: '#e2492f',
  emberDark: '#c23a22',
  emberSoft: '#fcebe6',
  emberGlow: 'rgba(226,73,47,0.55)',
  moss: '#2f6b57',
  mossSoft: '#e7f1ec',
  amber: '#a8701c',
  amberSoft: '#fbf1dd',
} as const;
