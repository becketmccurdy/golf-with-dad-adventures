# Golf With Dad Adventures

A private web application for tracking golf courses played with your dad, including notes, photos, and basic stats.

## Features

- **Authentication**: Secure login via Google
- **Dashboard**: Overview of courses played, statistics, and a map visualization
- **Course & Round Tracking**: Log courses you've played with details like score, rating, and notes
- **Photo Upload**: Save memories with photo attachments for each round
- **Map Integration**: View your golf adventures on a map using MapLibre GL
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Storage**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Maps**: MapLibre GL with OpenStreetMap tiles
- **State Management**: React Query for data fetching and caching
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm
- A Firebase project with Firestore, Authentication, and Storage enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/becketmccurdy/golf-with-dad-adventures.git
   cd golf-with-dad-adventures
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
pnpm build
```

The build output will be in the `dist` directory.
## Deployment

The application is set up for automatic deployment to Vercel via GitHub Actions.

1. Push your code to GitHub
2. Set up a new project in Vercel
3. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

4. Push to the `main` branch to trigger a deployment

## Firestore Rules

The application uses the following Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /coursesPlayed/{courseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /rounds/{roundId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## License

Private - Not for public distribution.

## Acknowledgments

- Created for logging golf adventures with Dad
- Built with React, Firebase, and MapLibre GL
