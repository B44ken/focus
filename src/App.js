import './App.css'
import { Calendar } from './calendar/Calendar'
import { Account } from './storage/Account'
import { TimePanel } from './time/TimePanel'

import { useEffect, useState } from 'react'
import { FirebaseUser } from './storage/user'

import 'firebaseui/dist/firebaseui.css'

const App = () => {
    const [user, setUser] = useState(new FirebaseUser())
    const [status, setStatus] = useState('Loading...')

    return <main>
        <title>{status}</title>
        <Account user={user} setUser={setUser} />
        <TimePanel user={user} setStatus={setStatus} />
        <Calendar user={user} key="Calendar" />
    </main>
}

export default App