(function($) {
	var GORIZONT = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			menu: function() {
				var self = this;

				$(".header-menu--has-submenu").on("mouseenter", function() {
					var $holder = $(this);
					$(".header-menu-level1", $holder).css("display", "block");
					setTimeout(function() {
						$(".header-menu-level1", $holder).addClass("show");
					}, 50);
				});
				$(".header-menu--has-submenu").on("mouseleave", function() {
					var $holder = $(this);
					$(".header-menu-level1", $holder).removeClass("show");
					setTimeout(function() {
						$(".header-menu-level1", $holder).css("display", "none");
					}, 350);
				});
			},

			dropdown: {
				timer: false,
				init: function() {
					var self = this;
					$(".header-menu-item-holder--has-submenu", $sel.body)
						.on("mouseenter", function() {
							(function($holder) {
								self.show($holder);
							})($(this));
						})
						.on("mouseleave", function() {
							(function($holder) {
								self.hide($holder);
							})($(this));
						});
				},
				show: function($holder) {
					var self = this;
					if(self.timer) {
						clearTimeout(self.timer);
					}
					var $list = $("> nav", $holder);
					$list.css("display", "block");
					self.timer = setTimeout(function() {
						$holder.addClass("hovered");
					}, 50);
				},

				hide: function($holder) {
					var self = this;
					if(self.timer) {
						clearTimeout(self.timer);
					}
					var $list = $("> nav", $holder);
					$holder.removeClass("hovered");
					self.timer = setTimeout(function() {
						$list.css("display", "none");
					}, 220);
				}
			},

			initAjaxLoader: function() {
				$sel.body.on("click", ".load-more-btn", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						$container = $($linkAddress.data("container"));

						(function(href, $container) {
							$.ajax({
								url: href,
								success: function(data) {
									var $data = $(data).addClass("load-events-item");
										$container.append($data);
									setTimeout(function() {
										$container.find(".load-events-item").removeClass("load-events-item");
									}, 50);
								}
							})
						})(href, $container);
						event.preventDefault();
				})
			},

			modalWindow: function() {
				$(".popup-gallery").magnificPopup({
					delegate: ".gallery-container-item",
					mainClass: "mfp-gallery",
					type: "iframe",
					removalDelay: 200,
					tLoading: '',
					closeOnContentClick: true,
					gallery: {
						enabled: true,
						navigateByImgClick: false,
						preload: [0, 2],
						arrowMarkup: "<button title='%title%' type='button' class='mfp-gallery-arrow mfp-gallery-arrow--%dir%'></button>",
						tPrev: "prev",
						tNext: "next",
						tCounter: "",
					},
					callbacks: {
						buildControls: function() {
							this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
						},
						elementParse: function(item) {
							if($(item.el).hasClass("gallery-container-item--video")) {
								item.type = 'iframe';
							} else {
								item.type = 'image';
							}
						}
					},
					zoom: {
						enabled: true,
						duration: 500,
					},
					midClick: true,

				});

				$(".contacts-application").magnificPopup({
					type: "inline",
					focus: '#name',
				});

			},

			goTop: function() {
				var $goTopBtn = $(".go-top", $sel.body);

				$sel.window.on("scroll", function() {
					var sTop = $sel.window.scrollTop();

					if(sTop != 0 ) {
						$goTopBtn.addClass("active");
					} else {
						$goTopBtn.removeClass("active");
					}

				});

				$goTopBtn.on("click", function(e) {
					if ($goTopBtn.hasClass("active")) {
						$sel.body.add($sel.html).animate({scrollTop:0},800);
					}
					e.preventDefault();
				});

			},

			yandexMap: {
				$map: false,
				map: false,
				points: false,
				init: function() {
					var self = this;
					self.$map = $(".contacts-location-container-map", $sel.body);
					if(!self.$map.length) {
						return false;
					}
					self.map = new ymaps.Map(self.$map[0], {
						center: self.$map.data("center"),
						zoom: self.$map.data("zoom")
					});
					self.map.behaviors.disable("scrollZoom");
					self.map.controls.remove("trafficControl").remove("scaleLine").remove("typeSelector").remove("searchControl");
					self.points = eval(self.$map.data("points"));

					var point1 = self.points[0],
						placemark1,
						pointPosition1 = point1.position.split(",");
					placemark1 = new ymaps.Placemark(
						[parseFloat(pointPosition1[0]), parseFloat(pointPosition1[1])], {
							balloonContent: point1.description,
						}, {
							preset: "islands#redIcon",
							iconImageHref: point1.icon,
							iconImageSize: [110, 145],
						}
					);

					self.map.geoObjects.add(placemark1);
				}
			},


		};

	})();

	ymaps.ready(function() {
		GORIZONT.yandexMap.init();
	});
	GORIZONT.goTop();
	GORIZONT.modalWindow();
	GORIZONT.initAjaxLoader();
	GORIZONT.menu();
	GORIZONT.dropdown.init();

})(jQuery);
