import Markdown from "react-markdown";
import { TimelineEntry } from "../lib/CharacterState";

export default function CharTimelineEntry({
    entry,
    end = false,
}: {
    entry: TimelineEntry;
    end?: boolean;
}) {
    let timeRefText = entry.timeReference ? " (" + entry.timeReference : "";
    if (entry.date) {
        if (timeRefText != "") timeRefText += "; ";
        else timeRefText += "(";
        timeRefText += new Date(entry.date).toLocaleDateString("ro-RO");
        if (entry.specificTime) {
            timeRefText +=
                ", " +
                new Date(entry.date).toLocaleTimeString("ro-RO", {
                    timeStyle: "short",
                });
        }
    }
    if (timeRefText != "") timeRefText += ")";

    return (
        <div
            className={`w-full flex flex-col gap-0 justify-start items-center`}
        >
            <div
                className={`w-full flex flex-row gap-1 justify-start items-center ${end ? "-mb-1" : ""}`}
            >
                {end ? (
                    <div className="rounded-full w-8 h-8 border-white border-2 border-solid flex items-center justify-center">
                        <div className="rounded-full w-4 h-4 bg-white" />
                    </div>
                ) : (
                    <div className="ml-2 mr-2 rounded-full w-4 h-4 bg-gray-400" />
                )}
                <h1 className="ml-2 font-bold text-lg">
                    {entry.title}
                    {timeRefText != "" ? " - " + timeRefText : ""}
                </h1>
            </div>
            <div className="w-full flex flex-row gap-1 justify-start items-center">
                <div className="w-2" />
                <div className="ml-8 flex flex-col gap-0">
                    <Markdown>{entry.description + ""}</Markdown>
                </div>
            </div>
        </div>
    );
}
