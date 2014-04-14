/**
 * AnimaDrag
 * Animated jQuery Drag and Drop Plugin
 * Version 0.5.1 beta
 * Author Abel Mohler
 * Released with the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * MODIFIED VIA FRESHLINE && V4 -- 03.09.2011
 */
(function($){
    $.fn.animaDrag = function(o, callback) {
        var defaults = {
            speed: 400,
            interval: 300,
            easing: null,
            cursor: 'point',
            boundary: document.body,
			boundary_offset:0,
            grip: null,
			offset_x:0,
			offset_y:0,
            overlay: true,
			direction:'vertical',
			dragit:null,
			afterDiv: null,
            after: function(e) {},
            during: function(e) {},
            before: function(e) {},
            afterEachAnimation: function(e) {}
        }
        if(typeof callback == 'function') {
            defaults.after = callback;
        }
        o = $.extend(defaults, o || {});
        return this.each(function() {
            var id, startX, startY, draggableStartX, draggableStartY, dragging = false, Ev, draggable = o.dragit,
            grip = ($(this).find(o.grip).length > 0) ? $(this).find(o.grip) : $(this);
            if(o.boundary) {
				
				
                var limitTop = 0-o.boundary_offset;				
				var limitLeft = 0-o.boundary_offset;
                var limitBottom = limitTop + $(o.boundary).innerHeight()+(2*o.boundary_offset);
				var limitRight = limitLeft + $(o.boundary).innerWidth()+(2*o.boundary_offset);
				
				
            }
			
			
			if ($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 ) {
				
				grip.mousemove(function(e) {
							
							
							o.before.call(draggable, e);

							var lastX, lastY;
							dragging = true;

							Ev = e;

							startX = lastX = e.pageX;
							startY = lastY = e.pageY;
							var off = parseInt(o.boundary.parent().css('padding-left'));
							draggableStartX = $(draggable).offset().left - o.boundary.parent().offset().left - off;
							draggableStartY = $(draggable).offset().top - o.boundary.parent().position().top ;
							
							$(draggable).onselectstart=function(){return false} 
							
							$(draggable).css({
								position: 'absolute',
								cursor: o.cursor,
								zIndex: '1010'
							})
						   
						   
							id = setInterval(function() {								
								$(draggable).css({								
											'left': (startX- o.boundary.parent().offset().left)-off+'px'										
										});
								
								
								o.boundary.find("#divider").css({
														 'left':$(draggable).position().left + $(draggable).width()/2+'px'
														 });
																					
								if (o.afterDiv!=null) {
								
									o.afterDiv.parent().parent().parent().find("#before").each(function(i) {								
											var off = parseInt(o.boundary.parent().css('padding-left'));
											var newW = (o.boundary.find("#divider").offset().left - o.boundary.find("#divider").parent().parent().offset().left - off);
											if (newW<0) newW=0;				
											$(this).parent().parent().css({																		
																	'width':newW +"px"
																});
												});
								}
														 
								lastX = Ev.pageX;
								lastY = Ev.pageY;
							}, o.interval);
							($.browser.safari || e.preventDefault());
				});
			}
			
            grip.mousedown(function(e) {
				
				
                o.before.call(draggable, e);

                var lastX, lastY;
                dragging = true;

                Ev = e;

                startX = lastX = e.pageX;
                startY = lastY = e.pageY;
				var off = parseInt(o.boundary.parent().css('padding-left'));
                draggableStartX = $(draggable).offset().left - o.boundary.parent().offset().left - off;
                draggableStartY = $(draggable).offset().top - o.boundary.parent().position().top ;
				
				$(draggable).onselectstart=function(){return false} 

                $(draggable).css({
                    position: 'absolute',
                    cursor: o.cursor,
                    zIndex: '1010'
                })
               
                id = setInterval(function() {
                    if(lastX != Ev.pageX || lastY != Ev.pageY) {
                        var positionX = draggableStartX - (startX - Ev.pageX); 
						var positionY = draggableStartY - (startY - Ev.pageY);
						
                        if(positionX < limitLeft && o.boundary) {
                            positionX = limitLeft;
                        }
                        else if(positionX + $(draggable).innerWidth() > limitRight && o.boundary) {
                            positionX = limitRight - $(draggable).outerWidth();
                        }
                        
				
						if (o.direction=="vertical") {
							
							$(draggable).stop().animate({								
								left: positionX + o.offset_x+'px'
								
							}, o.speed, o.easing);
						} 
						
						
                    }
					
					
					o.boundary.find("#divider").css({
											 'left':$(draggable).position().left + $(draggable).width()/2+'px'
											 });
                    													
					if (o.afterDiv!=null) {
					
						o.afterDiv.parent().parent().parent().find("#before").each(function(i) {								
								var off = parseInt(o.boundary.parent().css('padding-left'));
								var newW = (o.boundary.find("#divider").offset().left - o.boundary.find("#divider").parent().parent().offset().left - off);
								if (newW<0) newW=0;				
								$(this).parent().parent().css({																		
														'width':newW +"px"
													});
									});
					}
											 
                    lastX = Ev.pageX;
                    lastY = Ev.pageY;
                }, o.interval);
                ($.browser.safari || e.preventDefault());
            });
			
			
			
			
			
			
            $(document).mousemove(function(e) {
                if(dragging) {
                    Ev = e;
                    o.during.call(draggable, e);
               }
            });
            $(document).mouseup(function(e) {
                if(dragging) {
                    $(draggable).css({
                        cursor: '',
                        zIndex: '990'
                    }).removeClass('anima-drag');
					
                    $('#anima-drag-overlay').hide().appendTo(document.body);
                    clearInterval(id);
					
                    o.after.call(draggable, e);
                    dragging = false;
					
                }
            });
        });
    }
})(jQuery);