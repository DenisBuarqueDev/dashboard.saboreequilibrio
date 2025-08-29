import { useState, useEffect } from "react";
import api from "../api/axios"; // seu axios configurado
import { toast } from "react-toastify"; // opcional para alertas bonitos

const NewOrderNotifier = () => {
  const [lastOrderCount, setLastOrderCount] = useState(0);

  const checkNewOrders = async () => {
    try {
      const res = await api.get("/api/orders/admin");
      const orders = res.data;

      if (orders.length > lastOrderCount) {
        toast.success("🚀 Novo pedido recebido!");
        setLastOrderCount(orders.length);
      }
    } catch (err) {
      console.error("Erro ao verificar novos pedidos:", err);
    }
  };

  useEffect(() => {
    // primeira verificação
    checkNewOrders();

    // verifica a cada 5 segundos
    const interval = setInterval(() => {
      checkNewOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  return null; // não renderiza nada, só monitora
};

export default NewOrderNotifier;
