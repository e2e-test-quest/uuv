import { UuvAgent } from "./uuv.agent";

const agent = new UuvAgent("ollama/ministral-3:8b", "http://localhost:11434");
agent.start();
