import { camelCaseToReadable } from "../lib/Utils";
import CharSlider from "./CharSlider";

export default function CharAttributeSlider({
    name,
    leftSide,
    rightSide,
    value,
    max = 10,
}: {
    name: string;
    leftSide: string;
    rightSide: string;
    value: number;
    max?: number;
}) {
    return (
        <div className="w-full flex flex-col gap-2 p-4 dark-accent-border rounded-xl">
            <h1 className="w-full text-center font-bold text-lg">
                {camelCaseToReadable(name)}
            </h1>
            <div className="flex flex-row items-center justify-center">
                <p>{leftSide}</p>
                <p className="ml-auto">{rightSide}</p>
            </div>
            <CharSlider value={value} max={max} />
        </div>
    );
}
