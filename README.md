# Matchmaker Dashboard MVP

This is an internal tool MVP built for the TDC team to manage customers, view biodata, and assign matches dynamically. 

## Live Demo
*(Insert your Vercel/Netlify link here)*

## Sample Credentials
- **Username:** `admin`
- **Password:** `password`

---

## Technical Write-Up

### Tech Stack Choices
For this MVP, I chose to separate the application into a **Vite (React + TypeScript)** frontend and a **Node.js (Express)** backend. React with TypeScript was selected for the frontend to ensure type safety, fast rendering, and a modular component structure, allowing the dashboard and detailed views to be easily extended later. For styling, I used standard CSS with a focus on modern UI/UX principles (like glassmorphism and subtle micro-animations) to ensure the internal tool feels premium and highly interactive. On the backend, Node.js and Express provided a lightweight, fast environment to build the matching algorithm and API endpoints without the overhead of a heavier framework.

### Matching Logic
The core matching engine implements distinct, gender-specific algorithms. For male customers, the algorithm filters potential female matches who are younger, earn less, are shorter, and have aligned views on having children. For female customers, the logic prioritizes matching with males who have a higher or equal income and share similar relocation preferences. The algorithm iterates through the static database of 100 dynamically generated dummy profiles to construct a pool of compatible candidates.

### AI Integration
To enhance the matchmaker's workflow, AI is utilized in two key areas. First, an AI scoring mechanism ranks the filtered compatibility pool (generating a score from 60-100) and provides a one-sentence contextual explanation for *why* the match was suggested (e.g., aligning on values or lifestyle). Second, I implemented a floating AI Chatbot interface on the frontend. The bot parses natural language queries from the matchmaker, infers the context of the search (including dynamically reversing target genders based on user intent), and returns the optimal match from the database. 

### Assumptions Made
1. **Mock Services**: Since third-party API keys (like Twilio, SendGrid, and OpenAI) were not provided for the MVP, the email/SMS triggering and the NLP engine are simulated on the backend via modular service files that log the output. 
2. **Data Persistence**: A static JSON file (`profiles.json`) containing 100 randomly generated profiles is used as the data store rather than a live database to keep the MVP lightweight and easily reproducible.
3. **Authentication**: Authentication is hardcoded to a single matchmaker admin account for demonstration purposes.

---

## How to Run Locally

Install dependencies for both frontend and backend concurrently from the root directory:
```bash
npm run install:all
```

Start both development servers (runs frontend on port 5173 and backend on port 5000):
```bash
npm run dev
```
