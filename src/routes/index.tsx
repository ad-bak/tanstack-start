import { JokeForm } from "@/components/JokeForm";
import { JokesList } from "@/components/JokesList";
import { getJokes } from "@/serverActions/jokesAction";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    return getJokes();
  },
});

function App() {
  const jokes = Route.useLoaderData() || [];

  return (
    <div className="p-4 flex flex-col">
      <h1 className="text-2xl">DevJokes</h1>

      <JokesList jokes={jokes} />
      <JokeForm />
    </div>
  );
}
