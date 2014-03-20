// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

 var controller;
            $(document).ready(function($) {
                // init controller
                controller = new ScrollMagic();

                // build scene for the header content

                var scene = new ScrollScene({duration: 1000})
                .addTo(controller);

                // call scene
                new ScrollScene ({
                  triggerElement: ".trigger1",
                  duration: $(window).height() + 900,
                  offset: -350
              })
                .addTo(controller)
                .triggerHook("onCenter")
                .setTween(new TimelineMax().add([
                  TweenMax.fromTo(".trigger1 .layer1", 1, {scale: 1, top: "100%"}, {top: "-120%", ease: Linear.easeNone}),
                  TweenMax.to(".trigger1 #top", 1, {backgroundPosition: "0 -160%", ease: Linear.easeNone})
                  ]));


                // #therm Scene
                new ScrollScene ({
                  triggerElement: ".trigger2",
                  duration: $(window).height() + 1500,
                  offset: -750
              })
                .addTo(controller)
                .triggerHook("onCenter")
                .setTween(new TimelineMax().add([
                  TweenMax.fromTo(".trigger2 .layer2", 1, {scale: 1, top: "100%"}, {top: "-120%", ease: Linear.easeNone}),
                  TweenMax.to(".trigger2 #therm", 1, {backgroundPosition: "0 -160%", ease: Linear.easeNone})
                  ]));


                // pinning the navigation

                var scene = new ScrollScene({
                    triggerElement: "#nav",
                    duration: 10000,
                    offset: 330
                })
                .setPin(".pin2")
                .addTo(controller);


            });