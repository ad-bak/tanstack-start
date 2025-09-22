import { useState } from "react";

import { useRouter } from "@tanstack/react-router";
import { addJoke } from "@/serverActions/jokesAction";

export function JokeForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await addJoke({
        data: { question, answer },
      });

      setQuestion("");
      setAnswer("");

      router.invalidate();
    } catch (error) {
      console.error("Failed to add joke:", error);
      setError("Failed to add joke");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row gap-2 mb-6">
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <input
        type="text"
        name="question"
        placeholder="Question"
        className="p-1 border rounded w-full"
        required
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />
      <input
        type="text"
        name="answer"
        placeholder="Answer"
        className="p-1 border rounded w-full"
        required
        onChange={(e) => setAnswer(e.target.value)}
        value={answer}
      />
      <button className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Joke"}
      </button>
    </form>
  );
}
