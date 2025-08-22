const API_BASE_URL = "http://127.0.0.1:8000";
export async function fetchAllEmployees() {
  const res = await fetch(`${API_BASE_URL}/api/employees`);
  return res.json();
}
export async function fetchEmployeeById(id) {
  const res = await fetch(`${API_BASE_URL}/api/employees?eid=${id}`);
  return res.json();
}
export async function fetchEmployeeByName(name) {
  const res = await fetch(`http://127.0.0.1:8000/api/employees?ename=${name}`);
  return res.json();
}
export async function fetchEmployeeByRole(role) {
  const res = await fetch(`${API_BASE_URL}/api/employees?erole=${role}`);
  return res.json();
}
export async function addEmployee(employeeData) {
  const res = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  return res.json();
}