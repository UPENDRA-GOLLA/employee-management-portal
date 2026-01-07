import axios from "../api/axios";
import { useEffect, useState } from "react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get("/employees").then(res => setEmployees(res.data));
  }, []);

  return (
    <ul>
      {employees.map(e => (
        <li key={e._id}>{e.name}</li>
      ))}
    </ul>
  );
}
