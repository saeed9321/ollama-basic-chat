import './App.css'
import { useEffect, useState } from 'react'
import { Card } from './components/ui/card'
import { Button } from './components/ui/button'
import { Loader, Send } from 'lucide-react'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from './components/ui/label'
import axios from 'axios'

type AIMessage = {
  role: string,
  content: string
}

function App() {
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([{ role: "system", content: "make your answers very short" }]);
  const [message, setMessage] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLLM, setSelectedLLM] = useState<string>('');
  const [availableLLMs, setAvailableLLMs] = useState<string[]>([]);

  useEffect(() => {
    const getAvailableLLMs = async () => {
      const response = await axios.get("https://westandwithgaza.com/ollama/api/tags");

      if (!response || !response.data.models) {
        alert('No Available Models Found')
      }

      setAvailableLLMs(response.data.models.map((i: { model: string }) => i.model));
      setSelectedLLM(response.data.models[0].model);
    }
    getAvailableLLMs();
  }, [])

  async function addMessage(message: string | undefined) {
    if (!message) return;

    const updatedChatHistory = [...chatHistory, { role: 'user', content: message }];

    setLoading(true);
    setChatHistory(updatedChatHistory);
    setMessage("");

    try {
      // const response = await fetch("http://localhost:11434/api/chat", {
      const response = await fetch("https://westandwithgaza.com/ollama/api/chat", {
        method: 'POST',
        body: JSON.stringify({
          model: selectedLLM,
          stream: false,
          messages: updatedChatHistory,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const reader = response.body?.getReader();
      if (!reader) {
        return 'no reader found'
      }
      let buffer = "";
      setChatHistory(prev => [...prev, { role: 'assistant', content: "" }])
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += new TextDecoder().decode(value, { stream: true });
        try {
          const json = JSON.parse(buffer);
          setChatHistory(prevChatHistory => {
            const lastMessageIndex = prevChatHistory.length - 1;
            const lastMessage = prevChatHistory[lastMessageIndex];
            const updatedMessage = { role: "assistant", content: (lastMessage.content || "") + json?.message?.content };
            return [
              ...prevChatHistory.slice(0, lastMessageIndex),
              updatedMessage,
            ];
          });
          buffer = ''; // Clear the buffer once the JSON is parsed
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
      // alert(err?.message);
    } finally {
      setLoading(false);
    }
  }

  function handleHitEnter(event: { key: string }) {
    if (event.key === 'Enter' && !loading) addMessage(message)
  }

  const MessageBox = (message: AIMessage, index: number) => {
    if (message.role === 'user') {
      return (
        <Card key={index} className='p-2 mx-4 my-2 w-fit bg-slate-300'>{message.content}</Card>
      )
    } else if (message.role === 'assistant') {
      return (
        <Card key={index} className='p-2 mx-4 my-2 w-fit bg-slate-400'>{message.content}</Card>
      )
    }
  }

  return (
    <div className='bg-black'>

      <div className='flex flex-col items-center justify-center h-screen w-5/6 mx-auto invert'>
        <Label className='w-full mb-2'>Choose LLM Model</Label>
        <Select onValueChange={value => setSelectedLLM(value)}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder={selectedLLM} />
          </SelectTrigger>
          <SelectContent>
            {availableLLMs.map(model =>
              <SelectItem key={model} value={model}>{model}</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Card className='flex flex-col w-full bg-gray-400 h-5/6'>
          <div className='overflow-y-auto'>
            {chatHistory.map((i, index) => MessageBox(i, index))}
          </div>
          <div className='flex m-4 mt-auto border rounded-lg shadow-md'>
            <Input onKeyDown={handleHitEnter} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
            <Button onClick={() => addMessage(message)}>{loading ? <Loader className='animate-spin' /> : <Send />}</Button>

          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
