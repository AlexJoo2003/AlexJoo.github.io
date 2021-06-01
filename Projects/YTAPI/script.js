$(document).ready(function(){

    var key = "AIzaSyBdu7N5rwh0ngR0sHY6tdY4siypgbciH9M";
    var channelId = "UC7_YxT-KID8kRbqZo7MyscQ";
    var URL = "https://www.googleapis.com/youtube/v3/search";

    var options = {
        part: "snippet",
        type: "video",
        key: key,
        maxResults: 64,
        channelId: "",
    }
    

    function loadVids(){
        channelId = $("input").val();
        options["channelId"] = channelId;
        $.getJSON(URL, options, function(data){
            var usedVids = getRandom(data["items"], 4);
            $("main").empty();

            usedVids.forEach(item => {
                var vid = '<iframe src="https://www.youtube.com/embed/' + item["id"]["videoId"] + '" title="YouTube video player" frameborder="0"></iframe>'
                $("main").append(vid);
            });
        });
    }

    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    $(".container").click(function(){  
        toggleSlide();  
    });
    $("button").click(function(){
        toggleSlide();
        loadVids();
    });
    
    $("body").keyup(function(e){
        if(e.keyCode == 32){
            toggleSlide();
        }
    });
    $("input").keyup(function(e){
        console.log("test");
        if(e.keyCode == 13){
            console.log("test2");
            toggleSlide();
            loadVids();
        }
    });

    
    function toggleSlide(){
        if ($("section").is(":visible")){
            $("section").slideUp();
        }
        else{
            $("section").slideDown();
        }
    }
});