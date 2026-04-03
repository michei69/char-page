/* eslint-disable @typescript-eslint/ban-ts-comment */
import { memo, useEffect, useRef, useState } from "react";
import { createPath, useParams } from "react-router";
import Character from "../lib/CharacterState";
import LoadingTemplate from "../components/LoadingTemplate";
import PaddedBody from "../components/PaddedBody";
import CharSection from "../components/CharSection";
import EditorInput from "../components/EditorInput";
import EditorCheckbox from "../components/EditorCheckbox";
import EditorTrait from "../components/EditorTrait";
import traits from "../data/traits.json";
import alignments from "../data/alignment.json";
import featuredInCategories from "../data/featuredInCategories.json";
import EditorStat from "../components/EditorStat";
import EditorSlider from "../components/EditorSlider";
import EditorAlignmentChart from "../components/EditorAlignmentChart";
import EditorRelation from "../components/EditorRelation";
import { camelCaseToReadable, Toast } from "../lib/Utils";
import { API_BASE_URL } from "../lib/config";
import { proxy, useSnapshot } from "valtio";
import CharTextArea from "../components/CharTextArea";
import Markdown from "react-markdown";
import Croppie from "croppie";
import "croppie/croppie.css";
import { Loader2, RefreshCw } from "lucide-react";

const char = proxy({} as Character);

const HeaderPreview = memo(() => {
    const snap = useSnapshot(char);
    return (
        <section className="relative">
            <img
                className="h-20 object-cover object-center thumb"
                src={snap.thumbnailUrl}
                alt={snap.thumbnailAlt}
                title={snap.thumbnailAlt}
            />
            <div className="flex flex-col justify-center items-center gap-2 -mt-16 p-4 pt-0">
                <img
                    className="h-36 w-36 pfp rounded-full"
                    src={snap.pfpUrl}
                    alt={snap.name}
                />
                <h1 className="text-xl font-bold -mb-1">{snap.name}</h1>
                <Markdown>{snap.quote + ""}</Markdown>
                <div className="flex flex-row gap-1 mt-2">
                    {snap.original && (
                        <span
                            className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                            title="This is an original character"
                        >
                            Original
                        </span>
                    )}
                    {snap.fandom && (
                        <span
                            className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                            title="This character is part of a fandom"
                        >
                            Fandom
                        </span>
                    )}
                    {snap.mature && (
                        <span
                            className="p-4 pt-1 pb-1.5 rounded-xl darker-accent-background"
                            title="This character may contain mature content"
                        >
                            Mature
                        </span>
                    )}
                    {snap.tags.map((tag) => (
                        <span className="p-4 pt-1 pb-1.5 rounded-xl dark-background">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
});

const TagsList = memo(() => {
    const snap = useSnapshot(char);
    return snap.tags.map((tag, idx) => (
        <span
            key={idx}
            onClick={() => (char.tags = char.tags.filter((t) => t != tag))}
            className="p-4 pt-1 pb-1.5 rounded-xl dark-background select-none cursor-pointer"
        >
            {tag}
        </span>
    ));
});

const TraitStuff = memo(() => {
    const snap = useSnapshot(char);
    return (
        <>
            {snap.traits &&
                Object.keys(snap.traits).map((key, idx) => (
                    <EditorTrait
                        key={idx}
                        traits={snap.traits}
                        setTraits={(val) => {
                            char.traits = val;
                        }}
                        traitName={key}
                        traitValue={snap.traits[key] + ""}
                        options={traits}
                    />
                ))}
            <hr className="text-gray-600 w-full" />
            <EditorTrait
                traits={snap.traits}
                setTraits={(val) => {
                    char.traits = val;
                }}
                traitName={""}
                traitValue={""}
                editor={true}
                options={traits}
            />
        </>
    );
});

const StatsList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.stats &&
        Object.keys(snap.stats).map((key, idx) => (
            <EditorStat
                key={idx}
                stats={snap.stats}
                setStats={(val) => {
                    char.stats = val;
                }}
                idx={key}
            />
        ))
    );
});

const AttributesList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.attributes &&
        Object.keys(snap.attributes).map((key, idx) => (
            <EditorSlider
                key={idx}
                attributes={snap.attributes}
                setAttributes={(val) => {
                    char.attributes = val;
                }}
                value={snap.attributes[key].value}
                name={key}
                leftSide={snap.attributes[key].leftSide}
                rightSide={snap.attributes[key].rightSide}
            />
        ))
    );
});

const AlignmentsList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.alignments &&
        Object.keys(snap.alignments).map((key, idx) => (
            <EditorAlignmentChart
                key={idx}
                alignments={snap.alignments}
                setAlignments={(val) => {
                    char.alignments = val;
                }}
                name={key}
                leftSide={snap.alignments[key].left}
                rightSide={snap.alignments[key].right}
                topSide={snap.alignments[key].top}
                bottomSide={snap.alignments[key].bottom}
                x={snap.alignments[key].x}
                y={snap.alignments[key].y}
            />
        ))
    );
});

const RelationsList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.relations &&
        snap.relations.map((relation, idx) => (
            <EditorRelation
                key={idx}
                relations={snap.relations as Character["relations"]}
                setRelations={(relations) => {
                    char.relations = relations;
                }}
                idx={idx}
                charId={relation.charId}
                relation={relation.relation}
                description={relation.description}
            />
        ))
    );
});

const FeaturedInList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.featuredIn &&
        snap.featuredIn.map((feature, idx) => (
            <div
                key={idx}
                className="flex flex-row gap-2 w-full items-center justify-center"
            >
                <p className="text-right">
                    {camelCaseToReadable(feature.type)}
                </p>
                <input
                    type="text"
                    className="cute-border-visible p-2 rounded-xl w-full"
                    value={feature.title}
                    onChange={(e) => {
                        const newFeaturedIn = [...char.featuredIn];
                        newFeaturedIn[idx] = {
                            ...feature,
                            title: e.target.value,
                        };
                        char.featuredIn = newFeaturedIn;
                    }}
                />
                <input
                    type="text"
                    className="cute-border-visible p-2 rounded-xl w-full"
                    value={feature.link}
                    onChange={(e) => {
                        const newFeaturedIn = [...char.featuredIn];
                        newFeaturedIn[idx] = {
                            ...feature,
                            link: e.target.value,
                        };
                        char.featuredIn = newFeaturedIn;
                    }}
                />
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        const newFeaturedIn = [...char.featuredIn];
                        newFeaturedIn.splice(idx, 1);
                        char.featuredIn = newFeaturedIn;
                    }}
                >
                    X
                </button>
            </div>
        ))
    );
});

const TimelineList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.timeline &&
        snap.timeline.map((entry, idx) => {
            return (
                <div
                    key={idx}
                    className="flex flex-row gap-2 w-full items-center justify-center"
                >
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={entry.title}
                        onChange={(e) => {
                            const newTimeline = [...char.timeline];
                            newTimeline[idx] = {
                                ...newTimeline[idx],
                                title: e.target.value,
                            };
                            char.timeline = newTimeline;
                        }}
                        placeholder="Title"
                    />
                    <textarea
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={entry.description}
                        onChange={(e) => {
                            const newTimeline = [...char.timeline];
                            newTimeline[idx] = {
                                ...newTimeline[idx],
                                description: e.target.value,
                            };
                            char.timeline = newTimeline;
                        }}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={
                            (entry.date != ""
                                ? new Date(
                                      entry.date as string | Date,
                                  ).toISOString()
                                : "") + ""
                        }
                        onChange={(e) => {
                            const newTimeline = [...char.timeline];
                            newTimeline[idx] = {
                                ...newTimeline[idx],
                                date: new Date(e.target.value),
                            };
                            char.timeline = newTimeline;
                        }}
                        placeholder="Date"
                    />
                    <input
                        type="text"
                        className="cute-border-visible p-2 rounded-xl w-full"
                        value={entry.timeReference}
                        onChange={(e) => {
                            const newTimeline = [...char.timeline];
                            newTimeline[idx] = {
                                ...newTimeline[idx],
                                timeReference: e.target.value,
                            };
                            char.timeline = newTimeline;
                        }}
                        placeholder="Time Reference"
                    />
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <input
                            type="checkbox"
                            checked={entry.specificTime}
                            onChange={(e) => {
                                const newTimeline = [...char.timeline];
                                newTimeline[idx] = {
                                    ...newTimeline[idx],
                                    specificTime: e.target.checked,
                                };
                                char.timeline = newTimeline;
                            }}
                        />
                        <p>specific time?</p>
                    </div>
                    <button
                        className="cute-border-visible p-2 rounded-xl"
                        onClick={() => {
                            const newTimeline = [...char.timeline];
                            newTimeline.splice(idx, 1);
                            char.timeline = newTimeline;
                        }}
                    >
                        X
                    </button>
                </div>
            );
        })
    );
});

const ColorPaletteList = memo(() => {
    const snap = useSnapshot(char);
    return (
        snap.colorPalette &&
        Object.entries(snap.colorPalette).map(([key, val], idx) => (
            <div
                key={idx}
                className="flex flex-row gap-2 w-full items-center justify-center"
            >
                <input
                    type="text"
                    className="p-2 rounded-xl w-full cute-border-visible"
                    value={val.label}
                    onChange={(e) =>
                        (char.colorPalette = {
                            ...char.colorPalette,
                            [key]: {
                                ...val,
                                label: e.target.value,
                            },
                        })
                    }
                />
                <input
                    type="color"
                    className="p-2 rounded-xl w-full h-12"
                    value={val.hex}
                    onChange={(e) =>
                        (char.colorPalette = {
                            ...char.colorPalette,
                            [key]: {
                                ...val,
                                hex: e.target.value,
                            },
                        })
                    }
                />
                <button
                    className="cute-border-visible p-2 rounded-xl"
                    onClick={() => {
                        const newColorPalette = {
                            ...char.colorPalette,
                        };
                        delete newColorPalette[key as any];
                        char.colorPalette = newColorPalette;
                    }}
                >
                    X
                </button>
            </div>
        ))
    );
});

export default function Editor() {
    const params = useParams() as { id: string };
    // const snap = useSnapshot(char);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (params.id == "new") {
            Object.assign(char, new Character());
            Toast.info("Creating a new character...", 1000);
            setLoading(false);
        } else {
            fetch(`${API_BASE_URL}/api/character/${params.id}`)
                .then((response) => response.json())
                .then((data) => {
                    const ch: Character = Object.assign(
                        new Character(),
                        data.data,
                    );
                    console.log(ch);
                    if (ch.stats) {
                        const temp = Object.entries(ch.stats).sort(
                            (a, b) =>
                                (a[1].type === "TEXT" ? 1 : -1) -
                                (b[1].type === "TEXT" ? 1 : -1),
                        );
                        ch.stats = Object.fromEntries(temp);
                    }
                    // setChar(char);
                    Object.assign(char, ch);
                    setLoading(false);
                })
                .catch(() => {
                    Object.assign(char, new Character());
                    // setChar(new Character());
                    setLoading(false);
                });
        }
    }, [params]);

    useEffect(() => {
        window.onbeforeunload = () => true;
        return () => {
            window.onbeforeunload = () => false;
        };
    }, []);

    const [temp, setTemp] = useState("");
    const [temp2, setTemp2] = useState("BAR");
    const [temp3, setTemp3] = useState("");
    const [temp4, setTemp4] = useState("");
    const [temp5, setTemp5] = useState("");
    const [temp6, setTemp6] = useState("");
    const [temp7, setTemp7] = useState("");
    const [temp8, setTemp8] = useState("");
    const [temp9, setTemp9] = useState("");
    const [temp10, setTemp10] = useState("");
    const [temp11, setTemp11] = useState("");
    const [temp12, setTemp12] = useState(0);
    const [temp13, setTemp13] = useState(0);
    const [temp14, setTemp14] = useState("");
    const [temp15, setTemp15] = useState("book");
    const [temp16, setTemp16] = useState("");
    const [temp17, setTemp17] = useState("");
    const [temp18, setTemp18] = useState("");

    const thumbRef = useRef<HTMLInputElement>(null);
    const pfpRef = useRef<HTMLInputElement>(null);
    const cropRef = useRef<HTMLDialogElement>(null);
    const croppieDivRef = useRef<HTMLDivElement>(null);
    const croppieRef = useRef<Croppie>(null);

    const [croppingThumbnail, setCroppingThumbnail] = useState(false);
    const [uploading, setUploading] = useState(false);

    return (
        <>
            {loading ? (
                <LoadingTemplate full={true} />
            ) : (
                <PaddedBody className="padded flex flex-col items-center justify-center gap-4">
                    <dialog
                        ref={cropRef}
                        className="absolute"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "800px",
                            // height: "800px",
                        }}
                    >
                        <button
                            className="absolute top-0 right-0 z-10"
                            onClick={() => cropRef.current?.close()}
                        >
                            x
                        </button>
                        <div
                            id="croppie"
                            ref={croppieDivRef}
                            // style={{ height: "750px" }}
                        ></div>
                        <button
                            disabled={uploading}
                            className="flex flex-row gap-1 ml-auto mr-auto"
                            onClick={() => {
                                setUploading(true);
                                croppieRef.current
                                    ?.result({
                                        type: "base64",
                                        size: "original",
                                        format: "jpeg",
                                    })
                                    .then((data) => {
                                        const bytes = Uint8Array.from(
                                            atob(data.split("base64,")[1]),
                                            (c) => c.charCodeAt(0),
                                        );
                                        const formData = new FormData();
                                        formData.append(
                                            "file",
                                            new File(
                                                [bytes],
                                                croppingThumbnail
                                                    ? "thumbnail.jpg"
                                                    : "pfp.jpg",
                                                { type: "image/jpeg" },
                                            ),
                                        );
                                        fetch(`${API_BASE_URL}/api/upload`, {
                                            method: "POST",
                                            body: formData,
                                        })
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (data.success) {
                                                    console.log(data.url);
                                                    if (croppingThumbnail) {
                                                        char.thumbnailUrl =
                                                            data.url;
                                                    } else {
                                                        char.pfpUrl = data.url;
                                                    }
                                                    Toast.success(
                                                        `Uploaded ${croppingThumbnail ? "thumbnail" : "pfp"}!`,
                                                    );
                                                } else {
                                                    Toast.error(
                                                        `Failed to upload ${croppingThumbnail ? "thumbnail" : "pfp"}`,
                                                    );
                                                }
                                                setUploading(false);
                                                cropRef.current?.close();
                                            })
                                            .catch((err) => {
                                                Toast.error(
                                                    `Failed to upload ${croppingThumbnail ? "thumbnail" : "pfp"}`,
                                                );
                                                setUploading(false);
                                                cropRef.current?.close();
                                            });
                                    });
                            }}
                        >
                            Upload{uploading ? "ing" : ""}{" "}
                            {croppingThumbnail ? "thumbnail" : "pfp"}
                            {uploading && <Loader2 className="animate-spin" />}
                        </button>
                    </dialog>
                    <HeaderPreview />
                    <CharSection title="basics">
                        <div className="flex flex-row gap-1">
                            <button
                                onClick={() => {
                                    if (char.id != params.id) {
                                        fetch(
                                            `${API_BASE_URL}/api/character/${params.id}`,
                                            {
                                                method: "DELETE",
                                            },
                                        )
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (!data.success) {
                                                    console.error(data.error);
                                                    Toast.error(
                                                        "Failed to delete old character",
                                                    );
                                                }
                                            });
                                    }
                                    fetch(
                                        `${API_BASE_URL}/api/character/${char.id}`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify(char),
                                        },
                                    )
                                        .then((res) => res.json())
                                        .then((data) => {
                                            if (!data.success) {
                                                console.error(data.error);
                                                Toast.error(
                                                    "Failed to save character",
                                                );
                                            } else {
                                                Toast.success(
                                                    "Character saved!",
                                                );
                                            }
                                        });
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(JSON.stringify(char))
                                        .then(() =>
                                            Toast.success(
                                                "Copied to clipboard!",
                                            ),
                                        );
                                }}
                            >
                                Copy
                            </button>
                        </div>
                        <div className="flex flex-row gap-1 w-full">
                            <EditorInput
                                char={char}
                                setVal={(id) => {
                                    char.id = id;
                                }}
                                idx="id"
                                useSnap={true}
                            />
                            <button
                                onClick={() => {
                                    fetch(
                                        `${API_BASE_URL}/api/character/new/id`,
                                    )
                                        .then((res) => res.json())
                                        .then((data) => {
                                            char.id = data.id;
                                        });
                                }}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        <EditorInput
                            char={char}
                            setVal={(name) => {
                                char.name = name;
                            }}
                            idx="name"
                        />
                        <div className="flex flex-row gap-1 w-full">
                            <EditorInput
                                char={char}
                                setVal={(thumbnailUrl) => {
                                    char.thumbnailUrl = thumbnailUrl;
                                }}
                                idx="thumbnailUrl"
                                useSnap={true}
                            />
                            <input
                                type="file"
                                ref={thumbRef}
                                hidden
                                onInput={(e) => {
                                    if (e.currentTarget.files?.[0]) {
                                        if (croppieRef.current) {
                                            croppieRef.current.destroy();
                                        }
                                        croppieRef.current = new Croppie(
                                            croppieDivRef.current!,
                                            {
                                                viewport: {
                                                    width: 512,
                                                    height: 256,
                                                    type: "square",
                                                },
                                                boundary: {
                                                    width: 800,
                                                    height: 600,
                                                },
                                            },
                                        );
                                        setCroppingThumbnail(true);
                                        cropRef.current?.showModal();
                                        croppieRef.current?.bind({
                                            url: URL.createObjectURL(
                                                e.currentTarget.files[0],
                                            ),
                                        });
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (thumbRef.current) {
                                        thumbRef.current.click();
                                    }
                                }}
                            >
                                Upload
                            </button>
                        </div>
                        <EditorInput
                            char={char}
                            setVal={(thumbnailAlt) => {
                                char.thumbnailAlt = thumbnailAlt;
                            }}
                            idx="thumbnailAlt"
                        />
                        <div className="flex flex-row gap-1 w-full">
                            <EditorInput
                                char={char}
                                setVal={(pfpUrl) => {
                                    char.pfpUrl = pfpUrl;
                                }}
                                idx="pfpUrl"
                                useSnap={true}
                            />
                            <input
                                type="file"
                                ref={pfpRef}
                                hidden
                                onInput={(e) => {
                                    if (e.currentTarget.files?.[0]) {
                                        if (croppieRef.current) {
                                            croppieRef.current.destroy();
                                        }
                                        croppieRef.current = new Croppie(
                                            croppieDivRef.current!,
                                            {
                                                viewport: {
                                                    width: 256,
                                                    height: 256,
                                                    type: "circle",
                                                },
                                                boundary: {
                                                    width: 800,
                                                    height: 600,
                                                },
                                            },
                                        );
                                        setCroppingThumbnail(false);
                                        cropRef.current?.showModal();
                                        croppieRef.current?.bind({
                                            url: URL.createObjectURL(
                                                e.currentTarget.files[0],
                                            ),
                                        });
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (pfpRef.current) {
                                        pfpRef.current.click();
                                    }
                                }}
                            >
                                Upload
                            </button>
                        </div>
                        <EditorInput
                            char={char}
                            setVal={(quote) => {
                                char.quote = quote;
                            }}
                            idx="quote"
                        />
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-row gap-1 items-center justify-center">
                                <TagsList />
                            </div>
                            <div className="flex flex-row gap-2 w-full">
                                <p className="text-right">new tag</p>
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        char.tags = [...char.tags, temp.trim()];
                                        setTemp("");
                                    }}
                                    disabled={
                                        temp.trim() == "" ||
                                        char.tags.includes(temp.trim())
                                    }
                                >
                                    add
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <EditorCheckbox
                                char={char}
                                setVal={(original) => {
                                    char.original = original;
                                }}
                                idx="original"
                            />
                            <EditorCheckbox
                                char={char}
                                setVal={(fandom) => {
                                    char.fandom = fandom;
                                }}
                                idx="fandom"
                            />
                            <EditorCheckbox
                                char={char}
                                setVal={(mature) => {
                                    char.mature = mature;
                                }}
                                idx="mature"
                            />
                        </div>
                    </CharSection>
                    <CharSection title="about">
                        <TraitStuff />
                    </CharSection>
                    <CharSection title="stats">
                        <StatsList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <select
                                value={temp2}
                                onChange={(e) => setTemp2(e.target.value)}
                            >
                                <option value="BAR">Bar</option>
                                <option value="TEXT">Text</option>
                            </select>
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp3}
                                onChange={(e) => setTemp3(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    char.stats = {
                                        ...char.stats,
                                        [temp3]: {
                                            value: "",
                                            type: temp2,
                                            min: 0,
                                            max: 100,
                                        },
                                    };
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    <CharSection title="sliders">
                        <AttributesList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp4}
                                onChange={(e) => setTemp4(e.target.value)}
                                placeholder="name"
                            />
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp5}
                                onChange={(e) => setTemp5(e.target.value)}
                                placeholder="left side"
                            />
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp6}
                                onChange={(e) => setTemp6(e.target.value)}
                                placeholder="right side"
                            />
                            <button
                                onClick={() => {
                                    char.attributes = {
                                        ...char.attributes,
                                        [temp4]: {
                                            value: 50,
                                            leftSide: temp5,
                                            rightSide: temp6,
                                        },
                                    };
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    <CharSection title="alignment chart">
                        <AlignmentsList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-col gap-1">
                            <select
                                className="cute-border-visible rounded-2xl p-4"
                                value={temp7}
                                onChange={(e) => {
                                    setTemp7(e.target.value);
                                    const alignment = alignments.find(
                                        (a) => a.title == e.target.value,
                                    );
                                    if (!alignment) return;
                                    setTemp8(alignment.yTopAxis);
                                    setTemp9(alignment.yBottomAxis);
                                    setTemp10(alignment.xLeftAxis);
                                    setTemp11(alignment.xRightAxis);
                                }}
                            >
                                {alignments.map((alignment, idx) => (
                                    <option value={alignment.title} key={idx}>
                                        {alignment.title}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-row gap-2 w-full">
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp7}
                                    onChange={(e) => setTemp7(e.target.value)}
                                    placeholder="name"
                                />
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp8}
                                    onChange={(e) => setTemp8(e.target.value)}
                                    placeholder="top side"
                                />
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp9}
                                    onChange={(e) => setTemp9(e.target.value)}
                                    placeholder="bottom side"
                                />
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp10}
                                    onChange={(e) => setTemp10(e.target.value)}
                                    placeholder="left side"
                                />
                                <input
                                    type="text"
                                    className="cute-border-visible p-2 rounded-xl w-full"
                                    value={temp11}
                                    onChange={(e) => setTemp11(e.target.value)}
                                    placeholder="right side"
                                />
                                <input
                                    type="number"
                                    className="cute-border-visible p-2 rounded-xl w-20"
                                    value={temp12}
                                    onChange={(e) =>
                                        setTemp12(parseFloat(e.target.value))
                                    }
                                    placeholder="x"
                                />
                                <input
                                    type="number"
                                    className="cute-border-visible p-2 rounded-xl w-20"
                                    value={temp13}
                                    onChange={(e) =>
                                        setTemp13(parseFloat(e.target.value))
                                    }
                                    placeholder="y"
                                />
                                <button
                                    onClick={() => {
                                        char.alignments = {
                                            ...char.alignments,
                                            [temp7]: {
                                                top: temp8,
                                                bottom: temp9,
                                                left: temp10,
                                                right: temp11,
                                                x: temp12,
                                                y: temp13,
                                            },
                                        };
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </CharSection>
                    <CharSection title="relations">
                        <RelationsList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp14}
                                onChange={(e) => setTemp14(e.target.value)}
                                placeholder="charid"
                            />
                            <button
                                onClick={() => {
                                    char.relations = [
                                        ...char.relations,
                                        {
                                            charId: temp14,
                                            relation: "",
                                            description: "",
                                        },
                                    ];
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    <CharSection title="featured in">
                        <FeaturedInList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <select
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp15}
                                onChange={(e) => setTemp15(e.target.value)}
                            >
                                {featuredInCategories.map((o, idx) => (
                                    <option key={idx} value={o}>
                                        {camelCaseToReadable(o)}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    // @ts-ignore
                                    setChar({
                                        ...char,
                                        featuredIn: [
                                            ...char.featuredIn,
                                            {
                                                type: temp15,
                                                title: "",
                                                link: "",
                                            },
                                        ],
                                    });
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    <CharSection title="description">
                        <CharTextArea
                            char={char}
                            onChange={(val) => (char.description = val)}
                            idx="description"
                            markdown={true}
                        />
                    </CharSection>
                    <CharSection title="backstory">
                        <CharTextArea
                            char={char}
                            onChange={(val) => (char.story = val)}
                            idx="story"
                            markdown={true}
                        />
                    </CharSection>
                    <CharSection title="Color Palette">
                        <div className="flex flex-col gap-2 w-full items-center justify-center">
                            <ColorPaletteList />
                        </div>
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp16}
                                onChange={(e) => setTemp16(e.target.value)}
                                placeholder="Color Name"
                            />
                            <input
                                type="color"
                                className="p-2 rounded-xl w-full h-12"
                                value={temp17}
                                onChange={(e) => setTemp17(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    char.colorPalette = {
                                        ...char.colorPalette,
                                        [temp16]: {
                                            hex: temp17,
                                            label: temp16,
                                        },
                                    };
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    <CharSection title="Timeline">
                        <TimelineList />
                        <hr className="text-gray-600 w-full" />
                        <div className="flex flex-row gap-2 w-full">
                            <input
                                type="text"
                                className="cute-border-visible p-2 rounded-xl w-full"
                                value={temp18}
                                onChange={(e) => setTemp18(e.target.value)}
                                placeholder="Event Title"
                            />
                            <button
                                onClick={() => {
                                    char.timeline = [
                                        ...char.timeline,
                                        {
                                            title: temp18,
                                            description: "",
                                            date: "",
                                            timeReference: "",
                                        },
                                    ];
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </CharSection>
                    {/* todo trivia */}
                    <CharSection title="creator note">
                        <CharTextArea
                            char={char}
                            onChange={(val) => (char.creatorNote = val)}
                            idx="creatorNote"
                            markdown={true}
                        />
                    </CharSection>
                </PaddedBody>
            )}
        </>
    );
}
