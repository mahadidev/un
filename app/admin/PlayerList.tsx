import { MagicCard } from '@/components/magicui/magic-card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { db } from '@/lib/firebase';
import { PlayerType } from '@/type';
import { onValue, push, ref, remove, set } from 'firebase/database';
import { ChangeEvent, useEffect, useState } from 'react';

const PlayerList = () => {
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>(''); // For search input
	const [newPlayer, setNewPlayer] = useState<PlayerType>({
		id: '',
		name: '',
		device: '',
		level: 0,
		createdAt: Date.now(),
	});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility

	// Define the options for the levels
	const levelOptions = [0, 1, 2, 3, 4, 5];

	useEffect(() => {
		const playersRef = ref(db, 'players');

		const unsubscribe = onValue(playersRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				// Convert Firebase data into an array of PlayerType objects
				const loadedPlayers = Object.entries(data).map(([id, playerData]) => ({
					id, // Firebase key becomes 'id'
					...(playerData ?? []), // Spread the rest of the data
				})) as PlayerType[];

				// Sort players by level after loading
				setPlayers(
					loadedPlayers.sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
				);
			} else {
				setPlayers([]); // No players
			}
		});

		// Cleanup when component unmounts
		return () => unsubscribe();
	}, []);

	const handleLevelChange = (
		player: PlayerType,
		event: ChangeEvent<HTMLSelectElement>
	) => {
		const updatedLevel = Number(event.target.value);

		setPlayers((prevPlayers: PlayerType[]) => {
			const updatedPlayers = prevPlayers.map((item) =>
				item.id === player.id ? { ...item, level: updatedLevel } : item
			);

			// Sort players by level after updating the level
			return updatedPlayers.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
		});
	};

	// Delete player from the list
	const handleDeletePlayer = (playerId: string) => {
		setPlayers((prevPlayers) =>
			prevPlayers.filter((player) => player.id !== playerId)
		);

		// You can also delete from Firebase if necessary
		const playerRef = ref(db, 'players/' + playerId);
		remove(playerRef); // This will delete the player from Firebase as well
	};

	// Update players in Firebase
	const handleUpdatePlayers = async () => {
		try {
			const playersRef = ref(db, 'players'); // "players" table in Realtime Database

			// Replace all players
			await set(playersRef, players);

			alert('Players updated successfully!');
		} catch (error) {
			console.error('Error saving players:', error);
			alert('Something went wrong!');
		}
	};

	// Handle search input change
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Filter players based on the search term
	const filteredPlayers = players.filter((player) => {
		const term = searchTerm.toLowerCase();
		const isNameMatch = player.name.toLowerCase().includes(term);
		const isDeviceMatch = player.device.toLowerCase().includes(term);
		const isLevelMatch = player.level?.toString().includes(term); // Convert level to string and check if it matches

		return isNameMatch || isDeviceMatch || isLevelMatch; // Match any of name, device, or level
	});

	// Handle new player form change
	const handleNewPlayerChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setNewPlayer((prevPlayer) => ({
			...prevPlayer,
			[name]: value,
		}));
	};

	// Handle level change for new player
	const handleNewPlayerLevelChange = (
		event: ChangeEvent<HTMLSelectElement>
	) => {
		const updatedLevel = Number(event.target.value);
		setNewPlayer((prevPlayer) => ({
			...prevPlayer,
			level: updatedLevel,
		}));
	};

	// Add new player to state and Firebase
	const handleAddNewPlayer = async () => {
		try {
			const playersRef = ref(db, 'players');

			// Add new player to the "players" table in Firebase
			await push(playersRef, {
				name: newPlayer.name,
				device: newPlayer.device,
				level: newPlayer.level,
				createdAt: newPlayer.createdAt,
			});

			alert('New player added successfully!');
			setNewPlayer({
				id: '',
				name: '',
				device: '',
				level: 0,
				createdAt: Date.now(),
			}); // Reset the form
			setIsModalOpen(false); // Close the modal after adding the player
		} catch (error) {
			console.error('Error adding new player:', error);
			alert('Something went wrong!');
		}
	};

	// Toggle modal visibility
	const toggleModal = () => {
		setIsModalOpen((prev) => !prev);
	};

	return (
		<>
			<MagicCard className="w-full max-w-[600px] mx-auto h-max rounded-lg p-5 flex flex-col gap-5">
				<div className="flex justify-between items-center gap-2.5">
					<h1 className="text-2xl mb-4 text-zinc-200">Player List</h1>
					<ShinyButton
						className="ml-auto !flex gap-2.5 items-center mb-2.5 text-zinc-400"
						onClick={toggleModal}
					>
						{' '}
						<svg
							className="w-6 h-6 text-zinc-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						Add new
					</ShinyButton>
				</div>

				{/* Search Input */}
				<input
					type="text"
					placeholder="Search by name, device, or level"
					className="w-full p-2 mb-4 rounded-md border border-zinc-600 bg-zinc-800 text-zinc-200"
					value={searchTerm}
					onChange={handleSearchChange}
				/>

				{/* New Player Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 flex justify-center items-center z-50 bg-zinc-800/50 backdrop-blur-lg bg-opacity-50">
						<MagicCard className="w-96 bg-zinc-900 p-6 rounded-lg">
							<h2 className="text-2xl text-zinc-200 mb-4">Add New Player</h2>

							<input
								type="text"
								placeholder="Enter player name"
								name="name"
								value={newPlayer.name}
								onChange={handleNewPlayerChange}
								className="w-full p-2 mb-4 rounded-md border border-zinc-600 bg-zinc-800 text-zinc-200"
							/>
							<input
								type="text"
								placeholder="Enter player device"
								name="device"
								value={newPlayer.device}
								onChange={handleNewPlayerChange}
								className="w-full p-2 mb-4 rounded-md border border-zinc-600 bg-zinc-800 text-zinc-200"
							/>
							<select
								name="level"
								value={newPlayer.level}
								onChange={handleNewPlayerLevelChange}
								className="w-full p-2 mb-4 rounded-md border border-zinc-600 bg-zinc-800 text-zinc-200"
							>
								{levelOptions.map((level) => (
									<option key={level} value={level}>
										{level === 0 ? 'Not Set' : level}
									</option>
								))}
							</select>

							<div className="flex gap-3 justify-end">
								<ShimmerButton onClick={handleAddNewPlayer} className="w-24">
									Add
								</ShimmerButton>
								<ShimmerButton onClick={toggleModal} className="w-24">
									Cancel
								</ShimmerButton>
							</div>
						</MagicCard>
					</div>
				)}

				<div className="flex flex-col gap-2.5 mt-3.5">
					{filteredPlayers.map((player: PlayerType, index: number) => (
						<div
							className="w-full p-2.5 rounded-md border border-zinc-600 bg-zinc-800 flex justify-between items-center"
							key={index}
						>
							<h2 className="text-zinc-400">
								{player.name} ({player.device})
							</h2>
							<div className="flex items-center gap-3">
								<select
									className="w-max py-1.5 px-2.5 rounded-md border border-border bg-zinc-800 placeholder:text-zinc-500 text-zinc-200 text-sm"
									name="device"
									value={player.level} // Set the value based on the player's current level
									onChange={(event: ChangeEvent<HTMLSelectElement>) =>
										handleLevelChange(player, event)
									}
								>
									{levelOptions.map((level) => (
										<option key={level} value={level}>
											{level === 0 ? 'Not Set' : level}
										</option>
									))}
								</select>

								<button
									className="text-base underline text-zinc-300 cursor-pointer"
									onClick={() => handleDeletePlayer(player.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>

				<ShimmerButton className="mt-5 ml-auto" onClick={handleUpdatePlayers}>
					Update
				</ShimmerButton>
			</MagicCard>
		</>
	);
};

export default PlayerList;
