import { MagicCard } from '@/components/magicui/magic-card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { db } from '@/lib/firebase';
import { MatchType, PlayerType, TeamType } from '@/type';
import { onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function TeamList() {
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const [teams, setTeams] = useState<TeamType[]>([]);

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

				// Sort players by level and device type
				setPlayers(
					loadedPlayers.sort((a, b) => {
						// First, sort by level (higher levels first)
						if (a.level === b.level) {
							// If levels are equal, prioritize PC over mobile
							return a.device === 'pc' && b.device === 'mobile' ? -1 : 1;
						}
						return (b.level ?? 0) - (a.level ?? 0); // Sort levels in descending order
					})
				);
			} else {
				setPlayers([]); // No players
			}
		});

		// Cleanup when component unmounts
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const teamsRef = ref(db, 'teams');

		const unsubscribe = onValue(teamsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				// Convert Firebase data into an array of PlayerType objects
				const loadedTeams = Object.entries(data).map(([id, teamData]) => ({
					id, // Firebase key becomes 'id'
					...(teamData ?? []), // Spread the rest of the data
				})) as TeamType[];

				// Sort players by level and device type
				setTeams(loadedTeams);
				console.log(loadedTeams);
			} else {
				setTeams([]); // No players
			}
		});

		// Cleanup when component unmounts
		return () => unsubscribe();
	}, []);

	const shufflePlayers = (players: PlayerType[]) => {
		// Shuffle players to randomize the selection for each squad
		for (let i = players.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[players[i], players[j]] = [players[j], players[i]]; // Swap elements
		}
		return players;
	};

	const generateTeamName = (leaderName: string) => {
		return `${leaderName}'s Team`; // Generate team name like "Best Player's Team"
	};

	const handleUpdatePlayers = async () => {
		if (players.length < 8) {
			alert(
				'Warning: Not enough players. At least 8 players are required to generate teams.'
			);
			return; // Stop further execution if there are less than 8 players
		}

		// Shuffle players to randomize
		const shuffledPlayers = shufflePlayers([...players]);

		// Define squad size (4 players per squad)
		const squadSize = 4;
		const numFullSquads = Math.floor(shuffledPlayers.length / squadSize); // Calculate full squads

		// Create full squads
		const squads = [];
		for (let i = 0; i < numFullSquads; i++) {
			squads.push(shuffledPlayers.slice(i * squadSize, (i + 1) * squadSize));
		}

		// Handle remaining players (less than 4)
		const remainingPlayers = shuffledPlayers.slice(numFullSquads * squadSize);
		if (remainingPlayers.length > 0) {
			squads.push(remainingPlayers); // Add the remaining players to their own squad
		}

		// Create the team objects
		const teams = squads.map((squad) => {
			const leader = squad[0]; // The best player in the squad (the first in the sorted list)
			const teamName = generateTeamName(leader.name); // Generate team name based on the leader's name

			// Generate the team object with players array
			return {
				name: teamName,
				leader: leader.name, // Leader is the best player
				position: 0, // Position can be added later
				players: squad.map((player) => ({
					name: player.name,
					id: player.id,
					device: player.device,
					level: player.level ?? 0,
					createdAt: player.createdAt, // Keep all properties of the player
				})),
				createdAt: new Date().toISOString(), // Current date and time
			};
		});

		try {
			// Rename this variable to reference the "teams" location in Firebase
			const teamsRef = ref(db, 'teams'); // "teams" table in Realtime Database

			// Replace all teams data
			await set(teamsRef, teams);

			alert('Teams updated successfully!');
		} catch (error) {
			console.error('Error saving teams:', error);
			alert('Something went wrong!');
		}
	};

	const shuffleTeams = (teams: TeamType[]) => {
		// Shuffle teams to randomize the selection for each squad
		for (let i = teams.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[teams[i], teams[j]] = [teams[j], teams[i]]; // Swap elements
		}
		return teams;
	};

	const handleMatchMaking = async () => {
		if (teams.length < 2) return;

		const shuffledTeams = shuffleTeams([...teams]);
		const matches: MatchType[] = [];

		for (let i = 0; i < shuffledTeams.length; i += 2) {
			if (i + 1 < shuffledTeams.length) {
				matches.push({
					id: uuidv4(),
					team1: shuffledTeams[i],
					team2: shuffledTeams[i + 1],
					result: null,
					createdAt: new Date().toISOString(),
				});
			}
		}

		try {
			await set(ref(db, 'matches'), matches);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<MagicCard className="w-full max-w-[600px] mx-auto h-max rounded-lg p-5 flex flex-col gap-5">
				<h1 className="text-2xl mb-4 text-zinc-200">Team List</h1>
				<div className="flex flex-col gap-2.5 mt-3.5">
					{teams.map((team: TeamType, index: number) => (
						<div
							className="w-full p-2.5 rounded-md border border-zinc-600 bg-zinc-800"
							key={index}
						>
							<h2 className="text-zinc-200">
								{team.name} ({team.position})
							</h2>

							<div className="p-2.5  flex flex-col gap-2.5">
								{team.players.map((player: PlayerType, playerIndex: number) => (
									<div
										key={playerIndex}
										className="border border-zinc-500 px-2.5 py-0.5 rounded-md bg-zinc-700 flex justify-between items-center"
									>
										<h2 className="text-base text-zinc-200">
											{player.name} ({player.level})
										</h2>

										<p className="text-zinc-200">{player.device}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="flex items-center gap-2.5 mt-5">
					{teams.length > 0 && (
						<ShinyButton
							className=" cursor-pointer"
							onClick={handleMatchMaking}
						>
							Match Making
						</ShinyButton>
					)}
					<ShimmerButton className="" onClick={handleUpdatePlayers}>
						{teams?.length >= 2 ? 'Regenerate' : 'Generate Team'}
					</ShimmerButton>
				</div>
			</MagicCard>
		</>
	);
}
