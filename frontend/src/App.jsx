import React, { useState, useEffect } from "react";
import { Users, Clock, Wallet, Calendar, LayoutDashboard, Plus, Search, MapPin, CheckCircle, XCircle, FileText, Target, UserCircle, LogOut } from "lucide-react";
import axios from "axios";

// API URL from Vercel Environment Variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState("admin"); 
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Employees from Backend
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (e) {
      console.error("Error fetching employees", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "employees") fetchEmployees();
  }, [activeTab]);

  const addEmployee = async (employeeData) => {
    try {
      await axios.post(`${API_URL}/employees`, employeeData);
      fetchEmployees();
      setShowEmployeeModal(false);
    } catch (e) {
      alert("Error adding employee");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800 flex items-center gap-2">
          <Wallet className="text-yellow-400" /> IndoHRIS
        </div>
        <div className="p-4">
          <label className="text-xs text-indigo-300 block mb-2 uppercase font-bold">View Mode</label>
          <select className="w-full bg-indigo-800 border border-indigo-700 p-2 rounded text-sm outline-none" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
            <option value="admin">HR Administrator</option>
            <option value="employee">Employee User</option>
          </select>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {userRole === 'admin' && <NavItem icon={<Users size={20}/>} label="Employees" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />}
          <NavItem icon={<Clock size={20}/>} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          {userRole === 'admin' && <NavItem icon={<Wallet size={20}/>} label="Payroll" active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} />}
          <NavItem icon={<Calendar size={20}/>} label="Leave" active={activeTab === 'leave'} onClick={() => setActiveTab('leave')} />
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userRole === 'admin' ? 'HR Manager' : 'Budi Santoso'}</span>
            <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView employees={employees} />}
          {activeTab === 'employees' && <EmployeeView employees={employees} setEmployees={setEmployees} showModal={showEmployeeModal} setShowEmployeeModal={setShowEmployeeModal} addEmployee={addEmployee} loading={loading} />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'payroll' && <PayrollView employees={employees} />}
          {activeTab === 'leave' && <div className="text-center p-10">Leave Module coming soon...</div>}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}>
      {icon} {label}
    </button>
  );
}

function DashboardView({ employees }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Total Staff" value={employees.length} color="border-blue-500" />
      <StatCard label="Active Leaves" value="3" color="border-yellow-500" />
      <StatCard label="Attendance" value="95%" color="border-green-500" />
    </div>
  );
}

function EmployeeView({ employees, showModal, setShowModal, addEmployee, loading }) {
  const [form, setForm] = useState({ fullName: '', nik: '', departmentId: 'dept-1', baseSalary: 0, allowances: 0 });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input className="pl-10 pr-4 py-2 border rounded-lg w-full" placeholder="Search..." />
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"><Plus size={18}/> Add Employee</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-sm text-gray-600">
            <tr><th className="p-4">NIK</th><th className="p-4">Name</th><th className="p-4">Salary</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr> : 
             employees.map(emp => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono">{emp.nik}</td><td className="p-4">{emp.fullName}</td><td className="p-4">Rp {emp.baseSalary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">New Employee</h3>
            <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={e => setForm({...form, fullName: e.target.value})} />
            <input className="w-full border p-2 rounded" placeholder="NIK" onChange={e => setForm({...form, nik: e.target.value})} />
            <input type="number" className="w-full border p-2 rounded" placeholder="Salary" onChange={e => setForm({...form, baseSalary: Number(e.target.value)})} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button onClick={() => addEmployee(form)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendanceView() {
  return <div className="bg-indigo-600 text-white p-10 rounded-2xl text-center shadow-lg">
    <h3 className="text-2xl font-bold mb-4">Ready for Work?</h3>
    <button onClick={() => alert("Clock-in successful!")} className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold">📍 Clock-In Now</button>
  </div>;
}

function PayrollView({ employees }) {
  return <div className="space-y-4">
    {employees.map(emp => (
      <div key={emp.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
        <div><h4 className="font-bold">{emp.fullName}</h4><p className="text-sm text-gray-500">{emp.nik}</p></div>
        <div className="text-right"><p className="text-xs text-gray-400">Base Salary</p><p className="font-bold text-indigo-700">Rp {emp.baseSalary.toLocaleString()}</p></div>
      </div>
    ))}
  </div>;
}

function StatCard({ label, value, color }) {
  return <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}><p className="text-gray-500 text-sm">{label}</p><h3 className="text-2xl font-bold">{value}</h3></div>;
}
