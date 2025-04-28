import { MagicCard } from '@/components/magicui/magic-card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { db } from '@/lib/firebase';
import { PlayerType, TeamType } from '@/type';
import { onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';

export default function MatchList() {
	const [teams, setTeams] = useState<TeamType[]>([]);


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
					{/* {teams.length > 0 && (
						<ShinyButton
							className=" cursor-pointer"
							onClick={handleUpdatePlayers}
						>
							Match Making
						</ShinyButton>
					)} */}
				</div>
			</MagicCard>
		</>
	);
}
