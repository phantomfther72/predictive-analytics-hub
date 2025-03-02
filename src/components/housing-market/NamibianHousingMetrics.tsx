
import React from "react";
import { Bar, BarChart, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
// Rest of import statements...

// Fix any reference to Bar component in the code
// And ensure any fill property doesn't use a function (which causes the TS2769 error)
// For example, replace:
// fill={({ change_percentage }) => change_percentage > 0 ? "#10b981" : "#ef4444"}
// with:
// Fill based on data in the render method instead
