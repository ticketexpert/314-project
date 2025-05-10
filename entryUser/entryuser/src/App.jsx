import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ScanUI from './components/scanUI'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ScanUI />
       </div>
       </>
  )
}

export default App
