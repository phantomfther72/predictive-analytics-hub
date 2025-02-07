import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DashboardProfile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              value="user@example.com"
              disabled
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Subscription Tier</label>
            <p className="text-slate-600">Free</p>
          </div>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    </div>
  );
};