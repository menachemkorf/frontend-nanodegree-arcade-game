var n = 1;
function repeat(){
    n++;
    $('p').append(n);
    setTimeout(repeat2, 1000);
}
function repeat2(){
    n++;
    $('p').append(n);
    setTimeout(repeat3, 1000);
}
function repeat3(){
    n++;
    $('p').append(n);
    //requestAnimationFrame(repeat3);
}
repeat();