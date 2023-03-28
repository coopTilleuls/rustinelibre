import {PropsWithChildren} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface HomeCardProps extends PropsWithChildren {
    title: string;
    subTitle: string;
    button: string;
    pageLink: string;
    backgroundColor?: string;
    icon?: string;
    img?: string;
}

export const HomeCard = ({
                    title,
                    subTitle,
                    button,
                    pageLink,
                    backgroundColor,
                    icon,
                    img,
                    children,
                 }: HomeCardProps): JSX.Element => (
    <div className={backgroundColor}>
        <div className="p-5">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-black text-center">
                {title}
            </h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-800 text-center">
                {subTitle}
            </p>
            <Link href={pageLink}
               style={{marginLeft:'15%'}}
               className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 ml-16 w-64">
                {button}
            </Link>
        </div>
    </div>
);
