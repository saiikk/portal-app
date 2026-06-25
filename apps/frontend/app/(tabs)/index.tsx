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
import { usersApi, type UserBasic } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import type { Group } from '@/types';
import { s } from '@/utils/scale';

export default function TopScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsApi.getGroups,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users-basic'],
    queryFn: usersApi.getAllBasic,
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

  const toggleUser = (u: UserBasic) => {
    setSelectedIds((prev) =>
      prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id]
    );
  };

  const filteredUsers = allUsers.filter((u: UserBasic) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FF8700" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* グループ作成ボタン：admin のみ */}
      {isAdmin && (
        <View style={{ alignItems: 'flex-end', padding: s(12) }}>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              backgroundColor: '#FF8700',
              borderRadius: s(20),
              paddingHorizontal: s(16),
              paddingVertical: s(8),
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(14) }}>＋ グループ作成</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* グループ一覧 */}
      <FlatList
        data={groups}
        keyExtractor={(item: Group) => item.id}
        contentContainerStyle={{ paddingHorizontal: s(16), paddingTop: isAdmin ? 0 : s(12) }}
        renderItem={({ item }: { item: Group }) => (
          <TouchableOpacity
            onPress={() => router.navigate(`/chat/${item.id}`)}
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: s(8),
              paddingHorizontal: s(16),
              paddingVertical: s(14),
              marginBottom: s(10),
            }}
          >
            <Text style={{ fontSize: s(14), color: '#000' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: s(40) }}>
            <Text style={{ color: '#aaa' }}>グループがありません</Text>
          </View>
        }
      />

      {/* グループ作成モーダル：admin のみ */}
      {isAdmin && (
        <Modal visible={showModal} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: s(12), padding: s(20), width: '90%', maxHeight: '80%' }}>
              <Text style={{ fontSize: s(16), fontWeight: '600', marginBottom: s(12) }}>グループ作成</Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  borderRadius: s(8),
                  paddingHorizontal: s(12),
                  paddingVertical: s(10),
                  fontSize: s(14),
                  marginBottom: s(12),
                  color: '#555',
                }}
                placeholder="グループ名"
                value={groupName}
                onChangeText={setGroupName}
                autoFocus
              />

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  borderRadius: s(8),
                  paddingHorizontal: s(12),
                  paddingVertical: s(8),
                  fontSize: s(14),
                  marginBottom: s(8),
                  color: '#555',
                }}
                placeholder="ユーザー名で検索"
                value={search}
                onChangeText={setSearch}
              />

              <FlatList
                data={filteredUsers}
                keyExtractor={(item: UserBasic) => item.id}
                style={{ maxHeight: s(200), marginBottom: s(12) }}
                renderItem={({ item }: { item: UserBasic }) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => toggleUser(item)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: s(10),
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                      }}
                    >
                      <View
                        style={{
                          width: s(20),
                          height: s(20),
                          borderRadius: s(4),
                          borderWidth: 2,
                          borderColor: isSelected ? '#FF8700' : '#ccc',
                          backgroundColor: isSelected ? '#FF8700' : '#fff',
                          marginRight: s(10),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {isSelected && <Text style={{ color: '#fff', fontSize: s(12), fontWeight: '700' }}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: s(14), color: '#000' }}>{item.name}</Text>
                        <Text style={{ fontSize: s(11), color: '#888' }}>
                          {item.type === 'new_graduate' ? '新卒' : '社員'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <Text style={{ color: '#aaa', textAlign: 'center', paddingVertical: s(12) }}>
                    {search ? '該当するユーザーがいません' : 'ユーザーを読み込み中...'}
                  </Text>
                }
              />

              {selectedIds.length > 0 && (
                <Text style={{ fontSize: s(12), color: '#FF8700', marginBottom: s(8) }}>
                  {selectedIds.length}人を選択中
                </Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: s(8) }}>
                <TouchableOpacity onPress={closeModal} style={{ paddingHorizontal: s(16), paddingVertical: s(10) }}>
                  <Text style={{ color: '#666', fontSize: s(14) }}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => createGroup()}
                  disabled={!groupName.trim() || isPending}
                  style={{
                    backgroundColor: groupName.trim() ? '#FF8700' : '#ccc',
                    borderRadius: s(8),
                    paddingHorizontal: s(16),
                    paddingVertical: s(10),
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(14) }}>作成</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
