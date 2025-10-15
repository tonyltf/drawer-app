# Participant Drawer App

A Next.js application that generates sequences from a list of participants while ensuring that participants from the same group are never placed next to each other.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Biome** - Linting and formatting

## Features

- ✅ Add participants with names and groups
- ✅ Remove participants from the list
- ✅ Generate sequences ensuring no same-group adjacency
- ✅ View generated sequences with visual indicators
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Biome for code quality

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix code issues with Biome
- `npm run format` - Format code with Biome

## How It Works

1. **Add Participants:** Enter participant names and assign them to groups (A, B, C, etc.)
2. **Generate Sequence:** Click "Generate Sequence" to create a random arrangement
3. **Algorithm:** The app uses a smart algorithm that:
   - Prioritizes placing participants from different groups next to each other
   - Handles edge cases where perfect separation might not be possible
   - Ensures the best possible distribution

## Algorithm Details

The sequence generation algorithm works as follows:

1. Start with an empty result sequence
2. For each position, try to find a participant from a different group than the previous one
3. If no different group is available, take any remaining participant
4. Continue until all participants are placed

This ensures maximum separation between same-group participants while handling cases where perfect separation is impossible (e.g., when one group has significantly more members).

## Project Structure

```
src/
  app/
    layout.tsx     # Root layout
    page.tsx       # Main drawer app component
    globals.css    # Global styles
```

## Example Usage

1. Add participants like:
   - Alice (Group A)
   - Bob (Group B)
   - Charlie (Group A)
   - Diana (Group C)

2. Generate a sequence to get something like:
   1. Alice (Group A)
   2. Bob (Group B)
   3. Charlie (Group A)
   4. Diana (Group C)

The algorithm ensures Alice and Charlie (both Group A) won't be adjacent.
