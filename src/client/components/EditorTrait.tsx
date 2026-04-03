import { useState } from "react";
import { camelCaseToReadable } from "../lib/Utils";

export default function EditorTrait({
    traits,
    setTraits,
    traitName,
    traitValue,
    options,
    editor = false,
}: {
    traits: {
        [label: string]: string;
    };
    setTraits: (char: { [label: string]: string }) => void;
    traitName: string;
    traitValue: string;
    options: { [key: string]: string };
    editor?: boolean;
}) {
    const [temp, setTemp] = useState(traitValue);
    const [temp2, setTemp2] = useState(camelCaseToReadable(traitName));
    const [temp3, setTemp3] = useState(traitName);

    return (
        <div className="flex flex-row gap-2 w-full">
            <select
                className="cute-border-visible p-2 rounded-xl w-full"
                value={temp3}
                title={options[temp3]}
                onChange={(e) => {
                    setTemp3(e.target.value);
                    setTemp2(camelCaseToReadable(e.target.value));
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
                onChange={(e) => {
                    if (!editor) {
                        const newTraits = {
                            ...traits,
                            [e.target.value]: temp,
                        };
                        delete newTraits[temp2];
                        delete newTraits[temp2.toLowerCase()];
                        setTraits(newTraits);
                    }
                    setTemp2(e.target.value);
                }}
            />
            <input
                type="text"
                className="cute-border-visible p-2 rounded-xl w-full"
                value={temp}
                onChange={(e) => {
                    setTemp(e.target.value);
                    if (!editor)
                        setTraits({ ...traits, [temp2]: e.target.value });
                }}
            />
            {!editor ? (
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        const newTraits = { ...traits };
                        console.log(newTraits, temp2);
                        delete newTraits[temp2];
                        delete newTraits[temp2.toLowerCase()];
                        setTraits(newTraits);
                    }}
                >
                    X
                </button>
            ) : (
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        setTraits({ ...traits, [temp2]: temp });
                    }}
                >
                    Add
                </button>
            )}
        </div>
    );
}
