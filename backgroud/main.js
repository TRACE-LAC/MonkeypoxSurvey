function showApp() {
    alert("The audio has ended");
}
setInterval(function() {
    var videoPlayer = document.getElementById("animationPlayer");
    if(screen.width < 600) {
        
        if(!videoPlayer.src.includes("assets/cosex_intro_ver.mp4")) {
            videoPlayer.src="assets/cosex_intro_ver.mp4";
        }
        videoPlayer.width = screen.width;
    }
    if(screen.width > 900) {
        if(!videoPlayer.src.includes("assets/cosex_intro.mp4")) {
            videoPlayer.src="assets/cosex_intro.mp4";
        }
        videoPlayer.width = screen.width;
    }  
},1000);