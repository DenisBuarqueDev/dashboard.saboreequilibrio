import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import api from "../../api/axios";

// Código necessário para os recursos de acessibilidade
Modal.setAppElement("#root");

const index = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar categorias ao carregar a página
  useEffect(() => {
    fetchCategories();
  }, []);

  // Criar ou atualizar categoria
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("O título da categoria é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      if (editId) {
        // Atualizar categoria
        const response = await api.put(
          `/api/categories/${editId}`,
          { title },
          {
            withCredentials: true,
          }
        );
        setCategories(
          categories.map((cat) =>
            cat._id === editId ? response.data.data : cat
          )
        );
        setMessage(response.data.message);
      } else {
        // Criar nova categoria
        const response = await api.post(
          "/api/categories",
          { title },
          {
            withCredentials: true,
          }
        );
        setCategories([response.data.data, ...categories]);
        setMessage(response.data.message);
      }
      setTitle("");
      setEditId(null);
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Editar categoria
  const handleEdit = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/categories/${id}`, {
        withCredentials: true,
      });
      setTitle(response.data.title);
      setEditId(id);
      setIsOpen(true);
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir categoria
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;

    setIsLoading(true);
    try {
      const response = await api.delete(`/api/categories/${id}`, {
        withCredentials: true,
      });
      setCategories(categories.filter((cat) => cat._id !== id));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao excluir categoria");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
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
    setIsOpen(false);
  }

  return (
    <main className="flex flex-col space-y-2 max-w-screen-xl mx-auto w-full p-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Categorias</h1>
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
            <div className="table-cell text-left font-medium p-2">Título</div>
            <div className="table-cell text-center font-medium w-28 p-2">
              Ações
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="text-gray-500 text-center py-4">Carregando...</p>
        )}
        {categories.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center">
            Nenhuma usuário encontrada.
          </p>
        )}

        <div className="table-row-group p-2">
          {categories &&
            categories.map((category) => (
              <div key={category._id} className="table-row hover:bg-gray-100">
                <div className="table-cell p-2 border-t">
                  <p>{category.title}</p>
                </div>
                <div className="table-cell w-28 p-2 border-t">
                  <div
                    className="inline-flex rounded-md shadow-xs"
                    role="group"
                  >
                    <button
                      onClick={() => handleEdit(category._id)}
                      disabled={isLoading}
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
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
        className="bg-white rounded-xl p-5 max-w-[600px] min-h-[180px] w-full h-auto mx-auto my-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-2"
      >
        <form className="w-full mx-auto">
          <div className="mb-5">
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Categoria:
            </label>
            <input
              type="text"
              name="title"
              value={title}
              disabled={isLoading}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              placeholder="Digiet o título da categoria"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            {!isLoading && (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {editId ? "Atualizar" : "Adicionar"}
                </button>
                <button
                  onClick={fecharModal}
                  type="button"
                  className="text-black hover:bg-gray-200 border border-gray-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Cancelar
                </button>
              </>
            )}

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
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default index;
