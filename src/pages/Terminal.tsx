import React from 'react';
import { RoleGate } from '@/components/auth/RoleGate';
import { TerminalDashboard } from '@/components/terminal/TerminalDashboard';

const Terminal = () => {
  return (
    <RoleGate requiredRole="pro">
      <TerminalDashboard />
    </RoleGate>
  );
};

export default Terminal;