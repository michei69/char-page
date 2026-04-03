import * as SliderPrimitive from "@radix-ui/react-slider";
export default function CharSlider({
    value = 0,
    max = 10,
}: {
    value?: number;
    max?: number;
}) {
    return (
        <SliderPrimitive.Root
            className="relative flex w-full touch-none select-none items-center"
            value={[value]}
            defaultValue={[value]}
            max={max}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full darker-accent-background" />
            <SliderPrimitive.Thumb className="block h-6 w-2 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors pointer-events-none outline-none" />
        </SliderPrimitive.Root>
    );
}
