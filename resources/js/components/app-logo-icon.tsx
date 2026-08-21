import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Modern Boutique Guest House Silhouette & Archway */}
            <path d="M2.5 10L12 2.5L21.5 10V20.5C21.5 21.0523 21.0523 21.5 20.5 21.5H3.5C2.94772 21.5 2.5 21.0523 2.5 20.5V10Z" />
            <path d="M9 21.5V15C9 13.6193 10.1193 12.5 11.5 12.5H12.5C13.8807 12.5 15 13.6193 15 15V21.5" />
            <path d="M9.5 8H14.5" />
            <path d="M12 6.5V9.5" />
        </svg>
    );
}
