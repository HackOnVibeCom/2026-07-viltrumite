import { createFileRoute } from "@tanstack/react-router";
import { ExploreLayout } from "@/components/explore/ExploreLayout";

export const Route = createFileRoute("/explore")({
  component: ExploreLayout,
});
