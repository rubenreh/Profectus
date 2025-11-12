# FitTrack - The Most Researched Physical Health Platform

FitTrack is an AI-powered fitness and health coaching platform that provides evidence-based guidance using the world's most comprehensive research database. Get personalized fitness, nutrition, and health recommendations backed by scientific research.

## Features

- 🤖 **AI Personal Trainer** - 24/7 access to an AI trainer with knowledge from thousands of research papers
- 📊 **Progress Tracking** - Monitor nutrition, workouts, weight, and fitness goals
- 🎯 **Personalized Plans** - Customized workout and nutrition plans based on your goals
- 📚 **Research-Backed** - Every recommendation is based on peer-reviewed scientific evidence
- 💪 **Comprehensive Tracking** - Food diary, workout logs, weight tracking, and macro monitoring

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- Firebase project (for authentication and data storage)
- OpenAI API key (for AI trainer functionality)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fitness-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
   - Firebase configuration (from Firebase Console)
   - OpenAI API key (from OpenAI)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fitness-app/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes (chat API)
│   │   ├── diary/        # Food diary page
│   │   ├── trainer/      # AI trainer chat page
│   │   └── ...
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and Firebase setup
│   └── store/            # Zustand state management
├── public/               # Static assets
└── ...
```

## Deployment

### Deploy to Netlify

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will automatically detect the Next.js configuration

3. **Configure Environment Variables:**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add all variables from `.env.example`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `OPENAI_API_KEY`

4. **Deploy:**
   - Netlify will automatically build and deploy on every push to main
   - Or trigger a manual deploy from the Deploys tab

### Build Configuration

The project includes a `netlify.toml` file with the correct build settings:
- Build command: `npm run build`
- Publish directory: `.next`
- Next.js plugin configured for optimal performance

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

See `FIREBASE_SETUP.md` for detailed instructions.

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Firebase** - Authentication and Firestore database
- **OpenAI API** - AI trainer functionality
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Recharts** - Data visualization

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
