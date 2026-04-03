import Markdown from "react-markdown";
import { camelCaseToReadable } from "../lib/Utils";

export default function CharTrait({
    traitName,
    traitValue,
}: {
    traitName: string;
    traitValue: string;
}) {
    return (
        <div className="flex flex-row gap-2 w-full">
            <h2
                className="text-lg font-bold dark-background p-4 pt-1 pb-1.5 rounded-xl flex items-center"
                style={{ width: "25%" }}
            >
                {camelCaseToReadable(traitName)}
            </h2>
            <p
                className="dark-accent-border rounded-xl flex flex-col justify-center items-start p-2 pt-0.5 pb-1"
                style={{ width: "75%" }}
            >
                <Markdown>{traitValue + ""}</Markdown>
            </p>
        </div>
    );
}
