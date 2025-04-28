import React, { FC } from 'react';

const Players: FC<{
	name: string;
	level?: string;
	device?: string;
}> = (props) => {
	return (
		<div className="w-full p-2.5 rounded-md border border-zinc-600 bg-zinc-800 flex justify-between items-center">
			<h2 className="text-zinc-400">{props.name}</h2>
			{props.level && <p className="text-zinc-500">{props.level} Level</p>}
			{props.device && <p className="text-zinc-500">{props.device} Player</p>}
		</div>
	);
};
export default Players;
