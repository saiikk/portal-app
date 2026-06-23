import { Dimensions } from 'react-native';

const BASE_WIDTH = 393; // iPhone 17 Pro logical width (points)
const GLOBAL_SCALE = 1.15; // baseline upscale applied on all devices
const { width } = Dimensions.get('window');

export const s = (size: number): number =>
  Math.round((width / BASE_WIDTH) * size * GLOBAL_SCALE);
