import { Slot, useRouter, useSegments } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TopTabBar from '@/components/TopTabBar';
import { useAuthStore } from '@/stores/authStore';
import { s } from '@/utils/scale';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.72;

const MENU_ITEMS = [
  { label: 'お知らせ', icon: '🔔' },
  { label: '課題', icon: '📋' },
  { label: 'スケジュール', icon: '📅' },
  { label: 'ドキュメント', icon: '📄' },
  { label: '設定', icon: '⚙️' },
];

const WEB_TABS = [
  { label: 'トップ画面', segment: 'index', route: '/(tabs)/' },
  { label: '新卒紹介', segment: 'members', route: '/(tabs)/members' },
  { label: '役員紹介', segment: 'employees', route: '/(tabs)/employees' },
  { label: 'プロフィール', segment: 'profile', route: '/(tabs)/profile' },
] as const;

function WebTabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const { logout } = useAuthStore();
  const currentSegment = (segments as string[])[1] ?? 'index';

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm('ログアウトしますか？')) logout();
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Persistent sidebar */}
      <View
        style={{
          width: 220,
          backgroundColor: '#fff',
          borderRightWidth: 1,
          borderRightColor: '#e8e8e8',
          paddingTop: insets.top,
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FF8700' }}>Portal</Text>
        </View>

        {WEB_TABS.map((tab) => {
          const isActive = currentSegment === tab.segment;
          return (
            <TouchableOpacity
              key={tab.segment}
              onPress={() => router.navigate(tab.route)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 13,
                backgroundColor: isActive ? '#FFF5EB' : 'transparent',
                borderLeftWidth: 3,
                borderLeftColor: isActive ? '#FF8700' : 'transparent',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: isActive ? '#FF8700' : '#333',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16, marginVertical: 8 }} />

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 11 }}
            activeOpacity={0.6}
          >
            <Text style={{ fontSize: 15, marginRight: 12 }}>{item.icon}</Text>
            <Text style={{ fontSize: 14, color: '#aaa' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14, color: '#999' }}>ログアウト</Text>
        </TouchableOpacity>
      </View>

      {/* Content area — centered with max width */}
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 800, backgroundColor: '#fff' }}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

function MobileTabLayout() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 20 }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: -SIDEBAR_WIDTH, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setOpen(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopTabBar onMenuPress={openSidebar} />
      <Slot />

      {/* オーバーレイ */}
      {open && (
        <Animated.View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: overlayOpacity,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={closeSidebar} />
        </Animated.View>
      )}

      {/* サイドバー */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: '#fff',
          transform: [{ translateX }],
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
          paddingTop: insets.top,
        }}
      >
        {/* ヘッダー */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: s(20),
            paddingVertical: s(16),
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          }}
        >
          <Text style={{ fontSize: s(16), fontWeight: '700', color: '#FF8700' }}>メニュー</Text>
          <TouchableOpacity onPress={closeSidebar}>
            <Text style={{ fontSize: s(20), color: '#999' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* メニュー項目 */}
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: s(20),
              paddingVertical: s(16),
              borderBottomWidth: 1,
              borderBottomColor: '#f8f8f8',
            }}
            activeOpacity={0.6}
          >
            <Text style={{ fontSize: s(18), marginRight: s(14) }}>{item.icon}</Text>
            <Text style={{ fontSize: s(15), color: '#222' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return Platform.OS === 'web' ? <WebTabLayout /> : <MobileTabLayout />;
}
