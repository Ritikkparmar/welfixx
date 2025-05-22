import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight gradient-title">
            Dashboard
          </h1>
        </div>
        <Suspense
          fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
        >
          <DashboardPage />
        </Suspense>
      </div>
    </div>
  );
}
