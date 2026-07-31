import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "../lib/api";
import { AnalyticsCards } from "../components/dashboard/AnalyticsCards";
import { Loader2 } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your meeting productivity</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <AnalyticsCards stats={stats} />
      )}
    </div>
  );
}
