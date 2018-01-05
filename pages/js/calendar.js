// Глобальные переменные для переключения дней и месяцев
var currentDay = new Date().getDay(),
    monthIndex = 2

// Узнаю, сколько дней в месяце
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate()
}

// Получаю имя месяца по индексу
function getMonthName(month) {
    var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ]

    return monthNames[month]
}

// Получаю индекс месяца по имени
function getMonthIndex(name) {
    var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ]

    return monthNames.indexOf(name)
}

// Заполняю информацию о месяце
function getMonthInfo(month, year) {
    // Проверка на январь и декабрь
    if (month == -1) {
        year -= 1
        month = 11
    } else if (month == 13) {
        year += 1
        month = 0
    }

    var daysAmount = daysInMonth(month, year),
        days = [],
        name = getMonthName(month)

    iterationDay = 1
    iterated = 1
    for(var i = 1; i <= 6; i++) {
        var week = []
        for(var j = iterationDay; j <= daysAmount; j++) {
            week.push(j)
            iterationDay++
            if ((iterationDay - 1) % 7 == 0) {
                break
            }
        }
        days.push(week)
    }

    return {
        name: name,
        days: days.filter(week => week.length != 0)
    }
}

// Функция смены дня
function changeDay({ indexOfWeek, indexOfDay, indexOfMonth, month }, arrow = false) {
    // Изменяю тайтл даты в левой менюшке
    var day = month.days[indexOfWeek][indexOfDay],
        monthName = month.name.toLowerCase().slice(0, 3) + '.',
        h5 = `${day} ${monthName} &#183;`,
        currentMonth = getMonthName(new Date().getMonth())

    currentDay = month.days[indexOfWeek][indexOfDay]
    monthIndex = indexOfMonth

    if (month.name == currentMonth && day == (new Date().getDay() + 1) ) {
        h5 += ' Завтра'
    } else if (month.name == currentMonth && (day == new Date().getDay() - 1)) {
        h5 += ' Вчера'
    } else if (month.name == currentMonth && day == new Date().getDay()) {
        h5 += ' Сегодня'
    } else {
        monthName = month.name.toLowerCase().slice(0, month.name.length - 1) + 'я'
        h5 = `${day} ${monthName}`
    }

    document.querySelector('.left-bar .date h5').innerHTML = h5

    // Меняю активную клетку таблицы
    var today = document.querySelector('td.today')
    if (today)
        today.classList.remove('today')
    var newToday = document.querySelector(`
        .month:nth-of-type(${indexOfMonth})
        tr:nth-of-type(${indexOfWeek + 1})
        td:nth-of-type(${indexOfDay + 1})
    `)
    if(newToday)
        newToday.classList.add('today')
}

// Добавляю обработчик клика к клетке таблицы
function addEventListener(element, info) {
    element.addEventListener('click', () => changeDay(info))
}

// Создаю месяц
function createMonth(monthInfo, current = false, index) {
    var month = document.createElement('div')
    month.classList.add('month')
    month.innerHTML = `
        <div class="name">
            ${monthInfo.name}
        </div>
    `
    var table = document.createElement('table')
    monthInfo.days.map(week => {
        var tr = document.createElement('tr')
        week.map(day => {
            var td = document.createElement('td')
            // Отмечаю сегодня на календаре
            if(current && day == new Date().getDay()) {
                td.classList.add('today')
            }
            td.innerText = day
            addEventListener(td, {
                indexOfWeek: monthInfo.days.indexOf(week),
                indexOfDay: week.indexOf(day),
                month: monthInfo,
                indexOfMonth: index
            })
            tr.appendChild(td)
        })
        table.appendChild(tr)
    })
    month.appendChild(table)
    
    document.querySelector('.calendar .wrapper').appendChild(month)
}

// Показываю или скрываю календарь
function toggleCalendar() {
    var calendar = document.querySelector('.calendar')
    if(calendar.classList.contains('hide')) {
        calendar.classList.remove('hide')
    } else {
        calendar.classList.add('hide')
    }
}

// Переключаю на следующий день
function nextDay(months) {
    var monthInfo = {}
    months[monthIndex - 1].days.map(week => {
        for (let day of week) {
            if (day == (currentDay + 1)) {
                monthInfo = {
                    month: months[monthIndex - 1],
                    indexOfWeek: months[monthIndex - 1].days.indexOf(week),
                    indexOfDay: week.indexOf(currentDay + 1),
                    indexOfMonth: monthIndex
                }
                break
            }
        }
    })
    currentDay++
    if (currentDay > daysInMonth(getMonthIndex(months[monthIndex - 1].name), new Date().getFullYear()) && monthIndex != 3) {
        currentDay = 0
        monthIndex++
        monthInfo = {
            month: months[monthIndex - 1],
            indexOfWeek: 0,
            indexOfDay: 0,
            indexOfMonth: monthIndex
        }
        changeDay(monthInfo, true)
    } else if (currentDay > daysInMonth(new Date().getMonth() + 1, new Date().getFullYear()) && monthIndex == 3) {
        return
    } else {
        changeDay(monthInfo, true)
    }
}

// Переключаю на предыдущий день
function prevDay(months) {
    var monthInfo = {}
    months[monthIndex - 1].days.map(week => {
        for (let day of week) {
            if (day == (currentDay - 1)) {
                monthInfo = {
                    month: months[monthIndex - 1],
                    indexOfWeek: months[monthIndex - 1].days.indexOf(week),
                    indexOfDay: week.indexOf(currentDay - 1),
                    indexOfMonth: monthIndex
                }
                break
            }
        }
    })
    currentDay--
    if (currentDay < 1 && monthIndex != 1) {
        monthIndex--
        currentDay = daysInMonth(getMonthIndex(months[monthIndex - 1].name), new Date().getFullYear())
        monthInfo = {
            month: months[monthIndex - 1],
            indexOfWeek: months[monthIndex - 1].days.length - 1,
            indexOfDay: months[monthIndex - 1].days[months[monthIndex - 1].days.length - 1].length - 1,
            indexOfMonth: monthIndex
        }
        changeDay(monthInfo, true)
    } else if (currentDay < 1 && monthIndex == 1) {
        return
    } else {
        changeDay(monthInfo, true)
    }
}

// Основная функция, заполняющая календарь
function fillCalendar() {
    var date = new Date(),
        year = date.getFullYear(),
        currentMonth = getMonthInfo(date.getMonth(), year),
        previousMonth = getMonthInfo(date.getMonth() - 1, year),
        nextMonth = getMonthInfo(date.getMonth() + 1, year)

    createMonth(previousMonth, false, 1)
    createMonth(currentMonth, true, 2)
    createMonth(nextMonth, false, 3)
    
    document.querySelector('.date h5').addEventListener('click', () => toggleCalendar())
    document.querySelector('.next').addEventListener('click', () => {
        nextDay([previousMonth, currentMonth, nextMonth])
    })
    document.querySelector('.previous').addEventListener('click', () => {
        prevDay([previousMonth, currentMonth, nextMonth])
    })
}

fillCalendar()