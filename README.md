# New App

## Description

**New App** is a web application that allows users to log in using an activation code. Once logged in, users can:

1. **View Jokes**
   - Browse a personalized list of jokes.
   - Jokes display both the setup and punchline.
2. **Add New Jokes**
   - Submit new jokes by providing a setup and punchline.
   - Save jokes to your personalized joke list.
3. **Generate Jokes**
   - Use AI to generate a new joke.
   - The generated joke populates the setup and punchline fields.
4. **Generate Images**
   - Create an image based on a humorous prompt.
   - View the generated image directly within the app.
5. **Text to Speech**
   - Convert your joke into speech.
   - Listen to an audio rendition of your joke.
6. **Generate Markdown Stories**
   - Use AI to create a funny story in markdown format.
   - The story is rendered with proper formatting in the app.

## User Journey

1. **Activation Code Login**
   - The user lands on the login page.
   - Enters their activation code into the provided field.
   - Clicks the "Login" button.
   - If the activation code is valid, the user is logged in and redirected to the home page.

2. **Viewing Jokes**
   - From the home page, the user can view a list of their jokes.
   - Jokes are displayed with the setup and punchline.

3. **Adding a New Joke**
   - The user fills out the "Setup" and "Punchline" fields.
   - Clicks "Save Joke" to add it to their joke list.
   - The new joke appears in their joke list.

4. **Generating a Joke**
   - Clicks "Generate Joke" to use AI to create a new joke.
   - The generated joke populates the input fields.
   - The user can save the joke by clicking "Save Joke".

5. **Generating an Image**
   - Clicks "Generate Image" to create an image based on a humorous prompt.
   - The generated image is displayed on the page.

6. **Converting Text to Speech**
   - With a joke entered, the user clicks "Text to Speech".
   - An audio file is generated and played back.

7. **Generating a Markdown Story**
   - Clicks "Generate Markdown" to create a markdown-formatted funny story.
   - The story is displayed with proper formatting.

## External APIs Used

- **ZAPT AI**
  - Used for generating jokes, images, text-to-speech conversions, and markdown stories via the `createEvent` function.
  - Enables AI functionalities within the app.

- **Sentry**
  - Used for error tracking and logging on both frontend and backend.
  - Helps in monitoring and fixing runtime errors.

## Environment Variables

- `VITE_PUBLIC_SENTRY_DSN`: Sentry Data Source Name for error logging.
- `VITE_PUBLIC_APP_ENV`: The app environment (e.g., development, production).
- `VITE_PUBLIC_APP_ID`: The public application ID used with ZAPT AI.
- `NEON_DB_URL`: Database connection URL for Neon Postgres.
- `PROJECT_ID`: The project ID for backend services.

## Notes

- The app includes loading states for all API calls to enhance user experience.
- The design is responsive and user-friendly across different screen sizes.
- All buttons have a `cursor-pointer` class for better interactivity.
- Text inputs include the `box-border` class and defined text colors for consistency.
- The app uses `h-full` for full height display, avoiding white spaces.
- Progressier is used for adding PWA functionality.
- Users can only click buttons once during loading to prevent duplicate actions.