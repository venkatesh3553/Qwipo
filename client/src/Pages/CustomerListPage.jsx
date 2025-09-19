import { Link } from "react-router-dom";
import CustomerList from "../components/CustomerList";

function CustomerListPage() {
  return (
    <div>
      <h1>Customers</h1>
      <Link to="/customers/new">➕ Add Customer</Link>
      <CustomerList />
    </div>
  );
}

export default CustomerListPage;
