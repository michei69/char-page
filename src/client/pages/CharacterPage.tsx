/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Character from "../lib/CharacterState";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import Markdown from "react-markdown";
import CharSection from "../components/CharSection";
import CharTrait from "../components/CharTrait";
import CharProgress from "../components/CharProgress";
import CharMarkdownSection from "../components/CharMarkdownSection";
import CharAttributeSlider from "../components/CharAttributeSlider";
import CharAlignment from "../components/CharAlignment";
import CharRelation from "../components/CharRelation";
import { getIconForFeaturedInType, Toast } from "../lib/Utils";
import CharTriviaQuestion from "../components/CharTriviaQuestion";
import CharTimeline from "../components/CharTimeline";
import { API_BASE_URL } from "../lib/config";
import { Edit2 } from "lucide-react";

export default function CharacterPage() {
    const params = useParams() as { id: string };
    const [char, setChar] = useState({} as Character);
    const [relatedCharacters, setRelatedCharacters] = useState(
        {} as { [id: string]: Character },
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setRelatedCharacters({});
        const related = {} as any;
        fetch(`${API_BASE_URL}/api/character/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                const char: Character = Object.assign(
                    new Character(),
                    data.data,
                );
                console.log(char);
                if (char.stats) {
                    char.stats.sort(
                        (a, b) =>
                            (a.type === "TEXT" ? 1 : -1) -
                            (b.type === "TEXT" ? 1 : -1),
                    );
                }
                for (const ch of char.relations) {
                    fetch(`${API_BASE_URL}/api/character/${ch.charId}`)
                        .then((response) => response.json())
                        .then((data) => {
                            related[ch.charId] = Object.assign(
                                new Character(),
                                data.data,
                            );
                            setRelatedCharacters({ ...related });
                        });
                }
                setChar(char);
                setLoading(false);
            });
    }, [params]);

    return loading ? (
        <LoadingTemplate full={true} />
    ) : (
        <PaddedBody className="padded flex flex-col items-center justify-center gap-4">
            <section className="relative">
                <img
                    className="h-20 object-cover object-center thumb"
                    src={char.thumbnailUrl}
                    alt={char.thumbnailAlt}
                    title={char.thumbnailAlt}
                />
                <div className="flex flex-col justify-center items-center gap-2 -mt-16 p-4 pt-0">
                    <img
                        className="h-36 w-36 pfp rounded-full"
                        src={char.pfpUrl}
                        alt={char.name}
                    />
                    <h1 className="text-xl font-bold -mb-1">{char.name}</h1>
                    <Markdown>{char.quote + ""}</Markdown>
                    <div className="flex flex-row gap-1 mt-2">
                        {char.original && (
                            <span
                                className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                                title="This is an original character"
                            >
                                Original
                            </span>
                        )}
                        {char.fandom && (
                            <span
                                className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                                title="This character is part of a fandom"
                            >
                                Fandom
                            </span>
                        )}
                        {char.mature && (
                            <span
                                className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                                title="This character may contain mature content"
                            >
                                Mature
                            </span>
                        )}
                        {char.tags.map((tag) => (
                            <span className="p-4 pt-1 pb-1.5 rounded-xl dark-background">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p
                        className="absolute top-3 right-3 w-4 h-4 bg-[#ffffff66] p-4 rounded-full cursor-pointer"
                        onClick={() => navigate(`/edit/${params.id}`)}
                    >
                        <Edit2
                            className="w-4 h-4"
                            style={{ transform: "translate(-50%, -50%)" }}
                        />
                    </p>
                </div>
            </section>

            {char.traits && char.traits.length > 0 && (
                <CharSection title="About">
                    <div className="flex flex-col justify-center items-center gap-2 mt-2 p-4 pt-0 w-full">
                        {char.traits.map((trait, idx) => (
                            <CharTrait
                                key={idx}
                                traitName={trait.label}
                                traitValue={trait.text}
                            />
                        ))}
                    </div>
                </CharSection>
            )}

            {char.stats && char.stats.length > 0 && (
                <CharSection title="Stats">
                    <div className="flex flex-col justify-center items-center gap-2 mt-2 p-4 pt-0 w-full">
                        {char.stats.map((stat, idx) => {
                            if (stat.type == "TEXT")
                                return (
                                    <CharTrait
                                        key={idx}
                                        traitName={stat.label}
                                        traitValue={stat.value as string}
                                    />
                                );
                            return (
                                <CharProgress
                                    key={idx}
                                    statName={stat.label}
                                    statValue={stat.value as number}
                                    min={stat.min}
                                    max={stat.max}
                                />
                            );
                        })}
                    </div>
                </CharSection>
            )}

            {char.attributes && char.attributes.length > 0 && (
                <CharSection title="Attribute Sliders" className="p-2">
                    <div className="flex flex-col justify-center items-center gap-4 mt-2 p-4 pt-0 w-full">
                        {char.attributes.map((attr, idx) => (
                            <CharAttributeSlider
                                key={idx}
                                name={attr.label}
                                leftSide={attr.leftSide}
                                rightSide={attr.rightSide}
                                value={attr.value}
                                max={attr.value < 10 ? 10 : 100}
                            />
                        ))}
                    </div>
                </CharSection>
            )}

            {char.alignments && char.alignments.length > 0 && (
                <CharSection title="Alignment Charts">
                    <div className="flex flex-col justify-center items-center gap-2 mt-2 p-4 pt-0 w-full">
                        {char.alignments.map((alignment, idx) => (
                            <CharAlignment
                                key={idx}
                                name={alignment.label}
                                leftSide={alignment.left}
                                rightSide={alignment.right}
                                topSide={alignment.top}
                                bottomSide={alignment.bottom}
                                x={alignment.x}
                                y={alignment.y}
                            />
                        ))}
                    </div>
                </CharSection>
            )}

            {char.relations && char.relations.length > 0 && (
                <CharSection title="Relations">
                    <div className="flex flex-col justify-center items-center gap-2 mt-2 p-4 pt-0 w-full">
                        {char.relations.map((rel) =>
                            rel.charId in relatedCharacters ? (
                                <CharRelation
                                    key={`${rel.charId}-${rel.charId in relatedCharacters}`}
                                    name={relatedCharacters[rel.charId].name}
                                    otherPfpUrl={
                                        relatedCharacters[rel.charId].pfpUrl
                                    }
                                    relation={rel.relation}
                                    description={rel.description}
                                />
                            ) : (
                                <LoadingTemplate
                                    key={`${rel.charId}-${rel.charId in relatedCharacters}`}
                                />
                            ),
                        )}
                    </div>
                </CharSection>
            )}

            {char.featuredIn && char.featuredIn.length > 0 && (
                <CharSection title="Featured In">
                    <div className="flex flex-col justify-center items-center gap-2 mt-2 p-4 pt-0 w-full">
                        {char.featuredIn.map((feature, idx) => (
                            <a
                                href={feature.link}
                                key={idx}
                                className="flex flex-row gap-1 text-lg"
                            >
                                {getIconForFeaturedInType(feature.type)}{" "}
                                {feature.title}
                            </a>
                        ))}
                    </div>
                </CharSection>
            )}

            {char.description && char.description.trim().length > 0 && (
                <CharMarkdownSection title="Description">
                    {char.description}
                </CharMarkdownSection>
            )}
            {char.story && char.story.trim().length > 0 && (
                <CharMarkdownSection title="Background Story">
                    {char.story}
                </CharMarkdownSection>
            )}

            {char.colorPalette && char.colorPalette.length > 0 && (
                <CharSection title="Color Palette">
                    <div className="flex flex-row justify-center items-center gap-4 mt-2 p-4 pt-0 w-full flex-wrap">
                        {char.colorPalette.map((color, idx) => (
                            <div className="flex flex-col gap-0 justify-center items-center">
                                <div
                                    key={idx}
                                    className="min-w-16 w-full h-16 aspect-square rounded-xl cursor-pointer"
                                    style={{
                                        backgroundColor: color.hex,
                                    }}
                                    title={color.hex.toUpperCase()}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            color.hex.toUpperCase(),
                                        );
                                        Toast.success(
                                            "Copied to clipboard!",
                                            1000,
                                        );
                                    }}
                                ></div>
                                <p className="text-center">{color.label}</p>
                            </div>
                        ))}
                    </div>
                </CharSection>
            )}

            {/* TODO: everything image related */}

            {char.timeline && char.timeline.length > 0 && (
                <CharSection title="Timeline">
                    <CharTimeline entries={char.timeline} />
                </CharSection>
            )}

            {char.trivia && char.trivia.length > 0 && (
                <CharSection title="Trivia">
                    <div className="flex flex-col justify-center items-center gap-4 mt-2 p-4 pt-0 w-full">
                        {char.trivia.map((trivia, idx) => (
                            <CharTriviaQuestion key={idx} question={trivia} />
                        ))}
                    </div>
                </CharSection>
            )}

            {char.creatorNote && char.creatorNote.trim().length > 0 && (
                <CharMarkdownSection title="Creator Note">
                    {char.creatorNote}
                </CharMarkdownSection>
            )}
        </PaddedBody>
    );
}
