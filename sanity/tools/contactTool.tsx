import React, { useState, useEffect, useCallback } from "react";
import { useClient } from "sanity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Trash2, RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Submission {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function ContactTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    const data = await client.fetch<Submission[]>(
      `*[_type == "contactSubmission"] | order(createdAt desc) {
        _id, name, email, message, createdAt
      }`
    );
    setSubmissions(data);
    setIsLoading(false);
  }, [client]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Vill du radera meddelandet från ${name}?`)) return;
    setDeletingId(id);
    await client.delete(id);
    setSubmissions((prev) => prev.filter((s) => s._id !== id));
    setDeletingId(null);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "–";
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  };

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto p-8 font-sans">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="text-primary h-7 w-7" />
          <div>
            <h1 className="text-foreground text-2xl font-bold">Inkommande meddelanden</h1>
            <p className="text-muted-foreground text-sm">
              {submissions.length} meddelande{submissions.length !== 1 ? "n" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubmissions}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Uppdatera
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Inbox className="text-muted-foreground h-16 w-16" />
          <p className="text-muted-foreground text-lg font-medium">Inga meddelanden än</p>
          <p className="text-muted-foreground text-sm">
            När någon skickar ett meddelande via kontaktformuläret visas det här.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <Card key={s._id} className="border-muted shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-foreground text-base font-semibold">
                      {s.name || "Okänt namn"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-0.5">
                      <a
                        href={`mailto:${s.email}`}
                        className="text-primary hover:underline"
                      >
                        {s.email}
                      </a>
                      <span className="text-muted-foreground mx-1">·</span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(s.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleDelete(s._id, s.name)}
                    disabled={deletingId === s._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-wrap text-sm leading-relaxed">
                  {s.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
