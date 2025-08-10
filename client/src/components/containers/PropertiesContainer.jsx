import React, { useState } from "react";
import PropertyCard from "../cards/PropertyCard";
import Button from "../common/Button";
import { Plus } from "lucide-react";
import AddPropertyModal from "../AddPropertyModal";

const PropertiesContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

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
				<PropertyCard name={"001"} status={"occupied"} />
				<PropertyCard name={"002"} status={"vacant"} />
				<PropertyCard name={"003"} status={"maintenance"} />
				<PropertyCard name={"006"} status={"occupied"} />
			</div>
		</div>
	);
};

export default PropertiesContainer;
