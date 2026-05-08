import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Lock, Monitor, ShieldCheck, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User2 },
  { id: "account", label: "Account", icon: User2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "preferences", label: "Preferences", icon: Monitor },
];

const SettingsForm = ({ member = false }) => {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    bio: "",
  });
  const [accountForm, setAccountForm] = useState({
    username: user?.username || "",
    role: user?.role || (member ? "MEMBER" : "ADMIN"),
    status: user?.status || "Active",
  });
  const [notificationsForm, setNotificationsForm] = useState({
    emailAlerts: true,
    pushAlerts: true,
    weeklySummary: !member,
    taskReminders: true,
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferencesForm, setPreferencesForm] = useState({
    theme,
    compactMode: false,
    reduceMotion: false,
    startPage: member ? "dashboard" : "reports",
  });

  const passwordChecks = useMemo(
    () => ({
      length: securityForm.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(securityForm.newPassword),
      lowercase: /[a-z]/.test(securityForm.newPassword),
      number: /\d/.test(securityForm.newPassword),
    }),
    [securityForm.newPassword],
  );

  const saveProfile = () => {
    updateUser({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      department: profileForm.department,
    });
    toast.success("Profile details updated");
  };

  const saveAccount = () => {
    updateUser({
      username: accountForm.username,
      status: accountForm.status,
    });
    toast.success("Account settings saved");
  };

  const saveNotifications = () => {
    toast.success("Notification preferences updated");
  };

  const saveSecurity = () => {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error("Fill in all password fields");
      return;
    }

    if (Object.values(passwordChecks).includes(false)) {
      toast.error("New password does not meet the security rules");
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Password change request validated");
  };

  const savePreferences = () => {
    setTheme(preferencesForm.theme);
    toast.success("Workspace preferences updated");
  };

  return (
    <Card className="p-8">
      <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-5 text-sm font-semibold text-muted-foreground">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-2 transition",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "profile" && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" value={profileForm.name} onChange={(value) => setProfileForm((state) => ({ ...state, name: value }))} />
            <Field label="Email Address" value={profileForm.email} onChange={(value) => setProfileForm((state) => ({ ...state, email: value }))} />
            <Field label="Phone Number" value={profileForm.phone} onChange={(value) => setProfileForm((state) => ({ ...state, phone: value }))} />
            <Field label="Department" value={profileForm.department} onChange={(value) => setProfileForm((state) => ({ ...state, department: value }))} />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Bio</label>
              <Textarea value={profileForm.bio} onChange={(event) => setProfileForm((state) => ({ ...state, bio: event.target.value }))} />
            </div>
          </div>
          <Actions onSave={saveProfile} />
        </>
      )}

      {activeTab === "account" && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Username" value={accountForm.username} onChange={(value) => setAccountForm((state) => ({ ...state, username: value }))} />
            <Field label="Role" value={accountForm.role} disabled />
            <Field label="Account Status" value={accountForm.status} onChange={(value) => setAccountForm((state) => ({ ...state, status: value }))} />
            <Field label="Workspace Access" value={member ? "Member Panel" : "Admin Panel"} disabled />
          </div>
          <Actions onSave={saveAccount} />
        </>
      )}

      {activeTab === "notifications" && (
        <>
          <div className="grid gap-4">
            <ToggleRow
              title="Email Alerts"
              description="Receive task activity and project updates by email."
              checked={notificationsForm.emailAlerts}
              onChange={() => setNotificationsForm((state) => ({ ...state, emailAlerts: !state.emailAlerts }))}
            />
            <ToggleRow
              title="Push Alerts"
              description="Show in-app alerts for new assignments and mentions."
              checked={notificationsForm.pushAlerts}
              onChange={() => setNotificationsForm((state) => ({ ...state, pushAlerts: !state.pushAlerts }))}
            />
            <ToggleRow
              title="Weekly Summary"
              description="Get a weekly summary of team progress and pending work."
              checked={notificationsForm.weeklySummary}
              onChange={() => setNotificationsForm((state) => ({ ...state, weeklySummary: !state.weeklySummary }))}
            />
            <ToggleRow
              title="Task Reminders"
              description="Receive reminders for deadlines and overdue items."
              checked={notificationsForm.taskReminders}
              onChange={() => setNotificationsForm((state) => ({ ...state, taskReminders: !state.taskReminders }))}
            />
          </div>
          <Actions onSave={saveNotifications} />
        </>
      )}

      {activeTab === "security" && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Current Password"
              value={securityForm.currentPassword}
              type="password"
              onChange={(value) => setSecurityForm((state) => ({ ...state, currentPassword: value }))}
            />
            <div className="rounded-2xl bg-accent/60 p-4 dark:bg-slate-950/30">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Lock className="h-4 w-4 text-primary" /> Password Rules</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className={passwordChecks.length ? "text-emerald-500" : ""}>At least 8 characters</li>
                <li className={passwordChecks.uppercase ? "text-emerald-500" : ""}>One uppercase letter</li>
                <li className={passwordChecks.lowercase ? "text-emerald-500" : ""}>One lowercase letter</li>
                <li className={passwordChecks.number ? "text-emerald-500" : ""}>One number</li>
              </ul>
            </div>
            <Field
              label="New Password"
              value={securityForm.newPassword}
              type="password"
              onChange={(value) => setSecurityForm((state) => ({ ...state, newPassword: value }))}
            />
            <Field
              label="Confirm New Password"
              value={securityForm.confirmPassword}
              type="password"
              onChange={(value) => setSecurityForm((state) => ({ ...state, confirmPassword: value }))}
            />
          </div>
          <Actions onSave={saveSecurity} />
        </>
      )}

      {activeTab === "preferences" && (
        <>
          <div className="grid gap-4">
            <ToggleRow
              title="Dark Mode"
              description="Switch the workspace theme instantly."
              checked={preferencesForm.theme === "dark"}
              onChange={() =>
                setPreferencesForm((state) => ({
                  ...state,
                  theme: state.theme === "dark" ? "light" : "dark",
                }))
              }
            />
            <ToggleRow
              title="Compact Mode"
              description="Reduce spacing for denser dashboard layouts."
              checked={preferencesForm.compactMode}
              onChange={() => setPreferencesForm((state) => ({ ...state, compactMode: !state.compactMode }))}
            />
            <ToggleRow
              title="Reduce Motion"
              description="Use a calmer interface with less animation."
              checked={preferencesForm.reduceMotion}
              onChange={() => setPreferencesForm((state) => ({ ...state, reduceMotion: !state.reduceMotion }))}
            />
            <Field
              label="Default Start Page"
              value={preferencesForm.startPage}
              onChange={(value) => setPreferencesForm((state) => ({ ...state, startPage: value }))}
            />
          </div>
          <Actions onSave={savePreferences} />
        </>
      )}
    </Card>
  );
};

const Field = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div>
    <label className="mb-2 block text-sm font-medium">{label}</label>
    <Input value={value} onChange={(event) => onChange?.(event.target.value)} type={type} disabled={disabled} />
  </div>
);

const ToggleRow = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent/60 p-4 dark:bg-slate-950/30">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative h-8 w-14 rounded-full transition",
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full bg-white transition",
          checked ? "left-7" : "left-1",
        )}
      />
    </button>
  </div>
);

const Actions = ({ onSave }) => (
  <div className="mt-8 flex justify-end">
    <Button type="button" onClick={onSave}>Save Changes</Button>
  </div>
);

export default SettingsForm;
