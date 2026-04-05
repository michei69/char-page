import { useRef } from "react";

export default function AlignmentChart({
    leftSide,
    rightSide,
    topSide,
    bottomSide,
    x = 5,
    y = 5,
    handleClick = () => {},
}: {
    leftSide: string;
    rightSide: string;
    topSide: string;
    bottomSide: string;
    x?: number;
    y?: number;
    handleClick?: (percentX: number, percentY: number) => void;
}) {
    const root = useRef<HTMLDivElement>(null);
    const fire = useRef<boolean>(false);
    return (
        <div>
            <p className="text-center mb-0.5">{topSide}</p>
            <div
                ref={root}
                className="darker-background border-white rounded-xl w-72 h-72 aspect-square"
                onClick={(e) => {
                    if (!root.current) return;
                    const box = root.current.getBoundingClientRect();
                    const x = e.clientX - box.left;
                    const y = e.clientY - box.bottom;
                    const percentX = (x / box.width) * 10;
                    const percentY = -(y / box.height) * 10;
                    handleClick(percentX, percentY);
                }}
                onMouseDown={() => {
                    fire.current = true;
                }}
                onMouseMove={(e) => {
                    if (!fire.current) return;
                    if (!root.current) return;

                    const box = root.current.getBoundingClientRect();
                    const x = e.clientX - box.left;
                    const y = e.clientY - box.bottom;
                    const percentX = (x / box.width) * 10;
                    const percentY = -(y / box.height) * 10;
                    handleClick(percentX, percentY);
                }}
                onMouseUp={() => {
                    fire.current = false;
                }}
            >
                <p
                    className="text-right relative h-0"
                    style={{
                        left: "calc(-100% - 8px)",
                        top: "50%",
                        transform: "translateY(-16px)",
                    }}
                >
                    {leftSide}
                </p>
                <p
                    className="text-left relative h-0"
                    style={{
                        right: "calc(-100% - 8px)",
                        top: "50%",
                        transform: "translateY(-16px)",
                    }}
                >
                    {rightSide}
                </p>
                <div
                    className="w-full bg-white opacity-75 h-0.5 relative"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                />
                <div
                    className="w-full bg-white opacity-75 h-0.5 relative -mt-0.5"
                    style={{
                        top: "50%",
                        transform: "translateY(-50%) rotate(-90deg)",
                    }}
                />
                <div
                    className="w-2 h-2 aspect-square rounded-full bg-white relative -mt-1"
                    style={{
                        left: x * 10 + "%",
                        top: 100 - y * 10 + "%",
                        transform: "translateY(-50%)",
                    }}
                />
            </div>
            <p className="text-center mt-0.5">{bottomSide}</p>
        </div>
    );
}
