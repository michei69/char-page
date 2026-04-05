import { useState } from "react";
import Character from "../lib/CharacterState";
import { ArrowDown, ArrowUp } from "lucide-react";
import { moveInArray } from "../lib/Utils";

export default function EditorRelation({
    relations,
    setRelations,
    idx,
    relation,
    description,
    charId: charId,
}: {
    relations: Character["relations"];
    setRelations: (relations: Character["relations"]) => void;
    idx: number;
    relation: string;
    description: string;
    charId: string;
}) {
    const [tempRelation, setTempRelation] = useState(relation);
    const [tempDescription, setTempDescription] = useState(description);
    return (
        <div className="flex flex-row gap-4 justify-center items-center w-full">
            <div className="flex flex-col">
                <button
                    className="p-0!"
                    onClick={() => {
                        const newRelations = [...relations];
                        if (idx == 0) {
                            newRelations.push(relations[idx]);
                            setRelations(newRelations.slice(idx + 1));
                        } else {
                            setRelations(
                                moveInArray(newRelations, idx, idx - 1),
                            );
                        }
                    }}
                >
                    <ArrowUp />
                </button>
                <button
                    className="p-0!"
                    onClick={() => {
                        const newRelations = [...relations];
                        if (idx >= newRelations.length - 1) {
                            setRelations([
                                relations[idx],
                                ...newRelations.slice(0, idx),
                            ]);
                        } else {
                            setRelations(
                                moveInArray(newRelations, idx, idx + 1),
                            );
                        }
                    }}
                >
                    <ArrowDown />
                </button>
            </div>
            <p className="text-right">{charId}</p>
            <input
                type="text"
                className="cute-border-visible p-2 rounded-xl w-full"
                value={tempRelation}
                onChange={(e) => {
                    const newRelations = [...relations];
                    newRelations[idx] = {
                        ...relations[idx],
                        relation: e.target.value.trim(),
                    };
                    setTempRelation(e.target.value);
                    setRelations(newRelations);
                }}
            />
            <textarea
                className="cute-border-visible p-2 rounded-xl w-full"
                value={tempDescription}
                onChange={(e) => {
                    const newRelations = [...relations];
                    newRelations[idx] = {
                        ...relations[idx],
                        description: e.target.value,
                    };
                    setTempDescription(e.target.value);
                    setRelations(newRelations);
                }}
            />
            <button
                className="cute-border-visible p-2 rounded-xl"
                onClick={() => {
                    const newRelations = [...relations];
                    newRelations.splice(idx, 1);
                    setRelations(newRelations);
                }}
            >
                X
            </button>
        </div>
    );
}
