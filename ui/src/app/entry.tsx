import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/Divider.css';
import '@mantine/core/styles/Image.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/Tabs.css';
import '@mantine/core/styles/global.css';
import '@mantine/notifications/styles.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ComposedApp } from './composed-app';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ComposedApp />
    </StrictMode>
);
