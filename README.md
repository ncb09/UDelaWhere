# UDelaWhere??

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174.0-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.1-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-6.1.15-DB7093?logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Google Generative AI](https://img.shields.io/badge/Gemini_AI-0.22.0-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

An immersive, interactive campus exploration game that helps University of Delaware students, especially freshmen, discover and learn about campus locations through engaging 360° panoramas.

## 🎓 For Incoming Freshmen

Finding your way around a new campus can be overwhelming. UDelaWhere?? transforms campus navigation into an engaging game that helps you:

- **Learn Campus Geography** — Explore the University of Delaware through immersive 360° panoramic views
- **Build Mental Maps** — Develop a better understanding of how campus locations relate to each other
- **Discover Hidden Spots** — Find lesser-known locations you might not encounter during regular tours
- **Prepare Before Arrival** — Start learning the campus layout even before moving in
- **Challenge Friends** — Compare scores and compete with classmates to see who knows campus best

By playing UDelaWhere??, you'll arrive on campus with visual familiarity already established, recognizing landmarks and buildings as if you've been there before — making your transition to campus life much less overwhelming!

## ✨ Features

- **Immersive 360° Exploration** — Powered by Three.js, explore campus in every direction
- **Interactive Campus Map** — Built with Leaflet and OpenStreetMap for accurate location guessing
- **Two Game Modes**:
  - **Practice Mode** — Take your time to explore with no time limits
  - **Challenge Mode** — Test your knowledge with a 120-second time limit per location
- **Global Leaderboard** — Compete with other players and track high scores via Supabase

## 🛠️ Technologies

UDelaWhere?? leverages a modern tech stack:

- **Frontend Framework**: React 19 with TypeScript for type-safe development
- **3D Rendering**: Three.js for immersive 360° panoramic views
- **Mapping**: Leaflet with OpenStreetMap for accurate campus visualization
- **Styling**: Styled Components for component-based CSS-in-JS
- **Database & Authentication**: Supabase for leaderboard functionality
- **Image Processing**: FFmpeg for panorama to cubemap conversion
- **Original Panoramas**: Captured with Polycam for high-quality 360° images

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (for Supabase and Gemini AI):
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```
   npm start
   ```

## 📊 Leaderboard System

The leaderboard functionality uses Supabase as a backend:

- **Real-time Updates**: Scores are updated instantly
- **Best Score Tracking**: Only highest scores are displayed
- **Unique Usernames**: System ensures usernames are unique

## 👨‍💻 Contributors

- **Nathaniel Black** — Developer
  - [GitHub](https://github.com/ncb09)
  - [LinkedIn](https://www.linkedin.com/in/nathaniel-black-ab8a19329/)

- **Marcos Diaz Vazquez** — Developer
  - [GitHub](https://github.com/marcosdiazvazquez)
  - [LinkedIn](https://www.linkedin.com/in/marcos-diaz-vazquez/)

- **Dhruv Patel** — Developer
  - [GitHub](https://github.com/rkdhruv)
  - [LinkedIn](https://www.linkedin.com/in/rkdhruv/)

- **Anthony Baker-Espejo** — User Advocate
  - [LinkedIn](https://www.linkedin.com/in/abespejo/)

## 📷 Image Processing Pipeline

The game uses a two-step process to prepare panoramic images:

1. **Capture**: High-quality 360° panoramas captured around campus using Polycam
2. **Conversion**: FFmpeg processes equirectangular panoramas into cubemap format for Three.js
3. **Integration**: Processed images with coordinates are loaded into the game environment

## 📜 License

This project was created during HenHack 2025 by University of Delaware students.