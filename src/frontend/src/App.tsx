import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import StatesPage from "./pages/StatesPage";
import VehiclesPage from "./pages/VehiclesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const statesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/states",
  component: StatesPage,
});

const vehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vehicles",
  component: VehiclesPage,
});

const guidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guidelines",
  component: GuidelinesPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  statesRoute,
  vehiclesRoute,
  guidelinesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
