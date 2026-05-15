import { sendToAdmin } from "~/routes/events/sse.events.admin";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const command = formData.get("command") as string;

  if (command) {
    sendToAdmin("answer", {
      date: new Date().toString(),
      command: [command],
    });
  }

  return { success: true };
}
