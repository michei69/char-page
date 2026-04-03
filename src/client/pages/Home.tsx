import { useEffect, useState } from "react";
import PaddedBody from "../components/PaddedBody";
import { API_BASE_URL } from "../lib/config";
import Character from "../lib/CharacterState";
import LoadingTemplate from "../components/LoadingTemplate";
import MiniChar from "../components/MiniChar";
import { useNavigate } from "react-router";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([] as Character[]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/characters`)
            .then((res) => res.json())
            .then((data) => {
                setCharacters(data.data);
                setLoading(false);
            });
    }, []);

    return (
        <PaddedBody className="flex flex-col gap-8 items-center">
            <h1 className="text-3xl font-bold">Homepage</h1>
            <div className="flex flex-row gap-4 flex-wrap">
                {loading ? (
                    <LoadingTemplate />
                ) : (
                    <>
                        {characters.map((char) => (
                            <MiniChar key={char.id} character={char} />
                        ))}
                        <div
                            className="p-4 flex flex-col gap-2 card cute-border cursor-pointer rounded-2xl w-40 justify-center items-center"
                            onClick={() => {
                                navigate(`/edit/new`);
                            }}
                        >
                            <p className="text-5xl -mt-1">+</p>
                        </div>
                    </>
                )}
            </div>
        </PaddedBody>
    );
}
