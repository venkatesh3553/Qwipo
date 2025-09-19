import { useState } from "react";
import './index.css'

function AddressForm({ customerId, onAdded }) {
  const [form, setForm] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitting address for customer:", customerId, form);
    const res = await fetch(`http://localhost:3001/api/customers/${customerId}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log("Response:", data);
    setForm({ address_details: "", city: "", state: "", pin_code: "" });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <input
        type="text"
        placeholder="Address"
        value={form.address_details}
        onChange={(e) => setForm({ ...form, address_details: e.target.value })}
        required
        className="input"
      />
      <input
        type="text"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        required
        className="input"
      />
      <input
        type="text"
        placeholder="State"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
        required
        className="input"
      />
      <input
        type="text"
        placeholder="Pin Code"
        value={form.pin_code}
        onChange={(e) => setForm({ ...form, pin_code: e.target.value })}
        required
        className="input"
      />
      <button className="add-button" type="submit">Add Address</button>
    </form>
  );
}

export default AddressForm;
