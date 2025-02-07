
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Free</Badge>
              <span className="text-sm text-muted-foreground">- Basic access to market analytics</span>
            </div>
          </div>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    </div>
  );
};
