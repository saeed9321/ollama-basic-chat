import { useState } from 'react'
import './App.css'
import { Card } from './components/ui/card'
import { Button } from './components/ui/button'
import { Loader, Send } from 'lucide-react'
import { Input } from './components/ui/input'
import { answer } from "./OllamaChat";

function App() {
  const [chatHistory, setChatHistory] = useState<Record<string, string>[]>([]);
  const [message, setMessage] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);


  async function addMessage(message: string | undefined) {
    if (!message) return;

    setLoading(true);

    setChatHistory(prev => [...prev, { 'user': message }]);
    setMessage("");


    await answer(message).then(async result => {
      // add ai message filed
      setChatHistory(prev => [...prev, { 'ai': "" }])

      for await (const token of result) {

        setChatHistory(prevChatHistory => {
          const lastMessageIndex = prevChatHistory.length - 1;
          const lastMessage = prevChatHistory[lastMessageIndex];
          const updatedMessage = { ai: (lastMessage.ai || "") + token?.content };

          return [
            ...prevChatHistory.slice(0, lastMessageIndex),
            updatedMessage,
          ];
        });
      }

    }).catch(err => {
      alert(err?.message)
    }).finally(() => {

      setLoading(false);
    })



  }

  function handleHitEnter(event: { key: string }) {
    if (event.key === 'Enter' && !loading) addMessage(message)
  }

  const MessageBox = (message: Record<string, string>, index: number) => {
    if (message['user']) {
      return (
        <Card key={index} className='p-2 mx-4 my-2 w-fit bg-slate-300'>{message['user']}</Card>
      )
    } else {
      return (
        <Card key={index} className='p-2 mx-4 my-2 w-fit bg-slate-400'>{message['ai']}</Card>
      )
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='flex flex-col w-5/6 bg-gray-400 h-5/6'>
        <div className='overflow-y-auto'>
          {chatHistory.map((i, index) => MessageBox(i, index))}
        </div>
        <div className='flex m-4 mt-auto border rounded-lg shadow-md'>
          <Input onKeyDown={handleHitEnter} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
          <Button onClick={() => addMessage(message)}>{loading ? <Loader className='animate-spin' /> : <Send />}</Button>

        </div>
      </Card>
    </div>
  )
}

export default App
