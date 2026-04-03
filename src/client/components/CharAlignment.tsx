import { camelCaseToReadable } from "../lib/Utils";
import AlignmentChart from "./AlignmentChart";

export default function CharAlignment({
    name,
    leftSide,
    rightSide,
    topSide,
    bottomSide,
    x = 5,
    y = 5,
    handleClick = () => {},
}: {
    name: string;
    leftSide: string;
    rightSide: string;
    topSide: string;
    bottomSide: string;
    x?: number;
    y?: number;
    handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
    return (
        <div className="w-full flex flex-col gap-2 p-4 dark-accent-border rounded-xl items-center justify-center">
            <h1 className="w-full text-center font-bold text-lg">
                {camelCaseToReadable(name)}
            </h1>
            <AlignmentChart
                leftSide={leftSide}
                rightSide={rightSide}
                topSide={topSide}
                bottomSide={bottomSide}
                x={x}
                y={y}
                handleClick={handleClick}
            />
        </div>
    );
}
