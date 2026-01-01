import { useEffect } from 'react'

export const Account = ({ user, setUser }) => {
    useEffect(() => {
        if (!user.loggedIn) {
            setTimeout(() =>
                user.login(setUser)
                , 500)
        }
    }, [user, setUser])

    if (user.loggedIn)
        return <button className="link-button" onClick={() => user.logout(setUser)}>log out</button>

    return <button className="link-button" onClick={() => user.authLogin(setUser)}>log in</button>
}