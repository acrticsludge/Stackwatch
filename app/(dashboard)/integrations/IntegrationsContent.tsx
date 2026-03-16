"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, AlertCircle } from "lucide-react";

interface Integration {
  id: string;
  service: string;
  account_label: string;
  status: string;
  created_at: string;
  last_synced_at: string | null;
}

interface IntegrationsContentProps {
  integrations: Integration[];
}

const SERVICES = [
  {
    id: "github",
    name: "GitHub Actions",
    description: "Track Actions minutes vs monthly limit, broken down by repo.",
    fields: [
      { key: "api_key", label: "Personal Access Token", type: "password", placeholder: "ghp_..." },
      { key: "account_label", label: "Account label", type: "text", placeholder: "e.g. personal" },
    ],
    helpText: "Token needs repo and read:org scopes.",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Monitor bandwidth, build minutes, and function invocations.",
    fields: [
      { key: "api_key", label: "API Token", type: "password", placeholder: "Your Vercel API token" },
      { key: "account_label", label: "Account label", type: "text", placeholder: "e.g. personal" },
    ],
    helpText: "Create a token at vercel.com/account/tokens",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Watch database size, row count, storage, and MAU.",
    fields: [
      { key: "api_key", label: "Management API Key", type: "password", placeholder: "sbp_..." },
      { key: "meta.project_ref", label: "Project ref", type: "text", placeholder: "abcdefghijklmnop" },
      { key: "account_label", label: "Account label", type: "text", placeholder: "e.g. prod-db" },
    ],
    helpText: "Find your Management API key at supabase.com/dashboard/account/tokens",
  },
];

export function IntegrationsContent({ integrations }: IntegrationsContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openConnect(serviceId: string) {
    setFormData({});
    setError("");
    setOpenDialog(serviceId);
  }

  async function handleConnect(serviceId: string) {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: serviceId, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to connect");
        return;
      }
      setOpenDialog(null);
      toast({ title: "Connected!", description: `${serviceId} integration added.` });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/integrations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast({ title: "Error", description: "Failed to remove integration.", variant: "destructive" });
        return;
      }
      toast({ title: "Removed", description: "Integration disconnected." });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {SERVICES.map((svc) => {
        const connected = integrations.filter((i) => i.service === svc.id);
        const atLimit = connected.length >= 1;

        return (
          <div
            key={svc.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-900 mb-0.5">
                  {svc.name}
                </h2>
                <p className="text-sm text-slate-500">{svc.description}</p>
              </div>
              <Button
                size="sm"
                variant={atLimit ? "outline" : "default"}
                onClick={() => openConnect(svc.id)}
                disabled={atLimit}
              >
                <Plus className="h-4 w-4 mr-1" />
                {atLimit ? "Limit reached" : "Add account"}
              </Button>
            </div>

            {atLimit && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                Free plan allows 1 account per service. Remove the existing one to add a different account.
              </p>
            )}

            {connected.length === 0 ? (
              <p className="text-sm text-slate-400">No accounts connected.</p>
            ) : (
              <div className="space-y-2">
                {connected.map((intg) => (
                  <div
                    key={intg.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {intg.account_label}
                        </p>
                        <p className="text-xs text-slate-400">
                          {intg.last_synced_at
                            ? `Last synced ${new Date(intg.last_synced_at).toLocaleString()}`
                            : "Never synced"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          intg.status === "connected"
                            ? "success"
                            : intg.status === "error"
                              ? "danger"
                              : "secondary"
                        }
                      >
                        {intg.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => handleDelete(intg.id)}
                        disabled={deletingId === intg.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Connect dialogs */}
      {SERVICES.map((svc) => (
        <Dialog
          key={svc.id}
          open={openDialog === svc.id}
          onOpenChange={(o) => !o && setOpenDialog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {svc.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {svc.fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    autoComplete="off"
                  />
                </div>
              ))}
              {svc.helpText && (
                <p className="text-xs text-slate-400">{svc.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenDialog(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleConnect(svc.id)}
                disabled={submitting}
              >
                {submitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
