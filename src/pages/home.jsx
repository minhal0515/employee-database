import { useState, useEffect } from "react";
import SearchBar from "../components/Searchbar";
import { fetchAllEmployees, fetchEmployeeById, fetchEmployeeByRole, fetchEmployeeByName } from "../api";
import AddEmployee from "../components/AddEmployee";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEmployees().then(setEmployees);
  }, []);
  
  
const handleSearch = (query) => {
  if (!query) {
    fetchAllEmployees().then(setEmployees);
  } else if (!isNaN(query)) {
    fetchEmployeeById(query).then((data) => setEmployees(data ? [data] : []));
  }  else {
    fetchEmployeeByRole(query).then((data) => {
      if(data && data.length > 0) {
        setEmployees(data);
      } else {
        fetchEmployeeByName(query).then(setEmployees);
    }
    });
  }
};
  const goToAddEmployee = () => {
    navigate("/add-employee");
  };

  return (
    <div style={{height: "100vh", width: "221vh", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f5dc"}}>
      <h1 style={{color: "#5a4632"}}>Employee Database</h1>
      <SearchBar onSearch={handleSearch} />
      <button onClick={goToAddEmployee}
        style={{ backgroundColor: "#2a4d69", color: "white", padding:"12px 24px", borderRadius: "4px", border: "none", cursor: "pointer", marginBottom: "20px", fontsize: "16px" }}
        >
        Add New Employee!
      </button>
      <ul style={{ marginLeft: "0px", textAlign: "left" }}>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <li key={emp.id}>
                <span style={{ color: "#2a4d69"}}>{emp.first_name} {emp.last_name}</span> {" - "}
  <span style={{ color: "#a0522d" }}>{emp.emp_role}</span>
            </li>
          ))
        ) : (
          <p>No results found</p>
        )}
      </ul>
    </div>
  );
}
