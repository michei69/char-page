import { useSnapshot } from "valtio";
import Character from "../lib/CharacterState";
import { camelCaseToReadable } from "../lib/Utils";
import { useState } from "react";

export default function EditorInput({
    char,
    setVal,
    idx,
    text = "",
    useSnap = false,
}: {
    char: Character;
    setVal: (val: string) => void;
    idx: string;
    text?: string;
    useSnap?: boolean;
}) {
    const [txt, setTxt] = useState(char[idx as keyof Character] as string);
    const snap = useSnap ? useSnapshot(char) : null;
    return (
        <div className="flex flex-row gap-4 justify-center items-center w-full">
            <p className="text-right" style={{ minWidth: "20%" }}>
                {text != "" ? text : camelCaseToReadable(idx)}
            </p>
            <input
                type="text"
                className="cute-border-visible p-2 rounded-xl w-full"
                value={
                    useSnap && snap
                        ? (snap[idx as keyof Character] as string)
                        : txt
                }
                onChange={(e) => {
                    setTxt(e.target.value);
                    setVal(e.target.value);
                }}
            />
        </div>
    );
}
