import '@mantine/core/styles/ScrollArea.css';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/VisuallyHidden.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/Popover.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/Group.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Overlay.css';
import '@mantine/core/styles/ModalBase.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/InlineInput.css';
import '@mantine/core/styles/Flex.css';

import '@mantine/core/styles/Alert.css';
import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/Divider.css';
import '@mantine/core/styles/Image.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/ModalBase.css';
import '@mantine/core/styles/Modal.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/Tabs.css';
import '@mantine/core/styles/Kbd.css';
import '@mantine/core/styles/global.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import 'reactflow/dist/style.css';
import './styles/index.css';

import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ComposedApp } from './composed-app';

window.addEventListener('online', () => {
  navigator.serviceWorker.controller?.postMessage(NETWORK_MESSAGES.ONLINE);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ComposedApp />
  </StrictMode>
);
