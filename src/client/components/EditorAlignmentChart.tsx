import { useState } from "react";
import Character from "../lib/CharacterState";
import CharAlignment from "./CharAlignment";

export default function EditorAlignmentChart({
    alignments,
    setAlignments,
    name,
    leftSide,
    rightSide,
    topSide,
    bottomSide,
    x = 5,
    y = 5,
}: {
    alignments: Character["alignments"];
    setAlignments: (alignments: Character["alignments"]) => void;
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
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    top: e.target.value,
                                },
                            });
                        }}
                    />
                    <p>Left Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={leftSide}
                        onChange={(e) => {
                            setTempLeft(e.target.value);
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    left: e.target.value,
                                },
                            });
                        }}
                    />
                    <p>X</p>
                    <input
                        type="number"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={x}
                        onChange={(e) => {
                            setTempX(parseInt(e.target.value));
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    x: parseInt(e.target.value),
                                },
                            });
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
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    right: e.target.value,
                                },
                            });
                        }}
                    />
                    <p>Bottom Side</p>
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={bottomSide}
                        onChange={(e) => {
                            setTempBottom(e.target.value);
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    bottom: e.target.value,
                                },
                            });
                        }}
                    />
                    <p>Y</p>
                    <input
                        type="number"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={y}
                        onChange={(e) => {
                            setTempY(parseInt(e.target.value));
                            setAlignments({
                                ...alignments,
                                [name]: {
                                    ...alignments[name],
                                    y: parseInt(e.target.value),
                                },
                            });
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
                handleClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const box = (
                        e.target as HTMLDivElement
                    ).getBoundingClientRect();
                    const x = e.clientX - box.left;
                    const y = e.clientY - box.bottom;
                    const percentX = (x / box.width) * 10;
                    const percentY = -(y / box.height) * 10;
                    setTempX(Math.round(percentX * 100) / 100);
                    setTempY(Math.round(percentY * 100) / 100);
                    setAlignments({
                        ...alignments,
                        [name]: {
                            ...alignments[name],
                            x: Math.round(percentX * 100) / 100,
                            y: Math.round(percentY * 100) / 100,
                        },
                    });
                }}
            />
            <button
                className="mt-2 w-full p-2 rounded-xl bg-primary text-white font-bold cute-border-visible"
                onClick={() => {
                    const newAlignments = { ...alignments };
                    delete newAlignments[name];
                    setAlignments(newAlignments);
                }}
            >
                Delete
            </button>
        </div>
    );
}
