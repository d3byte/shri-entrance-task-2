// Функция, симулирующая получение данных с сервера
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

function measureTooltip(id) {
    var widths = '',
        tooltipWidth = 0
    var iterations = document.querySelectorAll(`.event-${id}`).length
    for (var i = 0; i < iterations; i++) {
        var width = document.querySelectorAll(`.event-${id} button`)[i]
        if (width) {
            width = window.getComputedStyle(width, null).getPropertyValue('width')
        } else {
            width = window.getComputedStyle(document.querySelectorAll(`.event-${id}`)[i], null)
                .getPropertyValue('width')
        }
        widths += width
    }
    widths = widths.split('px').filter(item => item != "")
    widths.map(width => tooltipWidth += parseInt(width))
    return {
        width: tooltipWidth,
        widths: widths
    }
}

function createTooltip(event) {
    var tooltip = document.createElement('div'),
        measures = measureTooltip(event.id)
    tooltip.classList.add('tooltip')
    tooltip.innerHTML = `
        
    `
    tooltip.style.left = '-' + (measures.width - 5) + 'px'
    document.querySelectorAll(`.event-${event.id}`)[1].appendChild(tooltip)
}

fetchEvents(0).then(res => {
    setTimeout(() => createTooltip(res[2]), 1000)
})


