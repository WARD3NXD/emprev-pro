"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider"; // adjust path if needed

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes"; // if using next-themes; remove if not

// --- small ThemeToggle (optional) ---
function ThemeToggle() {
  // if you didn't set up next-themes, remove this component or use your theme context
  try {
    // try/catch so build won't fail if next-themes is not installed
    const { theme, setTheme, systemTheme } = useTheme();
    const active = theme === "system" ? systemTheme : theme;
    const isDark = active === "dark";
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    );
  } catch {
    return null;
  }
}

// placeholder data (same as before)
const kpis = [
  { id: "completed", title: "Reviews completed", value: "128", delta: "+12%" },
  { id: "inprogress", title: "In progress", value: "34", delta: "-3%" },
  { id: "overdue", title: "Overdue", value: "6", delta: "+50%" },
  { id: "avgscore", title: "Avg. score", value: "4.2 / 5", delta: "+0.1" },
];

const recentActivities = [
  { id: 1, user: "Aisha Khan", role: "Frontend Developer", action: "Received review", when: "2h ago", score: 4.6 },
  { id: 2, user: "Ravi Patel", role: "Product Designer", action: "Submitted self-review", when: "1d ago", score: null },
  { id: 3, user: "Mei Lin", role: "QA Engineer", action: "Manager review completed", when: "3d ago", score: 4.8 },
  { id: 4, user: "Liam O'Connor", role: "Data Analyst", action: "Peer feedback added", when: "5d ago", score: null },
];

const upcomingReviews = [
  { id: 1, name: "Aisha Khan", due: "Nov 20, 2025", stage: 0.75 },
  { id: 2, name: "Ravi Patel", due: "Nov 22, 2025", stage: 0.45 },
  { id: 3, name: "Mei Lin", due: "Dec 02, 2025", stage: 0.9 },
];

export default function DashboardPage() {
  // --- AUTH GUARD (must be inside the component function) ---
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if auth finished loading and no user -> redirect to login
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // while the AuthProvider is initializing (reading localStorage), show a simple splash
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  // --- actual dashboard UI (same as earlier) ---
  return (
    <main className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of active reviews, recent activity and KPIs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Input placeholder="Search people or reviews..." className="w-64" />
            <Button variant="ghost" className="px-3">
              <Search size={16} />
            </Button>
          </div>

          <ThemeToggle />

          <Button onClick={() => router.push("/new-review")}>New review</Button>
          <Button variant="ghost" onClick={() => { signOut(); router.replace("/login"); }}>
            Sign out
          </Button>

          <Avatar>
            <AvatarImage src="/avatar.jpg" alt="You" />
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-semibold">{k.title}</span>
                <Badge variant="secondary">{k.delta}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{k.value}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Review progress</span>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">Export</Button>
                  <Button size="sm">Manage cycles</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingReviews.map((r) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{r.name.split(" ")[0][0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-sm text-muted-foreground">Due {r.due}</div>
                      </div>
                    </div>
                    <div className="w-56">
                      <Progress value={Math.round(r.stage * 100)} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-56">
                <ul className="space-y-4">
                  {recentActivities.map((a) => (
                    <li key={a.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{a.user.split(" ")[0][0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{a.user}</div>
                          <div className="text-sm text-muted-foreground">{a.action} • {a.role}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{a.when}</div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Engineering</div>
                    <div className="text-xs text-muted-foreground">24 employees • 18 reviews open</div>
                  </div>
                  <div className="w-24">
                    <Progress value={72} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Product</div>
                    <div className="text-xs text-muted-foreground">8 employees • 3 reviews open</div>
                  </div>
                  <div className="w-24">
                    <Progress value={62} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Design</div>
                    <div className="text-xs text-muted-foreground">6 employees • 2 reviews open</div>
                  </div>
                  <div className="w-24">
                    <Progress value={80} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-2">
                <Button variant="outline">Start review cycle</Button>
                <Button variant="ghost">Invite team</Button>
                <Button>Configure templates</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top performers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Last review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Aisha Khan</TableCell>
                    <TableCell>4.6</TableCell>
                    <TableCell>Oct 30, 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mei Lin</TableCell>
                    <TableCell>4.8</TableCell>
                    <TableCell>Oct 28, 2025</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground py-6">Built with shadcn/ui • Lightweight & upgradeable</footer>
    </main>
  );
}
