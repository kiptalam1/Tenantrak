import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TenantCard from "../cards/TenantCard";
import Button from "../common/Button";
import { Plus } from "lucide-react";
import AddTenantModal from "../modals/AddTenantModal";
import LoaderSpinner from "../common/LoaderSpinner";

const TenantsContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [tenants, setTenants] = useState([]);

	// fetch all tenants;
	useEffect(() => {
		const fetchProperties = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/tenants/all", { credentials: "include" });
				const data = await res.json();
				if (!res.ok) {
					toast.error(data?.error || "Failed to load tenants");
					return;
				}
				// console.log("data :", data);

				setTenants(data.tenants);
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong");
			} finally {
				setLoading(false);
			}
		};
		fetchProperties();
	}, []);

	// ⬅️ This is the instant update callback when a new room is added;
	const handleTenantCreated = (newTenant) => {
		setTenants((prevTenants) => [newTenant, ...prevTenants]);
	};

	// -> TODO  delete a tenant;
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to remove this tenant?")) return;

		try {
			const res = await fetch(`/api/tenants/tenant/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.error || "Failed to remove tenant");
				return;
			}

			toast.success(data?.message || "Tenant removed successfully");
			setTenants((prev) => prev.filter((tenant) => tenant._id !== id));
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	if (loading) {
		return (
			<div className="flex justify-center min-h-screen w-full">
				<LoaderSpinner />
			</div>
		);
	}

	return (
		<div className="w-full px-4 py-16 sm:py-4">
			{isModalOpen && (
				<AddTenantModal
					onTenantCreated={handleTenantCreated}
					onClose={closeModal}
				/>
			)}
			<div className="flex items-center justify-between p-4">
				<p className="text-gray-900	dark:text-gray-100">Tenant Management</p>
				<Button
					onClick={openModal}
					className="self-end"
					icon={<Plus />}
					label={"Add Tenant"}
				/>
			</div>
			<div className="flex items-center flex-wrap gap-4">
				{tenants.length === 0 && (
					<p className="w-full text-center text-sm italic text-gray-400 dark:text-gray-300">
						Add tenant to display
					</p>
				)}
				{tenants &&
					tenants.map((tenant) => (
						<TenantCard
							key={tenant._id}
							buildingName={tenant.buildingName}
							roomName={tenant.roomName}
							status={tenant.status}
							phone={tenant.phone}
							email={tenant.email}
							leaseEnd={
								new Date(tenant.leaseEnd).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}) || null
							}
							leaseStart={new Date(tenant.leaseStart).toLocaleDateString(
								"en-US",
								{
									year: "numeric",
									month: "short",
									day: "numeric",
								}
							)}
							price={tenant.price}
							fullName={tenant.fullName
								.toLowerCase()
								.replace(/\b\w/g, (char) => char.toUpperCase())}
							onDelete={() => handleDelete(tenant._id)}
						/>
					))}
			</div>
		</div>
	);
};

export default TenantsContainer;
