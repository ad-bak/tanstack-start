import { Joke, JokesData } from "@/types";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs";
import * as path from "node:path";
import { v4 as uuidv4 } from "uuid";

const JOKES_FILE = path.join(process.cwd(), "src/data/jokes.json");

export const getJokes = createServerFn({ method: "GET" }).handler(async () => {
  const jokes = await fs.promises.readFile(JOKES_FILE, "utf-8");
  return JSON.parse(jokes) as JokesData;
});

export const addJoke = createServerFn({ method: "POST" })
  .validator((data: { question: string; answer: string }) => {
    if (!data.question || !data.question.trim()) {
      throw new Error("Joke question is required");
    }
    if (!data.answer || !data.answer.trim()) {
      throw new Error("Joke answer is required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const jokesData = await getJokes();

      const newJoke: Joke = {
        id: uuidv4(),
        question: data.question,
        answer: data.answer,
      };

      const updatedJokes = [...jokesData, newJoke];

      await fs.promises.writeFile(JOKES_FILE, JSON.stringify(updatedJokes, null, 2), "utf-8");

      return newJoke;
    } catch (error) {
      console.error("Failed to add joke:", error);
      throw new Error("Failed to add joke");
    }
  });
