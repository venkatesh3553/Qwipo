import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./index.css"
function CustomerList() {
  const [customers, setCustomers] = useState([]);

  // Fetch all customers
  const fetchCustomers = () => {
    axios
      .get("http://localhost:3001/api/customers")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3001/api/customers/${id}`);
        setCustomers(customers.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  return (
    <div className="customer-container">
      <h2>Customer List</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Addresses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.phone_number}</td>
              <td>{c.addresses?.length ?? 0}</td>
              <td className="actions">
                <Link to={`/customers/${c.id}`} className="btn view">View</Link>
                <Link to={`/customers/${c.id}/edit`} className="btn edit">Edit</Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="btn delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
