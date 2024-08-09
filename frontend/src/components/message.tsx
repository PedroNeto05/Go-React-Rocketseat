import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

interface MessageProps {
  text: string;
  amountOfReaction: number;
  answered?: boolean;
}

export function Message({ text, amountOfReaction, answered }: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false);
  function handleReactToMessage() {
    setHasReacted(true);
  }
  return (
    <li
      data-answered={answered}
      className='ml-4 leading-relaxed text-zinc-100 data-[answered=true]:pointer-events-none data-[answered=true]:opacity-50'
    >
      {text}
      {hasReacted ? (
        <button
          type='button'
          className='mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500'
        >
          <ArrowUp className='size-4' />
          Curtir Pergunta ({amountOfReaction})
        </button>
      ) : (
        <button
          type='button'
          onClick={handleReactToMessage}
          className='mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300'
        >
          <ArrowUp className='size-4' />
          Curtir Pergunta ({amountOfReaction})
        </button>
      )}
    </li>
  );
}
