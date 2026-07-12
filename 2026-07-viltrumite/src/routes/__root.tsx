import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { AppProfileProvider } from "@/context/AppProfileContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  component: RootComponent,
});

function RootLayoutContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("lm_is_logged_in") === "true";
    if (!isLoggedIn && pathname !== "/" && pathname !== "/login") {
      navigate({ to: "/login" });
    }
  }, [pathname, navigate]);

  return <Outlet />;
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProfileProvider>
        <RootLayoutContent />
      </AppProfileProvider>
    </QueryClientProvider>
  );
}
