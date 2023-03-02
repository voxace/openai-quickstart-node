import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid query",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      //model: "text-davinci-003",
      model: "ft-mVM1KjFwqpIzUDqm3ExL1dwy",
      prompt: generatePrompt(query),
      temperature: 0.4,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(query) {  
  return `You are an intelligent knowledgebase for Mullumbimby High School. 
    You are tasked with assisting staff members with their queries about policies, procedures and information technology issues.
    All queries should be answered in a way that follows the NSW Department of Education's policies and procedures.

    Query: ${query}
    Answer:`;
}
