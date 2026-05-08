import { useNavigate } from "react-router-dom";
import { Camera, Mail, MapPin, Phone, User2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const profileName = user?.name || "John Doe";
  const profileUsername = user?.username || "johndoe";
  const profileEmail = user?.email || "john.doe@example.com";
  const profileDepartment = user?.department || "Development Team";
  const profilePhone = user?.phone || "+1 987 654 3210";
  const profileRole = user?.role === "ADMIN" ? "Administrator" : "Member";
  const profileLocation = user?.location || "San Francisco, USA";
  const profileJoined = user?.joined || "May 15, 2025";
  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="overflow-hidden p-0">
        <div className="h-36 bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
        <div className="-mt-16 px-8 pb-8">
          <div className="relative mx-auto mb-5 w-fit">
            <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900">
              <AvatarFallback className="text-4xl">{profileInitials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => navigate("/member/settings")}
              className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow-panel dark:bg-slate-900"
            >
              <Camera className="h-4 w-4 text-primary" />
            </button>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-3xl font-bold">{profileName}</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              {profileRole}
            </span>
          </div>
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> {profileEmail}</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> {profilePhone}</div>
            <div className="flex items-center gap-3"><User2 className="h-4 w-4 text-primary" /> {profileDepartment}</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> {profileLocation}</div>
          </div>
        </div>
      </Card>
      <Card className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Personal Information</h3>
          <Button variant="soft" onClick={() => navigate("/member/settings")}>Edit Profile</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["Full Name", profileName],
            ["Username", profileUsername],
            ["Email Address", profileEmail],
            ["Phone Number", profilePhone],
            ["Role", profileRole],
            ["Department", profileDepartment],
            ["Location", profileLocation],
            ["Joined Date", profileJoined],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-accent/60 p-4 dark:bg-slate-950/30">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-accent/60 p-4 dark:bg-slate-950/30">
          <p className="text-sm text-muted-foreground">Bio</p>
          <p className="mt-2 font-medium">Passionate about building great products and solving real-world problems.</p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
