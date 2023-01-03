import 'firebaseui/dist/firebaseui.css'
import firebase from 'firebase/compat/app'
import { getDatabase, ref, set, get } from 'firebase/database'

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

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

const provider = new GoogleAuthProvider()
const auth = getAuth()
const db = getDatabase()


export class FirebaseUser {
    constructor() {
        this.userData = {}
        this.defaultGoal = 1
        this.loggedIn = false
        this.lastUpdated = Date.now()
    }

    async login(setUser) {
        if(auth.currentUser !== null) {
            const userCopy = new FirebaseUser()
            userCopy.userData = await this.loadAllData()
            userCopy.goal = this.goal
            userCopy.loggedIn = true
            userCopy.lastUpdated = Date.now()
            setUser(userCopy)
            return true
        }
        return false
    }

    async authLogin(setUser) {
        signInWithPopup(auth, provider).then(() =>
            this.login(setUser)
        )
    }

    logout(setUser) {
        auth.signOut()
        const newUser = new FirebaseUser()
        setUser(newUser)
    }

    async read(key) {
        return await (await get(ref(db, '/' + key))).val()
    }

    
    async loadAllData() {
        return await this.read(auth.currentUser.uid)
    }

    
    async write(key, value) {
        await set(ref(db, '/' + key), value)
    }

    readDay(moment) {
        const [year, month, day] = moment.split('-')
        const defaultDay = {
            done: 0,
            goal: 60
        }
        let result = defaultDay

        if(this.userData[year] && this.userData[year][month] && this.userData[year][month][day]) {
            result = this.userData[year][month][day]
        }
        
        return result
    }

    async writeDay(moment, minutes) {
        if(!auth.loggedIn) return false

        const [year, month, day] = moment.split('-')
        if(!this.userData[year]) this.userData[year] = {}
        if(!this.userData[year][month]) this.userData[year][month] = {}

        this.userData[year][month][day] = {
            done: minutes,
            goal: this.userData.defaultGoa
        }
        await this.write(auth.currentUser.uid, this.userData)
    }
}