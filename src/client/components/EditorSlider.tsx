import * as SliderPrimitive from "@radix-ui/react-slider";
import { useState } from "react";
import { camelCaseToReadable } from "../lib/Utils";
import Character from "../lib/CharacterState";
export default function EditorSlider({
    attributes,
    setAttributes,
    value,
    name,
    leftSide,
    rightSide,
}: {
    attributes: Character["attributes"];
    setAttributes: (attributes: Character["attributes"]) => void;
    value: number;
    name: string;
    leftSide: string;
    rightSide: string;
}) {
    const [temp, setTemp] = useState(value);

    return (
        <div className="w-full flex flex-col gap-2 p-4 dark-accent-border rounded-xl relative">
            <h1 className="w-full text-center font-bold text-lg">
                {camelCaseToReadable(name)}
            </h1>
            <div className="flex flex-row items-center justify-center">
                <p>{leftSide}</p>
                <p className="ml-auto">{rightSide}</p>
            </div>
            <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={[temp]}
                defaultValue={[temp]}
                max={10}
                step={0.01}
                onValueChange={(value) => {
                    setTemp(value[0]);
                    setAttributes({
                        ...attributes,
                        [name]: {
                            ...attributes[name],
                            value: value[0],
                        },
                    });
                }}
            >
                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full darker-accent-background" />
                <SliderPrimitive.Thumb className="block h-6 w-2 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors outline-none" />
            </SliderPrimitive.Root>
            <button
                className="absolute top-0 right-0 p-2 rounded-full bg-dark-accent-background hover:bg-dark-accent-background/80 transition-colors"
                onClick={() => {
                    const newAttributes = { ...attributes };
                    delete newAttributes[name];
                    setAttributes(newAttributes);
                }}
            >
                X
            </button>
        </div>
    );
}
