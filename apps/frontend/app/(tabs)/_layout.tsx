import { Slot } from 'expo-router';
import { View } from 'react-native';

import TopTabBar from '@/components/TopTabBar';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopTabBar />
      <Slot />
    </View>
  );
}
