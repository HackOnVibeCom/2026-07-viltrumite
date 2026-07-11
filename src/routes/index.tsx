import { createFileRoute } from "@tanstack/react-router";
import LaunchMeshLanding from "@/components/site/LaunchMeshLanding";
import { SmoothScroll } from "@/components/site/SmoothScroll";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <SmoothScroll />
      <LaunchMeshLanding />
    </>
  );
}
