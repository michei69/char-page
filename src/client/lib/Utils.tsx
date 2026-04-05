import {
    Book,
    FerrisWheel,
    Film,
    Gamepad2,
    Globe,
    Scroll,
    Video,
} from "lucide-react";
import { Id, toast, ToastOptions, TypeOptions } from "react-toastify";

export function camelCaseToReadable(str: string) {
    return str.includes("(") || str.includes(" ") || str.toUpperCase() == str
        ? str
        : str
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
}
export function getIconForFeaturedInType(typ: string) {
    switch (typ) {
        case "book":
            return <Book className="w-4" />;
        case "story":
            return <Scroll className="w-4" />;
        case "comic":
            return <FerrisWheel className="w-4" />;
        case "video":
            return <Video className="w-4" />;
        case "animatic":
            return <Film className="w-4" />;
        case "videoGame":
            return <Gamepad2 className="w-4" />;
        default:
            return <Globe className="w-4" />;
    }
}

const defaultToast = {
    autoClose: 2000,
    theme: "dark",
    pauseOnHover: false,
    draggable: true,
} as ToastOptions;
export class Toast {
    private id: Id;
    private current: number = 0;
    private max: number = 0;
    constructor(id: Id, initial = 0, max = 0) {
        this.id = id;
        this.current = initial;
        this.max = max;
    }
    update({
        message,
        progress,
        type,
    }: {
        message?: any;
        progress?: number;
        type?: TypeOptions;
    }) {
        if (!this.id) return;
        if (progress && progress > 1) progress = 1;
        if (progress && progress < 0) progress = 0;
        return toast.update(this.id, {
            render: message,
            type,
            ...(progress == 1 ? { autoClose: 2000 } : { progress }),
        });
    }
    increment() {
        if (!this.id) return;
        this.current++;
        return toast.update(this.id, { progress: this.current / this.max });
    }

    static info(message: string, autoClose = 2000) {
        return toast.info(message, { ...defaultToast, autoClose });
    }
    static error(message: string, autoClose = 2000) {
        return toast.error(message, { ...defaultToast, autoClose });
    }
    static warn(message: string, autoClose = 2000) {
        return toast.warn(message, { ...defaultToast, autoClose });
    }
    static success(message: string, autoClose = 2000) {
        return toast.success(message, { ...defaultToast, autoClose });
    }
    static progress(
        message: string,
        progress: number,
        type: TypeOptions = "info",
        initial = 0,
        max = 0,
    ) {
        return new Toast(
            toast(message, {
                ...defaultToast,
                progress,
                type,
                autoClose: false,
            }),
            initial,
            max,
        );
    }
}

export function replaceStuff(
    obj: any,
    origKey: string,
    newObj: any,
    newKey: string,
) {
    if (newKey in obj) {
        obj[newKey] = newObj;
        return;
    }
    const idx = getIndex(obj, origKey);
    if (idx == -1) {
        obj[newKey] = newObj;
        return;
    }
    const firstPart = Object.entries(obj).splice(0, idx);
    const secondPart = Object.entries(obj).splice(idx + 1);
    obj = Object.fromEntries([...firstPart, [newKey, newObj], ...secondPart]);
    return obj;
}
export function getIndex(obj: any, key: string) {
    return Object.keys(obj).findIndex((val) => val == key);
}
export function getKey(obj: any, idx: number) {
    return idx >= 0 && idx < Object.keys(obj).length
        ? Object.keys(obj)[idx]
        : "";
}
export function moveStuff(origObj: any, origKey: string, afterKey: string) {
    let obj = { ...origObj };
    const origIdx = getIndex(obj, origKey);
    const idx = getIndex(obj, afterKey);
    if (origIdx == -1 || idx == -1) {
        const tmp = { ...obj[origKey] };
        delete obj[origKey];
        obj[origKey] = tmp;
        return obj;
    }
    if (origIdx == idx) return obj;

    const entries = Object.entries(obj);
    if (origIdx > idx) {
        const firstPart = entries.slice(0, idx + 1);
        const secondPart = entries.slice(idx + 1, origIdx);
        const thirdPart = entries.slice(origIdx + 1);
        console.log(firstPart, secondPart, thirdPart);
        obj = Object.fromEntries([
            ...firstPart,
            [origKey, obj[origKey]],
            ...secondPart,
            ...thirdPart,
        ]);
    } else {
        const firstPart = entries.slice(0, origIdx);
        const secondPart = entries.slice(origIdx + 1, idx + 1);
        const thirdPart = entries.slice(idx + 1);
        obj = Object.fromEntries([
            ...firstPart,
            ...secondPart,
            [origKey, obj[origKey]],
            ...thirdPart,
        ]);
    }

    return obj;
}

export function moveInArray(arr: any[], origIdx: number, afterIdx: number) {
    const tmp = arr[origIdx];
    arr[origIdx] = arr[afterIdx];
    arr[afterIdx] = tmp;
    return arr;
}
