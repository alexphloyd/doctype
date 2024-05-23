import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/Divider.css';
import '@mantine/core/styles/Image.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/Tabs.css';
import '@mantine/core/styles/global.css';
import '@mantine/notifications/styles.css';
import { messageBuilder } from 'core/src/infrastructure/channel-messaging/messages';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ComposedApp } from './composed-app';
import './styles/index.css';

window.addEventListener('online', () => {
    navigator.serviceWorker.controller?.postMessage(
        messageBuilder.NETWORK_STATE_CHANGED('online')
    );
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ComposedApp />
    </StrictMode>
);
