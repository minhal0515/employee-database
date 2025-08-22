import { useNavigate } from "react-router-dom";
import AddEmployee from "../components/AddEmployee";

export default function AddEmployeePage() {
  const navigate = useNavigate();

  const handleEmployeeAdded = (result) => {
    alert(`Employee added successfully! ID: ${result.employee_id}`);
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh", 
      background: "#f5f5dc", 
      width: "221vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ alignSelf: "flex-start", marginBottom: "20px" }}>
        <button 
          onClick={handleCancel}
          style={{
            background: "#6c757d",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ← Back to Home
        </button>
      </div>
      
      <h1 style={{color: "#5a4632", marginBottom: "30px"}}>Add New Employee</h1>
      
      <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
    </div>
  );
}