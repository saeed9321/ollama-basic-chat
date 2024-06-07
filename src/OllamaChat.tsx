// import { ChatOllama } from "@langchain/community/chat_models/ollama"
// import { ChatPromptTemplate } from "@langchain/core/prompts";
import axios from 'axios';
// import { Ollama } from "@langchain/community/llms/ollama";
// import { RunnableConfig, RunnableWithMessageHistory } from "@langchain/core/runnables";
// import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory"


// const chatModel = new ChatOllama({
//     // baseUrl: "https://westandwithgaza.com/ollama", // Default value
//     baseUrl: "http://localhost:11434", // Default value
//     model: "tinyllama", // You can also use mistral 4.1 GB
// });

// const chatModel = new Ollama({ baseUrl: "http://localhost:11434", model: "tinyllama" })

// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", `You are a very helpful AI Assistant, make your answers very short and to the point!`],
//     // new MessagesPlaceholder('history'),
//     ["human", `{input}`]
// ])

// chatModel.temperature = 0;


//////////////////////////////////////////////

const URL = "http://localhost:11434/api/chat";

export async function* answer(message: string) {
    const response = await axios
        .post(
            URL,
            {
                model: "tinyllama",
                messages: [
                    {
                        role: "system",
                        content: "make your answers very short",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            },
            { responseType: "stream" }
        );

    let buffer = ""
    for await (const chunk of response.data) {
        buffer += chunk.toString();
        try {
            const json = JSON.parse(buffer);
            // for (const token of json) {
            yield json;
            // }
            buffer = ''; // Clear the buffer once the JSON is parsed

        } catch (err) {
            // Some error 
        }
    }

    // }

    // response.data.on('data', (chunk: { toString: () => string; }) => {
    // yield chunk;
    // buffer += chunk.toString();
    // try {
    //     const json = JSON.parse(buffer);
    //     yield json;
    //     buffer = ""
    // } catch (error) {
    //     // error happended
    // }
    // });

    // const chain = prompt.pipe(chatModel);

    // const messageHistory = new ChatMessageHistory();
    // const withHistory = new RunnableWithMessageHistory({ chain, getMessageHistory: () => messageHistory, inputMessagesKey: 'input', historyMessagesKey: 'history' })
    // const config: RunnableConfig = { configurable: { sessionId: "1" } };

    // return await withHistory.stream({ input: message }, config);
    // return await chain.stream({ input: message });
}
