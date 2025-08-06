import React, { useState } from "react";

const AddPropertyModal = ({ onClose }) => {
	const [formData, setFormData] = useState({
		type: "",
		rent: "",
		status: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted:", formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-50	dark:bg-neutral-900 bg-opacity-50 text-gray-900	dark:text-gray-100 z-50 flex justify-center items-center p-4">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md shadow-lg">
				<h2 className="text-xl font-semibold text-gray-900	dark:text-gray-100 mb-4">
					Add New Property
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="type"
						placeholder="Type"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100	dark:bg-neutral-700 placeholder-gray-400	dark:placeholder-gray-500 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<input
						name="rent"
						placeholder="Rent"
						type="number"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100	dark:bg-neutral-700 placeholder-gray-400	dark:placeholder-gray-500 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<select
						name="status"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100	dark:bg-neutral-700 placeholder-gray-400	dark:placeholder-gray-500 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
						<option value="">Select status</option>
						<option value="vacant">Vacant</option>
						<option value="occupied">Occupied</option>
						<option value="pending">Maintenance</option>
					</select>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 dark:border-gray-600 text-gray-900 rounded hover:bg-gray-400">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddPropertyModal;
