import { AnimatePresence, m } from 'framer-motion';
import { BaseLoader } from '~/core/shared/ui/base-loader';

import { useAppLoading } from './model';

export const AppLoader = ({ className }: { className?: string }) => {
    const show = useAppLoading();

    return (
        <AnimatePresence>
            {show && (
                <m.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.17,
                        ease: 'easeIn',
                    }}
                    className={className}
                >
                    <BaseLoader color="blue" size="sm" />
                </m.div>
            )}
        </AnimatePresence>
    );
};
