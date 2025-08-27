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
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/users", { withCredentials: true });
      setUsers(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response.data.error || "Erro ao buscar usuários!!");
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
    }
  };

  // Excluir produto
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      setIsLoading(true);
      const response = await api.delete(`/api/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((p) => p._id !== id));
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error);
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
    <main className="flex flex-col space-y-2 max-w-screen-xl m-auto w-full p-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Usuários</h1>
        <button
          onClick={abrirModal}
          type="button"
          className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FaPlus />
        </button>
      </div>

      {message && (
        <div
          id="alert-border-3"
          className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
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
          <div className="ms-3 text-sm font-medium">{message}</div>
        </div>
      )}

      <div className="table w-full border rounded shadow">
        <div className="table-header-group bg-gray-300">
          <div className="table-row">
            <div className="table-cell text-left font-medium p-2">Nome</div>
            <div className="hidden md:table-cell text-left font-medium p-2">
              E-mail
            </div>
            <div className="hidden md:table-cell text-left font-medium p-2">
              Telefone
            </div>
            <div className="table-cell text-center font-medium w-28 p-2">
              Ações
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-gray-500 text-center py-4">Carregando...</div>
        )}
        {users.length === 0 && !isLoading && (
          <div className="text-gray-500 text-center py-4">
            Nenhuma usuário encontrada.
          </div>
        )}

        <div className="table-row-group p-2">
          {users &&
            users.map((user) => (
              <div key={user._id} className="table-row hover:bg-gray-100">
                <div className="table-cell border-t p-2">
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="hidden md:table-cell p-2 border-t">
                  <p>{user.email}</p>
                </div>
                <div className="hidden md:table-cell p-2 border-t">
                  <p>{user.phone}</p>
                </div>
                <div className="table-cell w-28 p-2 border-t">
                  <div
                    className="inline-flex rounded-md shadow-xs"
                    role="group"
                  >
                    <button
                      onClick={() => handleEdit(user._id)}
                      disabled={isLoading}
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={isLoading}
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={fecharModal}
        contentLabel="Modal de Usários"
        className="bg-white rounded-xl p-5 max-w-[600px] min-h-[300px] w-full h-auto mx-auto my-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-2"
      >
        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
          </div>

          <div className="w-full">
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

          <div>
            <label className="block text-sm font-medium">Imagem</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="border p-2 w-full rounded-lg"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            {isLoading && (
              <button
                disabled
                type="button"
                className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
                Loading...
              </button>
            )}

            {!isLoading && (
              <>
                <button
                  onClick={handleSubmit}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {editId ? "Atualizar" : "Adicionar"}
                </button>

                <button
                  onClick={fecharModal}
                  className="text-black hover:bg-gray-200 border border-gray-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default index;
