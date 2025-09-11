import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  transports: ["websocket"], // força usar WebSocket
});

const Chat = ({ orderId, userId }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Entrar na sala do pedido
    socket.emit("joinOrder", orderId);

    // Buscar mensagens iniciais
    const fetchMessages = async () => {
      const res = await api.get(`/api/chat/${orderId}`);
      setMessages(res.data);
    };
    fetchMessages();

    // Receber novas mensagens
    socket.on("newMessage", (message) => {
      if (message.orderId === orderId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [orderId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await api.post(`/api/chat/${orderId}`, {
      text,
      sender: "admin", // ou "user"
      userId,
    });
    setText("");
  };

  return (
    <>
      <div className="h-72 overflow-y-auto p-4 space-y-1 border border-gray-300 rounded-lg bg-white">
        {messages &&
          messages.map((message, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div class="flex items-start gap-2.5">
                <img
                  class="w-8 h-8 rounded-full"
                  src={message.userId.image}
                  alt="Jese image"
                />
                <div class="flex flex-col gap-1 w-full">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {message.from}
                    </span>
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {message.time}
                    </span>
                  </div>
                  <div class="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p class="text-sm font-normal text-gray-900 dark:text-white">
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-500"
        >
          Enviar
        </button>
      </form>
    </>
  );
};

export default Chat;
