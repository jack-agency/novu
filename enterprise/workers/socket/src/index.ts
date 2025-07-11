import { Hono } from 'hono';
import { authenticateJWT } from './middleware/auth';
import { authenticateInternalAPI } from './middleware/internal-auth';
import { handleWebSocketUpgrade, handleSendMessage } from './handlers/websocket';
import { WebSocketRoom } from './durable-objects/websocket-room';
import type { IEnv } from './types';

const app = new Hono<{ Bindings: IEnv }>();

app.get('/', authenticateJWT, handleWebSocketUpgrade);

app.post('/send', authenticateInternalAPI, handleSendMessage);

app.get('/health', (context) => context.text('OK'));

app.notFound((context) => context.text('Not found', 404));

app.onError((err, context) => {
	console.error('Application error:', err);

	return context.json({ error: 'Internal server error' }, 500);
});

export { WebSocketRoom };
export default app;
