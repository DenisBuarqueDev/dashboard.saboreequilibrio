import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const StatusUpdate = ({ orderId, orderStatus }) => {
  const [status, setStatus] = useState(orderStatus);
  const [loading, setLoading] = useState(false);


  const handleStatus = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Status atualizado!`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error("Erro ao atualizar status:");
      setStatus(newStatus); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form class="w-full">
        <select
          value={status}
          onChange={handleStatus}
          disabled={loading}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        >
          <option value="preparando" selected>
            Preparando
          </option>
          <option value="entrega">Entrega</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
          <option value="pendente">Pendente</option>
        </select>
      </form>
    </div>
  );
};

export default StatusUpdate;
