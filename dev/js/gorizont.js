(function($) {
	var GORIZONT = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},

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

			gallery: function() {

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

			form: {

				init: function($container) {
					var self = this;

					self.modalForm();

					if(!$container) {
						var $container = $sel.body;
					}

					jcf.setOptions("File", {
						buttonText: "Обзор",
						placeholderText: "",
					});

					jcf.replace($(".form-item--file", $container));

					$.validator.setDefaults({
						errorClass: "form-item--error",
						errorElement: "span"
					});

					$.validator.addMethod("mobileRu", function(phone_number, element) {
						phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
						return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
					}, "Error");

					$(".form", $container).each(function() {
						var $form = $(this),
							formParams = {
								rules: {
								},
								messages: {
								}
							},
							$formFields = $form.find("[data-error]");

						$formFields.each(function() {
							var $field = $(this),
								fieldPattern = $field.data("pattern"),
								fieldError = $field.data("error");
							if(fieldError) {
								formParams.messages[$field.attr("name")] = $field.data("error");
							} else {
								formParams.messages[$field.attr("name")] = "Ошибка заполнения";
							}
							if(fieldPattern) {
								formParams.rules[$field.attr("name")] = {};
								formParams.rules[$field.attr("name")][fieldPattern] = true;
							}
						});

						if($form.data("success")) {
							formParams.submitHandler = function(form) {
								$.magnificPopup.open({
									items: {
										src: $form.data("success"),
										type: "inline"
									},
									mainClass: "mfp-form",
									removalDelay: 300
								});
							};
						}

						$form.validate(formParams);
					});
				},

				modalForm: function() {
					$(".contacts-application").magnificPopup({
						type: "inline",
						mainClass: "mfp-form",
						closeMarkup: '<button title="%title%" class="mfp-close"><img src="../svg/icons/close_white.svg" width="20" height="20" class="mfp-close-icn mfp-close"/></button>',
						removalDelay: 300,
					});
				},


			},

			ajaxForm: {

				init: function() {

					$("#ajaxForm", $sel.body).submit(function(){
				        var $form = $(this),
							$result = $("#send_ajaxForm", $sel.body).html();

				        $.ajax({
				            type: 'POST',
				            url: $form.attr('action'),
				            data: $form.serialize(),
				            success: function(data) {
				                $.magnificPopup({
				                    items: {
				                        src: $result,
				                        type: "inline"
				                    }
				                });
				            },
				        });

				    });

				}

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


			hoverElement: {

				init: function() {
					var $allElementHover = $(".hover-item", $sel.body);

					$allElementHover.each(function() {
						var $element = $(this);

						$($element).on("mouseenter", function() {
							var $hoverItem = $(this),
								$elementId = $hoverItem.attr("id"),
								$hoverBlock = $sel.body.find("[data-hover='" + $elementId + "']");

							if (!$hoverBlock.hasClass("hover-block")) {
								$hoverBlock.addClass("hover-block");
							}

						});

						$($element).on("mouseleave", function() {
							var $hoverItem = $(this),
								$elementId = $hoverItem.attr("id"),
								$hoverBlock = $sel.body.find("[data-hover='" + $elementId + "']");

							if ($hoverBlock.hasClass("hover-block")) {
								$hoverBlock.removeClass("hover-block");
							}

						});

					});
				}
			},

			search: {
				init: function() {
					$(".search-input", $sel.body).autocomplete({
						minChars: 3,
						groupBy: "category",
						lookup: [
							{
								value: "Пиджак",
								data: {
									category: "Одежда",
									img: "/dummy/catalog/1.jpg"
								}
							}, {
								value: "Пальто",
								data: {
									category: "Одежда",
									img: "/dummy/catalog/2.jpg"
								}
							}, {
								value: "Галстук",
								data: {
									category: "Одежда",
									img: "/dummy/catalog/3.jpg"
								}
							}, {
								value: "Классическая рубашка",
								data: {
									category: "Одежда",
									img: "/dummy/catalog/4.jpg"
								}
							}, {
								value: "Adidas",
								data: {
									category: "Обувь",
									img: "/dummy/actions/1.jpg"
								}
							}, {
								value: "Adidas",
								data: {
									category: "Магазин",
									img: "/dummy/actions/2.jpg"
								}
							}, {
								value: "Nike",
								data: {
									category: "Обувь",
									img: "/dummy/actions/2.jpg"
								}
							}, {
								value: "Nike",
								data: {
									category: "Магазин",
									img: "/dummy/actions/2.jpg"
								}
							}
						],
						formatResult: function(suggestion, currentValue) {
							var strItem = " ";
							strItem += '<a href="#" class="search-item">' + '<div class="search-item-name">' + suggestion.value.replace(currentValue, "<b>" + currentValue + "</b>") + " / " + suggestion.data.category +'</div>' + '</a>';
							return strItem;
						},


					});

				}
			},

			slider: {

				init: function() {

					$(".owl-carousel").owlCarousel({
					    nav: false,
						items: 1,
						autoplay: true,
						autoplayTimeout: 5000,
						dots: true,
						dotClass: "dots-item",
					    responsive:{
					        0: {
					            items:1
					        },
					        600: {
					            items:1
					        },
					        1000: {
					            items:1
					        }
					    }
					});

				},

			},

			stickBlock: {

				init: function() {
					$(".shops-detail-information").stick_in_parent({
						container: $(".shops-detail-col"),
						offset_top: 50
					});
				},

			},

			toggler: {
				init: function() {
					var self = this;
					$(".text-toggler", $sel.body).on("click", function(e) {
						var $toggler = $(this);
						if($toggler.data("show")) {
							self.hide($toggler);
							$toggler.data("show", false);
						} else {
							$toggler.data("show", true);
							self.show($toggler);
						}
						e.preventDefault();
					});
				},
				show: function($toggler) {
					$($toggler.data("text")).css("display", "block");
					(function($text) {
						setTimeout(function() {
							$text.addClass("show");
						}, 100);
					})($($toggler.data("text")));
				},
				hide: function($toggler) {
					$($toggler.data("text")).removeClass("show").css("display", "none");
				}
			},


			accordion: {

				init: function() {
					var self = this;
					var $accordionItem = $(".acordeon-container-item");

					$accordionItem.on("mouseenter", function() {
						var $item = $(this),
							itemColor = $item.data("color");
						if (!$item.hasClass("acordeon-container-item--active")) {
							$item.css("background", itemColor);
						}
					});

					$accordionItem.on("mouseleave", function() {
						var $item = $(this),
							itemColor = $item.data("color");
						if (!$item.hasClass("acordeon-container-item--active")) {
							$item.css("background", "transparent");
						}
					});

					$accordionItem.on("click", function(e) {
						var $item = $(this),
							itemColor = $item.data("color");

						if (!$item.hasClass("acordeon-container-item--active")) {
							var curHeight = $item.height(),
								autoHeight = $item.css("height", "auto").height();

							$item.height(curHeight);

							self.animateToggle($item.css("background", itemColor), autoHeight, 50, true);
							setTimeout(function() {
								GORIZONT.common.go($item.offset().top, 500);
							}, 350);

							self.animateToggle($item.siblings().css("background", "transparent"), curHeight, 10, false);

						} else if ($item.hasClass("acordeon-container-item--active")) {
							self.animateToggle($item, "150px", 50, false);
						}
					});

				},

				animateToggle: function(block, heightElement, time, classElement) {
					block.animate({ height: heightElement }, time , function() {
						if (classElement == true) {
							block.addClass("acordeon-container-item--active");
						} else if (classElement == false) {
							block.removeClass("acordeon-container-item--active");
						}
					});
				}


			}


		};

	})();

	GORIZONT.accordion.init();
	ymaps.ready(function() {
		GORIZONT.yandexMap.init();
	});
	GORIZONT.toggler.init();
	GORIZONT.stickBlock.init();

	GORIZONT.ajaxForm.init();
	GORIZONT.slider.init();

	GORIZONT.hoverElement.init();
	GORIZONT.search.init();

	GORIZONT.goTop();
	GORIZONT.form.init();

	GORIZONT.gallery();
	GORIZONT.initAjaxLoader();

	GORIZONT.menu();
	GORIZONT.dropdown.init();

})(jQuery);
