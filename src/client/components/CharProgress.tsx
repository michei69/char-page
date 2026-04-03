import { camelCaseToReadable } from "../lib/Utils";
import ProgressBar from "./ProgressBar";

export default function CharProgress({
    statName,
    statValue,
    min = 0,
    max = 100,
    onClick = () => {},
}: {
    statName: string;
    statValue: number;
    min?: number;
    max?: number;
    onClick?: (val: number) => void;
}) {
    return (
        <div className="flex flex-row gap-2 w-full items-center">
            <h2
                className="text-lg font-bold dark-background p-4 pt-1 pb-1.5 rounded-xl"
                style={{ width: "25%" }}
            >
                {camelCaseToReadable(statName)}
            </h2>
            <ProgressBar
                max={100}
                value={((min + statValue) / max) * 100}
                style={{ width: "75%" }}
                onClick={(val) => {
                    onClick(Math.round((val / 100) * max - min));
                }}
            />
        </div>
    );
}
