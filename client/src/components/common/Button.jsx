import React from "react";

const Button = ({ onClick, icon, label }) => {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 p-1 bg-indigo-600 cursor-pointer	dark:bg-indigo-500 hover:bg-indigo-700	dark:hover:bg-indigo-400 text-gray-100 rounded-lg transition">
			{icon}
			{label}
		</button>
	);
};

export default Button;
