import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatView from '@/components/ChatView';

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
      {/* ヘッダー */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 44,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 16, color: '#FF8700' }}>{'＜ 戻る'}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>チャット</Text>
      </View>

      <ChatView groupId={groupId} />
    </View>
  );
}
