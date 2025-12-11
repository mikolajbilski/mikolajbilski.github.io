class Losowanko {
    constructor(num, t1, t2) {
        this.num = num
        this.t1 = t1
        this.t2 = t2
    }
}

class Special {
    // use "*" for wildcard (if a special doesn't depend on the specific field of losowanko)
    constructor(num, t1, t2, audio_name, author) {
        this.num = num
        this.t1 = t1
        this.t2 = t2
        this.audio_name = audio_name
        this.author = author
    }

    check_match(losowanko) {
        return (this.num === "*" || this.num === losowanko.num.toString()) &&
               (this.t1 === "*" || this.t1 === losowanko.t1) &&
               (this.t2 === "*" || this.t2 === losowanko.t2)
    }
}

var specials = [
    new Special("*", "jednowątkowych", "*", "jaki-jestes-wiciu", "wiciu"),
    new Special("*", "*", "wiader", "kaszelek", "wiciu"),
    new Special("*", "wkurwionych", "*", "rage", "smerf"),
    new Special("*", "warszawskich", "raperów", "karconoszingway", "*"),
    new Special("*", "*", "kolosów", "kolos", "*"),
    new Special("*", "rozjebanych", "piw", "piwo", "zloty"),
    new Special("*", "boskich", "przykazań", "przykazania", "*"),
    new Special("*", "najbardziej chujowych", "polskich zespołów", "skoczek", "beczka"),
    new Special("*", "*", "grześków tyci", "stopy", "domi"),
    new Special("*", "bezrobotnych", "bezrobotnych", "aha", "beczka"),
    new Special("*", "*", "uderzenie piszczelem w metalową rurę challenge", "ała-kurwa", "*")
]


// returns the object representing the special temacik, containing .audio_src and .author (strings)
function get_special(losowanko) {   
    for (var special of specials) {
        if (special.check_match(losowanko)) {
            return special
        }
    }
    return null
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var w1 = [];
var w2 = [];
var ryjce = ["majki", "domi", "beczka", "karas", "zloty", "juras", "zoha", "wiciu", "frasiu"];
$.ajaxSetup({
    async: false
});

$.getJSON("database.json", function(json) {
    w1 = json.w1;
    w2 = json.w2;
});

var lottSpeed = 50;
var lottTime = 600;
var los1 = true;
var los2 = true;
var los3 = true;
var time = 0;
var modal = document.getElementById('myModal');
var modal_close = document.getElementsByClassName("close")[0];
var losowania = 0;
var specjalne = 0;
var volume = 1;

var a1 = document.getElementById("a1");
var a2 = document.getElementById("a2");
var a3 = document.getElementById("a3");
var a4 = document.getElementById("a4");
var b1 = document.getElementById("b1");
var b2 = document.getElementById("b2");
var b3 = document.getElementById("b3");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");
var ryjceDiv = document.getElementById("ryjce");
var progress = document.getElementById("progress");
var stats = document.getElementById("stats");

if (localStorage.volume) {
    volume = Number(localStorage.volume);
    document.getElementById("volume").value = volume;
    setVolume(volume);
}

if (localStorage.losowania) {
    losowania = Number(localStorage.losowania);
    specjalne = Number(localStorage.specjalne);
}

stats.innerHTML = "twoje losowania: " + losowania + ", wylosowałeś/aś " + specjalne + " specjalnych tematów";
var started = false;

function download() {
    document.getElementById("img01").innerHTML = "";
    html2canvas(document.getElementById("machine")).then(canvas => {
        canvas.toBlob(function(blob) {
            saveAs(blob, "losowanko_" + losowania + ".png");
        });
    });
}

function setVolume(value) {
    a1.volume = value;
    a2.volume = value;
    a3.volume = value;
    a4.volume = value;
    localStorage.volume = value;
}

function losu_start() {
    if (started == false) {
        started = true;
        a3.pause();
        a4.pause();
        a3.currentTime = 0;
        a4.currentTime = 0;
        b1.innerHTML = "";
        b2.innerHTML = "";
        b3.innerHTML = "";
        a1.play();
        lottSpeed = 50;
        lottTime = 600;
        los1 = true;
        los2 = true;
        los3 = true;
        time = 0;
		p1.style.width = "0%";
		p2.style.width = "0%";
		p3.style.width = "0%";
        setTimeout(losowanko, 3300);
    };
}

function losowanko() {
    a2.play();

    if (los1) {
        b1.innerHTML = Math.floor(getRandomArbitrary(2, 11));
		p1.style.width = (time/80)*100 + "%";
	}

    if (los2) {
        if (b1.innerHTML == 3) {
            b2.innerHTML = w1[Math.floor(getRandomArbitrary(0, w1.length))];
        }
        else {
            b2.innerHTML = w1[Math.floor(getRandomArbitrary(0, w1.length))];
        }
		p2.style.width = ((time-80)/20)*100 + "%";
	}

    if (los3) {
        b3.innerHTML = w2[Math.floor(getRandomArbitrary(0, w2.length))];
		p3.style.width = ((time-100)/20)*100 + "%";
	}

    ryjceDiv.innerHTML = "temacik dla: <img height='100px' class='shadowed' src='img/" + ryjce[Math.floor(getRandomArbitrary(0, ryjce.length))] + ".png'/>";
    time += 1;

    if (time == 80) {
		p1.style.width = "100%";
        los1 = false;
	}

    if (time == 100) {
		p2.style.width = "100%";
        los2 = false;
	}

    if (time == 120) {
		p3.style.width = "100%";
        los3 = false;
	}
    if (los3 == true) {
        progress.innerHTML = "trwa losowanko (" + Math.floor((time / 120) * 100) + "%)";
        setTimeout(losowanko, lottSpeed);
    }
    else {
        progress.innerHTML = "losowanko zakonczone, jeszcze raz?";
        var losowanko_res = new Losowanko(b1.innerHTML, b2.innerHTML, b3.innerHTML)
        var special = get_special(losowanko_res)
        if (special) {
            a4.src = "sounds/" + special.audio_name + ".mp3"
            a4.play();

            if (special.author != '*') {
                ryjceDiv.innerHTML = "temacik dla: <img height='100px' class='shadowed' src='img/" + special.author + ".png' />";
            }

            specjalne += 1;
        }
        else {
            a3.play();
        }
        a2.pause();
        a2.currentTime = 0;
        started = false;
        losowania += 1;
        stats.innerHTML = "twoje losowania: " + losowania + ", wylosowałeś/aś " + specjalne + " specjalnych tematów";
        localStorage.losowania = losowania;
        localStorage.specjalne = specjalne;
    }
}
modal_close.onclick = function() {
    modal.style.display = "none";
}