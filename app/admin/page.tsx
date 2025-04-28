'use client';

import { MagicCard } from '@/components/magicui/magic-card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { useState } from 'react';
import MatchList from './MatchList';
import PlayerList from './PlayerList';
import TeamList from './TeamList';

const ADMIN_PASSWORD = '123'; // 🔥 CHANGE THIS

export default function AdminPage() {
	const [inputPassword, setInputPassword] = useState('');
	const [authenticated, setAuthenticated] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputPassword === ADMIN_PASSWORD) {
			setAuthenticated(true);
			setError('');
		} else {
			setError('Wrong password!');
		}
	};

	if (!authenticated) {
		return (
			<section className="flex items-center mt-20 md:mt-48">
				<div className="container mx-auto px-2.5">
					<MagicCard className="w-full max-w-[600px] mx-auto h-max rounded-lg p-3.5 flex flex-col gap-5">
						<h1 className="text-2xl mb-4 text-zinc-200">Enter Admin Password</h1>
						<form
							onSubmit={handleSubmit}
							className="w-full flex flex-col gap-4"
						>
							<input
								type="password"
								className="w-full py-2.5 px-2.5 rounded-md border border-border bg-zinc-800 placeholder:text-zinc-500 text-zinc-200"
								placeholder="Password"
								value={inputPassword}
								onChange={(e) => setInputPassword(e.target.value)}
							/>
							<ShimmerButton type="submit">Enter</ShimmerButton>
							{error && <p className="text-red-500">{error}</p>}
						</form>
					</MagicCard>
				</div>
			</section>
		);
	}

	// Admin content here after correct password
	return (
		<section className="flex items-center py-16">
			<div className="px-2.5 w-full max-w-[600px] mx-auto">
				<ShinyButton className="ml-auto !flex gap-2.5 items-center mb-2.5 text-zinc-400">
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
							d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
						/>
					</svg>
					Reset
				</ShinyButton>
				<div className="flex flex-col gap-10 ">
					<MatchList />
					<TeamList />
					<PlayerList />
				</div>
			</div>
		</section>
	);
}
