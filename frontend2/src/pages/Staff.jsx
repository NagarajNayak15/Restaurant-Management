import DashboardLayout from '../components/layout/DashboardLayout';

export default function Staff() {
  return (
    <DashboardLayout activePage="Staff">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <p className="text-gray-600">Manage your restaurant's Staff here.</p>
      </div>
    </DashboardLayout>
  );
}