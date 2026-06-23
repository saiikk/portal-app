import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
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
import { useAuthStore } from '@/stores/authStore';
import type { Message } from '@/types';

export default function ChatView({ groupId }: { groupId: string }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => messagesApi.getMessages(groupId),
    refetchInterval: 10000,
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (body: string) => messagesApi.sendMessage(groupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
      setInput('');
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
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        keyExtractor={(item) => String(item.id)}
        inverted
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isOwn = item.user_id === user?.id;
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: 8,
              }}
            >
              <View style={{ maxWidth: '75%' }}>
                {!isOwn && (
                  <Text style={{ fontSize: 10, color: '#888', marginBottom: 2, marginLeft: 4 }}>
                    {item.user?.name}
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: isOwn ? '#FF8700' : '#f0f0f0',
                    borderRadius: 16,
                    borderBottomRightRadius: isOwn ? 4 : 16,
                    borderBottomLeftRadius: isOwn ? 16 : 4,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ color: isOwn ? '#fff' : '#000', fontSize: 14 }}>
                    {item.body}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#aaa' }}>メッセージはまだありません</Text>
          </View>
        }
      />

      {/* 入力エリア */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 8,
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
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
            fontSize: 14,
            maxHeight: 100,
            marginRight: 8,
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
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>送信</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
