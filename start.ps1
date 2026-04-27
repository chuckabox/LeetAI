# Start script for LeetAI

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
