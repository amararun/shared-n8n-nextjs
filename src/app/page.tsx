import Chat from '@/components/chat/chat';
import { LogService } from '@/lib/log-service';

// Initialize LogService on the client side
if (typeof window !== 'undefined') {
  LogService.getInstance();
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Chat />
    </div>
  );
}
