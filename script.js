var currentSong = new Audio();
let timeUpdater;
console.log(currentSong);
console.log(currentSong.duration);
async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/Spotify%c20clone/songs/');
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const e = as[i];
        if (e.href.endsWith('mp3')) {
            songs.push(e.href.split("/songs/")[1]);
        }
    }
    return songs;
}


function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

// update currentTime
function currentTimeUpdate() {
    document.querySelector(".currentTime").innerHTML = `\\${formatTime(currentSong.currentTime)}`;
    document.querySelector(".circle").style.left = Math.floor(currentSong.currentTime / currentSong.duration * 100) + "%";
}

function updateTime() {
    // show total duration
    document.querySelector(".duration").innerHTML = `${formatTime(currentSong.duration)}`;

    // clear any previous evntlistner
    currentSong.removeEventListener("timeupdate", currentTimeUpdate)

    // update realtime duration
    currentSong.addEventListener("timeupdate", currentTimeUpdate)
    currentTimeUpdate();

    // add event listner to seekBar

    document.querySelector(".seekBar").addEventListener("click", e => {
        console.log(e.target.getBoundingClientRect(), e.offsetX);
        let xPosition = e.offsetX;
        let width = e.target.getBoundingClientRect().width;
        let seek = Math.floor(xPosition / width * 100);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration * 100) + "%";
        console.log(seek);
        currentSong.currentTime = (seek / 100) * currentSong.duration;
    })

    // sound control
    document.querySelector(".soundBar").addEventListener("click", e => {
        console.log(e.target.getBoundingClientRect(), e.offsetX);
        let xPosition = e.offsetX;
        let width = e.target.getBoundingClientRect().width;
        let seek = Math.floor(xPosition / width * 100);
        document.querySelector(".soundCircle").style.left = seek + "%";
        console.log(seek);
        currentSong.volume = seek / 100;
    })
}

function updateInfo(track) {
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    currentSong.addEventListener("loadeddata", () => {
        // set initial time to zero
        document.querySelector(".duration").innerHTML = `00:00`;
        document.querySelector(".currentTime").innerHTML = `\\00:00`;
        updateTime();
        // Cheak if the song ended
    }, { once: true });
}


const playMusic = (track) => {
    // let audio = new Audio("songs/" + track);

    currentTrackIndex = songs.indexOf(track);
    console.log(currentTrackIndex);
    currentSong.src = "songs/" + track;
    currentSong.play();
    document.getElementById("play").classList.replace("fa-play", "fa-pause");
    updateInfo(track);
    currentSong.addEventListener("ended", () => {
        document.getElementById("play").classList.replace("fa-pause", "fa-play");
        // currentSong.removeEventListener("timeupdate")
        play.addEventListener("click", () => {
            updateTime();
        }, { once: true })
    })
}

let songs = []
let currentTrackIndex = 0;
async function main() {
    // Get List of all songs
    songs = await getSongs();
    console.log(songs);

    // set deault song name
    document.querySelector(".songInfo").innerHTML = songs[0];

    // Show all songs
    let songUL = document.querySelector(".songList").getElementsByTagName('ul')[0];

    for (const song of songs) {
        songUL.innerHTML += `
    <li data-song="${song}">
        <img src="https://i.scdn.co/image/ab67616d00001e024a61adae73edffa174bd0006" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Artist Name</div>
        </div>
        <div class="playNow">
            <span style="font-size: 0.8rem;">Play Now</span>
            <i class="fa-solid fa-play"></i>
        </div>
    </li>
    `;
        console.log(song);
    }



    // attach event listner to song
    let songList = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
    songList.forEach(e => {
        e.addEventListener("click", (element) => {
            // playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())

            playMusic(e.getAttribute("data-song"));

            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
        })

    })


    // attach an event listner to play, previous, next buttons
    let prev = document.getElementById("previous");
    let play = document.getElementById("play");
    let next = document.getElementById("next");

    play.addEventListener("click", () => {
        if (!currentSong.src || currentSong.src.endsWith("//")) {
            currentSong.src = "/songs/" + songs[0];
            currentSong.addEventListener("loadeddata", () => {
                updateTime();
                currentSong.play();
            }, { once: true })
        }
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").classList.replace("fa-play", "fa-pause");
        }
        else {
            currentSong.pause();
            document.getElementById("play").classList.replace("fa-pause", "fa-play");
        }
    })

    prev.addEventListener("click", () => {
        if (currentTrackIndex <= 0) {
            currentTrackIndex = songs.length - 1;
        } else {
            currentTrackIndex--;
        }
        playMusic(songs[currentTrackIndex]);
    });

    next.addEventListener("click", () => {
        if (currentTrackIndex >= songs.length - 1) {
            currentTrackIndex = 0;
        } else {
            currentTrackIndex++;
        }
        playMusic(songs[currentTrackIndex]);
    });

}



main();


let toggle = document.querySelector(".toggle");
let cross = document.querySelector(".fa-xmark");
let left = document.querySelector(".left")
toggle.addEventListener("click", () => {
    left.classList.toggle("hidden")
    left.classList.remove("gap-10px");
})
cross.addEventListener("click", () => {
    left.classList.toggle("hidden")
})
