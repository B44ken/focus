import 'firebaseui/dist/firebaseui.css' 
import firebase from 'firebase/compat/app'
import { auth } from 'firebaseui'
import { useEffect, useState } from 'react'

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

ui.start('.login', {
    signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    }
})

export const Account = () => {
    const loginElement = <div className="login"></div>
    const [user, setUser] = useState(null)

    useEffect(() =>
        firebase.auth().onAuthStateChanged(u => setUser(u))
    , [])

    if(user) return <>
        <div>
            logged in as: { user.displayName } (<a href="#" onClick={ () => firebase.auth() }>logout</a>)
        </div>
    </>

    return <>
        logged in as: <br />
        <div className="login"></div>
    </>
}