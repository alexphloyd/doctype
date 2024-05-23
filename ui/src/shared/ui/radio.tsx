import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { PrimaryButton } from './buttons/primary';
import { Icon } from './icon';

export const Radio = <O extends RadioOptions>({
    options,
    onChange,
    defaultChecked,
    className,
}: Props<O>) => {
    const [selected, setSelected] = useState<OptionValue | undefined>(defaultChecked);

    const handleOptionClick = (newOption: string) => {
        setSelected(newOption);
        onChange(newOption as AvailableOptions<O>);
    };

    const list = useMemo(() => {
        return options.map((item) => (
            <Button
                key={crypto.randomUUID()}
                value={item.value}
                icon={item.icon}
                iconSection={item.iconSection}
                selected={selected === item.value}
                onClick={handleOptionClick}
            />
        ));
    }, [selected]);

    return (
        <main
            className={twMerge(
                className,
                'w-full flex flex-row items-center justify-center gap-x-4'
            )}
        >
            {list}
        </main>
    );
};

function Button({
    value,
    icon,
    iconSection,
    selected,
    onClick,
}: {
    value: string;
    icon: IconName;
    iconSection: string;
    selected: boolean;
    onClick: (value: string) => void;
}) {
    return (
        <PrimaryButton
            type="transparent"
            className={twMerge(
                'flex items-center justify-center py-7 px-6 w-full',
                selected ? 'bg-cyan-100/80' : 'bg-gray-50/00'
            )}
            onClick={() => onClick(value)}
            content={<Icon name={icon} section={iconSection} className="w-9 h-9" />}
        />
    );
}

interface Props<O extends RadioOptions> {
    options: O;
    onChange: (value: AvailableOptions<O>) => void;
    defaultChecked?: AvailableOptions<O>;
    className?: string;
}

export type RadioOptions = Array<OptionObject>;
export type AvailableOptions<T> = T extends { value: infer V; icon: IconName }[] ? V : never;

type OptionObject = { value: OptionValue; icon: IconName; iconSection: string };
type OptionValue = string;
