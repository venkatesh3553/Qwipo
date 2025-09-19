import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AddressList from "../components/AddressList";
import AddressForm from "../components/AddressForm";

function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  // useCallback ensures fetchCustomer doesn't change between renders
  const fetchCustomer = useCallback(() => {
    fetch(`http://localhost:3001/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Error fetching customer:", err));
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]); // add fetchCustomer as dependency

  if (!customer) return <p className="loading">Loading...</p>;

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await fetch(`http://localhost:3001/api/addresses/${addressId}`, {
          method: "DELETE",
        });
        fetchCustomer(); // refresh customer data
      } catch (err) {
        console.error("Error deleting address:", err);
      }
    }
  };

  return (
    <div className="customer-detail-container">
      {/* Customer Card */}
      <div className="customer-card">
        <h1>
          {customer.first_name} {customer.last_name}
        </h1>
        <p className="phone">📞 {customer.phone_number}</p>
      </div>

      {/* Addresses Section */}
      <div className="address-section">
        <h2>Addresses</h2>
        <AddressList addresses={customer.addresses} onDelete={handleDeleteAddress} />
      </div>

      <div className="address-form-wrapper">
        <h3>Add New Address</h3>
        <AddressForm customerId={id} onAdded={fetchCustomer} />
      </div>
    </div>
  );
}

export default CustomerDetailPage;
