import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { prisma } from "~/utils/db.server";
import type { QuestionEntity } from "@prisma/client";

export async function loader({}: Route.LoaderArgs) {
  const questions = await prisma.questionEntity.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return { questions };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Questions ({questions.length})</h1>
      <ul>
        {questions.map((q: QuestionEntity) => (
          <li key={q.id}>
            [{q.categoryColumn}] {q.type} - {q.prompt} (+{q.points})
          </li>
        ))}
      </ul>
    </div>
  );
}
