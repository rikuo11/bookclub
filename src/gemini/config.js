const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBGHGX6kH3iIXGv96sGUfr_COw7CVUkW-4');

export { genAI }