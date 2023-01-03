import { useEffect } from 'react'

export const Account = ({ user, setUser }) => {
    useEffect(() => {
        setTimeout(() => 
            user.login(setUser)
        , 500)
    }, [])

    if(user.loggedIn)
        return <a onClick={() => user.logout(setUser)}>log out</a>

    return <a onClick={() => user.authLogin(setUser)}>log in</a>
}