"use client";

import { useState } from "react";

interface Participant {
	id: number;
	name: string;
	group: string;
}

export default function DrawerApp() {
	const [participants, setParticipants] = useState<Participant[]>([
		{ id: 1, name: "Jasmine", group: "A" },
		{ id: 3, name: "Roxanne", group: "A" },
		{ id: 2, name: "Harvey", group: "B" },
		{ id: 5, name: "Hunter", group: "B" },
		{ id: 4, name: "Jared", group: "C" },
	]);

	const [sequence, setSequence] = useState<Participant[]>([]);
	const [newParticipant, setNewParticipant] = useState({ name: "", group: "" });
	const [isGenerating, setIsGenerating] = useState(false);

	const addParticipant = () => {
		if (newParticipant.name.trim() && newParticipant.group.trim()) {
			const newId = Math.max(...participants.map((p) => p.id), 0) + 1;
			setParticipants([
				...participants,
				{
					id: newId,
					name: newParticipant.name.trim(),
					group: newParticipant.group.trim(),
				},
			]);
			setNewParticipant({ name: "", group: "" });
		}
	};

	const removeParticipant = (id: number) => {
		setParticipants(participants.filter((p) => p.id !== id));
	};

	const generateSequence = async () => {
		if (participants.length === 0) return;

		setIsGenerating(true);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const availableParticipants = [...participants];
		const result: Participant[] = [];

		while (availableParticipants.length > 0) {
			let nextParticipant: Participant | null = null;
			const lastGroup =
				result.length > 0 ? result[result.length - 1].group : null;

			// Find all participants that can be selected (different group than last)
			const validParticipants = availableParticipants.filter(
				(p) => p.group !== lastGroup,
			);

			if (validParticipants.length > 0) {
				// Randomly select from valid participants
				const randomIndex = Math.floor(
					Math.random() * validParticipants.length,
				);
				nextParticipant = validParticipants[randomIndex];

				// Remove the selected participant from available list
				const participantIndex = availableParticipants.findIndex(
					(p) => p.id === nextParticipant!.id,
				);
				availableParticipants.splice(participantIndex, 1);
			} else if (availableParticipants.length > 0) {
				// If no valid participants (all same group), randomly select any
				const randomIndex = Math.floor(
					Math.random() * availableParticipants.length,
				);
				nextParticipant = availableParticipants[randomIndex];
				availableParticipants.splice(randomIndex, 1);
			}

			if (nextParticipant) {
				result.push(nextParticipant);
			}
		}

		setSequence(result);
		setIsGenerating(false);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
					Participant Drawer
				</h1>

				{/* Add Participant Section */}
				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
						Add Participant
					</h2>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
						<input
							type="text"
							placeholder="Participant name"
							value={newParticipant.name}
							onChange={(e) =>
								setNewParticipant({ ...newParticipant, name: e.target.value })
							}
							className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm sm:text-base"
						/>
						<input
							type="text"
							placeholder="Group"
							value={newParticipant.group}
							onChange={(e) =>
								setNewParticipant({ ...newParticipant, group: e.target.value })
							}
							className="w-full sm:w-24 lg:w-32 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm sm:text-base"
						/>
						<button
							type="button"
							onClick={addParticipant}
							className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
						>
							Add Participant
						</button>
					</div>
				</div>

				{/* Participants List Section */}
				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
						Participants ({participants.length})
					</h2>
					{participants.length === 0 ? (
						<p className="text-gray-500 text-sm sm:text-base">
							No participants added yet.
						</p>
					) : (
						<div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
							{participants.map((participant) => (
								<div
									key={participant.id}
									className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
								>
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
										<span className="font-medium text-gray-700 text-sm sm:text-base truncate">
											{participant.name}
										</span>
										<span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full self-start sm:self-auto whitespace-nowrap">
											Group {participant.group}
										</span>
									</div>
									<button
										type="button"
										onClick={() => removeParticipant(participant.id)}
										className="text-red-600 hover:text-red-800 ml-2 p-1 text-lg sm:text-xl transition-colors flex-shrink-0"
										aria-label={`Remove ${participant.name}`}
									>
										✕
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Generate Sequence Section */}
				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
						<h2 className="text-lg sm:text-xl font-semibold text-gray-800">
							Generate Sequence
						</h2>
						<button
							type="button"
							onClick={generateSequence}
							disabled={participants.length === 0 || isGenerating}
							className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base font-medium"
						>
							{isGenerating ? "Generating..." : "Generate Sequence"}
						</button>
					</div>

					{participants.length === 0 && (
						<p className="text-gray-500 text-sm sm:text-base">
							Add participants to generate a sequence.
						</p>
					)}
				</div>

				{/* Generated Sequence Section */}
				{sequence.length > 0 && (
					<div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
						<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
							Generated Sequence
						</h2>
						<div className="space-y-2 sm:space-y-3">
							{sequence.map((participant, index) => (
								<div
									key={participant.id}
									className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-md border-l-4 border-green-500 hover:from-green-100 hover:to-blue-100 transition-colors"
								>
									<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
										<span className="text-base sm:text-lg font-bold text-gray-700 w-auto sm:w-8 flex-shrink-0">
											{index + 1}.
										</span>
										<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
											<span className="font-medium text-gray-900 text-sm sm:text-base truncate">
												{participant.name}
											</span>
											<span className="inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full self-start sm:self-auto whitespace-nowrap">
												Group {participant.group}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
