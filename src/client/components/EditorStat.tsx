import { useState } from "react";
import Character from "../lib/CharacterState";
import { camelCaseToReadable } from "../lib/Utils";
import CharProgress from "./CharProgress";

export default function EditorStat({
    stats,
    setStats,
    idx,
}: {
    stats: Character["stats"];
    setStats: (stats: Character["stats"]) => void;
    idx: string;
}) {
    const [tempVal, setTempVal] = useState(stats[idx]?.value);
    return (
        <div className="flex flex-row gap-2 w-full items-center justify-center">
            <p className="text-right" style={{ minWidth: "20%" }}>
                {camelCaseToReadable(idx)}
            </p>
            {stats[idx].type == "BAR" ? (
                <CharProgress
                    statName={camelCaseToReadable(idx)}
                    statValue={parseInt(tempVal + "")}
                    max={stats[idx].max || 100}
                    min={stats[idx].min || 0}
                    onClick={(val) => {
                        console.log(val);
                        setTempVal(val);
                        setStats({
                            ...stats,
                            [idx]: {
                                ...stats[idx],
                                value: val,
                            },
                        });
                    }}
                />
            ) : (
                <input
                    type="text"
                    className="cute-border-visible p-2 rounded-xl w-full"
                    value={tempVal}
                    onChange={(e) => {
                        setTempVal(e.target.value);
                        setStats({
                            ...stats,
                            [idx]: {
                                ...stats[idx],
                                value: e.target.value,
                            },
                        });
                    }}
                />
            )}
            <button
                className="cute-border-visible p-2 rounded-xl"
                onClick={() => {
                    const newStats = { ...stats };
                    delete newStats[idx];
                    setStats(newStats);
                }}
            >
                X
            </button>
        </div>
    );
}
