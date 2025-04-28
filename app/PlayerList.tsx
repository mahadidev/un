'use client';

import { MagicCard } from '@/components/magicui/magic-card';
import Players from '@/components/players/Player';
import { db } from '@/lib/firebase';
import { PlayerType } from '@/type';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';


export default function PlayerList() {
	const [players, setPlayers] = useState<PlayerType[] | null>(null);

	useEffect(() => {
		const playerRef = ref(db, 'players');
		onValue(playerRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const newData = Object.values(data) as PlayerType[];
				setPlayers(newData);
			}
		});
	}, []);

	// Group players by level
	const groupedPlayers = players?.reduce(
		(acc: Record<number, PlayerType[]>, player) => {
			const level = player.level || 0;
			if (!acc[level]) {
				acc[level] = [];
			}
			acc[level].push(player);
			return acc;
		},
		{}
	);

	return (
		<>
			<MagicCard className="w-full max-w-[600px] mx-auto h-max rounded-lg py-2.5 flex flex-col gap-5">
				<div>
					<h2 className="text-zinc-300 text-2xl font-medium text-center">
						Player List
					</h2>
					<div className="w-[60%] mx-auto h-[1px] mt-2.5 bg-border rounded-md"></div>
				</div>

				{groupedPlayers &&
					Object.keys(groupedPlayers)
						.sort((a, b) => {
							if (a === '0') return 1; // '0' goes after all others
							if (b === '0') return -1;
							return Number(a) - Number(b);
						}) // sort levels
						.map((level) => (
							<div className="p-5 flex flex-col gap-2.5" key={level}>
								<h2 className="text-zinc-200 text-xl font-semibold">
									{level === '0' ? 'Others Player' : `Lavel ${level}`}
								</h2>
								{groupedPlayers[Number(level)].map((player) => (
									<Players
										key={player.id || player.name}
										name={player.name}
										device={player.device}
									/>
								))}
							</div>
						))}
			</MagicCard>
		</>
	);
}
