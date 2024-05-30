import { LazyMotion, domAnimation } from 'framer-motion';
import { type ReactNode } from 'react';

export const WithMotion = (component: () => ReactNode) => () => {
    return <LazyMotion features={domAnimation}>{component()}</LazyMotion>;
};
