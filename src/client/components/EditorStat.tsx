import { useState } from "react";
import Character from "../lib/CharacterState";
import { camelCaseToReadable, moveInArray, replaceStuff } from "../lib/Utils";
import CharProgress from "./CharProgress";
import { useContextMenu } from "./ContextMenuContext";
import { ArrowDown, ArrowUp, CheckSquare, Edit, Trash2 } from "lucide-react";

export default function EditorStat({
    stats,
    setStats,
    idx,
}: {
    stats: Character["stats"];
    setStats: (stats: Character["stats"]) => void;
    idx: number;
}) {
    const [tempVal, setTempVal] = useState(stats[idx]?.value);
    const [temp2Val, setTemp2Val] = useState(
        camelCaseToReadable(stats[idx]?.label),
    );
    const [editing, setEditing] = useState(false);
    const { showContextMenu } = useContextMenu();

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
            {
                label: `Convert to ${stats[idx].type == "BAR" ? "TEXT" : "BAR"}`,
                onClick: () => {
                    stats[idx] = {
                        ...stats[idx],
                        type: stats[idx].type == "BAR" ? "TEXT" : "BAR",
                    };
                    setStats(stats);
                },
            },
            stats[idx].type == "BAR" &&
                stats[idx].max != 100 && {
                    label: "Switch to Percentage",
                    onClick: () => {
                        const newVal =
                            (parseInt(stats[idx].value + "") /
                                (stats[idx].max! - stats[idx].min!)) *
                            100;
                        stats[idx] = {
                            ...stats[idx],
                            value: newVal,
                            min: 0,
                            max: 100,
                        };
                        setTempVal(newVal);
                        setStats(stats);
                    },
                },
            !editing
                ? {
                      icon: <Edit className="w-5 mt-0.5 -ml-1" />,
                      label: "Edit Name",
                      onClick: () => {
                          setEditing(true);
                      },
                  }
                : {
                      icon: <CheckSquare className="w-5 mt-0.5 -ml-1" />,
                      label: "Commit new Name",
                      onClick: () => {
                          stats[idx] = {
                              ...stats[idx],
                              label: temp2Val,
                          };
                          setStats(stats);
                          setEditing(false);
                      },
                  },
            {
                icon: <Trash2 className="w-5 mt-0.5 -ml-1" />,
                label: "Delete",
                onClick: () => {
                    setStats(stats.filter((_, i) => i != idx));
                },
            },
        ]);
    };

    return (
        <div
            className="flex flex-row gap-2 w-full items-center justify-center"
            onContextMenu={onContextMenu}
        >
            <div className="flex flex-col">
                <button
                    className="p-0!"
                    onClick={() => {
                        const newStats = [...stats];
                        if (idx == 0) {
                            newStats.push(stats[idx]);
                            setStats(newStats.slice(idx + 1));
                        } else {
                            setStats(moveInArray(newStats, idx, idx - 1));
                        }
                    }}
                >
                    <ArrowUp />
                </button>
                <button
                    className="p-0!"
                    onClick={() => {
                        const newStats = [...stats];
                        if (idx >= newStats.length - 1) {
                            setStats([stats[idx], ...newStats.slice(0, idx)]);
                        } else {
                            setStats(moveInArray(newStats, idx, idx + 1));
                        }
                    }}
                >
                    <ArrowDown />
                </button>
            </div>
            {editing ? (
                <input
                    type="text"
                    style={{ minWidth: "20%" }}
                    value={temp2Val}
                    onChange={(e) => {
                        setTemp2Val(e.target.value);
                    }}
                />
            ) : (
                <p className="text-right" style={{ minWidth: "20%" }}>
                    {camelCaseToReadable(stats[idx].label)}
                </p>
            )}
            {stats[idx].type == "BAR" ? (
                <CharProgress
                    statName={camelCaseToReadable(stats[idx].label)}
                    statValue={parseInt(tempVal + "")}
                    max={stats[idx].max || 100}
                    min={stats[idx].min || 0}
                    showStatName={false}
                    onClick={(val) => {
                        setTempVal(val);
                        stats[idx] = {
                            ...stats[idx],
                            value: val,
                        };
                        setStats(stats);
                    }}
                />
            ) : (
                <input
                    type="text"
                    className="cute-border-visible p-2 rounded-xl w-full"
                    value={tempVal}
                    onChange={(e) => {
                        setTempVal(e.target.value);
                        stats[idx] = {
                            ...stats[idx],
                            value: e.target.value,
                        };
                        setStats(stats);
                    }}
                />
            )}
            <button
                className="cute-border-visible p-2 rounded-xl"
                onClick={() => {
                    setStats(stats.filter((_, i) => i != idx));
                }}
            >
                X
            </button>
        </div>
    );
}
