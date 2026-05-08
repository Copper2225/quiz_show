import { type ActionFunctionArgs, data } from "react-router";
import { prisma } from "~/utils/db.server";
import { initQLCConfigs } from "~/utils/playData.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const configJson = formData.get("configs");

  if (typeof configJson !== "string") {
    return data({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const configs = JSON.parse(configJson) as Record<string, string>;

    // We use a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // For simplicity, we delete all existing QLC configs and re-insert
      // Alternatively, we could upsert individually
      await tx.qLCConfig.deleteMany();

      const entries = Object.entries(configs).filter(
        ([_, value]) => value !== "",
      );

      if (entries.length > 0) {
        await tx.qLCConfig.createMany({
          data: entries.map(([key, widgetId]) => ({
            key,
            widgetId,
          })),
        });
      }
    });

    await initQLCConfigs();

    return data({ success: true });
  } catch (e) {
    console.error("Failed to save QLC configs", e);
    return data({ error: "Failed to save" }, { status: 500 });
  }
}
