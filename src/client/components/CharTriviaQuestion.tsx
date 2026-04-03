import { useState } from "react";
import { TriviaQuestion } from "../lib/CharacterState";

export default function CharTriviaQuestion({
    question,
}: {
    question: TriviaQuestion;
}) {
    const [chosenAnswer, setChosenAnswer] = useState(null as number | null);

    return (
    <div className="flex flex-col gap-2 w-full items-center">
        <h1 className="font-bold">{question.question}</h1>
        <div className="flex flex-row gap-2">
            {question.type == "MULTICHOICE"
                ? Object.entries(question.options!).map(
                        ([label, correct], idx) => {
                            let cls = "";
                            if (chosenAnswer != null && correct) {
                                cls = "correct-answer";
                            } else if (chosenAnswer == idx) {
                                cls = "wrong-answer";
                            }
                            if (chosenAnswer != null && chosenAnswer != idx) {
                                cls += " brightness-75";
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={chosenAnswer != null}
                                    className={`cute-border-visible ${cls}`}
                                    onClick={() => setChosenAnswer(idx)}
                                >
                                    {label}
                                </button>
                            );
                        },
                    )
                : ["true", "false"].map((label, idx) => {
                        const correct = question.answer
                            ? label == "true"
                            : label == "false";
                        let cls = "";
                        if (chosenAnswer != null && correct) {
                            cls = "correct-answer";
                        } else if (chosenAnswer == idx) {
                            cls = "wrong-answer";
                        }
                        if (chosenAnswer != null && chosenAnswer != idx) {
                            cls += " brightness-75";
                        }
                        return (
                            <button
                                key={idx}
                                disabled={chosenAnswer != null}
                                className={`cute-border-visible ${cls}`}
                                onClick={() => setChosenAnswer(idx)}
                            >
                                {label}
                            </button>
                        );
                    })}
        </div>
    </div>
    );
}
