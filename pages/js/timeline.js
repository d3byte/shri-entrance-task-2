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
    for (var i = currentTime.hours + 1; i < 24; i++) {
        data.push(i)
    }
    for (var i = 0; i < data[0]; i++) {
        data.push(i)
    }
    console.log(data)
    return data
}

function addStyle(currentTime) {
    var css = `.current::after { 
                    content: '';
                    position: absolute;
                    width: 1px;
                    right: -${currentTime.minutes}px;
                    top: 15px;
                    height: calc(100% - 15px);
                    background: blue;
                    border-right: 1px solid #007DFF;
                }

                main.main-page .right-bar .timeline .time-area.current .timing > span:last-of-type {
                    margin-right: -${23 + parseInt(currentTime.minutes)}px;
                }

                @media only screen and (-webkit-min-device-pixel-ratio: 0) { 
                    .current::before {
                        content: '';
                        position: absolute;
                        width: 1px;
                        left: ${currentTime.minutes}px;
                        top: 15px;
                        height: calc(100% - 15px);
                        background: blue;
                        border-right: 1px solid #007DFF;
                    }

                    .current::after {
                        content: none !important;
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
    for(var item of data) {
        console.log(item)
        var renderString = `
        <div class="time-area ${item == currentTime.time ? 'current' : ''}">
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
        render += renderString
    }
    addStyle(currentTime)
    document.querySelector('.timeline').innerHTML = render
}

function setTimeline() {
    var currentTime = determineTime()
    var renderData = computeDataToRender(currentTime)
    renderTimelines(renderData, currentTime)
}

setTimeline()