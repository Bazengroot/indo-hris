import React, { useState } from "react";
import { Users, Clock, Wallet, Calendar, LayoutDashboard, Plus, Search, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-indigo-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">IndoHRIS 🇮🇩</h1>
        <nav className="space-y-4">
          <div onClick={() => setActiveTab("dashboard")} className="cursor-pointer hover:text-indigo-300">Dashboard</div>
          <div onClick={() => setActiveTab("employees")} className="cursor-pointer hover:text-indigo-300">Employees</div>
          <div onClick={() => setActiveTab("payroll")} className="cursor-pointer hover:text-indigo-300">Payroll</div>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold capitalize mb-5">{activeTab}</h2>
        <div className="bg-white p-6 rounded-lg shadow">Welcome to IndoHRIS Production. System is Live!</div>
      </div>
    </div>
  );
}