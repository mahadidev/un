"use client";

import PlayerList from "./PlayerList";
import TeamList from "./TeamList";

export default function Home() {


	return (
		<section className="flex items-center py-16">
			<div className="container mx-auto px-2.5 flex flex-col gap-10">
				<TeamList />
				<PlayerList />
			</div>
		</section>
	);
}
