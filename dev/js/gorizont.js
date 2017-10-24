(function($) {
	var GORIZONT = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);
		$sel.menuBurger = $(".mobile-header-burger", $sel.body);

		return {

			scrollAnimation: {

				blocks: [],
				init: function() {
					var self = this;
					$("[data-animationtype]:not(.animated), [data-animation]:not(.animated)").each(function() {
						var $item = $(this);
						self.blocks.push({
							"html": $item,
							"top": $item.offset().top
						});
						$item.addClass("beforeanimate");
					});

					$sel.window.on("scroll", function() {
						self.check();
					});
					setTimeout(function() {
						self.check();
					}, 50);

				},
				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.15;
					for(var i = 0, len = self.blocks.length; i < len; i++) {
						block = self.blocks[i],
						blockTop = parseInt(block.top, 10);
						if(block.html.hasClass("animated")) {
							continue;
						}
						if(top + buffer >= blockTop) {
							block.html.addClass("animated");
						}

					}
				}

			},

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
									}, 100);
									GORIZONT.reload()
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

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: false
					});
					var $selects = $("select", $container);
					$selects.each(function(i) {
						var $select = $(this),
							selectPlaceholder = $select.attr("placeholder");

						jcf.replace($select);
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

					self.sendForm();
				},

				modalForm: function() {
					$(".contacts-application").magnificPopup({
						type: "inline",
						mainClass: "mfp-form",
						closeMarkup: '<button title="%title%" class="mfp-close"><img src="../svg/icons/close_white.svg" width="20" height="20" class="mfp-close-icn mfp-close"/></button>',
						removalDelay: 300,
					});

					$(".conventions").magnificPopup({
						type: "inline",
						mainClass: "mfp-conventions",
						closeMarkup: '<button title="%title%" class="mfp-close"><img src="../svg/icons/close_white.svg" width="20" height="20" class="mfp-close-icn mfp-close"/></button>',
						removalDelay: 300,
					});
				},

				sendForm: function() {

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

								GORIZONT.reload()
				            },
				        });

				    });

				},

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

			searchSite: {
				init: function() {
					$(".search-input", $sel.body).autocomplete({
						minChars: 3,
						groupBy: "category",
						source: false,
						lookup: [
							{
								value: "Пальто",
								data: {
									category: "Одежда",
								}
							}, {
								value: "Спортмастер",
								data: {
									id: "sportmaster",
									category: "Магазин Спортмастер 1-этаж",
								}
							}, {
								value: "Ostin",
								data: {
									id: "ostin",
									category: "Магазин Ostin 3-этаж"
								}
							}, {
								value: "Zolla",
								data: {
									id: "zolla",
									category: "Магазин Zolla 1-этаж"
								}
							}, {
								value: "Adidas",
								data: {
									id: "adidas",
									category: "Магазин Adidas 1-этаж"
								}
							}, {
								value: "Nike",
								data: {
									id: "nike",
									category: "Магазин Nike 3-этаж"
								}
							}, {
								value: "H&M",
								data: {
									id: "HM",
									category: "Магазин H&M 2-этаж"
								}
							}
						],
						formatResult: function(suggestion, currentValue) {
							var strItem = " ";

							itemName = suggestion.value.toUpperCase().replace(currentValue.toUpperCase(), "<b>" + currentValue.toUpperCase() + "</b>");
							strItem += '<a href="#" class="search-item" data-tooltip-element="'+ suggestion.data.id + '">' + '<div class="search-item-name">' + itemName + " / " + suggestion.data.category +'</div>' + '</a>';
							return strItem;
						},
						onSelect: function(suggestion, element) {
							if(suggestion.data.id) {
								GORIZONT.schema.searchElementSchema(suggestion.data.id);
							}
						}

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
						smartSpeed: 700,
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

							self.animateToggle($item.css("background", itemColor), autoHeight, 100, true);

							self.animateToggle($item.siblings().css("background", "transparent"), curHeight, 100, false);

							setTimeout(function() {
								if ($(window).width() <= 768) {
									setTimeout(function() {
										GORIZONT.common.go($item.offset().top-90, 500);
									}, 350);

								} else {
									setTimeout(function() {
										GORIZONT.common.go($item.offset().top, 500);
									}, 350);
								}
							}, 350);



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


			},

			menuMobile: {
				isShow: false,
				init: function() {
					var self = this;
					$sel.body.append('<div class="menu-overlay"></div>');
					$sel.menuBurger.on("click", function() {
						self.isShow ? self.hide() : self.show();
					});

					$(".menu-overlay", $sel.body).on("click", function() {
						self.hide();
					});

					$(".mobile-panel-section-item-close", $sel.body).on("click", function() {
						self.hide();
					});
				},
				show: function() {
					this.isShow = true;
					$sel.menuBurger.addClass("active");
					$sel.body.addClass("show-menu");
				},
				hide: function() {
					this.isShow = false;
					$sel.menuBurger.removeClass("active");
					$sel.body.removeClass("show-menu");
				}
			},

			// Initialize scripts for each window size
			initSSM: function() {
				var self = this;

				ssm.addStates([
					{
						// Tablets in landscape orientation
						id: "tabletLandscape",
						query: "(max-width: 1000px)",
						onEnter: function() {
							self.menuMobile.init();
						},
						onLeave: function() {

						}
					}
				]);

			},

			load: {
				isLoad: false,
				$content: null,

				init: function() {
					var self = this;
					self.$content = $(".page-content-inner", $sel.body);

					$(".animation-link").on("click", function(e) {
						GORIZONT.load.page($(this).attr("href"));
						history.pushState( { urlPath: $(this).attr("href") } , "", $(this).attr("href") );
						e.preventDefault();
					});
				},

				page: function(url) {

					var self = this;

					if(self.isLoad) {
						return false;
					}

					setTimeout(function() {
						self.isLoad = true;
						self.$content.addClass("loading");

						setTimeout(function() {
							$.ajax({
								url: url,
								success: function(html) {
									self.isLoad = false;
									var $html = $('<div />').append(html);
									self.$content.empty().append($html.find(".page-content-inner").html());
									self.$content.removeClass("loading");

									GORIZONT.reload();
								}
							});
						}, 200);

					}, 320);
				}
			},

			animateButton: function() {

				$(".rippler").rippler({
					effectClass : "rippler-effect",
					effectSize  :  16,
					addElement  : "div",
					duration    :  800,
				});

			},

			schema: {
				$svg: false,
				$svgContainer: true,
				loaded: false,
				$oneScheme: false,

				init: function() {
					var self = this;

					self.preload();

					setTimeout(function() {
						self.LightenDarkenColor.init();
					}, 3000);

					self.toggleFloor.init();

				},

				preload: function() {
					var self = this;

					$(".page-preloader").addClass("active-block");

					setTimeout(function() {
						$(".page-preloader").addClass("active");
					}, 600);

					$sel.window.on("load", function() {
						$("html, body").animate({ scrollTop: 0 }, 100);

						setTimeout(function() {
							$(".page-preloader").removeClass("active");

							setTimeout(function() {

								$(".scheme").addClass("active-block");

								self.$svg = $(".scheme-inner-container svg");

								self.$oneScheme = $(".scheme-inner-container").find("svg:not(.scheme-inner-container-svg-clone svg)");

								self.$svgContainer = $(".scheme-inner-container-svg").parents(".scheme-inner");

								posQuatity = self.Zoom();
								self.dragSchema(self.$svgContainer, self.$svg, posQuatity);

								self.tooltip($("[data-tooltip-element]"));

							}, 1800);

							setTimeout(function() {
								$(".scheme").addClass("active");
							}, 2000);

						}, 2200);

					});
					setTimeout(function() {
						$(".page-preloader").removeClass("active-block");

						self.hoverElementSchema.init(false, $(".scheme-inner-container").find("svg:not(.scheme-inner-container-svg-clone svg)"));

					}, 6000);

				},

				Zoom: function() {
					var self = this,
						$zoomIn = $(".scheme-controls-zplus"),
						$zoomOut = $(".scheme-controls-zminus");

					$zoomIn.on("click", function() {
						var $buttonZoom = $(this)
							zoomQuantity = $zoomIn.attr("zoom-quantity");

						if (zoomQuantity < 10) {

							resultQuatity = +zoomQuantity + 0.5;

							self.$svg.css({
								'-webkit-transform' : "scale(" + resultQuatity + ")",
								'-moz-transform'    : "scale(" + resultQuatity + ")",
								'-ms-transform'     : "scale(" + resultQuatity + ")",
								'-o-transform'      : "scale(" + resultQuatity + ")",
								'transform'         : "scale(" + resultQuatity + ")"
							});

							$zoomIn.attr("zoom-quantity", resultQuatity);

							self.dragSchema(self.$svgContainer, self.$svg, +zoomQuantity-0.5);

						}
					});

					$zoomOut.on("click", function() {
						var $buttonZoom = $(this)
							zoomQuantity = $zoomIn.attr("zoom-quantity");

						if (zoomQuantity <= 10 && zoomQuantity > 1) {

							resultQuatity = +zoomQuantity - 0.5;

							$containerSvgWidth = self.$svg.parent().width() / resultQuatity;
							$containerSvgHeight = self.$svg.parent().height() / resultQuatity;

							self.$svg.css({
								"-webkit-transform" : "scale(" + resultQuatity + ")",
								"-moz-transform"    : "scale(" + resultQuatity + ")",
								"-ms-transform"     : "scale(" + resultQuatity + ")",
								"-o-transform"      : "scale(" + resultQuatity + ")",
								"transform"         : "scale(" + resultQuatity + ")",
							});

							$zoomIn.attr("zoom-quantity", resultQuatity);

							self.dragSchema(self.$svgContainer, self.$svg, +zoomQuantity-0.5);

						}
						if (zoomQuantity == 1.5) {
							setTimeout(function() {
								self.$svgContainer.animate({
									"left" : "0",
									"top"  : "0",
								}, 100);
							}, 200);
						} else {
							initialPosX = self.$svg.parent().position().left;
							initialPosY = self.$svg.parent().position().top;
							setTimeout(function() {
								self.$svgContainer.animate({
									"left" : initialPosX - (initialPosX / zoomQuantity),
									"top"  : initialPosY - (initialPosY / zoomQuantity),
								}, 500);
							}, 200);

						}

					});

					return 2

				},

				searchElementSchema: function(shopId) {
					var self = this;

					self.$svg.find("path").removeAttr("class");

					$itemSvg = self.$oneScheme.find("path[data-tooltip-element=" + shopId + "]");

					self.hoverElementSchema.init($itemSvg, false);

					numFloor = $itemSvg.parents(".scheme-inner-container-svg").attr("id");

					if (!$itemSvg.parents(".scheme-inner-container-svg").hasClass("active")) {
						self.toggleFloor.init(numFloor);
					}

					self.$svg.find("path[data-tooltip-element]").tooltipster('close');

					setTimeout(function() {
						self.$oneScheme.find("path[data-tooltip-element=" + shopId +"]").tooltipster('open');
					}, 500);

				},

				hoverElementSchema: {

					init: function(element=false, svg) {
						var self = this;

						if (element) {
							if (!element.attr("class")) {
								element.removeAttr("class");
								element.attr("class", "active");

								initColor = element.attr("fill");
								element.attr("data-color", initColor);

								changeColor = GORIZONT.schema.LightenDarkenColor.changeColor(initColor, -50);
								element.attr("fill", changeColor);

								setTimeout(function() {
									element.removeAttr("class");
									dataInitColor = element.attr("data-color");
									element.attr("fill", dataInitColor);
								}, 3500);

							}
							return;
						}

						svg.find("path").each(function() {
							var $elementSvg = $(this);

							$($elementSvg).on("mouseenter", function() {
								var $hoverElementSvg = $(this);

								if (!$hoverElementSvg.attr("class")) {
									$hoverElementSvg.attr("class", "active");

									initColor = $hoverElementSvg.attr("fill");
									$hoverElementSvg.attr("data-color", initColor);

									changeColor = GORIZONT.schema.LightenDarkenColor.changeColor(initColor, -50);
									$hoverElementSvg.attr("fill", changeColor);
								}

							});

							$($elementSvg).on("mouseleave", function() {
								var $hoverElementSvg = $(this);

								if ($hoverElementSvg.attr("class")) {

									$hoverElementSvg.removeAttr("class");

									dataInitColor = $hoverElementSvg.attr("data-color");
									$hoverElementSvg.attr("fill", dataInitColor);
								}

							});

						});

					},

				},

				dragSchema: function (schemaBlock, schemaSvg, valueQuantity) {
					var schemaSvgMaxWidth = schemaBlock.width()/valueQuantity;
						schemaSvgMaxHeight = schemaBlock.height()/valueQuantity;

					schemaBlock.draggable({
				        containment: $(this).parent(),
						cursor: "-webkit-grabbing",
						drag: function() {
							/*var leftPosition = ui.position.left,
								topPosition = ui.position.top;


							if (leftPosition > "1200") {
								ui.position.left = "1200";
							}
							if (leftPosition < "-1200") {
								ui.position.left = "-1200";
							}
							if (topPosition > "650") {
								ui.position.top = "650";
							}
							if (topPosition < "-650") {
								ui.position.top = "-650";
							}*/
						}
				    });
				},

				tooltip: function($tooltipElement) {

					if ($(window).width() <= 768) {
						$trigger = "click";
					} else {
						$trigger = "hover";
					}

					$tooltipElement.tooltipster({
						content: "loading....",
						contentCloning: true,

						contentAsHTML: true,
						interactive: true,

						animation: "fade",
						animationDuration: 300,
						distance: -35,

						updateAnimation: "fade",

						theme: ["tooltipster-white"],

						trigger: $trigger,

						functionBefore: function(instance, helper) {
							instance.content("");

							var idOrigin = helper.origin.dataset.tooltipElement;

							elementBlock = $sel.body.find("[data-shop="+idOrigin+"]");

							instance.content(elementBlock);

							// for getting information about the store from a file

				            /*$.get("tooltip-element.php", function(data) {
								jsonToolTip = $.parseJSON(data);

								for (var itemIdShop = 0; itemIdShop < jsonToolTip.length; itemIdShop++) {

									if (idOrigin == jsonToolTip[itemIdShop].id) {


										instance.content('<div id="'+idOrigin+'" class="tooltip-container"><p>'+ jsonToolTip[itemIdShop].id.toUpperCase() +'</p><p>т.'+ jsonToolTip[itemIdShop].mobile +'</p><p>'+ jsonToolTip[itemIdShop].shopProducts +'</p><p>'+ jsonToolTip[itemIdShop].timeWork +'</p><a href="shops_detail.html" class="link link--darkgray tooltip-container-link animation-link rippler rippler-default">Узнать больше</a></div><div class="tooltip-close"><span>x</span></div>');

										$(".tooltip-close").on("click", function(){
											instance._$origin.tooltipster("hide");
										});
										return;
									} else {
										instance.content("<span class='no-info'>Информация по данному магазину отсутствует</span>");
									}

								}

				            });*/

					    },

						functionReady: function(instance, helper) {
							$sel.body.find(".tooltip-close").on("click", function(){
								instance._$origin.tooltipster("hide");
							});
						},
					});

				},

				toggleFloor: {

					init: function(numFloor=false) {

						var self = this,
							$tabsScheme = $sel.body;

						if (numFloor) {
							self.hideAll($tabsScheme, function() {
								self.show(numFloor, $tabsScheme);
							});
						}

						$(".scheme-information-floor-item").on("click", function(e) {
							var $item = $(this),
								itemDataFloor = $item.data("floor");

							$(".scheme-inner-container svg").find("path[data-tooltip-element]").tooltipster('close');

							if(!$tabsScheme.hasClass("inactive")) {
								if(!$item.hasClass("active")) {
									self.hideAll($tabsScheme, function() {
										self.show(itemDataFloor, $tabsScheme);
									});
								}
								e.preventDefault();
							}
						});

						$(".scheme-information-floor-item-select").on("change", function(e) {
							var $item = $(this),
								itemDataFloor = $item.val();

							$(".scheme-inner-container svg").find("path[data-tooltip-element]").tooltipster('close');

							if(!$tabsScheme.hasClass("inactive")) {
								if(!$item.hasClass("active")) {
									self.hideAll($tabsScheme, function() {
										self.show(itemDataFloor, $tabsScheme);
									});
								}
								e.preventDefault();
							}
						});

					},

					show: function(itemDataFloor, $tabsScheme) {
						$(".scheme-information-floor-item[data-floor*=" + itemDataFloor + "]", $tabsScheme).addClass("active");
						$(".scheme-inner-container-svg[id*=" + itemDataFloor + "]", $tabsScheme).addClass("active");

						setTimeout(function() {
							$(".scheme-inner-container-svg[id*=" + itemDataFloor + "]", $tabsScheme).addClass("active-scheme-svg");
						}, 100);

					},

					hideAll: function($tabsScheme, callback) {
						$(".scheme-information-floor-item", $tabsScheme).removeClass("active");

						$(".scheme-inner-container-svg", $tabsScheme).removeClass("active-scheme-svg");

						setTimeout(function() {
							$(".scheme-inner-container-svg", $tabsScheme).removeClass("active");
							if(callback) {
								callback();
							}
						}, 100);

					},

				},

				LightenDarkenColor: {

					init: function() {
						var self = this,
							$allSvg = $(".scheme-inner-container-svg").children("svg"),
							elementSvg = $("path", $allSvg),

							cloneSvg= $(".scheme-inner-container-svg-clone>svg", $sel.body);

						elementSvg.each(function() {
							var item = $(this),
								idItem = item.attr("d"),
								colorItem = item.attr("fill"),
							    lightColor = self.changeColor(colorItem, -20);

							$cloneLement = cloneSvg.find('path[d="' + idItem + '"]').attr("fill", lightColor);

						});
					},

					changeColor: function(col, amt) {

						var usePound = false;

						if (col[0] == "#") {
							col = col.slice(1);
							usePound = true;
						}

						var num = parseInt(col,16);

						var r = (num >> 16) + amt;

						if (r > 255) r = 255;
						else if  (r < 0) r = 0;

						var b = ((num >> 8) & 0x00FF) + amt;

						if (b > 255) b = 255;
						else if  (b < 0) b = 0;

						var g = (num & 0x0000FF) + amt;

						if (g > 255) g = 255;
						else if (g < 0) g = 0;

						return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

					}
				}
			}
		};

	})();

	GORIZONT.load.init();

	GORIZONT.scrollAnimation.init();

	GORIZONT.accordion.init();

	ymaps.ready(function() {
		GORIZONT.yandexMap.init();
	});
	GORIZONT.toggler.init();
	GORIZONT.stickBlock.init();
	GORIZONT.initSSM();


	GORIZONT.slider.init();

	GORIZONT.hoverElement.init();
	GORIZONT.searchSite.init();

	GORIZONT.goTop();
	GORIZONT.form.init();

	GORIZONT.gallery();
	GORIZONT.initAjaxLoader();

	GORIZONT.menu();
	GORIZONT.dropdown.init();

	GORIZONT.animateButton();

	GORIZONT.schema.init();

	GORIZONT.reload = function() {
		GORIZONT.load.init();

		GORIZONT.scrollAnimation.init();

		GORIZONT.accordion.init();
		ymaps.ready(function() {
			GORIZONT.yandexMap.init();
		});
		GORIZONT.toggler.init();
		GORIZONT.stickBlock.init();

		GORIZONT.slider.init();

		GORIZONT.hoverElement.init();
		GORIZONT.searchSite.init();

		GORIZONT.goTop();
		GORIZONT.form.init();

		GORIZONT.gallery();

		GORIZONT.menu();
		GORIZONT.dropdown.init();

		GORIZONT.animateButton();

	}

})(jQuery);
