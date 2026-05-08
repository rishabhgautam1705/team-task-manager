import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/layouts/AuthLayout";

const AuthPage = ({ role, mode }) => (
  <AuthLayout role={role} mode={mode}>
    <AuthForm role={role} mode={mode} />
  </AuthLayout>
);

export default AuthPage;
