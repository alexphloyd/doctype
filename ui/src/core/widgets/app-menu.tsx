import { Divider } from '@mantine/core';
import { useLocationArray } from '~/core/app/router/use-location-array';
import { useAppDispatch } from '~/core/app/store/hooks';
import { create as createDocument } from '~/core/entities/document/model/effects/create';
import { AuthActionsButton } from '~/core/features/auth/ui/buttons/session-action.button';
import { AppLoader } from '~/core/shared/ui/app-loader/ui';
import { NavigationButton } from '~/core/shared/ui/buttons/navigation';
import { ToolbarActionButton } from '~/core/shared/ui/buttons/toolbar-action';
import { Icon } from '~/core/shared/ui/icon';

export const AppMenu = () => {
    const location = useLocationArray();

    return (
        <header className="py-[0.9rem] flex flex-col min-h-screen min-w-full">
            <section className="gap-y-2 flex flex-col grow">
                <NavigationButton
                    pushTo="/"
                    content={
                        <Icon name="home" className="w-[1.09rem] h-[1.09rem] text-accent" />
                    }
                />
                <NavigationButton
                    pushTo="/editor/12"
                    content={
                        <Icon name="app" className="w-[1.09rem] h-[1.09rem] text-accent" />
                    }
                />

                {location[0] !== 'sign-in' ? (
                    <Divider
                        classNames={{
                            root: 'h-[1px] w-full border-borderPrimary',
                        }}
                        orientation="horizontal"
                    />
                ) : null}

                <HomeToolbar />
                <EditorToolbar />
            </section>

            <section className="flex flex-col items-center justify-center">
                <AppLoader className="mb-[0.3rem]" />
                <AuthActionsButton />
            </section>
        </header>
    );
};

const HomeToolbar = () => {
    const location = useLocationArray();
    const show = location[0] === '';

    const dispatch = useAppDispatch();

    const _createDocument = () => {
        dispatch(createDocument());
    };

    return (
        <section hidden={!show}>
            <ToolbarActionButton
                debounce
                onClick={_createDocument}
                content={<Icon name="write" className="w-[1.09rem] h-[1.09rem] text-accent" />}
            />
        </section>
    );
};

const EditorToolbar = () => {
    const location = useLocationArray();
    const show = location[0] === 'editor';

    return (
        <section hidden={!show}>
            <ToolbarActionButton
                onClick={() => null}
                content={<Icon name="share" className="w-[1.09rem] h-[1.09rem] text-accent" />}
            />
        </section>
    );
};