import { useEffect, useRef } from "react";

export type MenuItem = {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    dev?: boolean;
};

export default function ContextMenu({
    x,
    y,
    items,
    onClose,
}: {
    x: number;
    y: number;
    items: Array<MenuItem | boolean>;
    onClose: () => void;
}) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        // Add event listeners
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    // Adjust position if menu would go off-screen
    const [adjustedX, adjustedY] = adjustPosition(x, y);

    return (
        <div
            ref={menuRef}
            className="fixed z-50 min-w-48 card cute-border cute-border-visible rounded-xl shadow-lg"
            style={{
                left: `${adjustedX}px`,
                top: `${adjustedY}px`,
                padding: "0",
            }}
        >
            {items
                .filter(
                    (item) =>
                        item && typeof item != "boolean" && "onClick" in item,
                )
                .map((item, index) => (
                    <button
                        key={index}
                        className={`w-full text-left p-2 hover:brightness-125 flex flex-row items-center gap-1 ${
                            item.disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        style={{ border: "none", borderRadius: "16px" }}
                        onClick={() => {
                            if (!item.disabled) {
                                item.onClick();
                                onClose();
                            }
                        }}
                        disabled={item.disabled}
                    >
                        {item.icon ?? ""}
                        <span>{item.label}</span>
                    </button>
                ))}
        </div>
    );
}

function adjustPosition(x: number, y: number): [number, number] {
    // Simple adjustment to prevent menu from going off-screen
    // In a real implementation, you might want to check viewport dimensions
    const menuWidth = 192; // min-w-48 = 12rem = 192px
    const menuHeight = 200; // Approximate height

    let adjustedX = x;
    let adjustedY = y;

    if (typeof window !== "undefined") {
        if (x + menuWidth > window.innerWidth) {
            adjustedX = window.innerWidth - menuWidth - 10;
        }
        if (y + menuHeight > window.innerHeight) {
            adjustedY = window.innerHeight - menuHeight - 10;
        }
    }

    return [adjustedX, adjustedY];
}
