import { GoogleOAuthProvider } from '@react-oauth/google';
import { type ReactNode } from 'react';

export const WithGoogleOAuth = (component: () => ReactNode) => () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            {component()}
        </GoogleOAuthProvider>
    );
};
