import * as ProgressPrimitive from "@radix-ui/react-progress";
import { CSSProperties, useRef, useState } from "react";
export default function ProgressBar({
    max = 100,
    value = 0,
    style = {},
    onClick = () => {},
}: {
    max?: number;
    value?: number;
    style?: CSSProperties;
    onClick?: (val: number) => void;
}) {
    const root = useRef<HTMLDivElement>(null);
    const fire = useRef<boolean>(false);
    return (
        <ProgressPrimitive.Root
            className="relative h-4 w-full overflow-hidden rounded-full dark-background darker-accent-border"
            max={max}
            value={value}
            style={style}
            title={`${Math.floor((value / max) * 100)}%`}
            ref={root}
            onClick={(e) => {
                const rect = root.current?.getBoundingClientRect();
                if (rect) {
                    const x = e.clientX - rect.left;
                    onClick(Math.floor((x / rect.width) * max));
                }
            }}
            onMouseDown={() => {
                fire.current = true;
            }}
            onMouseMove={(e) => {
                if (!fire.current) return;
                const rect = root.current?.getBoundingClientRect();
                if (rect) {
                    const x = e.clientX - rect.left;
                    onClick(Math.floor((x / rect.width) * max));
                }
            }}
            onMouseUp={() => {
                fire.current = false;
            }}
        >
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 dark-accent-background transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}
