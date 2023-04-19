setInterval(function() {
    var videoPlayer = document.getElementById("animationPlayer");
    if(videoPlayer != null && videoPlayer != undefined) {
        if(screen.width < 600) {
            if(!videoPlayer.src.includes("assets/assets/animations/cosex_intro_ver.mp4")) {
                videoPlayer.src="assets/assets/animations/cosex_intro_ver.mp4";
            }
        }
        if(screen.width > 600) {
            if(!videoPlayer.src.includes("assets/assets/animations/cosex_intro.mp4")) {
                videoPlayer.src="assets/assets/animations/cosex_intro.mp4";
            }
        }  
    }
},100);