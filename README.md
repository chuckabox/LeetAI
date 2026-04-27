# LeetAI 🚀

Personalized LeetCode Practice Recommendations & Skill Gap Analysis.

![LeetAI Dashboard Mockup](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg)

## Features
- **Profile Sync**: Instantly pull your LeetCode stats via username.
- **Skill Gap Detection**: Identify topics where you have the least experience.
- **Pattern-Based Recommendations**: Focused problem sets to bridge your gaps.
- **Premium UX**: Responsive, dark-mode dashboard with interactive stats.

## Quick Start
```powershell
.\start.ps1
```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide
- **Backend**: Node.js, Express, TypeScript
- **Storage**: SQLite
- **API**: LeetCode GraphQL

## Architecture
The app follows a modern client-server architecture:
- **Client** handles the UI/UX and state management.
- **Server** manages API integration with LeetCode and persistence in SQLite.
- **Recommendation Service** runs on the server to analyze user data and suggest problems.
