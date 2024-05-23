import { DetailedHTMLProps, HTMLAttributes, memo } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement> {
    name: IconName;
    section?: string;
}

export const Icon = memo((props: Props) => {
    const { name, section = 'primary', ...other } = props;

    return (
        <svg {...other} data-testid="icon_svg">
            <use
                data-testid="icon_svg_use"
                xlinkHref={`/icons/${section}.svg#${name.toLocaleLowerCase()}`}
            />
        </svg>
    );
});
