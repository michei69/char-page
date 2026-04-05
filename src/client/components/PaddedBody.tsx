import { CSSProperties } from "react";

export default function PaddedBody({
    children = null,
    className = "",
    style = {},
}: {
    children?: React.ReactNode;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <div
            className={`mr-auto ml-auto p-16 sm:pl-1 sm:pr-1 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
