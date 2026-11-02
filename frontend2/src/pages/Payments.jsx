import DashboardLayout from '../components/layout/DashboardLayout';

export default function Payments() {
  return (
    <DashboardLayout activePage="Payments">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-gray-600">Manage your restaurant's Payments here.</p>
      </div>
    </DashboardLayout>
  );
}