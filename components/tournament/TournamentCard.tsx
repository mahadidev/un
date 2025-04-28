import React, { FC } from 'react';

const TournamentCard: FC<{
	title: string;
	status: string;
}> = (props) => {
	return (
		<div className="w-full p-2.5 rounded-md border border-zinc-600 bg-zinc-800 flex justify-between items-center">
			<h2 className="text-zinc-400">{props.title}</h2>
			<p className="text-zinc-500">Team TRX Winner</p>
		</div>
	);
};
export default TournamentCard;
