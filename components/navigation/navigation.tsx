'use client';

import Link from 'next/link'; // ✅ Correct Link import
import { useEffect, useRef, useState } from 'react';
import { ShimmerButton } from '../magicui/shimmer-button';

export default function Navigation() {
	const [navigationHeight, setNavigationHeight] = useState(0);
	const navigationRef = useRef<HTMLDivElement>(null); // ✅ Correct typing

	useEffect(() => {
		if(navigationRef.current){
			setNavigationHeight(navigationRef.current.clientHeight)
		}
	}, [navigationRef])

	return (
		<>
			<div
				className="h-42"
				style={{
					height: `${navigationHeight}px`, // ✅ safe fallback to 0
				}}
			></div>
			<nav
				className="fixed top-0 left-0 right-0 py-2.5 bg-zinc-900 z-30 border-b border-border"
				ref={navigationRef}
			>
				<div className="container mx-auto px-2.5">
					<div className="grid grid-cols-3 gap-2.5 items-center">
						<ul>
							<Link href="/" className="text-white">
								Tournaments
							</Link>
						</ul>
						<Link
							href="/"
							className="font-semibold text-base sm:text-2xl text-center text-white"
						>
							UNKNOWN 50
						</Link>
						<ul className="flex justify-end items-center">
							<Link href="/register" className="flex">
								<ShimmerButton className="shadow-2xl">
									<span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
										Register
									</span>
								</ShimmerButton>
							</Link>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
