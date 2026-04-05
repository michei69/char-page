import { useState } from "react";
import Character from "../lib/CharacterState";
import CharAlignment from "./CharAlignment";
import { moveInArray } from "../lib/Utils";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function EditorAlignmentChart({
    alignments,
    setAlignments,
    name,
    idx,
    leftSide,
    rightSide,
    topSide,
    bottomSide,
    x = 5,
    y = 5,
}: {
    alignments: Character["alignments"];
    setAlignments: (alignments: Character["alignments"]) => void;
    idx: number;
    name: string;
    leftSide: string;
    rightSide: string;
    topSide: string;
    bottomSide: string;
    x?: number;
    y?: number;
}) {
    const [tempLeft, setTempLeft] = useState(leftSide);
    const [tempRight, setTempRight] = useState(rightSide);
    const [tempTop, setTempTop] = useState(topSide);
    const [tempBottom, setTempBottom] = useState(bottomSide);
    const [tempX, setTempX] = useState(x);
    const [tempY, setTempY] = useState(y);
    return (
        <div className="w-full flex flex-col gap-2 p-4 dark-accent-border rounded-xl">
            <h1 className="w-full text-center font-bold text-lg">
                Alignment Chart
            </h1>
            <div className="flex flex-row gap-2">
                <div className="w-1/2">
                    <p>Name</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={name}
                        disabled={true}
                    />
                    <p>Top Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={tempTop}
                        onChange={(e) => {
                            setTempTop(e.target.value);
                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                top: e.target.value,
                            };
                            setAlignments(alignments);
                        }}
                    />
                    <p>Left Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={leftSide}
                        onChange={(e) => {
                            setTempLeft(e.target.value);
                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                left: e.target.value,
                            };
                            setAlignments(alignments);
                        }}
                    />
                    <p>X</p>
                    <input
                        type="number"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={x}
                        onChange={(e) => {
                            setTempX(parseInt(e.target.value));
                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                x: parseFloat(e.target.value),
                            };
                            setAlignments(alignments);
                        }}
                    />
                </div>
                <div className="w-1/2">
                    <p>Right Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={rightSide}
                        onChange={(e) => {
                            setTempRight(e.target.value);

                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                right: e.target.value,
                            };
                            setAlignments(alignments);
                        }}
                    />
                    <p>Bottom Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={bottomSide}
                        onChange={(e) => {
                            setTempBottom(e.target.value);

                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                bottom: e.target.value,
                            };
                            setAlignments(alignments);
                        }}
                    />
                    <p>Y</p>
                    <input
                        type="number"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={y}
                        onChange={(e) => {
                            setTempY(parseInt(e.target.value));

                            // const alignment = [...alignments];
                            alignments[idx] = {
                                ...alignments[idx],
                                y: parseFloat(e.target.value),
                            };
                            setAlignments(alignments);
                        }}
                    />
                </div>
            </div>
            <CharAlignment
                name={name}
                leftSide={tempLeft}
                rightSide={tempRight}
                topSide={tempTop}
                bottomSide={tempBottom}
                x={tempX}
                y={tempY}
                handleClick={(percentX: number, percentY: number) => {
                    setTempX(Math.round(percentX * 100) / 100);
                    setTempY(Math.round(percentY * 100) / 100);
                    alignments[idx] = {
                        ...alignments[idx],
                        x: Math.round(percentX * 100) / 100,
                        y: Math.round(percentY * 100) / 100,
                    };
                    setAlignments(alignments);
                }}
            />
            <div className="flex flex-row items-center gap-1">
                <div className="flex flex-col">
                    <button
                        className="p-0!"
                        onClick={() => {
                            const newAlignments = [...alignments];
                            if (idx == 0) {
                                newAlignments.push(alignments[idx]);
                                setAlignments(newAlignments.slice(idx + 1));
                            } else {
                                setAlignments(
                                    moveInArray(newAlignments, idx, idx - 1),
                                );
                            }
                        }}
                    >
                        <ArrowUp />
                    </button>
                    <button
                        className="p-0!"
                        onClick={() => {
                            const newAlignments = [...alignments];
                            if (idx >= newAlignments.length - 1) {
                                setAlignments([
                                    alignments[idx],
                                    ...newAlignments.slice(0, idx),
                                ]);
                            } else {
                                setAlignments(
                                    moveInArray(newAlignments, idx, idx + 1),
                                );
                            }
                        }}
                    >
                        <ArrowDown />
                    </button>
                </div>
                <button
                    className="mt-2 w-full p-2 rounded-xl bg-primary text-white font-bold cute-border-visible"
                    onClick={() => {
                        setAlignments(alignments.filter((_, i) => i !== idx));
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
