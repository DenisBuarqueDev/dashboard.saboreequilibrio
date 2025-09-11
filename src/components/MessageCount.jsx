import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  transports: ["websocket"], // força websocket
});

const MessageCount = ({ orderId }) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await api.get(`/api/chat/count/${orderId}`);
      setCount(res.data.totalMessages);
    } catch (err) {
      console.error("Erro ao buscar quantidade de mensagens:", err);
    }
  };

  useEffect(() => {
    // entrar na sala do pedido
    socket.emit("joinOrder", orderId);

    // carregar quantidade inicial
    fetchCount();

    // ouvir novas mensagens
    socket.on("newMessage", (message) => {
      if (message.orderId === orderId) {
        setCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [orderId]);

  return (
    <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
      {count}
    </span>
  );
};

export default MessageCount;
