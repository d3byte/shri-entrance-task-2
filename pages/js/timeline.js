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

function computeDataToRender(currentTime) {
    var data = []
    for (var i = currentTime.hours - 3; i <= currentTime.hours; i++) {
        if (i == currentTime.hours) {
            data.push(currentTime.time)
            continue
        }
        if(i < 0) {
            var correctHour = 24 - Math.abs(i)
            data.push(correctHour)
            continue
        }
        data.push(i)
    }
    for (var i = currentTime.hours + 1; i < data[0]; i++) {
        data.push(i)
    }
    console.log(data)
    return data
}

function addStyle(currentTime) {
    var styleTag = document.getElementById("pseudo")
    var sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet
    if (sheet.insertRule) {
        sheet.insertRule(`.time-area.current:after { right: ${currentTime.minutes}px }`, 0)
        return
    } else {
        sheet.addRule(`.time-area.current:after { right: ${currentTime.minutes}px }`, 0)
        return
    } 
}

function renderTimelines(data, currentTime) {
    var render = ''
    for(var item of data) {
        var renderString
        if(item == currentTime.time) {
            renderString = `
            <div class="time-area current">
                <div class="timing">
                    <span>${item}</span>
                </div>
                <div class="floors">
                    <div class="floor">
                        <div class="rows">
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                        </div>
                    </div>
                    <div class="floor">
                        <div class="rows">
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                        </div>
                    </div>
                </div>
            </div>
            `
        } else {
            renderString = `
            <div class="time-area">
                <div class="timing">
                    <span>${item}</span>
                </div>
                <div class="floors">
                    <div class="floor">
                        <div class="rows">
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                        </div>
                    </div>
                    <div class="floor">
                        <div class="rows">
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                            <div class="room"></div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
        render += renderString
    }
    document.querySelector('.timeline').innerHTML = render
}

function setTimeline() {
    var currentTime = determineTime()
    var renderData = computeDataToRender(currentTime)
    renderTimelines(renderData, currentTime)
}

setTimeline()