// Функция для преобразования данных типа Date в удобный мне формат
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

// Обрабатываю полученные с сервера данные об эвентах
function handleEvents(data) {
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
            hoursIncluded: hoursIncluded(event.dateStart.slice(11, 13), event.dateEnd.slice(11, 13)),
            users: event.users
        }
        newData.push(eventInfo)
    })
    return newData
}

// Функция, симулирующая получение данных с сервера
function fetchEvents(ms) {
    var events = [
        {
            "id": "1",
            "title": "ШРИ 2018 - начало",
            "dateStart": "2017-12-28T12:16:23.309Z",
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
            "dateEnd": "2017-12-29T21:57:23.309Z",
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
    events = handleEvents(events)
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(events), ms)
    })
}

function determineColAmount(eventId) {
    var amount = document.querySelectorAll(`.event-${eventId}`).length
    return amount
}

function positionArrow(e) {
    var css = `
        .tooltip:before {
            left: ${e.layerX}px !important;
        }
    `,
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

function highlightEventCols(id, amount) {
    for(var i = 0; i < amount; i++) {
        document.querySelectorAll(`.event-${id}`)[i].classList.add('active')
    }
}

function monthNumToText(number) {
    const months = [
        'января', 'февраля', 'марта', 
        'апреля', 'мая', 'июня', 
        'июля', 'августа', 'сентября', 
        'октября', 'ноября', 'декабря'
    ]
    return months[number - 1]
}

function createTooltip(e, event) {
    console.log(event)
    var tooltip = document.createElement('div'),
        amount = determineColAmount(event.id)
    tooltip.classList.add('tooltip')
    positionArrow(e)
    highlightEventCols(event.id, amount)
    tooltip.innerHTML = `
        <div class="header">
            <span class="title">${event.title}</span>
             <div class="icon-container">
                <img src="desktop-assets/edit-gray.png">
            </div>
        </div>
        <div class="time">
            <span>
                ${event.start.day} ${monthNumToText(event.start.month)},
                ${event.start.time.hours}:${event.start.time.minutes}–${event.end.time.hours}:${event.end.time.minutes}
            </span>
            <span class="dot">&#183;</span>
            <span>
                ${event.room.title}
            </span>
        </div>
        <div class="participants">
            <div class="avatar">
                <img src="desktop-assets/close.svg">
            </div>
            <span class="name">Дарт Вейдер</span>
            <span class="left">и 12 участников</span> 
        </div>
    `
    e.target.appendChild(tooltip)
}

fetchEvents(0).then(res => {
    document.querySelectorAll('.event-1')[0].addEventListener('click', e => createTooltip(e,  res[0]))
    document.querySelectorAll('.event-1')[1].addEventListener('click', e => createTooltip(e, res[0]))
    document.querySelectorAll('.event-1')[2].addEventListener('click', e => createTooltip(e, res[0]))
})


