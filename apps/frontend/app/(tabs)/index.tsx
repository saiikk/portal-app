import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import { groupsApi } from '@/api/groups';
import ChatView from '@/components/ChatView';
import { useAuthStore } from '@/stores/authStore';
import type { Group } from '@/types';

export default function TopScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsApi.getGroups,
  });

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: (name: string) => groupsApi.createGroup(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setShowModal(false);
      setGroupName('');
    },
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FF8700" />
      </View>
    );
  }

  // general ユーザー：自分のグループのチャットを直接表示
  if (user?.role === 'general') {
    const group = groups[0];
    if (!group) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#aaa' }}>グループに参加していません</Text>
        </View>
      );
    }
    return <ChatView groupId={group.id} />;
  }

  // admin ユーザー：グループ一覧
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 作成ボタン */}
      <View style={{ alignItems: 'flex-end', padding: 12 }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: '#FF8700',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>＋ グループ作成</Text>
        </TouchableOpacity>
      </View>

      {/* グループ一覧 */}
      <FlatList
        data={groups}
        keyExtractor={(item: Group) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }: { item: Group }) => (
          <TouchableOpacity
            onPress={() => router.navigate(`/chat/${item.id}`)}
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14, color: '#000' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#aaa' }}>グループがありません</Text>
          </View>
        }
      />

      {/* グループ作成モーダル */}
      <Modal visible={showModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '80%',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
              グループ作成
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                marginBottom: 16,
              }}
              placeholder="グループ名"
              value={groupName}
              onChangeText={setGroupName}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity
                onPress={() => { setShowModal(false); setGroupName(''); }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: '#666', fontSize: 14 }}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { if (groupName.trim()) createGroup(groupName.trim()); }}
                disabled={!groupName.trim() || isPending}
                style={{
                  backgroundColor: groupName.trim() ? '#FF8700' : '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>作成</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
