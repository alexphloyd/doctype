import { Tabs } from '@mantine/core';

import { useAppDispatch } from '~/app/store/hooks';

import { type Tab, type SignInProcess } from '~/features/auth/model/types';

import { actions } from '../model/model';
import { useSignInProcessTab } from '../model/selectors';
import { Login } from './forms/log-in.form';
import { SignUp } from './forms/sign-up.form';

export function SignIn() {
    const dispatch = useAppDispatch();

    const activeTab = useSignInProcessTab();

    const handleChangeTab = (key: string | null) => {
        dispatch(actions.changeSignInProcessStep('credentials'));
        dispatch(actions.changeSignInProcessTab(key as TypeOfValue<SignInProcess, 'tab'>));
    };

    return (
        <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            variant="pills"
            classNames={{
                list: 'bg-gray-100/50 rounded-md px-[6px] py-[6px]',
                tabLabel: 'text-md tracking-wide',
                tab: 'h-8 data-[active]:shadow-sm text-gray-500 data-[active]:text-fontPrimary',
            }}
            color="white"
            className="w-[84%] sm:w-[60%] md:w-[55%] lg:w-[43%] xl:w-[38%] 2xl:w-[31%]"
        >
            <Tabs.List justify="center" grow className="mb-5 gap-0 bg-backgroundPrimary">
                <Tabs.Tab className="w-[50%]" value={'sign-up' satisfies Tab}>
                    Create An Account
                </Tabs.Tab>
                <Tabs.Tab className="w-[50%]" value={'log-in' satisfies Tab}>
                    Log In
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={'sign-up' satisfies Tab}>
                <SignUp />
            </Tabs.Panel>

            <Tabs.Panel value={'log-in' satisfies Tab}>
                <Login />
            </Tabs.Panel>
        </Tabs>
    );
}
