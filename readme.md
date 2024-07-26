# DreamSage

## Description

DreamSage is a comprehensive web application designed to help users track, analyze, and share their dreams. Built with React and powered by Supabase, this app offers a rich set of features for dream enthusiasts and those interested in exploring their subconscious mind.

## Features

- **Dream Logging**: Easily record your dreams with details such as mood, clarity, intensity, and themes.
- **Calendar View**: Visualize your dream patterns over time with an interactive calendar.
- **AI-Powered Insights**: Get personalized dream analysis and insights powered by OpenAI's language models.
- **Trend Analysis**: View graphical representations of your dream patterns, moods, and themes.
- **Sleep Tracking**: Log your sleep data and see how it correlates with your dreams.
- **Social Sharing**: Share your dreams with the community and explore others' experiences.
- **Customizable Settings**: Personalize your app experience with notification preferences and theme options.

## Technologies Used

- React
- Supabase (for backend and authentication)
- OpenAI API (for dream analysis)
- Recharts (for data visualization)
- Tailwind CSS (for styling)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dream-journal-app.git
   cd dream-journal-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up Supabase:
   - Create a new project in Supabase
   - Set up the following tables: `dreams`, `sleep_data`, `shared_dreams`, `user_settings`
   - Configure authentication methods as needed

5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

- `DreamJournalApp.js`: Main component and router
- `JournalTab.js`: Dream logging interface
- `CalendarTab.js`: Calendar view of dreams
- `InsightsTab.js`: AI-generated dream insights
- `TrendsTab.js`: Visualization of dream trends
- `TrackerTab.js`: Sleep tracking functionality
- `SocialTab.js`: Dream sharing and community features
- `SettingsTab.js`: User preferences and account settings
- `lib/supabaseClient.js`: Supabase client configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- OpenAI for providing the AI model for dream analysis
- Supabase for the backend infrastructure
- The React community for the amazing ecosystem of tools and libraries

