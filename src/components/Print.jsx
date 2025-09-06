import React, {useState} from "react";
import { FaPrint } from "react-icons/fa";
import api from "../api/axios";

const Print = ({id}) => {
  const [loading, setLoading] = useState(false);

  const printOrders = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/orders/print/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <button onClick={() => printOrders(id)}>
      <FaPrint />
    </button>
  );
};

export default Print;
