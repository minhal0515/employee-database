import React, { useState } from 'react';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', age: '', gender: '', 
    phoneNumber: '', empRole: '', salary: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/add_employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          phone_number: formData.phoneNumber,
          emp_role: formData.empRole,
          salary: parseFloat(formData.salary)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Success! ID: ${result.employee_id}`);
        setFormData({
          firstName: '', lastName: '', email: '', age: '', gender: '', 
          phoneNumber: '', empRole: '', salary: ''
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text" name="firstName" placeholder="First Name" value={formData.firstName}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <input
          type="text" name="lastName" placeholder="Last Name" value={formData.lastName}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <input
          type="email" name="email" placeholder="Email" value={formData.email}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <input
          type="tel" name="phoneNumber" placeholder="Phone" value={formData.phoneNumber}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <input
          type="number" name="age" placeholder="Age" value={formData.age}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <select
          name="gender" value={formData.gender} onChange={handleChange}
          className="p-2 border rounded" required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <br />
        <input
          type="text" name="empRole" placeholder="Role (e.g., Engineer)" value={formData.empRole}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
        <input
          type="number" name="salary" placeholder="Salary" value={formData.salary}
          onChange={handleChange} className="p-2 border rounded" required
        />
        <br />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Adding...' : 'Add Employee'}
      </button>

      {message && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "8px",
      fontWeight: "600",
      color: message.includes("Success!") ? "#ffffff" : "#ffffff",
      backgroundColor: message.includes("Success!") ? "#16a34a" : "#dc2626", // green-600 or red-600
      border: message.includes("Success!") ? "1px solid #15803d" : "1px solid #b91c1c"
    }}
  >
    {message}
  </div>
)}

    </div>
  );
};

export default AddEmployee;