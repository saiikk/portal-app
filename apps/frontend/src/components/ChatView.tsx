import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { messagesApi } from '@/api/messages';
import Avatar from '@/components/Avatar';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Message } from '@/types';
import { s } from '@/utils/scale';

export default function ChatView({ groupId }: { groupId: string }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => messagesApi.getMessages(groupId),
  });

  // Supabase Realtime でメッセージを即時受信
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [groupId, queryClient]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (body: string) => messagesApi.sendMessage(groupId, body),
    onSuccess: (newMessage) => {
      setInput('');
      queryClient.setQueryData<Message[]>(['messages', groupId], (prev = []) => [
        ...prev,
        newMessage,
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;
    sendMessage(trimmed);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FF8700" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={s(90)}
    >
      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        keyExtractor={(item) => String(item.id)}
        inverted
        contentContainerStyle={{ padding: s(12) }}
        renderItem={({ item }) => {
          const isOwn = item.user_id === user?.id;
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                marginBottom: s(8),
              }}
            >
              {!isOwn && (
                <View style={{ marginRight: s(6) }}>
                  <Avatar uri={item.user?.icon_url} size={s(32)} />
                </View>
              )}
              <View style={{ maxWidth: '75%' }}>
                {!isOwn && (
                  <Text style={{ fontSize: s(10), color: '#888', marginBottom: s(2), marginLeft: s(4) }}>
                    {item.user?.name}
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: isOwn ? '#FF8700' : '#f0f0f0',
                    borderRadius: s(16),
                    borderBottomRightRadius: isOwn ? s(4) : s(16),
                    borderBottomLeftRadius: isOwn ? s(16) : s(4),
                    paddingHorizontal: s(12),
                    paddingVertical: s(8),
                  }}
                >
                  <Text style={{ color: isOwn ? '#fff' : '#000', fontSize: s(14) }}>
                    {item.body}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: s(40) }}>
            <Text style={{ color: '#aaa' }}>メッセージはまだありません</Text>
          </View>
        }
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: s(8),
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: s(20),
            paddingHorizontal: s(14),
            paddingVertical: s(8),
            fontSize: s(14),
            maxHeight: s(100),
            marginRight: s(8),
            color: '#555',
          }}
          value={input}
          onChangeText={setInput}
          placeholder="メッセージを入力"
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim() || isPending}
          style={{
            backgroundColor: input.trim() ? '#FF8700' : '#ccc',
            borderRadius: s(20),
            paddingHorizontal: s(16),
            paddingVertical: s(10),
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(14) }}>送信</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
