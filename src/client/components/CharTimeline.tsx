import { TimelineEntry } from "../lib/CharacterState";
import CharTimelineEntry from "./CharTimelineEntry";

export default function CharTimeline({
    entries,
}: {
    entries: Array<TimelineEntry>;
}) {
    return (
        <div
            className="relative mb-2 h-full"
            style={{ width: "calc(100% - 2rem)" }}
        >
            <div
                className="absolute w-1 bg-gray-400 -z-10"
                style={{
                    height: "calc(100% - 3rem)",
                    transform: "translateX(250%) translateY(1rem)",
                }}
            />
            <div className="-ml-1 flex flex-col justify-start items-center gap-4">
                {entries.map((entry, idx) => (
                    <CharTimelineEntry
                        entry={entry}
                        key={idx}
                        end={idx == entries.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
