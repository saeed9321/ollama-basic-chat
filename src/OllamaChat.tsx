import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableConfig, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory"


const chatModel = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "tinyllama", // You can also use mistral 4.1 GB
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a very helpful AI Assistant, make your answers very short and to the point!`],
    // new MessagesPlaceholder('history'),
    ["human", `{input}`]
])

chatModel.temperature = 0;


export async function answer(message: string) {

    const chain = prompt.pipe(chatModel);

    // const messageHistory = new ChatMessageHistory();
    // const withHistory = new RunnableWithMessageHistory({ chain, getMessageHistory: () => messageHistory, inputMessagesKey: 'input', historyMessagesKey: 'history' })
    // const config: RunnableConfig = { configurable: { sessionId: "1" } };

    // return await withHistory.stream({ input: message }, config);
    return await chain.stream({ input: message });
}