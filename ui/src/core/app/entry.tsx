import { NETWORK_MESSAGES } from 'core/src/infrastructure/networking/channel-messaging';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ComposedApp } from './composed-app';
import './styles/index.css';

window.addEventListener('online', () => {
  navigator.serviceWorker.controller?.postMessage(NETWORK_MESSAGES.ONLINE);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ComposedApp />
  </StrictMode>
);
