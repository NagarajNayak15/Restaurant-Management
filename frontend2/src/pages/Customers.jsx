import DashboardLayout from '../components/layout/DashboardLayout';

export default function Customers() {
  return (
    <DashboardLayout activePage="Customers">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-gray-600">Manage your restaurant's Customers here.</p>
      </div>
    </DashboardLayout>
  );
}