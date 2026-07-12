import { createFileRoute } from "@tanstack/react-router";
import { FounderLayout } from "@/components/founder/FounderLayout";

export const Route = createFileRoute("/founder")({
  component: FounderLayout,
});
