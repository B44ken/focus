import './App.css'
import { Calendar } from './calendar/Calendar'
import { Account } from './storage/Account'
import { TimePanel } from './time/TimePanel'

import { useState } from 'react'
import { FirebaseUser } from './storage/user'

import 'firebaseui/dist/firebaseui.css'
import firebase from 'firebase/compat/app'
import { auth } from 'firebaseui'

firebase.initializeApp({
    apiKey: "AIzaSyClROcctTLva8nMlP7R-AzuueGiz_9U8J8",
    authDomain: "focus-d94c9.firebaseapp.com",
    databaseURL: "https://focus-d94c9-default-rtdb.firebaseio.com",
    projectId: "focus-d94c9",
    storageBucket: "focus-d94c9.appspot.com",
    messagingSenderId: "204472118325",
    appId: "1:204472118325:web:c32bf0ffc0c31c55f2d57c",
    measurementId: "G-1P61N0LJG3",
})

const ui = new auth.AuthUI(firebase.auth())

const App = () => {
    const [user, setUser] = useState(new FirebaseUser(ui))

    console.log(user.user?.uid)

    return <main>
        <Account user={user} setUser={setUser} />
        <TimePanel user={user} />
        <Calendar user={user} key="Calendar" />
    </main>
}

export default App