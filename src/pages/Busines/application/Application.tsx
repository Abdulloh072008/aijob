import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { fetchOrgApplicants, fetchOrgProfile, updateApplicantStatus } from "../../../api/organizationapi";

export default function ApplicantsList() {
  const dispatch = useAppDispatch();
  const { applicants, profile, loading } = useAppSelector((state) => state.organization);

  useEffect(() => {
    if (profile?.id) {
      dispatch(fetchOrgApplicants(profile.id));
    } else {
      dispatch(fetchOrgProfile());
    }
  }, [profile?.id, dispatch]);

  const handleStatusUpdate = (applicantId: string, status: "Accepted" | "Rejected") => {
    dispatch(updateApplicantStatus({ applicantId, status }));
  };

  if (loading) return <div className="p-6 text-center text-sm font-medium text-muted-foreground animate-pulse">Retrieving applicant profiles...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Incoming Applications</h2>
        <p className="text-sm text-muted-foreground">Review candidates currently applying to your open vacancies.</p>
      </div>

      {applicants.length === 0 ? (
        <Card className="border-dashed bg-white py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-2">
            <Users className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-muted-foreground">No candidates have applied to your active posts yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden shadow-xs border-gray-200">
          <CardContent className="p-0 divide-y divide-gray-100">
            {applicants.map((app) => (
              <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">{app.candidateName || "Candidate Profile"}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Applied for: <span className="font-medium text-gray-700">{app.jobTitle}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(app.id, "Rejected")} className="text-gray-600 rounded-lg">
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleStatusUpdate(app.id, "Accepted")} className="bg-[#0A66C2] hover:bg-[#004182] rounded-lg">
                    Shortlist
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}