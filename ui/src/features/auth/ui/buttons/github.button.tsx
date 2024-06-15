import { Button } from '@mantine/core';

import { Icon } from '~/shared/ui/icon';

export const GithubButton = () => {
    return (
        <Button
            variant="white"
            classNames={{ root: 'hover:bg-gray-100/40 bg-gray-100/40 px-4' }}
            size="md"
        >
            <div className="flex items-center justify-center">
                <Icon name="github" className="w-5 h-5 text-black/90" />
            </div>
        </Button>
    );
};
