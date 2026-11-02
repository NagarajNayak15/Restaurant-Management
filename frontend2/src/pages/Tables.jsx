import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, CircleOff, LoaderCircle, Plus, QrCode, RefreshCw, Table2, Trash2, Users } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

async function requestTables(path = "", options = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("ownerToken");

  if (token) headers.set("Authorization", token);
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}/table${path}`, { ...options, headers });
  let data;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Table request failed (${response.status}).`);
    throw new Error("The server returned an invalid table response.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Table request failed (${response.status}).`);
  }

  return data;
}

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadTables = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await requestTables();
      if (!Array.isArray(data)) throw new Error("The server returned an invalid table list.");
      setTables(data);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchTables = async () => {
      try {
        const data = await requestTables();
        if (!Array.isArray(data)) throw new Error("The server returned an invalid table list.");
        if (!cancelled) setTables(data);
      } catch (error) {
        if (!cancelled) setLoadError(error.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchTables();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(() => tables.filter((table) => table.isActive).length, [tables]);
  const occupiedCount = useMemo(
    () => tables.filter((table) => table.orders?.length > 0).length,
    [tables],
  );

  const createTable = async () => {
    setIsCreating(true);
    setActionError("");
    setNotice("");

    try {
      const created = await requestTables("", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setTables((current) => [...current, { ...created, orders: [] }].sort((a, b) => a.tableNumber - b.tableNumber));
      setNotice(`Table ${created.tableNumber} created.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTable = async (table) => {
    setUpdatingId(table.id);
    setActionError("");
    setNotice("");

    try {
      const result = await requestTables(`/${encodeURIComponent(table.id)}/active`, {
        method: "POST",
        body: JSON.stringify({ isActive: !table.isActive }),
      });
      const updatedTable = result.table;
      setTables((current) => current.map((item) => item.id === table.id ? { ...item, ...updatedTable } : item));
      setNotice(`Table ${table.tableNumber} ${updatedTable.isActive ? "activated" : "deactivated"}.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setUpdatingId("");
    }
  };

  const deleteTable = async (table) => {
    if (!window.confirm(`Permanently delete Table ${table.tableNumber}? This cannot be undone.`)) return;

    setDeletingId(table.id);
    setActionError("");
    setNotice("");

    try {
      await requestTables(`/${encodeURIComponent(table.id)}`, { method: "DELETE" });
      setTables((current) => current.filter((item) => item.id !== table.id));
      setNotice(`Table ${table.tableNumber} deleted.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <DashboardLayout activePage="Tables">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Table management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage restaurant tables and their customer QR links.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadTables}
              disabled={isLoading}
              aria-label="Refresh tables"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={createTable}
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
              Add table
            </button>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span className="inline-flex items-center gap-2"><AlertCircle size={18} />{loadError}</span>
            <button type="button" onClick={loadTables} className="font-semibold underline">Try again</button>
          </div>
        )}
        {actionError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}

        <div className="grid gap-4 sm:grid-cols-3">
          <section className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Table2 size={22} /></div>
            <div><p className="text-sm text-gray-500">Total tables</p><p className="text-2xl font-bold text-gray-900">{tables.length}</p></div>
          </section>
          <section className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600"><Check size={22} /></div>
            <div><p className="text-sm text-gray-500">Active tables</p><p className="text-2xl font-bold text-gray-900">{activeCount}</p></div>
          </section>
          <section className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Users size={22} /></div>
            <div><p className="text-sm text-gray-500">With active orders</p><p className="text-2xl font-bold text-gray-900">{occupiedCount}</p></div>
          </section>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16 text-sm text-gray-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading tables...
          </div>
        ) : tables.length === 0 && !loadError ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <Table2 className="mx-auto h-9 w-9 text-gray-400" />
            <h2 className="mt-4 font-semibold text-gray-900">No tables yet</h2>
            <p className="mt-1 text-sm text-gray-500">Add a table to generate its customer QR token.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <article key={table.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Table2 size={24} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Table {table.tableNumber}</h2>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {table.orders?.length ? `${table.orders.length} active ${table.orders.length === 1 ? "order" : "orders"}` : "No active orders"}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${table.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {table.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                    <QrCode size={15} /> Customer QR token
                  </div>
                  <code className="block break-all text-xs text-gray-700">{table.qrToken}</code>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTable(table)}
                    disabled={updatingId === table.id || deletingId === table.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {updatingId === table.id ? <LoaderCircle size={15} className="animate-spin" /> : <CircleOff size={15} />}
                    {table.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTable(table)}
                    disabled={deletingId === table.id || updatingId === table.id}
                    aria-label={`Delete Table ${table.tableNumber}`}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === table.id ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
