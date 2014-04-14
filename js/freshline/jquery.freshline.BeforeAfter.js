/**
 * jquery.freshline.BeforeAfter - jQuery Plugin for Before After Effects Banner Animation (freshline)
 * @version: 1.1 (12.09.2011)
 * @requires jQuery v1.2.2 or later 
 * @author Krisztian Horvath
 * All Rights Reserved, use only in freshline Templates or when Plugin bought at Envato ! 
**/




(function($,undefined){	
	
	
	
	////////////////////////////
	// THE PLUGIN STARTS HERE //
	////////////////////////////
	
	$.fn.extend({
	
		
		// OUR PLUGIN HERE :)
		beforeAfter_slider: function(options) {
	
		
			
		////////////////////////////////
		// SET DEFAULT VALUES OF ITEM //
		////////////////////////////////
		var defaults = {	
			width: 876, // width of banner
			height: 300, // height of banner			
			start_from:'left',		// left, right
			start_pos:30,			
			follow:true
		};
		
		var options = $.extend({}, $.fn.beforeAfter_slider.defaults, options);
					

		return this.each(function() {
		
			// An Array to preload all the images
			var ba_images = new Array;
			
			//Keep track of the ba_images that are loaded
			var ba_imagesLoaded = 0;
			
			//PUT THE BANNER HOLDER IN A VARIABLE
			var bannerTop = $(this);
			bannerTop.onselectstart=function(){return false} 			
			
			// OPTIONS 
			var opt=options;
			opt.ie = ($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 );
			opt.topon = $(this);
			
			// Set Some Data in the Object
			bannerTop.data('off',parseInt(bannerTop.css('padding-top')));								
			bannerTop.data('ba_imagesLoaded',0);
			var currentSlide = bannerTop.find("li").first();	
			bannerTop.data('currentSlide',currentSlide);
			
			//Init the Mask
			initMask(bannerTop,opt);
				
			//init the Drag and Drop Div's
			initDragAndDrop(bannerTop);
			
			//create the Before & After Images
			createBeforeAfters(bannerTop);
			
			var mainloader=$("<div id='mainloader' class='loader'></div>");									
			bannerTop.append(mainloader);
			
			//turn off all slides, to make sure nothing pops up without our controll....
			if (opt.ie!=true) {
				bannerTop.find('ul li').css({'opacity':'0.0'});
				bannerTop.find('#divider').css({'opacity':'0.0'});
				bannerTop.find('#drag').css({'opacity':'0.0'});
			}
			
			bannerTop.data('dragH',bannerTop.find("#drag").height()/2);
			startBeforeAfter(bannerTop,opt);
			
			// Init Image Preloading 
			initImagePreLoading(bannerTop);
			
			//NOW WE LOAD THE ba_images, AND ONCE IT HAS BEED DONE, WE CAN START
			if (opt.ie) 
				startRotation(bannerTop,opt);									
			 else 
				preloadba_images(bannerTop,opt);
		
			
		})
	}
})


		///////////////////////////////
		//  --  LOCALE FUNCTIONS -- //
		///////////////////////////////
		
		
					/////////////////////////////////////////////////////////
					// PUT ALL ba_images IN AN ARRAY, FOR PRELOADING !!  //
					///////////////////////////////////////////////////////
					function initImagePreLoading(item) {
								var ba_images=new Array();
								var imageamounts=0;
								item.find("ul li:first img").each(
									function(i){
										var $this=$(this);
										ba_images[imageamounts] = $this.attr('src');								
										imageamounts++;
									});
						
							
							item.data('ba_images',ba_images);
							
					}
		
		
					/////////////////////////////////////////////////////////////////////////////////////////	
					//REKURSIVE PRELOADING ALL THE ba_images, AND CALL THE CALLBACK FUNCTION AT THE END   //
					////////////////////////////////////////////////////////////////////////////////////////
					function preloadba_images(item,opt){	
										
											var ba_images = item.data('ba_images');
											var ba_imagesLoaded = item.data('ba_imagesLoaded');
											var img = new Image();	// TEMPORARY HOLDER FOR IMAGE TO LOAD				
											$(img).css("display","none");
											$(img).attr('src',ba_images[ba_imagesLoaded]);	// SET THE SOURCE OF THE TEMP IMAGE
											
											if (img.complete || img.readyState === 4) {		// CHECK IF THE IMAGE IS ALREADY LOADED
												ba_imagesLoaded++;								// IF YES WE CAN INCREASE THE AMOUNT OF LOADED ba_images
												if(ba_imagesLoaded == ba_images.length) {			// IF WE LOADED ALL THE ba_images	
													startRotation(item,opt)					// CAN CALLBACK FUNCION BE CALLED
												} else {		
													item.data('ba_imagesLoaded',ba_imagesLoaded);
													preloadba_images(item,opt);				// OTHER WAY WE NEED TO PRELOAD THE REST ba_images
												}
											} else {
												
												$(img).load(function(){						// IF NOT CACHED YET, LETS LOAD THE IMAGE
														ba_imagesLoaded++;						// WE CAN INCREASE THE AMOUNT OF LOADED ba_images
														if(ba_imagesLoaded == ba_images.length) {	// IF WE LOADED ALL THE ba_images									
															startRotation(item,opt);						// CAN CALLBACK FUNCION BE CALLED		
														} else {		
															item.data('ba_imagesLoaded',ba_imagesLoaded);													
															preloadba_images(item,opt);		// OTHER WAY WE NEED TO PRELOAD THE REST ba_images
														}
												});
											}
										
								}; 
		
		
					/////////////////////////////
					// DRAG AND DROP FUNCTION //
					///////////////////////////
					
					function initDragAndDrop(item) {
								///////////////////////////////
								// CREATE THE "CHANGER DRAG" //
								///////////////////////////////							
								
								var divider = $("<div id='divider'></div>");
								item.find("#mask").append(divider);
								
								var drag = $("<div id='drag'></div>");
								item.find("#mask").append(drag);
								
								
								drag.hover(
									function() {
										var $this=$(this);
										$this.css({'background-position':'left bottom'});
										
									},	
									function() {
										var $this=$(this);
										$this.css({'background-position':'left top'});
										
									}					
								);
								
								
								item.onselectstart=function(){return false} 			
								
								item.hover(
									function() {
										var $this=$(this);
										if (!($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )) {
											$this.find("#drag").animate({'opacity':1},{duration:200,queue:false});
											$this.find("#divider").animate({'opacity':1},200);
										}
									},
									function() {
										if (!($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )) {
											$this.find("#drag").animate({'opacity':0.3},200);
											$this.find("#divider").animate({'opacity':0.3},200);
										}
									}
								);
					
					}
		
					////////////////////////////////////////////////////
					// CREATE THE BEFORE AFTER IMAGES IN THE DIVS 	  //
					////////////////////////////////////////////////////
					
					function createBeforeAfters (item) {
						item.find("li >img").each(
							function(){
							
								var $this=$(this);
								
								// ADD THE ID BEFORE TO THE FIRST IMG IN THE LIST 
								$this.attr({id:'before'});
								
								//IF ALT IS SET, ADD A NEW IMG TAG TO LOAD THE AFTER IMAGE AS WELL
								if ($this.attr("alt").length !=0 && $this.attr("alt") != null) {
								
									// CREATE ALTERNATIVE IMG
									$this.parent().append("<img id='after' src='"+$this.attr("alt")+"'>");
								} else {
									// CREATE ALTERNATIVE IMG
									$this.parent().append("<img id='before' src='"+$this.attr("src")+"'>");
								}
								
									// WRAP THE ALL IN A NEW DIV
									$this.parent().find("#before, #after").wrapAll("<div id='ba_images'></div>");
									
									
									// WRAP EACH BEFORE AND AFTER AS WELL IN A DIV
									$this.parent().find("#after").wrap("<div id='ext_ext_after'><div id='ext_after'></div></div>");					
									$this.parent().find("#before").wrap("<div id='ext_ext_before'><div id='ext_before'></div></div>");										
									
									

									
									var eea=$this.parent().parent().parent().find("#after").parent().parent();
									var ea=eea.find("#after").parent();
									var a=ea.find("#after");
									
									var eeb=$this.parent().parent().parent().find("#before").parent().parent();
									var eb=eeb.find("#before").parent();
									var b=eb.find("#before");
									
									eea.css({'position':'absolute','z-index':'0','top':'0px'});
									eeb.css({'position':'absolute','z-index':'1','top':'0px','left':'0px'});
									eea.parent().css({'z-index':1});
									
									
									eea.onselectstart=function(){return false} 			
									eeb.onselectstart=function(){return false} 			
									
									var loader=$("<div id='loader' class='loader'></div>");
									
									$(eea).parent().parent().append(loader);
									ea.find("img").load(function() {
									
											$this.parent().parent().parent().parent().find('#loader').each(
												function() { 
													var $this=$(this);
													$this.remove()
												});											

											
									});
									//alert(eea.parent().parent().html());
								
								
							});
					}
					////////////////////////////////////////////////////
					// - THE BANNER SWAPPER, ONE AGAINST THE OTHER :) //
					////////////////////////////////////////////////////
					function swapBanner(item,newitem,bannerTop,opt) {
													
							opt.countdown=0;
							var left=true;
							bannerTop.find('li').each(function () {
								$this=$(this);
								if ($this.index() != item.index() && $this.index()!=newitem.index())
									if (!($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )) { $this.css({'opacity':0.0}); 
									} else {
										$this.css({'z-index':'50'});
									}
								else
									$this.css({'z-index':'100'});
							});
							if (item.index()>newitem.index()) left = false;
							if (item.index()==0 && newitem.index()!=1) left=false;										
							
							
							if (item.index()==(item.parent().find("li").size()-1) && newitem.index()==0) left=true;
								
							
							
							if (left) {
								item.animate({'left':0-opt.width},{duration:500,queue:false});
								newitem.css({'opacity':'1.0','position':'absolute','top':'0px','left':opt.width,'width':opt.width, 'height':opt.height});
								
							} else  {
								item.animate({'left':opt.width},{duration:500,queue:false});
								newitem.css({'opacity':'1.0','position':'absolute','top':'0px','left':0-opt.width,'width':opt.width, 'height':opt.height});						
							}
							
								
								
								// CHANGE THE THUMBNAIL ICONS
								item.parent().parent().parent().find(".mini_thumbnail_buttons").each(										
																function(i) {
																	var $this=$(this);
																	$this.css({'background-position':'top left'});
																	$this.data('on',false);
																	$this.removeClass("thumbison");
																	$this.find('.timer').css({backgroundPosition:'0px 0px'});
																	
																	if (i == newitem.parent().find("li").size() - newitem.index()-1) {
																		$this.data('on',true);
																		$this.css({'background-position':'bottom right'});
																		$this.addClass("thumbison");
																	}
																});		
																								
								var eeb=newitem.find("#before").parent().parent();												
								eeb.css({'width':bannerTop.find("#divider").position().left+"px",	 'overflow':'hidden'});		
								
								newitem.animate({'left':'0px','top':'0px','opacity':'1.0'},{duration:500,queue:false});
								
								bannerTop.data('currentSlide',newitem);
								
								textanim(newitem,500);
					}
					
					
					
					////////////////////////////////
					// SET CSS OF THE FULL BANNER //
					///////////////////////////////
					function initBorder(item,opt) {	
												
						item.css({
										"width":opt.width+'px',
										"height":opt.height+'px',
										"position":"relative",		
										
									});								
					}	
					
					
					
					
					//////////////////////////////////////
					// SET CSS OF THE BANNER HOLDER DIV //
					//////////////////////////////////////
					function initHolder(item,i,opt){					
						
						$(item).css({
										"width":opt.width+"px",
										"height":opt.height+"px",
										"z-index":"200",
										"position":"relative",			
										"overflow":"hidden",
										"left":0,
										"top":0
										
									});
						if (!($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )) {			
							if (i>0) $(item).css({ "opacity":0});											
						}
					}	
					
					
					////////////////////////////////////
					// CREATE A MASK FOR ALL SUBITEMS //
					////////////////////////////////////
					function initMask(item,opt) {
						item.find("ul").wrap("<div id='mask'></div>");
						item.find("#mask").css({
													'overflow':'hidden',
													'width':opt.width+'px',
													'height':opt.height+'px',
													'position':'absolute',													
													
												});					
					}
					
					
					
					////////////////////////////////////////////
					// START AFTER LOADIN THE KEN BURN SLIDER //
					////////////////////////////////////////////
					function startBeforeAfter(item,opt) {
								
								var dragH = item.data().dragH;
								
								// SET THE BORDER
								item.each( function() {
									$this=$(this);
									initBorder($this,opt)
								});
								
								// INITIALISING OF THE ITEMS AND MAIN BANNER HOLDER						
								item.find("li").each( function(i) {
									$this=$(this);
									initHolder($this,i,opt)
								});					
								
								
								item.css({'opacity':'0.0', 'display':'block'});
								item.animate({'opacity':'1.0'},1500);
																					
								createNavigation(item,opt,item.data('currentSlide'));								
								
						}
					
					
					///////////////////////////
					// CREATE THE NAVIGATION //
					///////////////////////////
				
					function createNavigation(item,opt) {
								
								var toolbox = $('<div id="toolbox" style="opacity:0"></div>');
								item.append(toolbox);
								
								//var toolboxWidth = 3 + item.find("li").size() ;
								
								toolbox.css({'z-index':'4051'});
												

								var prev=$("<div id='previous'></div>");
								var next=$("<div id='next'></div>");										

								////////////////////////////////////
								// HOVERING OVER THE ARROWS EVENT //
								////////////////////////////////////
								var hoverInit=function(button) {
									button.hover(
										function() {
											var $this=$(this);
											if ($this.attr('id')=='previous')
												$this.css({'background-position':'bottom right'});
											else
												$this.css({'background-position':'bottom left'});
										},
										function() {
											$this=$(this);
											if ($this.attr('id')=='previous')
												$this.css({'background-position':'top right'});
											else
												$this.css({'background-position':'top left'});
										});
								}
								
								///////////////////////////////
								// CLICK ON THE ARROWS EVENT //
								///////////////////////////////
								var clickInit=function(button) {
									button.click(
											function() {
												var $this=$(this);
												var newId = item.data('currentSlide').index();
												if ($this.attr('id')=="previous")												
													newId++;
												else
													newId--;
												if (newId==item.data('currentSlide').parent().find("li").size()) newId=0;
												if (newId==-1) newId=item.data('currentSlide').parent().find("li").size()-1;												
													
												var newcurrentSlide = item.find("li").each(
														function(i) {				
															$this=$(this);
															if (i == newId) {										
																swapBanner(item.data('currentSlide'),$this,item,opt);
															}
														});																										
												}										
										) //End of Button Click
								}
								
								hoverInit(prev);clickInit(prev);
								hoverInit(next);clickInit(next);
								
								toolbox.append(prev);
								toolbox.append(next);

								
								
								var thdivider=$("<div id='mini_divider'></div>");
								toolbox.append(thdivider);
								
								///////////////////////////
								// CREATE THE THUMBNAILS //
								///////////////////////////
										
								item.find("li").each(
									function(i) {
									
										var $this=$(this);
										var nums = $this.parent().find("li").size()-1;
										
										var thumbnail=$("<div id='"+(nums-i)+"' class='mini_thumbnail_buttons'><div class='timer'></div></div>");
										toolbox.append(thumbnail);
												
										if (item.data('currentSlide').index() == (nums-i)) {
											thumbnail.data('on',true);
											thumbnail.css({'background-position':'bottom right'});
										}
										
											
										thumbnail.hover(
											function() {
												var $this=$(this);
												$this.css({'background-position':'top right'});
												
												if ($this.data().on == true) 
													$this.css({'background-position':'bottom right'});
												
												$this.parent().append('<div id="image_thumbnail" style="opacity:0.0;left:'+$this.position().left+'px;top:'+($this.position().top + 10)+'px"></div>');
												var it =$this.parent().find('#image_thumbnail');
												
												var searchedID = $(this).attr('id');
												var imgsrc="";
												var altsrc="";
												item.find('li').each(function() {
													var $this=$(this);
													if ($(this).index() == searchedID) {
														imgsrc= $this.find("#before").attr('src');														
														altsrc= $this.find("#after").attr('src');														
													}
												 });
												 
												
												var newWidth =it.width() - 6;
												var newHeight = it.height()-6;
												var divIt = (item.find("#divider").position().left/opt.width) * newWidth;
												

												
												it.append('<div><div><img style="position:absolute;top:3px;left:3px;width:'+newWidth+'px;height:'+newHeight+'px" src="'+altsrc+'"></div></div>');												
												it.append('<div style="position:absolute;overflow:hidden;width:'+divIt+'px;height:'+it.height()+'px"><div><img style="position:absolute;top:3px;left:3px;width:'+newWidth+'px;height:'+newHeight+'px" src="'+imgsrc+'"></div></div>');												
												it.append('<div id="loader" style="loader"></div>');												
												it.append('<div id="image_thumbnail_arrow" style="position:absolute;left:'+(it.width()/2 - 4)+'px;top:'+(it.height()-1)+'px"></div>');
												
												it.animate({'opacity':1.0,'top':+1},200);
											},
											function() {
												var $this=$(this);
												$this.css({'background-position':'top left'});
												if ($this.data().on == true) 
													$this.css({'background-position':'bottom left'});
												$this.parent().find("#image_thumbnail").remove();
											});
												
										thumbnail.click(
											function() {
												var $this=$(this);
												if ($this.data().on != true)  {																										
													var newId = $(this).attr('id');																										
													var newcurrentSlide = item.find("li").each(
														function(i) {	
															var $this=$(this);														
															if (i == newId) {										
																swapBanner(item.data('currentSlide'),$this,item,opt);
															}
														});
												
												}
												
											}) //End of Thumbnail Click
									})  // End of Creating Thumbnails	
									
									item.find('.timer:last').parent().addClass('thumbison');
										
									
							
						} // End of Creating Navigation
					
					
					
						
					/////////////////////////////
					// START THE ROTATION HERE //
					/////////////////////////////
					function startRotation(item,opt) {
					
							var dragH = item.data('dragH');
							dragH = item.find("#drag").height()/2;
							// SET THE BORDER
							item.each( function() {
								$this=$(this);
								initBorder($this,opt)
							});
							
							
							// INITIALISING OF THE ITEMS AND MAIN BANNER HOLDER						
							item.find("li").each( function(i) {
								$this=$(this);
								initHolder($this,i,opt)
							});					
							
						
							item.css({'opacity':'0.0', 'display':'block'});
							item.animate({'opacity':'1.0'},1500);
							
							
							
							/////////////////////////////////////////////////////
							//   INIT ANIMATION; ONLY ONCE !!				  //
							// NOW RUN ONCE THE LINE TO THE 30PIXEL POINT... //
							//////////////////////////////////////////////////
							var eea=item.data('currentSlide').find("#after").parent().parent();
							var ea=eea.find("#after").parent();
							var a=ea.find("#after");
							
							var eeb=item.data('currentSlide').find("#before").parent().parent();
							var eb=eeb.find("#before").parent();
							var b=eb.find("#before");
						
								
								if (opt.start_from=="right") {						
									
									eeb.css({'width':opt.width,	'overflow':'hidden'});
									if (opt.ie) {
									} else {
										eeb.animate({'width':opt.width+"px"},0).delay(500);
									}
									item.find("#drag").animate({'left':opt.width+"px"},0).delay(500);
									
									item.find("#divider").animate({'left':opt.width+"px"},0).delay(500);
									
								} 
							
								if (opt.start_from=="left") {								
									eeb.css({'width':'0px',	 'overflow':'hidden'});									
									if (opt.ie) {
									} else {
										eeb.animate({'width':'0px',	 'overflow':'hidden'},0).delay(500);										
									}
									item.find("#drag").animate({'left':"0px"},0).delay(500);										
									item.find("#divider").animate({'left':"0px"},0).delay(500);									
								} 
							
								
							eeb.animate({'width':opt.start_pos+"px"},800);
							item.find("#drag").animate({'opacity':0.3,'left':opt.start_pos-20+"px"},{duration:800, 
										complete:function() {
															  var $this=$(this);
															  if (opt.follow) {
																var followMouse = function(e) {																																					
																		var $this=$(this);															
																		$this.find('#drag').css({'opacity':'1.0'});									
																		
																		$this.find('#drag').css({'top':(e.pageY - $this.offset().top - dragH - item.data().off)+'px'})																			
																		
																}											
																item.bind('mousemove', followMouse);
															  }

							
															}
							});
								
							item.find("#divider").animate({'opacity':0.3,'left':opt.start_pos+"px"},800);
							
						
							
							initDrag(item,item.data('currentSlide'));
							
							item.find("#toolbox").animate({'opacity':'1.0'},1000);
							
							//turn off all slides, to make sure nothing pops up without our controll....
							item.find('ul li').animate({'opacity':'1.0'},300);
							item.find('#mainloader').animate({'opacity':'0.4'},{duration:500, complete:function() {
								item.find('#mainloader').remove();
							}});
							textanim(item.data('currentSlide'),500);	

							
							item.hover(function() {
								$(this).addClass('onitemhovered');
							},
							function() {
								$(this).removeClass('onitemhovered');
							});
							
							
							

							if (opt.timer>0) {
								opt.countdown=0;
								setInterval(function() {
									if (!item.hasClass('onitemhovered')) opt.countdown=opt.countdown+1;
									if (opt.countdown >= opt.timer/100) {
										opt.countdown=0;
										item.find("#previous").click();
									}
									var proc=100- (Math.round(((100/opt.timer)*opt.countdown)*100));
									
									item.find('.thumbison .timer').css({backgroundPosition: '0px '+(proc*10)+'px'});
								},100);
							}
				}
				
				
				////////////////////////////////////
				// INITIALISE THE DRAG FUNCTION  //
				///////////////////////////////////
				function initDrag(item) {
							if ($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )
								jQuery(item).animaDrag({ 
									dragit:item.find("#drag"),
									speed: 0, 
									interval: 0, 
									easing: null, 										
									direction: 'vertical',			
									boundary: item.find('#mask'), 
									boundary_offset:30,//opt.banner_bordersize,
									grip: null, 
									overlay: false,					
									afterDiv: item.data('currentSlide')									
								}); 
							else
								jQuery(item.find("#drag")).animaDrag({ 
									dragit:item.find("#drag"),
									speed: 0, 
									interval: 0, 
									easing: null, 										
									direction: 'vertical',			
									boundary: item.find('#mask'), 
									boundary_offset:30,//opt.banner_bordersize,
									grip: null, 
									overlay: false,					
									afterDiv: item.data('currentSlide')
									
								}); 
							}
							
				
				
				///////////////////
				// TEXTANIMATION //
				//////////////////			
				function textanim (item,edelay) {
				
								
								var counter=0;
								
								item.find('div').each(function(i) {
									var $this=$(this);
									if ($this.hasClass('before')) $this.appendTo(item.find("#before").parent());
									if ($this.hasClass('after')) $this.appendTo(item.find("#after").parent());
								});
								
								item.find('div').each(function(i) {
											item.onselectstart=function(){return false} 			
											var $this=$(this);
											if ($this.attr('id')!="ext_ext_before") $this.stop(true,true);
											if ($this.data('_top') == undefined) $this.data('_top',$this.position().top);
											if ($this.data('_left') == undefined) $this.data('_left',$this.position().left);
											if ($this.data('_op') == undefined) $this.data('_op',$this.css('opacity'));
									
									if (!($.browser.msie && $.browser.version >= 7 && $.browser.version < 9 )) {
											//// -  SLIDE UP   -   ////
											if ($this.hasClass('slideup')) {
													$this.animate({'top':$this.data('_top')+20+"px"},
																	{duration:0,queue:false})
														   .delay(edelay + (counter+1)*200)
														   .animate({'top':$this.data('_top')-20+"px"},
																	{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  SLIDE RIGHT   -   ////
											if ($this.hasClass('slideright')) {
												$this.animate({'left':$this.data('_left')-20+"px"},
															{duration:0,queue:false})
												   .delay(edelay + (counter+1)*200)
												   .animate({'left':$this.data('_left')+20+"px"},
															{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  SLIDE DOWN  -   ////
											if ($this.hasClass('slidedown')) {
													$this.animate({'top':$this.data('_top')-20+"px"},
																	{duration:0,queue:false})
														   .delay(edelay + (counter+1)*200)
														   .animate({'top':$this.data('_top')+20+"px"},
																	{duration:300,queue:true})	
												counter++;
											}
											
										
											//// -  SLIDE LEFT   -   ////
											if ($this.hasClass('slideleft')) {
												$this.animate({'left':$this.data('_left')+20+"px"},
															{duration:0,queue:false})
												   .delay(edelay + (counter+1)*200)
												   .animate({'left':$this.data('_left')-20+"px"},
															{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  FADE UP   -   ////
											if ($this.hasClass('fadeup')) {
													$this.animate({'top':$this.data('_top')+20+"px",
																	 'opacity':0},
																	{duration:0,queue:false})
														   .delay(edelay + (counter+1)*200)
														   .animate({'top':$this.data('_top')-20+"px",
																	 'opacity':$this.data('_op')},
																	{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  FADE RIGHT   -   ////
											if ($this.hasClass('faderight')) {
												$this.animate({'left':$this.data('_left')-20+"px",
															 'opacity':0},
															{duration:0,queue:false})
												   .delay(edelay + (counter+1)*200)
												   .animate({'left':$this.data('_left')+20+"px",
															'opacity':$this.data('_op')},
															{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  FADE DOWN  -   ////
											if ($this.hasClass('fadedown')) {
													$this.animate({'top':$this.data('_top')-20+"px",
																	 'opacity':0},
																	{duration:0,queue:false})
														   .delay(edelay + (counter+1)*200)
														   .animate({'top':$this.data('_top')+20+"px",
																	 'opacity':$this.data('_op')},
																	{duration:300,queue:true})	
												counter++;
											}
											
											
											//// -  FADE LEFT   -   ////
											if ($this.hasClass('fadeleft')) {
												$this.animate({'left':$this.data('_left')+20+"px",
															 'opacity':0},
															{duration:0,queue:false})
												   .delay(edelay + (counter+1)*200)
												   .animate({'left':$this.data('_left')-20+"px",
															'opacity':$this.data('_op')},
															{duration:300,queue:true})	
												counter++;
											}
											
											//// -  FADE   -   ////
											if ($this.hasClass('fade')) {
												$this.animate({'opacity':0},
															{duration:0,queue:false})
												   .delay(edelay + (counter+1)*200)
												   .animate({'opacity':$this.data('_op')},
															{duration:300,queue:true})	
												counter++;
											}
									}	
									});
										
										
					
				}
})(jQuery);			

				
			

			   