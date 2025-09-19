import { useParams } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";

function CustomerFormPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>{id ? "Edit Customer" : "New Customer"}</h1>
      <CustomerForm customerId={id} />
    </div>
  );
}

export default CustomerFormPage;
