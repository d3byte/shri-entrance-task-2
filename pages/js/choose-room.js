function chooseRoom(roomInfo) {
    document.querySelector('.labeled-room.list').classList.add('hide')
    var room = document.createElement('div')
    room.classList.add('labeled-room', 'active')
    room.innerHTML = `
        <label>Ваша переговорка</label>
        <div class="room">
            <div class="info">
                <span class="time">16:00–16:30</span>
                <span class="location">${roomInfo.title} &#183; ${roomInfo.floor} этаж</span>
            </div>
            <img src="desktop-assets/close-white.svg" onclick="cancelRoom()">
        </div>
    `
    document.querySelector('.room-interface').appendChild(room)
}

function cancelRoom() {
    document.querySelector('.labeled-room.active').remove()
    document.querySelector('.labeled-room.list').classList.remove('hide')
}