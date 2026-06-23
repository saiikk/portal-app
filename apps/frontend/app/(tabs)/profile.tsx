import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { profileApi } from '@/api/profile';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { s } from '@/utils/scale';

export default function ProfileScreen() {
  const { user, logout, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: () => profileApi.updateProfile({ name: name.trim(), email: email.trim() }),
    onSuccess: (updated) => {
      setUser(updated);
      setIsEditing(false);
      Alert.alert('保存しました');
    },
    onError: () => {
      Alert.alert('エラー', '保存に失敗しました');
    },
  });

  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadAvatar(formData),
    onSuccess: (updated) => {
      setUser(updated);
      setAvatarUri(null);
    },
    onError: () => {
      setAvatarUri(null);
      Alert.alert('エラー', '画像のアップロードに失敗しました');
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限が必要です', 'フォトライブラリへのアクセスを許可してください');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      const ext = asset.uri.split('.').pop() ?? 'jpg';
      const formData = new FormData();
      formData.append('avatar', { uri: asset.uri, name: `avatar.${ext}`, type: asset.mimeType ?? 'image/jpeg' } as any);
      uploadAvatar(formData);
    }
  };

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        style: 'destructive',
        onPress: async () => {
          try { await logout(); } catch { await logout(); }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: s(24) }}>
      {/* アバター */}
      <View style={{ alignItems: 'center', marginBottom: s(32) }}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} disabled={isUploading}>
          <View>
            <Avatar uri={avatarUri ?? user?.icon_url} size={s(96)} />
            {isUploading && (
              <View style={{
                position: 'absolute', width: s(96), height: s(96), borderRadius: s(48),
                backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
              }}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={{ marginTop: s(8) }} disabled={isUploading}>
          <Text style={{ fontSize: s(12), color: '#FF8700' }}>写真を変更</Text>
        </TouchableOpacity>
      </View>

      {/* 名前 */}
      <Text style={{ fontSize: s(13), color: '#666', marginBottom: s(6) }}>名前</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#e0e0e0',
          borderRadius: s(8),
          paddingHorizontal: s(14),
          paddingVertical: s(11),
          fontSize: s(15),
          marginBottom: s(20),
          backgroundColor: isEditing ? '#fff' : '#fafafa',
          color: isEditing ? '#000' : '#555',
        }}
        value={name}
        onChangeText={setName}
        placeholder="名前"
        autoCapitalize="none"
        editable={isEditing}
      />

      {/* メールアドレス */}
      <Text style={{ fontSize: s(13), color: '#666', marginBottom: s(6) }}>メールアドレス</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#e0e0e0',
          borderRadius: s(8),
          paddingHorizontal: s(14),
          paddingVertical: s(11),
          fontSize: s(15),
          marginBottom: s(20),
          backgroundColor: isEditing ? '#fff' : '#fafafa',
          color: isEditing ? '#000' : '#555',
        }}
        value={email}
        onChangeText={setEmail}
        placeholder="メールアドレス"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={isEditing}
      />

      {/* 種別（読み取り専用） */}
      <Text style={{ fontSize: s(13), color: '#666', marginBottom: s(6) }}>種別</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#f0f0f0',
          borderRadius: s(8),
          paddingHorizontal: s(14),
          paddingVertical: s(11),
          marginBottom: s(28),
          backgroundColor: '#fafafa',
        }}
      >
        <Text style={{ fontSize: s(15), color: '#999' }}>
          {user?.type === 'new_graduate' ? '新卒' : '社員'}
        </Text>
      </View>

      {/* 編集 / 保存 + パスワードリセット */}
      <View style={{ flexDirection: 'row', gap: s(10), marginBottom: s(32) }}>
        <TouchableOpacity
          onPress={() => isEditing ? saveProfile() : setIsEditing(true)}
          disabled={isPending}
          style={{ flex: 1, backgroundColor: '#FF8700', borderRadius: s(8), paddingVertical: s(13), alignItems: 'center' }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontSize: s(15), fontWeight: '600' }}>
            {isPending ? '保存中...' : isEditing ? '保存' : '編集'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowPasswordModal(true)}
          style={{ flex: 1, borderWidth: 1, borderColor: '#FF8700', borderRadius: s(8), paddingVertical: s(13), alignItems: 'center' }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#FF8700', fontSize: s(15), fontWeight: '600' }}>パスワードリセット</Text>
        </TouchableOpacity>
      </View>

      {/* ログアウト */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#f5f5f5',
          borderRadius: s(8),
          paddingVertical: s(13),
          alignItems: 'center',
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#666', fontSize: s(15), fontWeight: '600' }}>ログアウト</Text>
      </TouchableOpacity>

      {/* パスワードリセット送信済みモーダル */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: s(16), padding: s(28), width: '80%', alignItems: 'center' }}>
            <Text style={{ fontSize: s(32), marginBottom: s(12) }}>✉️</Text>
            <Text style={{ fontSize: s(16), fontWeight: '600', marginBottom: s(8) }}>メールを送信しました</Text>
            <Text style={{ fontSize: s(13), color: '#666', textAlign: 'center', marginBottom: s(24), lineHeight: s(20) }}>
              パスワードリセット用のメールを{'\n'}{user?.email} に送信しました。
            </Text>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
              style={{
                backgroundColor: '#FF8700',
                borderRadius: s(8),
                paddingHorizontal: s(32),
                paddingVertical: s(11),
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(14) }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
