import { useSnapshot } from "valtio";
import Character from "../lib/CharacterState";
import { camelCaseToReadable } from "../lib/Utils";
import { useState } from "react";

export default function EditorCheckbox({
    char,
    setVal,
    idx,
    text = "",
}: {
    char: Character;
    setVal: (val: boolean) => void;
    idx: string;
    text?: string;
}) {
    const [active, setActive] = useState(
        char[idx as keyof Character] as boolean,
    );
    return (
        <div className="flex flex-row gap-4 justify-center items-center w-full">
            <input
                type="checkbox"
                checked={active}
                onChange={(e) => {
                    setActive(e.target.checked);
                    setVal(e.target.checked);
                }}
            />
            <p className="text-left">
                {text != "" ? text : camelCaseToReadable(idx)}
            </p>
        </div>
    );
}
