import { useNavigate } from "react-router";
import Character from "../lib/CharacterState";

export default function MiniChar({ character }: { character: Character }) {
    const navigate = useNavigate();

    return (
        <div
            className="p-4 flex flex-col gap-2 card cute-border cursor-pointer rounded-2xl"
            onClick={() => {
                navigate(`/character/${character.id}`);
            }}
        >
            <img
                src={character.pfpUrl}
                className="w-32 h-32 aspect-square object-cover rounded-full border-white border-2"
            />
            <h2 className="text-lg text-center">{character.name}</h2>
        </div>
    );
}
