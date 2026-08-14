"use client";

import { useEffect, useState } from "react";
import { Home, Loader2, MapPin, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AddressItem = {
  fullName: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

export function AddressManager() {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState<AddressItem>({
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const json = await res.json();
        setAddresses(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openNewAddressModal = () => {
    setEditIndex(null);
    setForm({
      fullName: "",
      phone: "",
      email: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setShowModal(true);
  };

  const openEditAddressModal = (addr: AddressItem, index: number) => {
    setEditIndex(index);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email || "",
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || "India",
    });
    setShowModal(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/user/addresses?index=${index}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.data || []);
        setNotice({ type: "success", text: "Address removed." });
      } else {
        throw new Error(data.error || "Failed to remove address");
      }
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete address",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const isEdit = editIndex !== null;
      const url = "/api/user/addresses";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { index: editIndex, ...form } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      setAddresses(data.data || []);
      setShowModal(false);
      setNotice({
        type: "success",
        text: isEdit ? "Address updated successfully!" : "New address added successfully!",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="font-display text-2xl text-dark">Saved Addresses</h2>
          <p className="mt-1 text-sm text-muted">
            Manage delivery addresses for seamless checkout.
          </p>
        </div>
        <Button onClick={openNewAddressModal} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add New Address
        </Button>
      </div>

      {notice && (
        <div
          className={`rounded-lg p-3 text-sm font-medium ${
            notice.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notice.text}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-display text-lg text-dark">No saved addresses yet</h3>
          <p className="mt-1 text-sm text-muted">
            Add a shipping address to speed up your future orders.
          </p>
          <Button onClick={openNewAddressModal} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-primary">
                    <Home className="h-3.5 w-3.5" /> Address #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditAddressModal(addr, idx)}
                      className="rounded-lg p-1.5 text-muted hover:bg-cream-dark hover:text-dark transition-colors"
                      title="Edit address"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-destructive transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold text-dark">{addr.fullName}</h4>
                  <p className="text-sm text-muted">{addr.phone}</p>
                </div>

                <p className="text-sm text-dark/90 leading-relaxed">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                  <br />
                  {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                  <br />
                  {addr.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-xl text-dark">
                {editIndex !== null ? "Edit Saved Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-muted hover:bg-cream-dark hover:text-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="addr-name">Full Name *</Label>
                  <Input
                    id="addr-name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Recipient's name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-phone">Phone Number *</Label>
                  <Input
                    id="addr-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-line1">Address Line 1 *</Label>
                <Input
                  id="addr-line1"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  placeholder="House/Flat No., Building Name, Street"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-line2">Address Line 2 (Optional)</Label>
                <Input
                  id="addr-line2"
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  placeholder="Landmark, Area, Colony"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="addr-city">City *</Label>
                  <Input
                    id="addr-city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-state">State *</Label>
                  <Input
                    id="addr-state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-pincode">Pincode *</Label>
                  <Input
                    id="addr-pincode"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {editIndex !== null ? "Update Address" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
