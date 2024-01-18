import { useState } from 'react'
import './App.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'

function App() {

  return (
    <div className='h-screen bg-gray-400 flex items-center justify-center'
    >
      <Card className='p-4 min-w-[400px]'>
        <CardHeader>
          <CardTitle>Hello Hackers</CardTitle>
          <CardDescription>This is ReactJS biolerplate</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className='flex flex-wrap gap-10'>
            <li><Badge>React</Badge></li>
            <li><Badge>Typescript</Badge></li>
            <li><Badge>Vite</Badge></li>
            <li><Badge>Tailwind</Badge></li>
            <li><Badge>Shadcn UI</Badge></li>
          </ol>
        </CardContent>
        <CardFooter>
          <Button variant={'outline'}>Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
