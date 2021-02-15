jQuery(document).ready(function($) {


	$('.mobile-menu-toggle').click(function(event) {
		$('.header-menu, .mobile-bg').toggleClass('active');
		$('body').toggleClass('no-scroll');
	});
	function parse_query_string(query) {
		var vars = query.split("&");
		var query_string = {};
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			var key = decodeURIComponent(pair[0]);
			var value = decodeURIComponent(pair[1]);
			// If first entry with this name
			if (typeof query_string[key] === "undefined") {
				query_string[key] = decodeURIComponent(value);
				// If second entry with this name
			} else if (typeof query_string[key] === "string") {
				var arr = [query_string[key], decodeURIComponent(value)];
				query_string[key] = arr;
				// If third or later entry with this name
			} else {
				query_string[key].push(decodeURIComponent(value));
			}
		}
		return query_string;
	}

	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);

	$('.vacancies .show-more').click(function(event) {
		var parent = $(this).closest('.tab-inner-content-wrapper');
		checkVisibleVacancies(parent, 6);
	});

	function checkVisibleVacancies(parent, step) {

		var to_show = parent.data('show');

		$('.vacancy-col', parent).removeClass('hidden-item');

		var visible_blocks = $('.vacancy-col:visible', parent).length;
		if (step === 0) {
			to_show = 6;
		}
		$('.show-more', parent).removeClass('hidden');
		
		if (to_show < visible_blocks) {
			to_show += step;
		}

		if (to_show >= visible_blocks) {
			$('.show-more', parent).addClass('hidden');
		}
		parent.data('show', to_show);

		$('.vacancy-col:visible', parent).each(function(index, el) {
			to_show --;
			if (to_show < 0) {
				$(this).addClass('hidden-item');
			}
		});
		
		filterBorderChange(parent);
	}

	if (qs.anchor) {
		console.log(qs.anchor)
		$('.tabs-header li').removeClass('active');
		$('.tabs-header a').removeClass('active');
		$('a[href="#'+qs.anchor+'"').addClass('active').closest('li').addClass('active');
		$('.tab-outer').removeClass('active');
		$('#'+qs.anchor).addClass('active');
	}
	
	$('.tabs-subheader a').click(function(event) {
		event.preventDefault();
		var href = $(this).attr('href');
		if (href) {
			if(history.pushState) {
				history.pushState(null, null, href);
			}
			else {
				location.hash = href;
			}
		}
		
		var parent = $(this).closest('.w100');
		
		$('.tabs-subheader a, .tabs-subheader li', parent).removeClass('active');
		$('.tabs-subheader .current', parent).html($(this).html());
		$(this).addClass('active');
		$(this).parent().addClass('active');
		if (href) {
			$('.tab-inner-content-wrapper', parent).removeClass('active');
			$(href).addClass('active');
		}
		if ($('.tabs-subheader', parent).hasClass('toggled')) {
			$('.tabs-subheader', parent).removeClass('toggled');
			$('.tabs-subheader ul', parent).slideUp(400);
		}
	});

	function onHashChange() {
        var hash = window.location.hash;

        if (hash) {
            // using ES6 template string syntax
            $(`.tabs-subheader a[href="${hash}"]`).trigger('click');
        }
    }

    window.addEventListener('hashchange', onHashChange, false);
    onHashChange();

	$('.project-type').click(function(event) {
		var data = $(this).data('project-type');
		var parent = $(this).closest('.w100');
		$('.tab-inner-content-wrapper', parent).removeAttr('class').addClass('tab-inner-content-wrapper').addClass(data).addClass('active');
		if (data != 'all') {
			$('.filtered-on-top').remove();
			$('.filtered-item').removeClass('filtered-item');
			$($('.col.'+data).get().reverse()).each(function(index, el) {
				$(this).clone().addClass('filtered-on-top').prependTo('.data-to-filter');
				$(this).addClass('filtered-item');
			});
		}else{
			$('.filtered-on-top').remove();
			$('.filtered-item').removeClass('filtered-item');
		}
	});
	$('.project-type').hover(function() {
		var data = $(this).data('project-type');
		var parent = $(this).closest('.w100');
		$('.tab-inner-content-wrapper', parent).addClass('hover-'+data);
	}, function() {
		var data = $(this).data('project-type');
		var parent = $(this).closest('.w100');
		$('.tab-inner-content-wrapper', parent).removeClass('hover-'+data);
	});
	$('.dropdown-bg').click(function(event) {
		var parent = $(this).parent();
		$('.current', parent).trigger('click');
		$('.filter-toggle', parent).trigger('click');
	});
	$('.tabs-header a').click(function(event) {
		console.log('asdasd')
		event.preventDefault();
		var href = $(this).attr('href');
		$('.tab-outer, .tabs-header a, .tabs-header li').removeClass('active');
		$(this).addClass('active');
		$('.tabs-header .current').html($(this).html());
		$(this).parent().addClass('active');
		$(href).addClass('active');
		if ($('.tabs-header').hasClass('toggled')) {
			$('.tabs-header').removeClass('toggled');
			$('.tabs-header ul').slideUp(400);
		}
	});
	$('.filter-toggle').click(function(event) {
		var parent =  $(this).closest('.filter-wrapper');
		if (parent.hasClass('toggled')) {
			parent.removeClass('toggled');
			$('ul',parent).slideUp(400);
		}else{
			parent.addClass('toggled');
			$('ul',parent).slideDown(400);
		}

	});
	$('.current').click(function(event) {
		var parent = $(this).parent();
		if (parent.hasClass('toggled')) {
			parent.removeClass('toggled');
			$('ul', parent).slideUp(400);
		}else{
			parent.addClass('toggled');
			$('ul', parent).slideDown(400);
		}
	});

	$('.full-size-slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		dots: true,
	});
	$('.filter-wrapper .checkbox').change(function () {
		var parent = $(this).closest('.tab-inner-content-wrapper');
		var checked_inputs = 0;
		var to_show = [];
				$('.checkbox', parent).each(function () {
			if ($(this).prop('checked')){
								checked_inputs ++;
								to_show.push($(this).attr('id'))
			}
				});
				if (checked_inputs > 0){
						parent.addClass('filtered')
		}else{
					parent.removeClass('filtered')
		}
		$('.vacancy-col', parent).removeAttr('style');
		to_show.forEach(function (id) {
			$('.'+id).css('display', 'block')
		});
		checkVisibleVacancies(parent, 0);
	});
	function filterBorderChange(parent) {
		$('.vacancy-col', parent).removeClass('no-right');
		var showed = 1;
		$('.vacancy-col:visible', parent).each(function() {
			if (showed % 2 == 0){
				$(this).addClass('no-right')
			}
			showed ++;
		})
	}
	function resize(){
		if ($('.project-row iframe').length > 0) {
			$('.project-row iframe').width($('.w100').width())
			$('.project-row iframe').height($('.w100').width() * 0.565)
		}
		var height = $(window).height() - 70;
		if ($('div').is('.full-size-slider')) {
			$('.full-size-slider').height(height);
		}
		if ($('div').is('.full-size-slide-content')) {
			$('.full-size-slide-content').height(height);
		}
		if ($('div').is('.right-content')) {
			if ($(window).width() > 1179) {
				// var left = $('.header-menu').offset().left - $('.header-logo').offset().left;
				var left = $('.header-logo').outerWidth() + 40;
				$('.right-content').css('padding-left', left);
			}else{
				$('.right-content').css('padding-left', 0);
			}
			if ($(window).width() < 850) {
				var container_left = 0 - $('.right-content').offset().left;
				var	width = $(window).width();
				$('.full-width').css({
					width: width,
					left: container_left
				});
				if ($(window).width() < 481) {
					$('.full-width-xs').css({
						width: width,
						left: container_left
					});
				}else{
					$('.full-width-xs').removeAttr('style')
				}
			}else{
				$('.full-width').removeAttr('style')
			}
		}
		if ($('div').is('#particles-js')) {
			if ($(window).width() > 1179) {
				// var p_width = $('.right-content').offset().left + $('.header-menu').offset().left - $('.header-logo').offset().left;
				var p_width = $('.right-content').offset().left + $('.header-logo').outerWidth() + 40;
				$('#particles-js').width(p_width);
				particlesJS('particles-js',{
					"particles": {
						"number": {
						"value": 100,
						"density": {
							"enable": true,
							"value_area": 800
						}
						},
						"color": {
						"value": "#767478"
						},
						"shape": {
						"type": "circle",
						"stroke": {
							"width": 0,
							"color": "#000000"
						},
						"polygon": {
							"nb_sides": 5
						},
						"image": {
							"width": 100,
							"height": 100
						}
						},
						"opacity": {
						"value": 1,
						"random": true,
						"anim": {
							"enable": true,
							"speed": 0.1,
							"opacity_min": 0.1,
							"sync": false
						}
						},
						"size": {
						"value": 5,
						"random": true,
						"anim": {
							"enable": false,
							"speed": 1,
							"size_min": 0.1,
							"sync": false
						}
						},
						"line_linked": {
						"enable": true,
						"distance": 150,
						"color": "#cdcecd",
						"opacity": 0.4,
						"width": 1
						},
						"move": {
						"enable": true,
						"speed": 3,
						"direction": "none",
						"random": false,
						"straight": false,
						"out_mode": "out",
						"attract": {
							"enable": false,
							"rotateX": 600,
							"rotateY": 1200
						}
						}
					},
					"interactivity": {
						"detect_on": "canvas",
						"events": {
						"onhover": {
							"enable": true,
							"mode": "grab"
						},
						"onclick": {
							"enable": true,
							"mode": "push"
						},
						"resize": true
						},
						"modes": {
						"grab": {
							"distance": 300,
							"line_linked": {
								"opacity": 1
							}
						},
						"bubble": {
							"distance": 400,
							"size": 40,
							"duration": 2,
							"opacity": 8,
							"speed": 3
						},
						"repulse": {
							"distance": 200
						},
						"push": {
							"particles_nb": 4
						},
						"remove": {
							"particles_nb": 2
						}
						}
					},
					"retina_detect": true,
					"config_demo": {
						"hide_card": false,
						"background_color": "#b61924",
						"background_image": "",
						"background_position": "50% 50%",
						"background_repeat": "no-repeat",
						"background_size": "cover"
					}
				});
			}
		}
	}
	resize();

	$(window).resize(function(event) {
		 resize();
	});


});