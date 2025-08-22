import { useState, useEffect, useRef } from "react";
import { fetchEmployeeByName, fetchEmployeeByRole } from "../api";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const getSuggestions = async () => {
        try {
          const nameData = Array.isArray(await fetchEmployeeByName(query))
            ? await fetchEmployeeByName(query)
            : [];
          const roleData = Array.isArray(await fetchEmployeeByRole(query))
            ? await fetchEmployeeByRole(query)
            : [];

          console.log("nameData:", nameData);
          console.log("roleData:", roleData);
          const normalized = [
            ...nameData.map((e) => ({ ...e, __match: "name" })),
            ...roleData.map((e) => ({ ...e, __match: (e.first_name ? "both" : "role") }))
          ];
          const mapById = new Map();
          for (const item of normalized) {
            if (!mapById.has(item.id)) {
              mapById.set(item.id, item);
            } else {
              const existing = mapById.get(item.id);
              if ((!existing.first_name || !existing.last_name) && (item.first_name && item.last_name)) {
                mapById.set(item.id, item);
              }
            }
          }

          const merged = Array.from(mapById.values());

          setSuggestions(merged);
        } catch (err) {
          console.error("Suggestion fetch error:", err);
          setSuggestions([]);
        }
      };

      getSuggestions();
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (item) => {
    const value = item.first_name ? `${item.first_name} ${item.last_name}` : item.emp_role;
    setQuery(value);
    setSuggestions([]);
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    onSearch(query);
  };

  return (
    <div style={{ position: "relative", width: 360 }}>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="employee-search"
          type="text"
          placeholder="Search by name or role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
      </form>

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "48px",
            width: "100%",
            border: "1px solid #ccc",
            color: "#000",
            background: "#fff",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 1000,
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            maxHeight: 260,
            overflowY: "auto",
            borderRadius: 6,
          }}
        >
          {suggestions.map((emp) => (
            <li
              key={emp.id ?? `${emp.emp_role}-${Math.random()}`}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f1f1",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseDown={() => handleSelect(emp)}
            >
              {emp.first_name ? (
                <>
                  <div style={{ fontWeight: 700 }}>
                    {emp.first_name} {emp.last_name}
                  </div>
                  {emp.emp_role && (
                    <div style={{ fontSize: 12, color: "#555" }}>
                      {emp.emp_role} <span style={{ fontSize: 11, color: "#999" }}>• name match</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontWeight: 700 }}>
                  {emp.emp_role} <span style={{ fontSize: 12, color: "#777" }}> (role)</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
