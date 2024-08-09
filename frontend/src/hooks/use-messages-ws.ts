import { useEffect } from 'react';
import { GetRoomMessagesResponse } from '../http/get-room-messages';
import { useQueryClient } from '@tanstack/react-query';

interface UseMessagesWebSocketsParams {
  roomId: string;
}

type WebhookMessage =
  | { kind: 'message_created'; value: { id: string; message: string } }
  | { kind: 'message_answered'; value: { id: string } }
  | { kind: 'message_reaction_increased'; value: { id: string; count: number } }
  | {
      kind: 'message_reaction_decreased';
      value: { id: string; count: number };
    };

export function useMessagesWebSockets({ roomId }: UseMessagesWebSocketsParams) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);

    ws.onopen = () => {
      console.log('websocket connect');
    };

    ws.onclose = () => {
      console.log('websocket connection closed');
    };

    ws.onmessage = (event) => {
      const wsData: WebhookMessage = JSON.parse(event.data);
      console.log(wsData);

      switch (wsData.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomId],
            (state) => {
              return {
                messages: [
                  ...(state?.messages ?? []),
                  {
                    id: wsData.value.id,
                    text: wsData.value.message,
                    amountOfReactions: 0,
                    answered: false,
                  },
                ],
              };
            }
          );
          break;
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomId],
            (state) => {
              if (!state) return undefined;

              return {
                messages: state.messages.map((item) => {
                  if (item.id === wsData.value.id) {
                    return { ...item, answered: true };
                  }

                  return item;
                }),
              };
            }
          );
          break;
        case 'message_reaction_increased':
        case 'message_reaction_decreased':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomId],
            (state) => {
              if (!state) return undefined;

              return {
                messages: state.messages.map((item) => {
                  if (item.id === wsData.value.id) {
                    return { ...item, amountOfReactions: wsData.value.count };
                  }

                  return item;
                }),
              };
            }
          );
          break;
        default:
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, queryClient]);
}
