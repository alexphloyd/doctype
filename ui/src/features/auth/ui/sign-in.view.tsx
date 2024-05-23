import { Divider, Tabs } from '@mantine/core';

import { useAppDispatch } from '~/app/store/hooks';

import { type Tab, type SignInProcess } from '~/features/auth/model/types';

import { actions } from '../model/model';
import { useSignInProcessStep, useSignInProcessTab } from '../model/selectors';
import { GoogleButton } from './buttons/google.button';
import { Login } from './forms/log-in.form';
import { SignUp } from './forms/sign-up.form';

export function SignIn() {
    const dispatch = useAppDispatch();

    const activeTab = useSignInProcessTab();
    const step = useSignInProcessStep();

    const handleChangeTab = (key: string | null) => {
        dispatch(actions.changeSignInProcessStep('credentials'));
        dispatch(actions.changeSignInProcessTab(key as TypeOfValue<SignInProcess, 'tab'>));
    };

    return (
        <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            variant="outline"
            className="w-[84%] sm:w-[60%] md:w-[55%] lg:w-[43%] xl:w-[38%] 2xl:w-[31%]"
        >
            <Tabs.List justify="center" className="mb-5">
                <Tabs.Tab
                    className="px-4"
                    styles={{
                        tabLabel: { fontSize: '0.95rem' },
                    }}
                    value={'sign-up' satisfies Tab}
                >
                    Create An Account
                </Tabs.Tab>
                <Tabs.Tab
                    className="px-8"
                    styles={{
                        tabLabel: { fontSize: '0.95rem' },
                    }}
                    value={'log-in' satisfies Tab}
                >
                    Log In
                </Tabs.Tab>
            </Tabs.List>

            {step !== 'verification' ? (
                <>
                    <GoogleButton />

                    <Divider
                        my="md"
                        styles={{
                            label: {
                                fontSize: '0.92rem',
                                fontWeight: '100',
                                borderColor: 'rgb(229 231 235 / 0.7)',
                            },
                        }}
                        label="or with credentials"
                        labelPosition="center"
                    />
                </>
            ) : null}

            <Tabs.Panel value={'sign-up' satisfies Tab}>
                <SignUp />
            </Tabs.Panel>

            <Tabs.Panel value={'log-in' satisfies Tab}>
                <Login />
            </Tabs.Panel>
        </Tabs>
    );
}
