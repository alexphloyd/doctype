import { Avatar } from '@mantine/core';
import { m } from 'framer-motion';

import { useAppDispatch } from '~/app/store/hooks';

import { useNetworkState } from '~/shared/lib/use-network-state';
import { NavigationButton } from '~/shared/ui/buttons/navigation';
import { Icon } from '~/shared/ui/icon';

import { actions } from '../../model/model';
import { useSession } from '../../model/selectors';

export const AuthActionsButton = () => {
    const dispatch = useAppDispatch();

    const network = useNetworkState();
    const session = useSession();

    const handleLogout = () => {
        dispatch(actions.logout());
    };

    if (!session && network.online) {
        return (
            <NavigationButton
                className="px-[9.5px] py-[7px] "
                pushTo="/sign-in"
                content={
                    <Icon
                        name="login"
                        className="w-[1.19rem] h-[1.19rem] text-accent -ml-[0.5px]"
                    />
                }
            />
        );
    }

    if (session) {
        return (
            <m.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.2,
                    ease: 'easeIn',
                }}
            >
                <Avatar
                    styles={{ root: { cursor: 'pointer', marginBottom: '-5px' } }}
                    src={'/avatar-placeholder.png'}
                    size={'md'}
                    onClick={handleLogout}
                />
            </m.div>
        );
    }
};
