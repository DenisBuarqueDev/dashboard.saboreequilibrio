import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaClockRotateLeft } from "react-icons/fa6";
import StatusUpdate from "../../components/StatusUpdate";
import { io } from "socket.io-client";

/*const socket = io("http://localhost:5000", {
  transports: ["websocket"], // força usar WebSocket
});*/

const socket = io("https://backend-saboreequilibrio.onrender.com", {
  transports: ["websocket"], // força usar WebSocket
});

const index = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});

  // Busca as ordens do backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/orders/admin");
      setOrders(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Erro ao buscar pedidos.";
      //toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false); // sempre finaliza o carregamento
    }
  };

  // Busca a contagem de pedidos por status
  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders/countstatus");

      setCounts(res.data);
    } catch (error) {
      console.error("Erro ao buscar contagem:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCounts();
  }, []); // Executa apenas uma vez ao montar o componente

  useEffect(() => {
    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="space-y-8 animate-pulse my-9 md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
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
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                {counts.preparando || 0} Prep.
              </Link>
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
                <Link
                  to="/"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {counts.entrega || 0} Entr.
                </Link>
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
                <Link
                  to="/"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {counts.finalizado || 0} Final.
                </Link>
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
                <Link
                  to="/"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {counts.cancelado || 0} Cancel.
                </Link>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 mb-2 md:grid-cols-4 md:gap-2">
          {orders.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col w-full gap-4 space-y-1 border p-2 shadow rounded bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {order.userId.image && (
                        <img
                          className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                          src={order.userId.image}
                          alt="Avatar"
                        />
                      )}

                      <small className="font-semibold">
                        {order.userId.firstName} {order.userId.lastName}
                      </small>
                    </div>
                    <small>{order.userId.phone}</small>
                  </div>

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
      </section>
    </main>
  );
};

export default index;
