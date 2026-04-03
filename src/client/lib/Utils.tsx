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
