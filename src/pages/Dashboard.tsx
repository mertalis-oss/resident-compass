import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDropzone } from "react-dropzone";
import { AlertTriangle, Upload, FileText, Image, LogOut, Loader2, Trash2, Settings, ShoppingCart, Users, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import AIConciergeWidget from "@/components/AIConciergeWidget";
import logoDark from "@/assets/Dark_Seffaf.png";
import type { User } from "@supabase/supabase-js";

const MAX_DAYS = 180;
const ACCEPTED_TYPES = { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

interface VisaStatus {
  country: string;
  days_spent: number;
  tax_resident: boolean;
}

interface StoredFile {
  name: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [visaStatus, setVisaStatus] = useState<VisaStatus[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login", { replace: true }); return; }
      setUser(session.user);

      // Parallel fetch
      const [visaRes, enrollRes, profileRes] = await Promise.all([
        supabase.rpc("check_visa_status", { p_user_id: session.user.id }),
        supabase.from("enrollments").select("status").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("profiles").select("role").eq("id", session.user.id).single(),
      ]);

      if (visaRes.data) setVisaStatus(visaRes.data);
      if (enrollRes.data?.[0]) setEnrollmentStatus(enrollRes.data[0].status);
      if (profileRes.data?.role === 'admin') setIsAdmin(true);

      await fetchFiles(session.user.id);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const fetchFiles = async (uid: string) => {
    const { data, error } = await supabase.storage.from("documents").list(uid, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (!error && data) setFiles(data.map((f) => ({ name: f.name, created_at: f.created_at })));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    setUploading(true);
    let uploadedCount = 0;
    for (const file of acceptedFiles) {
      const path = `${user.id}/${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      } else {
        uploadedCount++;
      }
    }
    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} file(s) uploaded successfully`);
      await fetchFiles(user.id);
    }
    setUploading(false);
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (rejections) => {
      rejections.forEach((r) => toast.error(`${r.file.name}: Only PDF, JPG, PNG allowed (max 10MB)`));
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const thailandEntry = visaStatus.find((v) => v.country?.toLowerCase() === "thailand");
  const daysSpent = thailandEntry?.days_spent ?? 0;
  const isTaxResident = thailandEntry?.tax_resident ?? false;
  const progressPct = Math.min((daysSpent / MAX_DAYS) * 100, 100);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <img src={logoDark} alt="Plan B Asia" className="h-9" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 space-y-8 max-w-5xl">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-1">Your sovereign dashboard — residency, documents, and concierge.</p>
        </div>

        {/* Residency Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-heading">Residency Tracker</CardTitle>
            <CardDescription>Days spent in Thailand this calendar year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{daysSpent} / {MAX_DAYS} days</span>
              <Badge variant={daysSpent > 170 ? "destructive" : daysSpent > 140 ? "secondary" : "outline"}>
                {isTaxResident ? "Tax Resident" : "Non-Resident"}
              </Badge>
            </div>
            <Progress value={progressPct} className="h-3" />

            {daysSpent > 170 && !isTaxResident && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Tax Residency Risk</AlertTitle>
                <AlertDescription>
                  You've spent {daysSpent} days in Thailand. Tax residency threshold is 180 days.
                  Consider planning an exit within the next {MAX_DAYS - daysSpent} days to maintain non-resident status.
                </AlertDescription>
              </Alert>
            )}

            {isTaxResident && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Tax Resident Status</AlertTitle>
                <AlertDescription>
                  You are currently classified as a tax resident of Thailand (180+ days).
                  Under the 2026 Revenue Code reforms, worldwide income may be subject to Thai taxation.
                  Contact our compliance team immediately.
                </AlertDescription>
              </Alert>
            )}

            {/* Other countries */}
            {visaStatus.filter((v) => v.country?.toLowerCase() !== "thailand").length > 0 && (
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Other Countries</p>
                {visaStatus
                  .filter((v) => v.country?.toLowerCase() !== "thailand")
                  .map((v) => (
                    <div key={v.country} className="flex justify-between text-sm">
                      <span>{v.country}</span>
                      <span className="text-muted-foreground">{v.days_spent} days</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Vault */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-heading">Document Vault</CardTitle>
            <CardDescription>Securely store passports, contracts, and compliance documents (PDF, JPG, PNG)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">Uploading…</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">
                    {isDragActive ? "Drop files here" : "Drag & drop files, or click to browse"}
                  </span>
                  <span className="text-xs">PDF, JPG, PNG — max 10 MB</span>
                </div>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <ScrollArea className="max-h-[240px]">
                <div className="space-y-2">
                  {files.map((f) => {
                    const ext = f.name.split(".").pop()?.toLowerCase();
                    const Icon = ext === "pdf" ? FileText : Image;
                    return (
                      <div
                        key={f.name}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{f.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {f.created_at ? new Date(f.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>

      {/* AI Concierge */}
      {user && (
        <AIConciergeWidget
          userId={user.id}
          daysSpent={daysSpent}
          taxResident={isTaxResident}
          enrollmentStatus={enrollmentStatus}
        />
      )}
    </div>
  );
}
