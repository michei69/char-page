import { createContext, useContext, useState, ReactNode } from "react";
import ContextMenu, { MenuItem } from "./ContextMenu";

interface ContextMenuContextType {
    showContextMenu: (
        x: number,
        y: number,
        items: Array<MenuItem | boolean>,
    ) => void;
    hideContextMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
    undefined,
);

export function useContextMenu() {
    const context = useContext(ContextMenuContext);
    if (!context) {
        throw new Error(
            "useContextMenu must be used within a ContextMenuProvider",
        );
    }
    return context;
}

export function ContextMenuProvider({ children }: { children: ReactNode }) {
    const [menuState, setMenuState] = useState<{
        visible: boolean;
        x: number;
        y: number;
        items: Array<MenuItem | boolean>;
    }>({
        visible: false,
        x: 0,
        y: 0,
        items: [],
    });

    const showContextMenu = (
        x: number,
        y: number,
        items: Array<MenuItem | boolean>,
    ) => {
        setMenuState({
            visible: true,
            x,
            y,
            items,
        });
    };

    const hideContextMenu = () => {
        setMenuState((prev) => ({
            ...prev,
            visible: false,
        }));
    };

    return (
        <ContextMenuContext.Provider
            value={{ showContextMenu, hideContextMenu }}
        >
            {children}
            {menuState.visible && (
                <ContextMenu
                    x={menuState.x}
                    y={menuState.y}
                    items={menuState.items}
                    onClose={hideContextMenu}
                />
            )}
        </ContextMenuContext.Provider>
    );
}
