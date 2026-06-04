import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { fetchOrgJobs, fetchOrgProfile } from "../../../api/organizationapi";

export default function OverviewDashboard() {
  const dispatch = useAppDispatch();
  const { profile, stats } = useAppSelector((state) => state.organization);

  useEffect(() => {
    dispatch(fetchOrgProfile());
    dispatch(fetchOrgJobs());
  }, [dispatch]);

  const metricsData = [
    { label: "Active Positions", count: stats?.activeJobs || 0, color: "bg-[#0A66C2]" },
    { label: "Total Applications", count: stats?.totalApplicants || 0, color: "bg-green-600" },
    { label: "Pending Reviews", count: stats?.pendingReviews || 0, color: "bg-amber-500" }
  ];

  const maxCount = Math.max(...metricsData.map((m) => m.count), 1);

  return (
    <div className="space-y-6 w-full max-w-[1128px] mx-auto">
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome Back, {profile?.name || "Loading..."}</h1>
          <p className="text-muted-foreground text-sm mt-1">Here is what is happening with your organization recruitment today.</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricsData.map((m, i) => (
          <Card key={i} className="bg-white border-gray-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{m.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-white border-gray-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Metrics Analytics Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 flex items-end gap-6 border-b border-l border-gray-200 p-4 relative">
            {metricsData.map((bar, index) => {
              const computedHeight = (bar.count / maxCount) * 85 + 5;
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div className="absolute top-[-24px] opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-900 text-white px-2 py-0.5 rounded-sm mb-1 z-10">{bar.count}</div>
                  <div className={`w-full ${bar.color} rounded-t-md transition-all duration-500 ease-out`} style={{ height: `${computedHeight}%` }} />
                  <span className="text-xs font-medium text-muted-foreground mt-3 text-center truncate w-full">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}