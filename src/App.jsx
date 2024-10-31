import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent } from './supabaseClient';
import { useNavigate } from '@solidjs/router';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [jokes, setJokes] = createSignal([]);
  const [newJoke, setNewJoke] = createSignal({ setup: '', punchline: '' });
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [generatedImage, setGeneratedImage] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [markdownText, setMarkdownText] = createSignal('');
  const [activationCode, setActivationCode] = createSignal('');

  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  const handleActivationCodeLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/validateActivationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ activationCode: activationCode() }),
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        setCurrentPage('homePage');
      } else {
        alert(result.error || 'Invalid activation code');
      }
    } catch (error) {
      console.error('Error during activation code login:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJokes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getJokes', {
        headers: {
          'Authorization': `Bearer ${user().token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJokes(data);
      } else {
        console.error('Error fetching jokes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching jokes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJoke = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/saveJoke', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke()),
      });
      if (response.ok) {
        const savedJoke = await response.json();
        setJokes([...jokes(), savedJoke]);
        setNewJoke({ setup: '', punchline: '' });
      } else {
        console.error('Error saving joke');
      }
    } catch (error) {
      console.error('Error saving joke:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchJokes();
    }
  });

  const handleGenerateJoke = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Give me a joke in JSON format with the following structure: { "setup": "joke setup", "punchline": "joke punchline" }',
        response_type: 'json'
      });
      setNewJoke(result);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await createEvent('generate_image', {
        prompt: 'A funny cartoon character telling a joke'
      });
      setGeneratedImage(result);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: `${newJoke().setup} ... ${newJoke().punchline}`
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownGeneration = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Write a short, funny story about a comedian in markdown format',
        response_type: 'text'
      });
      setMarkdownText(result);
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with Activation Code</h2>
              <input
                type="text"
                placeholder="Enter Activation Code"
                value={activationCode()}
                onInput={(e) => setActivationCode(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border mb-4 text-gray-800"
              />
              <button
                onClick={handleActivationCodeLogin}
                class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  loading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading()}
              >
                {loading() ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto h-full">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Joke Central</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
            <div class="col-span-1 md:col-span-2 lg:col-span-1 h-full">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Add New Joke</h2>
              <form onSubmit={saveJoke} class="space-y-4">
                <input
                  type="text"
                  placeholder="Setup"
                  value={newJoke().setup}
                  onInput={(e) => setNewJoke({ ...newJoke(), setup: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-800"
                  required
                />
                <input
                  type="text"
                  placeholder="Punchline"
                  value={newJoke().punchline}
                  onInput={(e) => setNewJoke({ ...newJoke(), punchline: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-800"
                  required
                />
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    disabled={loading()}
                  >
                    {loading() ? 'Saving...' : 'Save Joke'}
                  </button>
                  <button
                    type="button"
                    class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      loading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleGenerateJoke}
                    disabled={loading()}
                  >
                    {loading() ? 'Generating...' : 'Generate Joke'}
                  </button>
                </div>
              </form>
            </div>

            <div class="col-span-1 md:col-span-2 lg:col-span-1 h-full">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Joke List</h2>
              <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                <For each={jokes()}>
                  {(joke) => (
                    <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      <p class="font-semibold text-lg text-purple-600 mb-2">{joke.setup}</p>
                      <p class="text-gray-700">{joke.punchline}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="col-span-1 md:col-span-2 lg:col-span-1 h-full">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Additional Features</h2>
              <div class="space-y-4">
                <button
                  onClick={handleGenerateImage}
                  class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  disabled={loading()}
                >
                  {loading() ? 'Generating...' : 'Generate Image'}
                </button>
                <Show when={newJoke().setup && newJoke().punchline}>
                  <button
                    onClick={handleTextToSpeech}
                    class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    disabled={loading()}
                  >
                    {loading() ? 'Converting...' : 'Text to Speech'}
                  </button>
                </Show>
                <button
                  onClick={handleMarkdownGeneration}
                  class="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  disabled={loading()}
                >
                  {loading() ? 'Generating...' : 'Generate Markdown'}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Show when={generatedImage()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-purple-600">Generated Image</h3>
                <img src={generatedImage()} alt="Generated joke image" class="w-full rounded-lg shadow-md" />
              </div>
            </Show>
            <Show when={audioUrl()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-purple-600">Audio Joke</h3>
                <audio controls src={audioUrl()} class="w-full" />
              </div>
            </Show>
            <Show when={markdownText()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-purple-600">Markdown Story</h3>
                <div class="bg-white p-4 rounded-lg shadow-md">
                  <SolidMarkdown children={markdownText()} />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;