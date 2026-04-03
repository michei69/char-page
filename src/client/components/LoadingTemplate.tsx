import { Loader2 } from "lucide-react";

export default function LoadingTemplate({ full = false }: { full?: boolean }) {
    return (
        <div
            className={`w-full h-full flex flex-row gap-2 items-center justify-center ${full ? "mt-auto mb-auto h-screen" : ""}`}
        >
            <Loader2 className="animate-spin" />
            Loading...
        </div>
    );
}
