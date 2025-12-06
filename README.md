# AHP Decision Maker

A modern, web-based tool for multi-criteria decision-making using the **Analytic Hierarchy Process (AHP)**. This application helps users make complex decisions by breaking them down into a hierarchy of criteria, performing pairwise comparisons, and calculating the relative weight of each criterion.

## Features

- **Step-by-Step Workflow**: Guided process from problem definition to final analysis.
- **Dynamic Criteria**: Define up to 15 criteria for your decision.
- **Interactive Pairwise Comparisons**:
  - **Smart Slider Input**: Intuitive bi-directional slider for comparing criteria (1-9 Saaty scale).
  - **Auto-Reciprocal**: Automatically calculates reciprocal values (e.g., if A vs B is 3, B vs A is 1/3).
  - **Real-time Validation**: Ensures all inputs are valid and consistent.
- **Advanced Visualization**:
  - **Consistency Check**: Real-time calculation of Consistency Ratio (CR) to ensure logical judgments.
  - **Detailed Matrices**: View full Comparison and Normalized matrices with interactive tooltips.
  - **Ranked Results**: Clear visualization of criteria weights and rankings.
- **Premium UI/UX**:
  - **Dark Mode**: Sleek, high-contrast dark theme.
  - **Responsive Design**: Fully functional on desktop and mobile.
  - **Smart Tooltips**: Portal-based tooltips that never clip, providing context on hover.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm, or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ahp-decision-maker.git
    cd ahp-decision-maker
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Run the development server:

    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

1.  **Define Problem**: State the decision you are trying to make (e.g., "Choose the best office location").
2.  **Set Criteria**: List the factors that influence your decision (e.g., Cost, Size, Location, Amenities).
3.  **Compare**: Use the slider to compare each pair of criteria.
    - Slide **Right** if the Row criterion is more important.
    - Slide **Left** if the Column criterion is more important.
    - The scale ranges from 1 (Equal) to 9 (Extreme Importance).
4.  **Analyze**: Review the calculated weights and consistency ratio. If CR > 0.10, consider revising your judgments.

## Project Structure

```
app/
├── components/
│   ├── ahp/          # Core AHP step components (Step1, Step2, etc.)
│   └── ui/           # Reusable UI components (Button, Card, Slider, etc.)
├── context/          # Global state management (AhpContext)
├── lib/
│   ├── ahp-logic.ts  # Core mathematical algorithms for AHP
│   └── utils.ts      # Helper functions
├── layout.tsx        # Root layout with providers
└── page.tsx          # Main application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
