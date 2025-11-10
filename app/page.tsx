"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Search } from "lucide-react";
import { PieChart, BarChart, CheckCircle, Clock, User } from "lucide-react";

// Sample data (placeholder) — replace with real data hooks / fetchers
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
  return (
    <main className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Emprev</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your employee with ease.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Input placeholder="Search people or reviews..." className="w-64" />
            <Button variant="ghost" className="px-3">
              <Search size={16} />
            </Button>
          </div>
          <Avatar>
            <AvatarImage src="https://res.cloudinary.com/dpe3jxriv/image/upload/v1762755016/avatar_rupbhz.png" alt="You" />
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
                  <Button variant="ghost" size="sm">
                    Export
                  </Button>
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

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-2">
                <Button>New Review</Button>
                <Button variant="outline">Configure templates</Button>
              </div>
            </CardContent>
          </Card>

          
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground py-6">Built with collaboration of AI and Human Mind</footer>
    </main>
  );
}
