import { useRouter, useSegments } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { s } from '@/utils/scale';

const TABS = [
  { label: 'トップ画面', segment: 'index', route: '/(tabs)/' },
  { label: '新卒紹介', segment: 'members', route: '/(tabs)/members' },
  { label: '役員紹介', segment: 'employees', route: '/(tabs)/employees' },
  { label: 'プロフィール', segment: 'profile', route: '/(tabs)/profile' },
] as const;

type Props = { onMenuPress?: () => void };

export default function TopTabBar({ onMenuPress }: Props) {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const currentSegment = (segments as string[])[1] ?? 'index';

  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingTop: insets.top,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: s(8),
          height: s(44),
        }}
      >
        {/* ハンバーガーアイコン */}
        <TouchableOpacity
          onPress={onMenuPress}
          style={{
            width: s(28),
            height: s(20),
            backgroundColor: '#FF8700',
            borderRadius: s(2),
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingVertical: s(3),
            marginRight: s(12),
          }}
          activeOpacity={0.7}
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{ width: s(16), height: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />
          ))}
        </TouchableOpacity>

        {TABS.map((tab) => {
          const isActive = currentSegment === tab.segment;
          return (
            <TouchableOpacity
              key={tab.segment}
              onPress={() => router.navigate(tab.route)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: s(8),
                borderBottomWidth: 2,
                borderBottomColor: isActive ? '#FF8700' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: s(11),
                  color: isActive ? '#FF8700' : '#333',
                  fontWeight: isActive ? '600' : '400',
                }}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
