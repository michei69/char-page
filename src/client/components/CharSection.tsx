import { CSSProperties } from "react";

export default function CharSection({
    children = null,
    className = "",
    style = {},
    title,
}: {
    children?: React.ReactNode;
    className?: string;
    style?: CSSProperties;
    title: string;
}) {
    return (
        <section className={className ? className : "p-4"} style={style}>
            <h1 className="text-xl font-bold text-left">{title}</h1>
            <hr className="w-full" />
            {children}
        </section>
    );
}
