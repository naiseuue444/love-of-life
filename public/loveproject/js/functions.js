var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    var winW = $(window).width();
    var scale = winW < 768 ? Math.min(1, (winW - 20) / 670) : 1;
    var heartW = Math.round(670 * scale);
    var heartH = Math.round(625 * scale);

    $loveHeart = $("#loveHeart");
    $loveHeart.css({ width: heartW + 'px', height: heartH + 'px' });

    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = heartW;
    gardenCanvas.height = heartH;
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    window.heartScale = scale;
    window.offsetX = heartW / 2;
    window.offsetY = heartH / 2 - (55 * scale);

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var s = window.heartScale || 1;
    var x = (19.5 * s) * (16 * Math.pow(Math.sin(t), 3));
    var y = - (20 * s) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array((window.offsetX || 335) + x, (window.offsetY || 257) + y);
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this);
            var destination = $ele[0];
            var sourceHtml = $ele.html();
            $ele.html('');
            
            var temp = document.createElement('div');
            temp.innerHTML = sourceHtml;

            function typeNode(sourceNode, targetParent, onComplete) {
                var children = Array.from(sourceNode.childNodes);
                var childIndex = 0;

                function nextChild() {
                    if (childIndex >= children.length) {
                        if (onComplete) onComplete();
                        return;
                    }

                    var child = children[childIndex++];
                    if (child.nodeType === Node.TEXT_NODE) {
                        var text = child.textContent;
                        var textNode = document.createTextNode('');
                        targetParent.appendChild(textNode);
                        var charIndex = 0;

                        var textInterval = setInterval(function() {
                            if (charIndex < text.length) {
                                textNode.textContent += text.charAt(charIndex++);
                                destination.scrollTop = destination.scrollHeight;
                            } else {
                                clearInterval(textInterval);
                                nextChild();
                            }
                        }, 60);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        var newElem = child.cloneNode(false);
                        targetParent.appendChild(newElem);
                        typeNode(child, newElem, function() {
                            nextChild();
                        });
                    } else {
                        nextChild();
                    }
                }

                nextChild();
            }

            typeNode(temp, destination);
        });
        return this;
    };
})(jQuery);

function timeElapse(date){
    var current = new Date();
    var years = current.getFullYear() - date.getFullYear();
    var tempDate = new Date(date.getTime());
    tempDate.setFullYear(date.getFullYear() + years);

    if (current < tempDate) {
        years--;
        tempDate = new Date(date.getTime());
        tempDate.setFullYear(date.getFullYear() + years);
    }

    var diffSeconds = Math.max(0, Math.floor((current.getTime() - tempDate.getTime()) / 1000));
    var days = Math.floor(diffSeconds / (3600 * 24));
    diffSeconds %= (3600 * 24);

    var hours = Math.floor(diffSeconds / 3600);
    diffSeconds %= 3600;

    var minutes = Math.floor(diffSeconds / 60);
    var seconds = diffSeconds % 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + years + "</span> years <span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
    $("#elapseClock").html(result);
}

function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

function adjustWordsPosition() {
    var isMobile = $(window).width() < 768;
    var topOffset = (window.offsetY || 250) - (isMobile ? 65 : 35);
    $('#words').css({
        position: 'absolute',
        top: topOffset + 'px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '75%' : '85%',
        textAlign: 'center'
    });
}

function adjustCodePosition() {
    if ($(window).width() >= 768) {
        $('#code').css("margin-top", Math.max(0, ($("#garden").height() - $("#code").height()) / 2));
    }
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
}