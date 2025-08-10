import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PropertyCard from "../cards/PropertyCard";
import Button from "../common/Button";
import { Plus } from "lucide-react";
import AddPropertyModal from "../AddPropertyModal";

const PropertiesContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [rooms, setRooms] = useState([]);

	// fetch all rooms;
	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const res = await fetch("/api/rooms/all", { credentials: "include" });
				const data = await res.json();
				// console.dir(data);
				if (!res.ok)
					return toast.error(data?.error || "Failed to load properties");
				setRooms(data.rooms);
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong");
			}
		};
		fetchProperties();
	}, []);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	return (
		<div className="w-full px-4 py-16 sm:py-4">
			{isModalOpen && <AddPropertyModal onClose={closeModal} />}
			<div className="flex items-center justify-between p-4">
				<p className="text-gray-900	dark:text-gray-100">Property Management</p>
				<Button
					onClick={openModal}
					className="self-end "
					icon={<Plus />}
					label={"Add Property"}
				/>
			</div>
			<div className="flex items-center flex-wrap gap-4">
				{rooms &&
					rooms.map((room) => (
						<PropertyCard
							key={room._id}
							buildingName={room.buildingName}
							roomName={room.roomName}
							status={room.status}
							roomType={room.roomType}
							bath={room.bath}
							bed={room.bed}
							price={room.price}
							tenant={room.tenants[0]}
						/>
					))}
			</div>
		</div>
	);
};

export default PropertiesContainer;
