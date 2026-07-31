import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CheckCircle2, ListTodo, Presentation, AlertCircle, BarChart3, Users } from "lucide-react";

export function AnalyticsCards({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Meetings</CardTitle>
          <Presentation className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMeetings || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Tasks</CardTitle>
          <ListTodo className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTasks || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Completed Tasks</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedTasks || 0}</div>
          <p className="text-xs text-gray-500 mt-1">{stats.completionRate || 0}% completion rate</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">High Priority</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highPriorityTasks || 0}</div>
          <p className="text-xs text-gray-500 mt-1">Needs attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
