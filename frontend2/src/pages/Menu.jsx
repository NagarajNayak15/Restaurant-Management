import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ImagePlus, LoaderCircle, Pencil, Plus, Search, Trash2, Utensils, X } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  imageUrl: "",
  non_veg: false,
  isAvailable: true,
  prepTimeMinutes: "",
};

async function requestMenu(path = "", options = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("ownerToken");

  if (token) headers.set("Authorization", token);
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}/menu${path}`, { ...options, headers });
  let data;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Menu request failed (${response.status}).`);
    throw new Error("The server returned an invalid menu response.");
  }

  if (!response.ok) {
    const validationMessages = data.errors?.map((issue) => issue.message).filter(Boolean);
    throw new Error(validationMessages?.join(" ") || data.message || `Menu request failed (${response.status}).`);
  }

  return data;
}

function MenuItemForm({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => item ? {
    name: item.name ?? "",
    category: item.category ?? "",
    description: item.description ?? "",
    price: String(item.price ?? ""),
    imageUrl: item.imageUrl ?? "",
    non_veg: Boolean(item.non_veg),
    isAvailable: item.isAvailable !== false,
    prepTimeMinutes: item.prepTimeMinutes == null ? "" : String(item.prepTimeMinutes),
  } : emptyForm);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const prepTimeMinutes = form.prepTimeMinutes === "" ? undefined : Number(form.prepTimeMinutes);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a price greater than zero.");
      return;
    }

    if (prepTimeMinutes !== undefined && (!Number.isInteger(prepTimeMinutes) || prepTimeMinutes < 0)) {
      setError("Preparation time must be a whole number of minutes.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price,
      non_veg: form.non_veg,
      isAvailable: form.isAvailable,
    };

    if (payload.name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.imageUrl.trim()) payload.imageUrl = form.imageUrl.trim();
    if (prepTimeMinutes !== undefined) payload.prepTimeMinutes = prepTimeMinutes;

    try {
      await onSave(payload);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const inputClass = "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-form-title"
        className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 id="menu-form-title" className="text-xl font-semibold text-gray-900">
              {item ? "Edit menu item" : "Add menu item"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Enter the item details shown on your restaurant menu.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Item name *
              <input name="name" value={form.name} onChange={updateField} required minLength={2} className={inputClass} autoFocus />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Category *
              <input name="category" value={form.category} onChange={updateField} required className={inputClass} placeholder="e.g. Starters" />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Price (₹) *
              <input name="price" type="number" value={form.price} onChange={updateField} required min="0.01" step="0.01" className={inputClass} />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Preparation time (minutes)
              <input name="prepTimeMinutes" type="number" value={form.prepTimeMinutes} onChange={updateField} min="0" step="1" className={inputClass} placeholder="Optional" />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Image URL
              <input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} className={inputClass} placeholder="https://example.com/image.jpg" />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Description
              <textarea name="description" value={form.description} onChange={updateField} rows={3} className={inputClass} placeholder="Describe the dish" />
            </label>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input name="non_veg" type="checkbox" checked={form.non_veg} onChange={updateField} className="h-4 w-4 rounded border-gray-300 accent-orange-500" />
              Non-vegetarian
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={updateField} className="h-4 w-4 rounded border-gray-300 accent-orange-500" />
              Available to order
            </label>
          </div>

          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              {item ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await requestMenu();
      if (!Array.isArray(data)) throw new Error("The server returned an invalid menu list.");
      setItems(data);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchItems = async () => {
      try {
        const data = await requestMenu();
        if (!Array.isArray(data)) throw new Error("The server returned an invalid menu list.");
        if (!cancelled) setItems(data);
      } catch (error) {
        if (!cancelled) setLoadError(error.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch = !query || [item.name, item.category, item.description]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, items, search]);

  const saveItem = async (payload) => {
    setIsSaving(true);
    setActionError("");
    setNotice("");

    try {
      if (editingItem) {
        const updated = await requestMenu(`/${encodeURIComponent(editingItem.id)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
        setNotice("Menu item updated.");
      } else {
        const created = await requestMenu("", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((current) => [...current, created]);
        setNotice("Menu item added.");
      }

      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      setActionError(error.message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return;

    setDeletingId(item.id);
    setActionError("");
    setNotice("");

    try {
      await requestMenu(`/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setNotice("Menu item deleted.");
    } catch (error) {
      setActionError(error.message);
    } finally {
      setDeletingId("");
    }
  };

  const closeForm = () => {
    if (isSaving) return;
    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <DashboardLayout activePage="Menu Management">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu management</h1>
            <p className="mt-1 text-sm text-gray-600">Add, update, and manage items available to your customers.</p>
          </div>
          <button
            type="button"
            onClick={() => { setEditingItem(null); setIsCreating(true); setActionError(""); }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            <Plus size={18} />
            Add menu item
          </button>
        </div>

        {loadError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span className="inline-flex items-center gap-2"><AlertCircle size={18} />{loadError}</span>
            <button type="button" onClick={loadItems} className="font-semibold underline">Try again</button>
          </div>
        )}
        {actionError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search menu</span>
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by item, category, or description"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label>
              <span className="sr-only">Filter by category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-500 sm:min-w-48">
                <option value="all">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16 text-sm text-gray-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading menu...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <Utensils className="mx-auto h-9 w-9 text-gray-400" />
            <h2 className="mt-4 font-semibold text-gray-900">{items.length ? "No matching menu items" : "Your menu is empty"}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {items.length ? "Try another search or category." : "Add your first item to start building your menu."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="relative flex h-44 items-center justify-center bg-gray-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-9 w-9 text-gray-400" />
                  )}
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${item.non_veg ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                    {item.non_veg ? "Non-veg" : "Vegetarian"}
                  </span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${item.isAvailable ? "bg-white text-green-700" : "bg-gray-900/80 text-white"}`}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-gray-900">{item.name}</h2>
                      <p className="mt-0.5 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="shrink-0 font-semibold text-gray-900">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(item.price))}
                    </p>
                  </div>
                  {item.description && <p className="line-clamp-2 min-h-10 text-sm text-gray-600">{item.description}</p>}
                  {item.prepTimeMinutes != null && <p className="text-xs text-gray-500">{item.prepTimeMinutes} min preparation</p>}
                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => { setEditingItem(item); setIsCreating(false); setActionError(""); }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      disabled={deletingId === item.id}
                      aria-label={`Delete ${item.name}`}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === item.id ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Check size={16} />
          {filteredItems.length} of {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {(isCreating || editingItem) && (
        <MenuItemForm
          item={editingItem}
          onClose={closeForm}
          onSave={saveItem}
          saving={isSaving}
        />
      )}
    </DashboardLayout>
  );
}
