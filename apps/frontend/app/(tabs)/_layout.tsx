import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'チャット' }} />
      <Tabs.Screen name="members" options={{ title: '新卒紹介' }} />
      <Tabs.Screen name="employees" options={{ title: '社員紹介' }} />
      <Tabs.Screen name="profile" options={{ title: 'プロフィール' }} />
    </Tabs>
  );
}
