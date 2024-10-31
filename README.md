# New App

## Description

New App is a web application that allows users to log in using an activation code. Once logged in, users can:

1. **View Jokes**: Browse a list of jokes tailored to them.
2. **Add New Jokes**: Submit new jokes with a setup and punchline.
3. **Generate Jokes**: Use AI to generate new jokes.
4. **Generate Images**: Create images based on prompts.
5. **Text to Speech**: Convert joke text to speech.
6. **Generate Markdown Stories**: Create markdown-formatted stories using AI.

## User Journey

1. **Activation Code Login**
   - The user lands on the login page.
   - Enters their activation code into the provided field.
   - Clicks the "Login" button.
   - If the activation code is valid, the user is logged in and redirected to the home page.
  
2. **Viewing Jokes**
   - From the home page, the user can view a list of jokes.
   - Jokes display the setup and punchline.
  
3. **Adding a New Joke**
   - The user fills out the "Setup" and "Punchline" fields.
   - Clicks "Save Joke" to add it to their joke list.

4. **Generating a Joke**
   - Clicks "Generate Joke" to use AI to create a new joke.
   - The generated joke is displayed in the input fields.

5. **Generating an Image**
   - Clicks "Generate Image" to create an image based on a prompt.
   - The generated image is displayed on the page.

6. **Converting Text to Speech**
   - With a joke entered, the user clicks "Text to Speech".
   - An audio file is generated and played back.

7. **Generating a Markdown Story**
   - Clicks "Generate Markdown" to create a markdown-formatted story.
   - The story is displayed with proper formatting.

## External APIs Used

- **ZAPT AI**: Used for generating jokes, images, text-to-speech conversions, and markdown stories via the `createEvent` function.
- **Sentry**: For error tracking and logging.

## Environment Variables

- `VITE_PUBLIC_SENTRY_DSN`: Sentry Data Source Name for error logging.
- `VITE_PUBLIC_APP_ENV`: The app environment (e.g., development, production).
- `VITE_PUBLIC_APP_ID`: The public application ID used with ZAPT AI.

## Notes

- The app includes loading states for all API calls to enhance user experience.
- The design is responsive and user-friendly across different screen sizes.