import { Dimensions, Platform } from 'react-native';

const BASE_WIDTH = 393; // iPhone 17 Pro logical width (points)
const GLOBAL_SCALE = 1.15;
const rawWidth = Dimensions.get('window').width;
// Web のデスクトップ幅をモバイル相当に制限
const width = Platform.OS === 'web' ? Math.min(rawWidth, 430) : rawWidth;

export const s = (size: number): number =>
  Math.round((width / BASE_WIDTH) * size * GLOBAL_SCALE);
