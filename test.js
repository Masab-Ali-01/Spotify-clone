let aduio = new Audio("songs/295.mp3");
aduio.play()
aduio.addEventListener("loadeddata",()=>{
    console.log(aduio.duration)
})