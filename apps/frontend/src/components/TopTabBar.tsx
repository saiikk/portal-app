import { useRouter, useSegments } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { label: 'トップ画面', segment: 'index', route: '/(tabs)/' },
  { label: '新卒紹介', segment: 'members', route: '/(tabs)/members' },
  { label: '役員紹介', segment: 'employees', route: '/(tabs)/employees' },
  { label: 'プロフィール', segment: 'profile', route: '/(tabs)/profile' },
] as const;

export default function TopTabBar() {
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          height: 44,
        }}
      >
        {/* ハンバーガーアイコン */}
        <View
          style={{
            width: 28,
            height: 20,
            backgroundColor: '#FF8700',
            borderRadius: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingVertical: 3,
            marginRight: 12,
          }}
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{ width: 16, height: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />
          ))}
        </View>

        {TABS.map((tab) => {
          const isActive = currentSegment === tab.segment;
          return (
            <TouchableOpacity
              key={tab.segment}
              onPress={() => router.navigate(tab.route)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? '#FF8700' : 'transparent',
                marginRight: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: isActive ? '#FF8700' : '#333',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
