import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const navigate = useNavigate();
	return (
		<div className="h-screen w-full flex flex-col gap-1 items-center justify-center px-4 bg-gray-50 dark:bg-neutral-900">
			<form className="w-full max-w-md sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white dark:bg-neutral-800 shadow-md rounded-xl p-6 space-y-4">
				<h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Sign Up
				</h2>

				<div className="flex flex-col">
					<label
						htmlFor="fullName"
						className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
						Full Name
					</label>
					<input
						id="fullName"
						type="text"
						className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="John Doe"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="email"
						className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
						Email
					</label>
					<input
						id="email"
						type="email"
						className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="johndoe@example.com"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="password"
						className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
						Password
					</label>
					<input
						id="password"
						type="password"
						className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="••••••••"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="confirmPassword"
						className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					className="w-full py-2 mt-4 text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 rounded-lg font-medium cursor-pointer transition-all">
					Register
				</button>
				<span
					onClick={() => navigate("/")}
					className="text-sm text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer">
					I already have an account
				</span>
			</form>
		</div>
	);
};

export default RegisterPage;
