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
      setCategories(response.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao buscar categorias");
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
        const response = await api.put(`/api/categories/${editId}`, { title });
        setCategories(
          categories.map((cat) =>
            cat._id === editId ? response.data.data : cat
          )
        );
        setMessage(response.data.message);
        setIsOpen(false);
      } else {
        // Criar nova categoria
        const response = await api.post("/api/categories", { title });
        setCategories([response.data.data, ...categories]);
        setMessage(response.data.message);
        setIsOpen(false);
      }
      setTitle("");
      setEditId(null);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao salvar categoria");
    } finally {
      setIsLoading(false);
    }
  };

  // Editar categoria
  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/categories/${id}`);
      setTitle(response.data.title);
      setEditId(id);
      setIsOpen(true);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao buscar categoria");
    }
  };

  // Excluir categoria
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;

    setIsLoading(true);
    try {
      const response = await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao excluir categoria");
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
    setIsOpen(false);
  }

  return (
    <main className="flex flex-col space-y-2 max-w-screen-xl mx-auto w-full p-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Categorias</h1>
        <button
          onClick={abrirModal}
          type="button"
          className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FaPlus />
          Adicionar
        </button>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading && <p className="text-gray-500">Carregando...</p>}
        {categories.length === 0 && !isLoading && (
          <p>Nenhuma categoria encontrada.</p>
        )}

        <table className="w-full text-sm text-left border rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Título
              </th>
              <th scope="col" className="px-6 py-3 w-24">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((category) => (
                <tr key={category._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    className="px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {category.title}
                  </th>
                  <td className="py-1 text-center">
                    <div className="inline-flex rounded-md shadow-xs" role="group">
                      <button
                        onClick={() => handleEdit(category._id)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
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
            height: "180px",
            margin: "auto",
          },
        }}
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
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default index;
