import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and security.</p>
      </div>
      
      <div className="space-y-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
