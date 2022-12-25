import 'firebaseui/dist/firebaseui.css'
import firebase from 'firebase/compat/app'
import { getDatabase, ref, set, get } from 'firebase/database'

export class FirebaseUser {
    constructor(ui) {
        this.user = null
        this.id = null
        this.userData = {}
        this.defaultGoal = 60
        this.db = getDatabase()
        this.ui = ui
        this.uiStarted = false
    }

    mountUI(element, setUser) {
        const tryMount = () => {
            try {
                this.ui.start(element, {
                    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
                    callbacks: {
                        signInSuccessWithAuthResult: result => {
                            const newUser = this
                            newUser.user = result.user
                            setUser(newUser)
                        }
                    }
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
                window.user = this
            }
        }, 100)
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
        if(!this.user?.uid) return false

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