import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaClockRotateLeft } from "react-icons/fa6";
import { TbMessage } from "react-icons/tb";
import StatusUpdate from "../../components/StatusUpdate";
import { io } from "socket.io-client";
import CountOrders from "../../components/CountOrders";
import Print from "../../components/Print";
import Chat from "../../components/Chat";
import MessageCount from "../../components/MessageCount";
import { useAuthValue } from "../../context/AuthContextProvider";

// URL websocket
const socket = io(`${import.meta.env.VITE_API_URL}`, {
  transports: ["websocket"], // força usar WebSocket
});

const index = () => {
  const { user } = useAuthValue();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState("preparando");
  const [chat, setChat] = useState([]);

  // Busca as ordens do backend
  const fetchOrders = async (status = "preparando") => {
    try {
      setLoading(true);
      const response = await api.get(`/api/orders/admin?status=${status}`);
      setOrders(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Erro ao buscar pedidos.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  useEffect(() => {
    socket.on("newOrder", (order) => {
      // só adiciona ao estado se for do status ativo
      if (order.status === activeStatus) {
        setOrders((prev) => [order, ...prev]);
      }
    });

    // ouvir pedidos atualizados
    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) => {
        // Se mudou de status e não pertence mais à aba ativa → remove
        if (updatedOrder.status !== activeStatus) {
          return prev.filter((order) => order._id !== updatedOrder._id);
        }

        // Se pertence ao status ativo → atualiza ou adiciona
        const exists = prev.find((order) => order._id === updatedOrder._id);
        if (exists) {
          return prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );
        } else {
          return [updatedOrder, ...prev];
        }
      });
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusUpdated");
    };
  }, [activeStatus]);

  const handleChat = async (orderId) => {
    openModal(false);
    setChat(orderId);
  };

  // Hook que demonstra se a modal está aberta ou não
  const [modalIsOpen, setIsOpen] = useState(true);

  // Função que abre a modal
  function openModal() {
    setIsOpen(false);
  }

  // Função que fecha a modal
  function closeModal() {
    setIsOpen(true);
  }

  if (loading) {
    return (
      <div
        role="status"
        className="max-w-screen-sm space-y-8 animate-pulse my-9 md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
      >
        <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-sm sm:w-96 dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="w-full">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full p-2 bg-gray-100 min-h-screen md:py-4">
      <section className="max-w-screen-xl w-full flex flex-col mx-auto">
        <CountOrders setActiveStatus={setActiveStatus} />

        {error && <p>error</p>}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-2">
          {orders.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col w-full space-y-1 border p-2 shadow rounded bg-white"
                >
                  {order.userId && (
                    <div class="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          class="w-10 h-10 rounded-full"
                          src={order.userId.image}
                          alt="Photo"
                        />
                        <div class="font-medium dark:text-white">
                          <div>
                            {order.userId.firstName} {order.userId.lastName}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {order.userId.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Print id={order._id} />
                        <button
                          onClick={() => handleChat(order._id)}
                          type="button"
                          class="inline-flex items-center px-2 py-1 text-sm text-center text-black border rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                          <TbMessage />
                          <MessageCount orderId={order._id} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <small className="flex items-center">
                      {order.address && (
                        <>
                          {order.address.street}, {order.address.number},{" "}
                          {order.address.district}, {order.address.zipCode},{" "}
                          {order.address.city} -{order.address.state},{" "}
                          {order.address.complement}
                        </>
                      )}
                    </small>
                  </div>
                  <StatusUpdate
                    orderId={order._id}
                    orderStatus={order.status}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          //second: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center text-sm font-semibold">
                        <FaClockRotateLeft className="mr-2" />
                        {(() => {
                          const date = new Date(order.createdAt);
                          date.setMinutes(date.getMinutes() + 50); // Adiciona 50 minutos
                          // Extrai a hora formatada (em fuso horário local, ex: Brasília)
                          const hour = date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "America/Sao_Paulo",
                          });

                          return hour;
                        })()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <ul>
                      {order.items && order.items.length > 0 ? (
                        <ul className="">
                          {order.items.map((item) => (
                            <li
                              key={item._id}
                              className="flex items-center justify-between border-b text-gray-600"
                            >
                              <small className="font-semibold">
                                {item.qtd} - {item.title}
                              </small>
                              <small>
                                R$ {item.subtotal.toFixed(2).replace(".", ",")}
                              </small>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Nenhum item encontrado para este pedido.
                        </p>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <small>
                        Pagamento:{" "}
                        {order.payment.charAt(0).toUpperCase() +
                          order.payment.slice(1)}
                      </small>
                      <small className="font-semibold">
                        R$ {order.amount.toFixed(2).replace(".", ",")}
                      </small>
                    </div>

                    <small>Delivery R$ 0,00</small>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 max-w-screen-sm w-full mx-auto p-2 bg-gray bg-white"
          hidden={modalIsOpen}
        >
          <div className="flex items-center justify-between mb-2 p-2">
            <p className="font-bold">Chat Atendimento:</p>
            <button
              type="button"
              onClick={closeModal}
              className="flex items-center justify-center px-2 rounded-full text-sm text-white bg-red-500"
            >
              X
            </button>
          </div>

          <Chat orderId={chat} userId={user.id} />
        </div>
      </section>
    </main>
  );
};

export default index;
