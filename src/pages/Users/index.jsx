import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import api from "../../api/axios";

const index = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/users", { withCredentials: true });
      setUsers(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao buscar usuários!");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar usuários ao carregar
  useEffect(() => {
    fetchUsers();
  }, []);

  // Atualizar formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setMessage("Apenas imagens PNG, JPG ou JPEG são permitidas");
      return;
    }
    setForm({ ...form, image: file });
  };

  // Criar ou atualizar produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      setMessage("Preencha todos os campos são obrigatórios!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "image" && form.image) {
        formData.append("image", form.image);
      } else if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editId) {
        // Atualizar produto
        const response = await api.put(`/api/users/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setUsers(users.map((u) => (u._id === editId ? response.data.data : u)));
        setMessage(response.data.message);
        setIsOpen(true);
      } else {
        // Criar produto
        const response = await api.post("/api/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setUsers([response.data.data, ...users]);
        setMessage(response.data.message);
      }
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        image: null,
      });
      setEditId(null);
      setIsOpen(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  // Editar produto
  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`, {
        withCredentials: true,
      });
      setForm({
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        phone: response.data.data.phone,
        email: response.data.data.email,
        image: null,
      });
      setEditId(id);
      setIsOpen(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao buscar produto");
      setIsOpen(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Excluir produto
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    setIsLoading(true);
    try {
      const response = await api.delete(`/api/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((p) => p._id !== id));
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hook que demonstra se a modal está aberta ou não
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // Função que abre a modal
  function abrirModal() {
    setIsOpen(true);
  }

  // Função que fecha a modal
  function fecharModal() {
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      image: null,
    });
    setEditId(null);
    setMessage("");
    setIsOpen(false);
  }

  return (
    <main className="flex flex-col space-y-2 max-w-screen-xl mx-auto w-full p-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Usuários</h1>
        <button
          onClick={abrirModal}
          type="button"
          className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FaPlus />
          Adicionar
        </button>
      </div>

      {message && (
        <div
          id="alert-border-3"
          class="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
          role="alert"
        >
          <svg
            class="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div class="ms-3 text-sm font-medium">{message}</div>
        </div>
      )}

      {error && (
        <div
          id="alert-border-2"
          className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
          role="alert"
        >
          <svg
            className="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div className="ms-3 text-sm font-medium">{error}</div>
        </div>
      )}

      <div class="overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading && <p className="text-gray-500">Carregando...</p>}
        {users.length === 0 && !isLoading && <p>Nenhuma usuário encontrada.</p>}
        <table class="w-full text-sm text-left border rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Nome
              </th>
              <th scope="col" class="px-6 py-3">
                Telefone
              </th>
              <th scope="col" class="px-6 py-3">
                E-mail
              </th>
              <th scope="col" class="px-6 py-3 w-24">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr
                  key={user._id}
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td
                    scope="row"
                    class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${user.image}`}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-white font-semibold w-8 h-8 rounded-full mr-2 bg-gray-400">
                        F
                      </div>
                    )}
                    {user.firstName} {user.lastName}
                  </td>
                  <td
                    scope="row"
                    class="px-4 py-2 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.phone}
                  </td>
                  <td
                    scope="row"
                    class="px-4 py-2 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.email}
                  </td>
                  <td class="px-4 py-2 text-center">
                    <div class="inline-flex rounded-md shadow-xs" role="group">
                      <button
                        onClick={() => handleEdit(user._id)}
                        disabled={isLoading}
                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={isLoading}
                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={fecharModal}
        contentLabel="Modal de exemplo"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0 ,0, 0.8)",
          },
          content: {
            background: "#ffffff",
            borderRadius: "10px",
            padding: "20px",
            width: "50%",
            height: "370px",
            margin: "auto",
          },
        }}
      >
        <form onSubmit={handleSubmit} class="w-full mx-auto">
          <h1 className="py-2 text-2xl">Usuário</h1>
          <div className="grid grid-cols-1 mb-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sobrenome</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mb-2 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">E-Mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                min="0"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="my-3">
            <label className="block text-sm font-medium">Imagem</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="border p-2 w-full rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {editId ? "Atualizar" : "Adicionar"}
            </button>
            <button
              onClick={fecharModal}
              class="text-black hover:bg-gray-200 border border-gray-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default index;
