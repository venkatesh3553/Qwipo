import { useEffect, useState } from "react";
import "./index.css";

function CustomerForm({ customerId }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", phone_number: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (customerId) {
      fetch(`http://localhost:3001/api/customers/${customerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setForm({
              first_name: data.first_name,
              last_name: data.last_name,
              phone_number: data.phone_number,
            });
          }
        });
    }
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = customerId
      ? `http://localhost:3001/api/customers/${customerId}`
      : "http://localhost:3001/api/customers";
    const method = customerId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      window.location.href = "/";
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>{customerId ? "Update Customer" : "Add Customer"}</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        <label>First Name</label>
        <input
          type="text"
          placeholder="Enter first name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          placeholder="Enter last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          required
        />

        <button type="submit" className="btn-submit">
          {customerId ? "Update" : "Create"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default CustomerForm;
