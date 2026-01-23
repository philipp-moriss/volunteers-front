import {FC} from 'react'

type IconProps = {
    iconId: string
    size?: number
    className?: string
}

export const Icon: FC<IconProps> = ({ iconId, size = 24, className = '' }) => {
    const sprite = '/icons-sprite.svg'

    return (
        <svg className={className} width={size} height={size} fill={'currentColor'}>
            <use href={`${sprite}#${iconId}`} />

        </svg>
    )
}
