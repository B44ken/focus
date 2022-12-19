import 'firebaseui/dist/firebaseui.css'
import firebase from 'firebase/compat/app'
import { auth } from 'firebaseui'
import { getDatabase, ref, set, get, connectDatabaseEmulator } from 'firebase/database'

export class FirebaseUser {
    constructor() {
        this.user = null
        this.id = null
        this.userData = {}
        this.defaultGoal = 60
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
        this.db = getDatabase()
        this.ui = new auth.AuthUI(firebase.auth())
    }

    async mountUI(element) {
        const tryMount = () => {
            try {
                this.ui.start(element, {
                    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
                    callbacks: { signInSuccessWithAuthResult: () => false }
                })
                return true
            } catch (err) { return false }
        }

        firebase.auth().onAuthStateChanged(async (u) => {
            this.user = u
            this.id = u?.uid
            if(u) {
                await this.loadAllData()
            }
        })

        const mountInt = setInterval(() => {
            if (tryMount()) {
                clearInterval(mountInt)
                window.user = this;
            }
        }, 50)
    }

    logout() {
        firebase.auth().signOut()
    }

    async read(key) {
        return await (await get(ref(this.db, '/' + key))).val()
    }

    
    async loadAllData() {
        const data = await this.read(this.user.uid)
        this.userData = data        
    }

    
    async write(key, value) {
        await set(ref(this.db, '/' + key), value)
    }

    readDay(moment) {
        const [year, month, day] = moment.split('-')
        const defaultDay = {
            done: 0,
            goal: 120
        }
        let result = defaultDay

        if(this.userData[year] && this.userData[year][month] && this.userData[year][month][day]) {
            result = this.userData[year][month][day]
        }
        
        return result
    }

    async writeDay(moment, minutes) {
        if(!this.user.user.uid) return false

        const [year, month, day] = moment.split('-')
        if(!this.userData[year]) this.userData[year] = {}
        if(!this.userData[year][month]) this.userData[year][month] = {}
        this.userData[year][month][day] = {
            done: minutes,
            goal: this.defaultGoal
        }
        await this.write(this.user.uid, this.userData)
    }
}