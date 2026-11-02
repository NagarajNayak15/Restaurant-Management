import DashboardLayout from '../components/layout/DashboardLayout';

export default function Settings() {
  return (
    <DashboardLayout activePage="Settings">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your restaurant's Settings here.</p>
      </div>
    </DashboardLayout>
  );
}