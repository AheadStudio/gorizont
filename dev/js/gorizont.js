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
								}
							})
						})(href, $container);
						event.preventDefault();
				})
			},

			modalWindow: function() {
				$(".popup-gallery").magnificPopup({
					delegate: ".gallery-item-container",
					mainClass: "mfp-gallery",
					type: "image",
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
					zoom: {
						enabled: true,
						duration: 500,
					},
					midClick: true,

				});

			},

		};

	})();

	GORIZONT.modalWindow();
	GORIZONT.initAjaxLoader();
	GORIZONT.menu();
	GORIZONT.dropdown.init();


})(jQuery);
