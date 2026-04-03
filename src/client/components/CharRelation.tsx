import Markdown from "react-markdown";

export default function CharRelation({
    name,
    otherPfpUrl,
    relation,
    description,
}: {
    name: string;
    otherPfpUrl: string;
    relation: string;
    description: string;
}) {
    return (
        <div className="w-full flex flex-row gap-2 p-4 dark-accent-border rounded-xl justify-center items-center">
            <img
                src={otherPfpUrl}
                className="w-12 h-12 aspect-square object-cover rounded-full"
            />
            <div className="flex flex-col gap-1.5 w-full items-start justify-center">
                <h1 className="w-full font-bold text-lg">
                    {name} - {relation}
                </h1>
                <div>
                    <Markdown>{description + ""}</Markdown>
                </div>
            </div>
        </div>
    );
}
