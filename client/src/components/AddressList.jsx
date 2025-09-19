function AddressList({ addresses, onDelete }) {
  if (!addresses || addresses.length === 0) return <p>No addresses found.</p>;

  return (
    <ul>
      {addresses.map((addr) => (
        <li key={addr.id} className="address-item" style={{ marginBottom: "10px" }}>
          <p>
            {addr.address_details}, {addr.city}, {addr.state}, {addr.pin_code}
          </p>
          <button
            onClick={() => onDelete(addr.id)}
            style={{
              color: "white",
              backgroundColor: "red",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default AddressList;
