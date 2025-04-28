'use client';
import { MagicCard } from '@/components/magicui/magic-card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { db } from '@/lib/firebase'; // your firebase.ts file
import { push, ref } from 'firebase/database';
import { FormEvent } from 'react';

export default function Register() {
	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const name = (form.elements.namedItem('name') as HTMLInputElement).value;
		const device = (form.elements.namedItem('device') as HTMLSelectElement)
			.value;

		if (!name || !device) {
			alert('Please enter all fields!');
			return;
		}

		try {
			const playersRef = ref(db, 'players'); // "players" table in Realtime Database
			await push(playersRef, {
				name,
				device,
				lavel: null,
				createdAt: Date.now(), // you can store timestamp if you want,
			});

			alert('Registration successful!');
			form.reset(); // clear form
		} catch (error) {
			console.error('Error saving player:', error);
			alert('Something went wrong!');
		}
	};

	return (
		<section className="flex items-center flex items-center py-16">
			<div className="container mx-auto px-2.5">
				<MagicCard className="w-full max-w-[600px] mx-auto h-max rounded-lg py-2.5 flex flex-col gap-5">
					<div>
						<h2 className="text-zinc-300 text-2xl font-medium text-center">
							Register
						</h2>
						<div className="w-[60%] mx-auto h-[1px] mt-2.5 bg-border rounded-md"></div>
					</div>

					<form
						className="p-4 flex flex-col gap-4"
						onSubmit={onSubmit}
						method="post"
						action={'#'}
					>
						<div className="flex flex-col gap-1.5">
							<label className="text-zinc-200">Name</label>
							<input
								className="w-full py-2.5 px-2.5 rounded-md border border-border bg-zinc-800 placeholder:text-zinc-500 text-zinc-200"
								placeholder="ex. AKUJI V2"
								name="name"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-zinc-200">Device</label>
							<select
								className="w-full py-2.5 px-2.5 rounded-md border border-border bg-zinc-800 placeholder:text-zinc-500 text-zinc-200"
								name="device"
							>
								<option value="PC">PC</option>
								<option value="Mobile">Mobile</option>
							</select>
						</div>

						<div className="flex justify-end">
							<ShimmerButton>Submit</ShimmerButton>
						</div>
					</form>
				</MagicCard>
			</div>
		</section>
	);
}
