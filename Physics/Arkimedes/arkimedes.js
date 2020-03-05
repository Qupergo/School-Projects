

function displace(distance) {
    fluidDensity = 997
    gravity = 9.82

    mass = 0.18
    diameter = .3

    radius = diameter/2

    let displacedVolume;

    if (distance >= diameter) {
        displacedVolume = Math.pow(radius, 3)*Math.PI
    }

    else {
        displacedVolume = ((Math.PI*Math.pow(distance, 2))/3)*(3*radius - distance)
    }

    console.log(displacedVolume)


    force = gravity * fluidDensity * displacedVolume - mass*gravity
    move(distance)
    console.log(force)

}

function move(distance) {
    var elem = document.querySelector(".object");   
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {
        if (pos == distance*10) {
            clearInterval(id);
        } else {
            pos++;
            elem.style.top = pos + "px"; 
        }
    }
}


displace(50);