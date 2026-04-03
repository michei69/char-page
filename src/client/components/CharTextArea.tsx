import { useSnapshot } from "valtio";
import Character from "../lib/CharacterState";
import { useState } from "react";
import Markdown from "react-markdown";

export default function CharTextArea({
    char,
    onChange,
    idx,
    markdown = false,
}: {
    char: Character;
    onChange: (val: string) => void;
    idx: string;
    markdown?: boolean;
}) {
    const [val, setVal] = useState(char[idx as keyof Character] as string);
    const [preview, setPreview] = useState(false);
    return (
        <>
            {preview ? (
                <div className="h-96 w-full markdown-container">
                    <Markdown>{val}</Markdown>
                </div>
            ) : (
                <textarea
                    className="cute-border-visible p-2 rounded-xl w-full h-96"
                    value={val}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setVal(e.target.value);
                    }}
                />
            )}
            {markdown && (
                <button
                    onClick={() => {
                        setPreview(!preview);
                    }}
                >
                    {preview ? "Edit" : "Preview"}
                </button>
            )}
        </>
    );
}
