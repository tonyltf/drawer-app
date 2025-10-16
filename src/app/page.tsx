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

		// Try multiple attempts to find a valid sequence
		let bestSequence: Participant[] = [];
		let attempts = 0;
		const maxAttempts = 100;

		while (attempts < maxAttempts) {
			const availableParticipants = [...participants];
			const result: Participant[] = [];
			let isValidSequence = true;

			while (availableParticipants.length > 0 && isValidSequence) {
				let nextParticipant: Participant | null = null;
				const lastGroup =
					result.length > 0 ? result[result.length - 1].group : null;
				const firstGroup = result.length > 0 ? result[0].group : null;

				// Find participants that don't conflict with the last position
				let validParticipants = availableParticipants.filter(
					(p) => p.group !== lastGroup,
				);

				// If this would be the last participant, also ensure it's different from first
				if (availableParticipants.length === 1 && firstGroup) {
					validParticipants = validParticipants.filter(
						(p) => p.group !== firstGroup,
					);
				}

				// Additional check: if we're down to the last 2 participants, make sure we can complete the sequence
				if (
					availableParticipants.length === 2 &&
					firstGroup &&
					result.length > 1
				) {
					// Check if selecting each valid participant would allow us to place the final one
					validParticipants = validParticipants.filter((candidate) => {
						const remaining = availableParticipants.find(
							(p) => p.id !== candidate.id,
						);
						if (!remaining) return true;
						// The remaining participant should be different from both the candidate and the first
						return (
							remaining.group !== candidate.group &&
							remaining.group !== firstGroup
						);
					});
				}

				if (validParticipants.length > 0) {
					// Randomly select from valid participants
					const randomIndex = Math.floor(
						Math.random() * validParticipants.length,
					);
					nextParticipant = validParticipants[randomIndex];
				} else if (availableParticipants.length > 0) {
					// No valid participants found - this sequence attempt failed
					isValidSequence = false;
					break;
				}

				if (nextParticipant) {
					result.push(nextParticipant);
					const participantIndex = availableParticipants.findIndex(
						(p) => p.id === nextParticipant!.id,
					);
					availableParticipants.splice(participantIndex, 1);
				}
			}

			// Check if this is a complete and valid sequence
			if (isValidSequence && result.length === participants.length) {
				// Final validation: ensure first and last are from different groups (if more than 1 participant)
				if (
					result.length <= 1 ||
					result[0].group !== result[result.length - 1].group
				) {
					bestSequence = result;
					break;
				}
			}

			// Keep track of the best sequence found so far (most participants placed)
			if (result.length > bestSequence.length) {
				bestSequence = result;
			}

			attempts++;
		}

		// If we couldn't find a perfect sequence, use the best one we found
		setSequence(bestSequence);
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
