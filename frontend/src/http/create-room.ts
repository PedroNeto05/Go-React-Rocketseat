interface CreateRoomRequest {
  theme: string;
}

export async function createRoom({ theme }: CreateRoomRequest) {
  const response = await fetch(`http://localhost:8080/api/rooms`, {
    method: 'POST',
    body: JSON.stringify({
      theme,
    }),
  });

  const data: { id: string } = await response.json();

  return { roomId: data.id };
}
