import type { Message } from '@/types';
import client from './client';

export const messagesApi = {
  getMessages: (groupId: string) =>
    client.get<Message[]>(`/groups/${groupId}/messages`).then((r) => r.data),

  sendMessage: (groupId: string, body: string) =>
    client.post<Message>(`/groups/${groupId}/messages`, { body }).then((r) => r.data),
};
