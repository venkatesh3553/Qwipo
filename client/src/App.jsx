import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Component } from "react";
import CustomerFormPage from "./Pages/CustomerFormPage";
import CustomerDetailPage from "./Pages/CustomerDetailPage";
import CustomerListPage from "./Pages/CustomerListPage";


  
class App extends Component{
  render() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
      </Routes>
    </BrowserRouter>
  );
  }
}

export default App;
