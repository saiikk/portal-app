import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { groupsApi, type GroupMember } from '@/api/groups';
import Avatar from '@/components/Avatar';
import ChatView from '@/components/ChatView';
import { useAuthStore } from '@/stores/authStore';
import { s } from '@/utils/scale';

const MAX_PREVIEW = 3;

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showMembers, setShowMembers] = useState(false);

  const { data: groupData } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupsApi.getGroup(groupId),
  });

  const { data: members = [], isSuccess: isMembersSuccess } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => groupsApi.getMembers(groupId),
  });

  // 非メンバー（退出済み含む）はトップにリダイレクト
  const isMember = members.some((m) => m.id === user?.id);
  useEffect(() => {
    if (isMembersSuccess && !isMember) {
      router.replace('/(tabs)/');
    }
  }, [isMembersSuccess, isMember, router]);

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'owner' | 'member' }) =>
      groupsApi.updateMemberRole(groupId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
    },
    onError: () => {
      Alert.alert('エラー', 'グループには最低1人のオーナーが必要です。');
    },
  });

  const { mutate: kickMember } = useMutation({
    mutationFn: (userId: string) =>
      groupsApi.kickMember(groupId, userId, groupData?.name ?? 'グループ'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
    },
    onError: () => {
      Alert.alert('エラー', '退出処理に失敗しました。');
    },
  });

  const handleRoleToggle = (member: GroupMember) => {
    const newRole = member.role === 'owner' ? 'member' : 'owner';

    if (newRole === 'member') {
      const ownerCount = members.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        Alert.alert('変更できません', 'グループには最低1人のオーナーが必要です。');
        return;
      }
    }

    const label = newRole === 'owner' ? 'オーナー' : 'メンバー';
    Alert.alert(
      'ロール変更',
      `${member.name} を${label}に変更しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '変更', onPress: () => updateRole({ userId: member.id, role: newRole }) },
      ]
    );
  };

  const handleKick = (member: GroupMember) => {
    if (member.role === 'owner') {
      const ownerCount = members.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        Alert.alert('退出できません', 'グループには最低1人のオーナーが必要です。');
        return;
      }
    }

    const doKick = () => kickMember(member.id);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`${member.name} をグループから退出させますか？`)) {
        doKick();
      }
      return;
    }

    Alert.alert(
      'メンバーを退出',
      `${member.name} をグループから退出させますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '退出させる', style: 'destructive', onPress: doKick },
      ]
    );
  };

  const currentUserRole = members.find((m) => m.id === user?.id)?.role;
  const isOwner = currentUserRole === 'owner';

  const preview = members.slice(0, MAX_PREVIEW);
  const extra = members.length - MAX_PREVIEW;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
      {/* ヘッダー */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: s(44),
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          paddingHorizontal: s(12),
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: s(12) }}>
          <Text style={{ fontSize: s(16), color: '#FF8700' }}>{'＜ 戻る'}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: s(16), fontWeight: '600', flex: 1 }}>
          {groupData?.name ?? 'チャット'}
        </Text>

        {/* 重なりアバター */}
        <TouchableOpacity
          onPress={() => setShowMembers(true)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          {preview.map((m, i) => (
            <View
              key={m.id}
              style={{
                marginLeft: i === 0 ? 0 : -s(10),
                borderWidth: 2,
                borderColor: '#fff',
                borderRadius: s(16),
                zIndex: MAX_PREVIEW - i,
              }}
            >
              <Avatar uri={m.icon_url} size={s(28)} />
            </View>
          ))}
          {extra > 0 && (
            <View
              style={{
                width: s(28), height: s(28), borderRadius: s(14),
                backgroundColor: '#e0e0e0', marginLeft: -s(10),
                borderWidth: 2, borderColor: '#fff',
                justifyContent: 'center', alignItems: 'center', zIndex: 0,
              }}
            >
              <Text style={{ fontSize: s(9), color: '#666', fontWeight: '600' }}>+{extra}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ChatView groupId={groupId} />

      {/* メンバー一覧モーダル */}
      <Modal visible={showMembers} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: s(16), padding: s(20), width: '85%', maxHeight: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: s(16) }}>
              <Text style={{ fontSize: s(16), fontWeight: '600' }}>
                メンバー（{members.length}人）
              </Text>
              <TouchableOpacity onPress={() => setShowMembers(false)}>
                <Text style={{ fontSize: s(14), color: '#FF8700' }}>閉じる</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={members}
              keyExtractor={(item: GroupMember) => item.id}
              renderItem={({ item }: { item: GroupMember }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: s(10), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                  <Avatar uri={item.icon_url} size={s(40)} />
                  <View style={{ flex: 1, marginLeft: s(12) }}>
                    <Text style={{ fontSize: s(14), fontWeight: '500', color: '#000' }}>{item.name}</Text>
                    <Text style={{ fontSize: s(11), color: '#888', marginTop: s(2) }}>
                      {item.type === 'new_graduate' ? '新卒' : '社員'}
                    </Text>
                  </View>

                  {/* ロール表示 / 変更 */}
                  {isOwner ? (
                    <TouchableOpacity
                      onPress={() => handleRoleToggle(item)}
                      style={{
                        paddingHorizontal: s(10),
                        paddingVertical: s(4),
                        borderRadius: s(12),
                        backgroundColor: item.role === 'owner' ? '#FF8700' : '#f0f0f0',
                        marginRight: s(6),
                      }}
                    >
                      <Text style={{ fontSize: s(11), fontWeight: '600', color: item.role === 'owner' ? '#fff' : '#666' }}>
                        {item.role === 'owner' ? 'オーナー' : 'メンバー'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ fontSize: s(11), color: '#888', marginRight: s(6) }}>
                      {item.role === 'owner' ? 'オーナー' : 'メンバー'}
                    </Text>
                  )}

                  {/* 退出ボタン（オーナーのみ・自分以外） */}
                  {isOwner && item.id !== user?.id && (
                    <TouchableOpacity
                      onPress={() => handleKick(item)}
                      style={{
                        paddingHorizontal: s(8),
                        paddingVertical: s(4),
                        borderRadius: s(12),
                        borderWidth: 1,
                        borderColor: '#ff4444',
                      }}
                    >
                      <Text style={{ fontSize: s(11), color: '#ff4444', fontWeight: '600' }}>退出</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
