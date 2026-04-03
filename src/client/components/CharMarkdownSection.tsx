import { CSSProperties } from "react";
import Markdown from "react-markdown";
import CharSection from "./CharSection";

export default function CharMarkdownSection({
    children = "",
    className = "",
    style = {},
    title,
}: {
    children?: string;
    className?: string;
    style?: CSSProperties;
    title: string;
}) {
    return (
        <CharSection title={title} className={className} style={style}>
            <div className="w-full h-full p-4 pt-2 pb-2 markdown-container">
                <Markdown>{children + ""}</Markdown>
            </div>
        </CharSection>
    );
}
