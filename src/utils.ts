import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Utility function to merge Tailwind classes
export const cn = (...inputs: (string | undefined | false | null)[]) => {
    return twMerge(clsx(inputs));
};
