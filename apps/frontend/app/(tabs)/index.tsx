import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { groupsApi } from '@/api/groups';
import { usersApi, type UserSummary } from '@/api/users';
import ChatView from '@/components/ChatView';
import { useAuthStore } from '@/stores/authStore';
import type { Group } from '@/types';

export default function TopScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsApi.getGroups,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
    enabled: showModal,
  });

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: () => groupsApi.createGroup(groupName.trim(), selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      closeModal();
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setGroupName('');
    setSearch('');
    setSelectedIds([]);
  };

  const toggleUser = (u: UserSummary) => {
    if (u.has_group) return;
    setSelectedIds((prev) =>
      prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id]
    );
  };

  const filteredUsers = allUsers.filter((u: UserSummary) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>グループ作成</Text>

            {/* グループ名 */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                marginBottom: 12,
              }}
              placeholder="グループ名"
              value={groupName}
              onChangeText={setGroupName}
              autoFocus
            />

            {/* ユーザー検索 */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 14,
                marginBottom: 8,
              }}
              placeholder="ユーザー名で検索"
              value={search}
              onChangeText={setSearch}
            />

            {/* ユーザーリスト */}
            <FlatList
              data={filteredUsers}
              keyExtractor={(item: UserSummary) => item.id}
              style={{ maxHeight: 200, marginBottom: 12 }}
              renderItem={({ item }: { item: UserSummary }) => {
                const isSelected = selectedIds.includes(item.id);
                const isDisabled = item.has_group;
                return (
                  <TouchableOpacity
                    onPress={() => toggleUser(item)}
                    activeOpacity={isDisabled ? 1 : 0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f0f0f0',
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: isSelected ? '#FF8700' : '#ccc',
                        backgroundColor: isSelected ? '#FF8700' : '#fff',
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {isSelected && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: '#000' }}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: '#888' }}>
                        {item.type === 'new_graduate' ? '新卒' : '社員'}
                        {isDisabled ? '　グループ参加済み' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={{ color: '#aaa', textAlign: 'center', paddingVertical: 12 }}>
                  {search ? '該当するユーザーがいません' : 'ユーザーを読み込み中...'}
                </Text>
              }
            />

            {selectedIds.length > 0 && (
              <Text style={{ fontSize: 12, color: '#FF8700', marginBottom: 8 }}>
                {selectedIds.length}人を選択中
              </Text>
            )}

            {/* ボタン */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity onPress={closeModal} style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                <Text style={{ color: '#666', fontSize: 14 }}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => createGroup()}
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
