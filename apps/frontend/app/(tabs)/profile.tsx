import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useAuthStore } from '@/stores/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            await logout();
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 24 }}>プロフィール</Text>

      {user && (
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>名前</Text>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>{user.name}</Text>

          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>メールアドレス</Text>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>{user.email}</Text>

          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>種別</Text>
          <Text style={{ fontSize: 16 }}>
            {user.type === 'new_graduate' ? '新卒' : '社員'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#ff8700',
          borderRadius: 8,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>ログアウト</Text>
      </TouchableOpacity>
    </View>
  );
}
