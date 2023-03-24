import {PropsWithChildren} from 'react';
import Link from 'next/link';

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
            <a href="#"
               style={{marginLeft:'15%'}}
               className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 ml-16 w-64">
                <Link href={pageLink} className="text-white">
                    {button}
                </Link>
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d={icon ?? "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"}
                          clipRule="evenodd"></path>
                </svg>
            </a>
        </div>
    </div>
);
