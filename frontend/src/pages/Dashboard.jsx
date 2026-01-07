import { useEffect, useState } from "react";
import axios from "../api/axios";

function SummaryCard({ title, value, loading }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">
        {loading ? <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span> : value}
      </h2>
    </div>
  );
}

function EmployeeModal({ isOpen, onClose, employee, onSave, mode = "create" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee && mode === "edit") {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        role: employee.role || "",
        department: employee.department || ""
      });
    } else {
      setFormData({ name: "", email: "", role: "", department: "" });
    }
  }, [employee, mode, isOpen]);

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-white">
            {mode === "edit" ? "Edit Employee" : "Add New Employee"}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !formData.name || !formData.email || !formData.role || !formData.department}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [stats, setStats] = useState({
    total: 0,
    byDepartment: {},
    recentCount: 0
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/employees");
      setEmployees(res.data);
      
      // Calculate stats
      const byDept = res.data.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {});
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recent = res.data.filter(emp => 
        new Date(emp.createdAt) > thirtyDaysAgo
      ).length;
      
      setStats({
        total: res.data.length,
        byDepartment: byDept,
        recentCount: recent
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (data) => {
    try {
      await axios.post("/employees", data);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    }
  };

  const handleUpdateEmployee = async (data) => {
    try {
      await axios.put(`/employees/${selectedEmployee._id}`, data);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update employee");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete employee");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setModalMode("edit");
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const topDepartment = Object.entries(stats.byDepartment)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your employee directory</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchEmployees}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button 
                onClick={openCreateModal}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm flex-1">{error}</span>
            <button onClick={() => setError("")} className="ml-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Total Employees" value={stats.total} loading={loading} />
          <SummaryCard title="New This Month" value={stats.recentCount} loading={loading} />
          <SummaryCard title="Top Department" value={topDepartment} loading={loading} />
        </div>

        {/* Employees Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-500">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first employee</p>
              <button 
                onClick={openCreateModal}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Add Employee
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <div key={employee._id} className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {employee.department}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Joined {new Date(employee.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        onSave={modalMode === "edit" ? handleUpdateEmployee : handleCreateEmployee}
        mode={modalMode}
      />
    </div>
  );
}