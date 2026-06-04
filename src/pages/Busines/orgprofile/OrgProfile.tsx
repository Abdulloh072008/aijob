import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";

import {
  fetchOrgProfile,
  fetchOrgProfileById,
} from "../../../api/organizationapi";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

import {
  Building2,
  ExternalLink,
  MapPin,
  Pencil,
} from "lucide-react";

import EditProfileDialog from "../../../components/shared/Dialog/ProfileDailog";

const OrgProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { profile, loading } = useSelector(
    (state: RootState) => state.organization
  );

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrgProfileById(id)); 
    } else {
      dispatch(fetchOrgProfile()); 
    }
  }, [id, dispatch]);

  if (loading.profile && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <section className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        <Card className="overflow-hidden border bg-white">

          <div className="h-44 bg-gradient-to-r from-[#0A66C2] to-[#60A5FA]" />

          <CardContent className="relative pt-0 pb-6 px-6">

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white rounded-full shadow"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={16} />
            </Button>

            <div className="-mt-12">
              <Avatar className="h-24 w-24 rounded-lg border-4 border-white shadow">
                <AvatarImage src={profile?.logoUrl} />
                <AvatarFallback className="text-2xl font-black">
                 {profile?.fullName?.charAt(0) || profile?.organizationName?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-black">
                {profile?.fullName || profile?.organizationName || "Organaization"}
              </h1>

              <p className="text-sm text-slate-600 font-semibold">
                {profile?.industry || "Industry"} • {profile?.size || "Company Size"}
              </p>

              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {profile?.location || "No location"}
              </p>

              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1"
                >
                  Visit Website <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="bg-[#0A66C2] font-black rounded-full">
                + Follow
              </Button>

              <Button variant="outline" className="font-black rounded-full">
                Message
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-black text-base mb-3 flex items-center gap-2">
              <Building2 size={18} className="text-[#0A66C2]" />
              About Company
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {profile?.description || "No company description available."}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-black text-base mb-4">Company Details</h2>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Industry
                </p>
                <p className="font-semibold">{profile?.industry || "-"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Size
                </p>
                <p className="font-semibold">{profile?.size || "-"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Location
                </p>
                <p className="font-semibold">{profile?.location || "-"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Website
                </p>
                <p className="font-semibold text-blue-600">
                  {profile?.website || "-"}
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-black text-base mb-3">
              Company Stats
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black">--</p>
                <p className="text-xs text-slate-500">Active Jobs</p>
              </div>

              <div>
                <p className="text-2xl font-black">--</p>
                <p className="text-xs text-slate-500">Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />

      </div>
    </section>
  );
};

export default OrgProfile;