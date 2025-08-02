import React from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md w-full max-w-md">
			<h2 className="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Login
			</h2>
			<form className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block mb-1 text-gray-700 dark:text-gray-300">
						Email
					</label>
					<input
						type="email"
						id="email"
						className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
						placeholder="you@example.com"
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block mb-1 text-gray-700 dark:text-gray-300">
						Password
					</label>
					<input
						type="password"
						id="password"
						className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
						placeholder="••••••••"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-sm disabled:bg-slate-300 dark:disabled:bg-slate-700 transition">
					Sign In
				</button>
				<span
					onClick={() => navigate("/auth/register")}
					className="text-sm text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer">
					I do not have an account yet
				</span>
			</form>
		</div>
	);
};

export default LoginForm;
