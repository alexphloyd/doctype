import { Button, MantineProvider, TextInput, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';

const theme = createTheme({
    fontFamily: 'Roboto',
    fontSizes: { sm: '0.87rem', md: '0.94rem' },
    components: {
        TextInput: TextInput.extend({
            classNames: {
                input: 'text-fontPrimary border-borderDark focus:border-accent',
            },
        }),
        Button: Button.extend({
            classNames: {
                label: 'font-[500]',
            },
        }),
    },
});

export const WithMantine = (component: () => ReactNode) => () => {
    return (
        <MantineProvider theme={theme}>
            <Notifications />
            {component()}
        </MantineProvider>
    );
};
