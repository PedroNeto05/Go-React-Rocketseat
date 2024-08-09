interface GetRoomMessagesRequest {
  roomId: string;
}

export async function getRoomMessagesRequest({
  roomId,
}: GetRoomMessagesRequest) {
  const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`);

  const data: Array<{
    id: string;
    room_id: string;
    message: string;
    reaction_count: number;
    answered: boolean;
  }> = await response.json();

  return {
    messages: data.map((item) => {
      return {
        id: item.id,
        text: item.message,
        amountOfReactions: item.reaction_count,
        answered: item.answered,
      };
    }),
  };
}
