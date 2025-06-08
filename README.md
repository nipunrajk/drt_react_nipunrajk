# Assignment project

## Features

- View detailed satellite information including NORAD ID, orbit codes, and launch dates
- Filter satellites by:
  - Object types (Payloads, Debris, Rocket Bodies, Unknown)
  - Orbit codes
  - Search by name or NORAD ID
- Sort data by various columns
- Select up to 10 satellites for detailed viewing
- Responsive design with mobile support

## Important Notes for Evaluators

- **Initial Load Time**: Due to the large dataset being fetched, please allow 10-15 seconds for the initial data to load. A loading indicator will be displayed during this time.
- **Data Handling**: The application efficiently handles large datasets with:
  - Client-side filtering and sorting
  - Virtualized scrolling for optimal performance
  - Responsive UI that remains interactive during data operations
- **State Management**: Uses Zustand for efficient state management and persistence
- **Error Handling**: Gracefully handles API errors and displays user-friendly messages

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:

```bash
git clone drt_react_nipunrajk
cd drt_react_nipunrajk
```

2. Install dependencies:

```bash
npm install
# or if you use yarn
yarn
```

## Running the Application

1. Start the development server:

```bash
npm run dev
# or with yarn
yarn dev
```

2. Open your browser and visit:

```
http://localhost:5175
```

## Usage Guide

1. **Filtering Data**:

   - Use the category buttons to filter by object types (Payloads, Debris, etc.)
   - Click multiple categories to view combinations
   - Use the Orbit Code dropdown to filter by specific orbits
   - Use the search bar to find satellites by name or NORAD ID

2. **Sorting**:

   - Click on column headers to sort data
   - Click again to reverse sort order

3. **Selecting Satellites**:
   - Use checkboxes to select satellites
   - Maximum 10 satellites can be selected at once
   - View selected satellites in the side panel

## Technologies Used

- React 19
- TypeScript
- Vite
- TanStack Table
- Tailwind CSS
- TanStack Query
- Zustand (State Management)
- Shadcn
