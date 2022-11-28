let storage = {
    'defaultGoal': 120,
    'days': {
        '2022-11-01': {
            'goal': 120,
            'time': 130
        },
        '2022-11-02': {
            'goal': 120,
            'time': 100
        },
        '2022-11-03': {
            'goal': 120,
            'time': 120,
        }
    }
}

export const queryDay = date => {
    const dateString = date.format('YYYY-MM-DD')
    if(!storage.days[dateString]) 
        return { goal: storage.defaultGoal, time: 0 }
    return storage.days[dateString]
}

export const updateDay = (date, time) => {
    const dateString = date.format('YYYY-MM-DD')
    storage.days[dateString] = {
        goal: storage.defaultGoal,
        time
    }

}