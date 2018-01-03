function fetchEvents(ms) {
    var events = [
        {
            "id": "1",
            "title": "ШРИ 2018 - начало",
            "dateStart": "2017-12-28T13:57:23.309Z",
            "dateEnd": "2017-12-28T14:57:23.309Z",
            "users": [
                {
                    "id": "1",
                    "login": "veged"
                },
                {
                    "id": "2",
                    "login": "alt-j"
                }
            ],
            "room": {
                "id": "1",
                "title": "404",
                "capacity": 5,
                "floor": 7
            }
        },
        {
            "id": "2",
            "title": "👾 Хакатон 👾",
            "dateStart": "2017-12-28T14:57:23.309Z",
            "dateEnd": "2017-12-28T15:57:23.309Z",
            "users": [
                {
                    "id": "2",
                    "login": "alt-j"
                },
                {
                    "id": "3",
                    "login": "yeti-or"
                }
            ],
            "room": {
                "id": "2",
                "title": "Деньги",
                "capacity": 4,
                "floor": 6
            }
        },
        {
            "id": "3",
            "title": "🍨 Пробуем kefir.js",
            "dateStart": "2017-12-28T16:57:23.309Z",
            "dateEnd": "2017-12-28T18:57:23.309Z",
            "users": [
                {
                    "id": "1",
                    "login": "veged"
                },
                {
                    "id": "3",
                    "login": "yeti-or"
                }
            ],
            "room": {
                "id": "3",
                "title": "Карты",
                "capacity": 4,
                "floor": 7
            }
        }
    ]
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(events), ms)
    })
}

function checkForFirefox() {
    return navigator.userAgent.slice(navigator.userAgent.length - 12, navigator.userAgent.length - 5) == 'Firefox'
}

function determineTime() {
    var date = new Date()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    if(minutes < 10) {
        minutes = "0" + minutes
    }
    return {
        time: hours + ':' + minutes,
        hours: hours,
        minutes: minutes
    }
}

function splitDate(date) {
    return {
        year: date.slice(0, 4),
        month: date.slice(5, 7),
        day: date.slice(8, 10),
        time: {
            hours: date.slice(11, 13),
            minutes: date.slice(14, 16),
            seconds: date.slice(17, 19),
        }
    }
}

function hoursIncluded(start, end) {
    var hours = []
    for (var i = start; i <= end; i++) {
        hours.push(parseInt(i))
    }
    return hours
}

function handleEventData(data) {
    var newData = []
    data.map(event => {
        let eventInfo = {
            id: event.id,
            title: event.title,
            floor: event.room.floor,
            room: {
                id: event.room.id,
                title: event.room.title,
                capacity: event.room.capacity,
                users: event.users
            },
            start: splitDate(event.dateStart),
            end: splitDate(event.dateEnd),
            hoursIncluded: hoursIncluded(event.dateStart.slice(11, 13), event.dateEnd.slice(11, 13))
        }
        newData.push(eventInfo)
    })
    return newData
}

function computeDataToRender(currentTime, events) {
    var data = []
    var handledData = handleEventData(events)
    for (var i = currentTime.hours - 3; i <= currentTime.hours; i++) {
        var eventInfo = handledData.map(date => {
            if (date.hoursIncluded.includes(i))
                return date
        })
        if (i == currentTime.hours) {
            data.push({
                date: currentTime.time,
                events: eventInfo.filter(event => event != undefined)
            })
            continue
        }
        if(i < 0) {
            var correctHour = 24 - Math.abs(i)
            data.push({
                date: correctHour,
                events: eventInfo.filter(event => event != undefined)
            })
            continue
        }
        data.push({
            date: i,
            events: eventInfo.filter(event => event != undefined)
        })
    }
    for (var i = currentTime.hours + 1; i < 24; i++) {
        var eventInfo = handledData.map(date => {
            if(i == 15) {
                console.log(date.hoursIncluded.includes(i))
                console.log(date)
            }
            if (date.hoursIncluded.includes(i))
                return date
        })
        data.push({
            date: i,
            events: eventInfo.filter(event => event != undefined)
        })
    }
    for (var i = 0; i < data[0].date; i++) {
        var eventInfo = handledData.map(date => {
            if (i == 15) {
                console.log(date.hoursIncluded.includes(i))
                console.log(date)
            }
            if (date.hoursIncluded.includes(i))
                return date
        })
        data.push({
            date: i,
            events: eventInfo.filter(event => event != undefined)
        })
    }

    return data
}

function addStyle(currentTime) {
    var css = `main.main-page .right-bar .timeline .time-area.current .timing > span:last-of-type {
                    margin-right: -${23 + parseInt(currentTime.minutes)}px;
                }

                .current::before {
                        content: '';
                        position: absolute;
                        width: 1px;
                        left: ${currentTime.minutes}px;
                        top: 15px;
                        height: calc(100% - 15px);
                        background: blue;
                        border-right: 1px solid #007DFF;
                        z-index: 5000
                    }

                    main.main-page .right-bar .timeline .time-area.current .timing > .hours {
                        right: calc(100% - 5px);
                    }

                    main.main-page .right-bar .timeline .time-area .timing > span:first-of-type {
                        margin-right: 0;
                        margin-left: -4px;
                    }

                    main.main-page .right-bar .timeline .time-area:first-of-type .timing > span {
                        margin-left: 0;
                    }

                     main.main-page .right-bar .timeline .time-area.current .timing > span {
                        ${currentTime.minutes > 22 ?
                            `margin-left: ${Math.abs(23 - parseInt(currentTime.minutes))}px;`
                            :
                            `margin-left: -${Math.abs(23 - parseInt(currentTime.minutes))}px;`
                        }
                    }
                }`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style)
}

function renderTimelines(data, currentTime) {
    var render = ''
    data.map((item, index) => {
        var renderString = `
        <div class="time-area ta-${index} ${item.date == currentTime.time ? 'current' : ''}">
            <div class="timing">
                ${item.date == currentTime.time ? `<span class="hours">${currentTime.hours}</span>` : ''}
                <span>${item.date}</span>
            </div>
            <div class="floors">
                <div class="floor f-7">
                    <div class="rows">
                        <div class="room r-1"><button class="select-room s s-60">+</button></div>
                        <div class="room r-2"><button class="select-room s s-60">+</button></div>
                        <div class="room r-3"><button class="select-room s s-60">+</button></div>
                        <div class="room r-4"><button class="select-room s s-60">+</button></div>
                    </div>
                </div>
                <div class="floor f-6">
                    <div class="rows">
                        <div class="room r-1"><button class="select-room s s-60">+</button></div>
                        <div class="room r-2"><button class="select-room s s-60">+</button></div>
                        <div class="room r-3"><button class="select-room s s-60">+</button></div>
                        <div class="room r-4"><button class="select-room s s-60">+</button></div>
                        <div class="room r-5"><button class="select-room s s-60">+</button></div>
                    </div>
                </div>
            </div>
        </div>
        `
        render += renderString
    })
    addStyle(currentTime)
    document.querySelector('.timeline').innerHTML = render
    data.map((item, index) => {
        // console.log(item, index)
        if(item.events) {
            item.events.map((event, i) => {
                if(item.date == event.hoursIncluded[0]) {
                    document.querySelector(`
                    .ta-${index} .f-${event.floor} .r-${event.room.id}
                    `).innerHTML = `<button class="select-room s s-${60 - event.start.time.minutes}">+</button>`
                    if(event.id == 2) {
                        console.log('____________')
                        console.log('Ставлю начало Hackathon')
                        console.log('s-', 60 - event.start.time.minutes)
                        console.log('____________')
                    }
                } else if (item.date == event.hoursIncluded[event.hoursIncluded.length - 1]) {
                    document.querySelector(`
                    .ta-${index} .f-${event.floor} .r-${event.room.id}
                    `).innerHTML = `<button class="select-room s s-${event.end.time.minutes}-r">+</button>`
                    if (event.id == 2) {
                        console.log('____________')
                        console.log('Ставлю конец Hackathon')
                        console.log('s-', event.start.time.minutes)
                        console.log('____________')
                    }
                } else {
                    document.querySelector(`
                    .ta-${index} .f-${event.floor} .r-${event.room.id}
                    `).innerHTML = ''
                }



                // if(event.hoursIncluded.length > 2) {
                //     var button = document.createElement('button')
                //     button.classList.add('select-room', 's', 's-60')
                //     button.innerText = '+'
                //     for (var i = 1; i < event.hoursIncluded.length - 2; i++) {
                //         document.querySelector(`
                //         .time-area:nth-of-type(${event.hoursIncluded[i]}) .f-${event.floor} .r-${event.room.id}
                //         `).appendChild(button)
                //     }
                // }
                // document.querySelector(`
                // .time-area:nth-of-type(${event.hoursIncluded[event.hoursIncluded.length - 1]}) .f-${event.floor} .r-${event.room.id}
                // `).innerHTML = `<button class="select-room s s-${event.end.time.minutes}>+</button>`
            })
        }
    })
    // 
}

function setTimeline() {
    fetchEvents(0).then(res => {
        var currentTime = determineTime()
        var renderData = computeDataToRender(currentTime, res)
        console.log(renderData)
        renderTimelines(renderData, currentTime)
        console.log(document.querySelectorAll('button.select-room'))
    })
}

setTimeline()
