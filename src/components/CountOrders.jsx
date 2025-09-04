import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { io } from "socket.io-client";

const CountOrders = ({ setActiveStatus }) => {
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    pendente: 0,
    preparando: 0,
    entrega: 0,
    finalizado: 0,
    cancelado: 0,
  });

  useEffect(() => {
    // Conectar socket
    const socket = io("https://backend-saboreequilibrio.onrender.com");
    //const socket = io("http://localhost:5000");

    // Buscar contagem inicial da API
    const fetchCounts = async () => {
      const { data } = await api.get("/api/orders/countstatus");
      setCounts(data);
    };
    fetchCounts();

    // Ouvir atualizações em tempo real
    socket.on("ordersCountUpdated", (newCounts) => {
      setCounts(newCounts);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <nav className="flex mb-5" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <button
            onClick={() => setActiveStatus("preparando")}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            {counts.preparando || 0} Preparando
          </button>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <button
              onClick={() => setActiveStatus("entrega")}
              className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              {counts.entrega || 0} Entrega
            </button>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <button
              onClick={() => setActiveStatus("finalizado")}
              className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              {counts.finalizado || 0} Finalizado
            </button>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <button
              onClick={() => setActiveStatus("cancelado")}
              className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              {counts.cancelado || 0} Cancelado
            </button>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default CountOrders;
