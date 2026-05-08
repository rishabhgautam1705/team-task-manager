import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  Check,
  Chrome,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
  agreed: true,
};

const roleLabel = {
  ADMIN: "Admin",
  MEMBER: "Member",
};

const passwordRules = [
  ["minLength", (value) => value.length >= 8, "Password must be at least 8 characters"],
  ["uppercase", (value) => /[A-Z]/.test(value), "Password must include an uppercase letter"],
  ["lowercase", (value) => /[a-z]/.test(value), "Password must include a lowercase letter"],
  ["number", (value) => /\d/.test(value), "Password must include a number"],
];

const AuthForm = ({ role = "ADMIN", mode = "login" }) => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignup = mode === "signup";
  const isPremiumSignup = isSignup && ["ADMIN", "MEMBER"].includes(role);
  const accountLabel = roleLabel[role] || "User";

  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (isSignup && form.name.trim().length < 2) {
      nextErrors.name = "Full name is required";
    }

    if (isSignup && form.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (isSignup) {
      const failedRule = passwordRules.find(([, test]) => !test(form.password));
      if (failedRule) {
        nextErrors.password = failedRule[2];
      }
    }

    if (isSignup && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (isSignup && !form.agreed) {
      nextErrors.agreed = "Please accept the terms to continue";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const destination = role === "ADMIN" ? "/admin/dashboard" : "/member/dashboard";

    if (isSignup) {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role,
      });
    } else {
      await login({
        email: form.email.trim(),
        password: form.password,
        role,
        rememberMe: form.rememberMe,
      });
    }

    navigate(destination);
  };

  const handleSocialAction = (provider) => {
    toast(`${provider} sign up is not configured yet`);
  };

  if (isPremiumSignup) {
    const roleKey = role.toLowerCase();

    return (
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[560px]" noValidate>
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 grid h-[78px] w-[78px] place-items-center rounded-full border border-blue-100 bg-white shadow-[0_14px_34px_rgba(40,115,220,0.14)] dark:border-slate-700 dark:bg-slate-950">
            <div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-blue-50 dark:bg-blue-500/10">
              <div className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-gradient-to-br from-[#2d8cff] to-[#1e68e7] text-white shadow-lg shadow-blue-500/25">
                {role === "ADMIN" ? <Crown className="h-5 w-5" aria-hidden="true" /> : <User className="h-5 w-5" aria-hidden="true" />}
              </div>
            </div>
          </div>
          <h1 className="text-[30px] font-black leading-tight tracking-normal text-[#071d4d] dark:text-white sm:text-[34px]">
            <span className="text-[#2f83f6]">{accountLabel}</span> Sign Up
          </h1>
          <p className="mt-2 text-base text-[#5d6f95] dark:text-slate-400">Create your {accountLabel.toLowerCase()} account to get started</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InputField
            id={`${roleKey}-name`}
            label="Full Name"
            icon={User}
            placeholder="Full Name"
            value={form.name}
            onChange={updateField("name")}
            error={errors.name}
            admin
            autoComplete="name"
          />
          <InputField
            id={`${roleKey}-email`}
            label="Email Address"
            icon={Mail}
            placeholder="Email Address"
            value={form.email}
            onChange={updateField("email")}
            error={errors.email}
            admin
            autoComplete="email"
          />
          <InputField
            id={`${roleKey}-username`}
            label="Username"
            icon={User}
            placeholder="Username"
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            admin
            className="sm:col-span-2"
            autoComplete="username"
          />
          <PasswordField
            id={`${roleKey}-password`}
            label="Password"
            placeholder="Password"
            value={form.password}
            onChange={updateField("password")}
            error={errors.password}
            admin
            showPassword={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            autoComplete="new-password"
          />
          <PasswordField
            id={`${roleKey}-confirm-password`}
            label="Confirm Password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={updateField("confirmPassword")}
            error={errors.confirmPassword}
            admin
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
            autoComplete="new-password"
          />
        </div>

        <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#5d6f95] dark:text-slate-400">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={updateField("agreed")}
            className="peer sr-only"
          />
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-blue-300 bg-white text-white shadow-sm transition peer-checked:border-[#2f83f6] peer-checked:bg-[#2f83f6] dark:border-slate-600 dark:bg-slate-950">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            I agree to the{" "}
            <Link to="/" className="font-medium text-[#257af0] hover:text-[#0f5ed2]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="font-medium text-[#257af0] hover:text-[#0f5ed2]">
              Privacy Policy
            </Link>
            {errors.agreed && <span className="mt-1 block text-sm text-rose-500">{errors.agreed}</span>}
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 w-full rounded-2xl bg-[#2f83f6] text-base shadow-[0_14px_30px_rgba(47,131,246,0.22)] hover:bg-[#1f73e8]"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              Create {accountLabel} Account
              <ArrowRight className="ml-auto h-6 w-6" aria-hidden="true" />
            </>
          )}
        </Button>

        <div className="my-5 flex items-center gap-4 text-sm text-[#8b9abb] dark:text-slate-500">
          <span className="h-px flex-1 bg-blue-100 dark:bg-slate-800" />
          <span>or sign up with</span>
          <span className="h-px flex-1 bg-blue-100 dark:bg-slate-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSocialAction("Google")}
            className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-white text-base font-semibold text-[#647390] shadow-[0_10px_24px_rgba(41,91,160,0.08)] transition hover:border-blue-200 hover:text-[#1f3f78] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white"
          >
            <Chrome className="h-6 w-6 text-[#2f83f6]" aria-hidden="true" />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialAction("Microsoft")}
            className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-white text-base font-semibold text-[#647390] shadow-[0_10px_24px_rgba(41,91,160,0.08)] transition hover:border-blue-200 hover:text-[#1f3f78] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white"
          >
            <span className="grid h-5 w-5 grid-cols-2 gap-0.5" aria-hidden="true">
              <span className="bg-[#f25022]" />
              <span className="bg-[#7fba00]" />
              <span className="bg-[#00a4ef]" />
              <span className="bg-[#ffb900]" />
            </span>
            Microsoft
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {accountLabel} {isSignup ? "Sign Up" : "Login"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {isSignup
            ? `Create your ${accountLabel.toLowerCase()} account to continue.`
            : `Login to your ${accountLabel.toLowerCase()} account to continue.`}
        </p>
      </div>

      {isSignup && (
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id={`${role}-name`}
            label="Full Name"
            icon={User}
            placeholder="Full Name"
            value={form.name}
            onChange={updateField("name")}
            error={errors.name}
            autoComplete="name"
          />
          <InputField
            id={`${role}-username`}
            label="Username"
            icon={AtSign}
            placeholder="Username"
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            autoComplete="username"
          />
        </div>
      )}

      <InputField
        id={`${role}-email`}
        label="Email Address"
        icon={Mail}
        placeholder="Email Address"
        value={form.email}
        onChange={updateField("email")}
        error={errors.email}
        autoComplete="email"
      />

      <PasswordField
        id={`${role}-password`}
        label="Password"
        placeholder="Password"
        value={form.password}
        onChange={updateField("password")}
        error={errors.password}
        showPassword={showPassword}
        onToggle={() => setShowPassword((current) => !current)}
        autoComplete={isSignup ? "new-password" : "current-password"}
      />

      {isSignup && (
        <PasswordField
          id={`${role}-confirm-password`}
          label="Confirm Password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          error={errors.confirmPassword}
          showPassword={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          autoComplete="new-password"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        {isSignup ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={updateField("agreed")}
              className="h-4 w-4 rounded border-primary/30 accent-primary"
            />
            I agree to the terms
          </label>
        ) : (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={updateField("rememberMe")}
              className="h-4 w-4 rounded border-primary/30 accent-primary"
            />
            Remember me
          </label>
        )}
        <Link to={isSignup ? `/${role.toLowerCase()}/login` : `/${role.toLowerCase()}/signup`} className="font-semibold text-primary">
          {isSignup ? "Already have an account?" : "Create an account"}
        </Link>
      </div>

      {errors.agreed && <p className="text-sm text-rose-500">{errors.agreed}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : isSignup ? `Create ${accountLabel} Account` : `${accountLabel} Login`}
      </Button>
    </form>
  );
};

const InputField = ({ id, label, icon: Icon, error, admin = false, className, inputClassName, rightElement, ...props }) => (
  <div className={className}>
    <label htmlFor={id} className={admin ? "sr-only" : "mb-2 block text-sm font-semibold text-slate-900 dark:text-white"}>
      {label}
    </label>
    <div className="relative">
      <Icon
        className={cn(
          "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2",
          admin ? "text-[#2f83f6]" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "pl-12",
          admin &&
            "h-12 rounded-2xl border-[#cfdaea] bg-white text-sm text-slate-900 shadow-none placeholder:text-[#667899] focus:border-[#2f83f6] focus:ring-[#2f83f6]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
          inputClassName,
        )}
        {...props}
      />
      {rightElement}
    </div>
    {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
  </div>
);

const PasswordField = ({ id, label, showPassword, onToggle, admin = false, error, ...props }) => (
  <InputField
    id={id}
    label={label}
    icon={Lock}
    type={showPassword ? "text" : "password"}
    admin={admin}
    error={error}
    className={admin ? "sm:col-span-2" : undefined}
    inputClassName="pr-12"
    rightElement={<PasswordToggle showPassword={showPassword} onToggle={onToggle} />}
    {...props}
  />
);

const PasswordToggle = ({ showPassword, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
  </button>
);

export default AuthForm;
