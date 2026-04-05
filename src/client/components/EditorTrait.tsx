import { useEffect, useState } from "react";
import {
    camelCaseToReadable,
    getIndex,
    getKey,
    moveInArray,
    moveStuff,
} from "../lib/Utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import Character from "../lib/CharacterState";

export default function EditorTrait({
    traits,
    setTraits,
    traitName,
    traitValue,
    options,
    idx = -1,
    editor = false,
}: {
    traits: Character["traits"];
    setTraits: (char: Character["traits"]) => void;
    traitName: string;
    traitValue: string;
    options: { [key: string]: string };
    idx?: number;
    editor?: boolean;
}) {
    const [temp, setTemp] = useState(traitValue);
    const [temp2, setTemp2] = useState(camelCaseToReadable(traitName));
    const [temp3, setTemp3] = useState(traitName);

    return (
        <div className="flex flex-row gap-2 w-full">
            {idx != -1 && (
                <div className="flex flex-col">
                    <button
                        className="p-0!"
                        onClick={() => {
                            const newTraits = [...traits];
                            if (idx == 0) {
                                newTraits.push(traits[idx]);
                                setTraits(newTraits.slice(idx + 1));
                            } else {
                                setTraits(moveInArray(newTraits, idx, idx - 1));
                            }
                        }}
                    >
                        <ArrowUp />
                    </button>
                    <button
                        className="p-0!"
                        onClick={() => {
                            const newTraits = [...traits];
                            if (idx >= newTraits.length - 1) {
                                setTraits([
                                    traits[idx],
                                    ...newTraits.slice(0, idx),
                                ]);
                            } else {
                                setTraits(moveInArray(newTraits, idx, idx + 1));
                            }
                        }}
                    >
                        <ArrowDown />
                    </button>
                </div>
            )}
            <select
                // text black cause firefox gets its select colors wrong and its white on white lol
                className="p-2 rounded-xl w-8 text-black invert"
                value={temp3}
                title={options[temp3]}
                onChange={(e) => {
                    setTemp3(e.target.value);
                    setTemp2(camelCaseToReadable(e.target.value));
                    setTemp("");
                }}
            >
                {options &&
                    Object.entries(options).map(([o, question], idx) => (
                        <option key={idx} value={o} title={question as string}>
                            {camelCaseToReadable(o)}
                        </option>
                    ))}
            </select>
            <input
                type="text"
                className="cute-border-visible p-2 rounded-xl w-full"
                value={temp2}
                placeholder="Name"
                onChange={(e) => {
                    setTemp2(e.target.value);
                }}
                onBlur={() => {
                    if (!editor) {
                        const newTraits = [...traits];
                        newTraits[idx] = {
                            ...newTraits[idx],
                            label: temp2,
                        };
                        setTraits(newTraits);
                    }
                }}
            />
            <input
                type="text"
                className="cute-border-visible p-2 rounded-xl w-full"
                value={temp}
                placeholder="Value"
                onChange={(e) => {
                    setTemp(e.target.value);
                    if (!editor) {
                        const newTraits = [...traits];
                        newTraits[idx] = {
                            ...newTraits[idx],
                            text: e.target.value,
                        };
                        setTraits(newTraits);
                    }
                }}
            />
            {!editor ? (
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        setTraits(traits.filter((_, i) => i != idx));
                    }}
                >
                    X
                </button>
            ) : (
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        traits.push({
                            label: temp2,
                            text: temp,
                        });
                        setTraits(traits);
                        setTemp("");
                        setTemp2("");
                    }}
                >
                    Add
                </button>
            )}
        </div>
    );
}
