const { localSummary } = require("../validation");
const { generateOpenAiSummary } = require("../repositories/openai.repository");

async function createSummary(config, text) {
  if (!config.openai.apiKey) {
    return { summary: localSummary(text), mode: "local_fallback" };
  }

  try {
    const summary = await generateOpenAiSummary(config, text);
    return { summary: summary || localSummary(text), mode: "openai" };
  } catch (_error) {
    return { summary: localSummary(text), mode: "api_failed_fallback" };
  }
}

module.exports = { createSummary };
