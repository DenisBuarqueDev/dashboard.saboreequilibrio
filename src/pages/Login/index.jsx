import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { useAuthValue } from "../../context/AuthContextProvider";

const index = () => {
  const { login } = useAuthValue();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <main className="flex items-center justify-center w-full h-screen p-4 bg-gray-50 md:py-4">
      <section className="max-w-screen-sm w-full mx-auto border bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-semibold">
          Acesso
        </h1>
        <p className="mb-3 text-gray-400">Informe seus dados de Administrador.</p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              E-Mail
            </label>
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              maxLength={50}
              required
              placeholder="Ex: seunome@gmail.com"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Senha
            </label>
            <input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              maxLength={50}
              required
              placeholder="**********"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            />
          </div>
          <div className="py-2">
            <input
              id="terms"
              type="checkbox"
              value={isChecked}
              onChange={handleCheckboxChange}
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-green-300"
              required
            />{" "}
            Concordo com os termos e condições.
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!isChecked}
              className={`flex items-center text-white ${
                isChecked
                  ? "bg-green-700 hover:bg-green-800 cursor-pointer"
                  : "bg-gray-500 hover:bg-gray-500"
              } focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
            >
              Entrar <MdLogin className="ml-2 w-5 h-5" />
            </button>
            <Link
              to="/"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default index;
