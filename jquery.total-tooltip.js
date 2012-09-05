(function ($) {
	$.fn.destroy_tooltips = function(unique_class, callback) {

		// quanto se tenta destruir o tooltip diretamente
		if($(this).is(".tooltip")){
			var tooltip = $(this);	
		
		// quanto se tenta destruir o tooltip via unique_class
		} else {
			var tooltip = $(".tooltip").filter("."+unique_class)
		}

		// destruição do tooltip
		setTimeout(function(){
			if(tooltip.is_touching() ) {
				tooltip.mouseleave(function(){ $(this).force_destroy(callback); });
			} else {
				tooltip.force_destroy(callback);
			}
		}, 100);

	}

	$.fn.force_destroy = function(callback){
		callback_function = callback;
		$(this).stop(true, false).animate(
			{
				opacity: 0,
				top: "-=40px"
			}, 100, function() {
				$(this).remove();
				if(typeof callback_function == "function") callback_function.call();
		});
	}


	$.fn.watch_touches = function(){
		$(this).hover(function(){
			$(this).attr("data-touching", "touching");
		}, function(){
			$(this).removeAttr("data-touching");
		})
	}

	$.fn.is_touching = function(){
		return $(this).is("[data-touching]");
	}

	$.fn.tooltip = function(contents, unique_class, options) {
		// assumindo valores padrões caso não sejam declarados
		if(typeof(options) 						== "undefined") options 					= {};
		if(typeof(options["coords"]) 			== "undefined") options["coords"] 			= $(this).offset();
		if(typeof(options["offsets"]) 			== "undefined") options["offsets"] 			= {left: 0, top: 0};
		if(typeof(options["offsets"]["left"]) 	== "undefined") options["offsets"]["left"] 	= 0;
		if(typeof(options["offsets"]["top"]) 	== "undefined") options["offsets"]["top"] 	= 0;
		if(typeof(options["time"]) 				== "undefined") options["time"] 			= -1;

		// forma meio tosca, porém funcional de simplificar as variáveis
		var coords 	= options["coords"];
		var offsets = options["offsets"];
		var time 	= options["time"];

		// declarações HTML da tip (pontinha) e do tooltip
		var tip = "<div class='tip'></div>";
		var tooltip = $("<div class='tooltip " + unique_class + "'>" + contents + tip +"</div>")

		// inserção do tooltip no DOM (porém nesse momento ele ainda está invisível)
		tooltip.prependTo("body"); //.css({opacity: 0});

		// algumas variáveis para ajudar no raciocínio matemático
		tamanho_da_tela 			= $(window).width();
		tamanho_do_tooltip 			= tooltip.outerWidth();
		metade_do_elemento_alvo 	= this.outerWidth()/2;
		metade_do_tooltip 			= tamanho_do_tooltip/2;
		altura_do_tooltip 			= tooltip.outerHeight();

		movimento_vertical 			= 15;

		// detectando se o tooltip ultrapassa a tela
		ultrapassa_a_tela = Math.max(0, (coords['left'] + tamanho_do_tooltip) - tamanho_da_tela);
		if (ultrapassa_a_tela > 0 ) tooltip.find(".tip").css({ marginLeft: (-15 + ultrapassa_a_tela) + "px" });

		// posicionamento e ...
		tooltip.css({
			left: coords['left'] - offsets['left'] + (metade_do_elemento_alvo - metade_do_tooltip) - ultrapassa_a_tela,
			top: (coords['top'] - offsets['top'] - altura_do_tooltip - 25 + movimento_vertical) + "px"
		});

		// aparecimento do tooltip
		tooltip.stop(true, true).animate({opacity: 1, top: parseInt(tooltip.css("top")) - movimento_vertical }, 150);

		// temporização do tooltip
		if(time > -1){
			var contagem = function(){
				if (time > 0) {
					time--;
					setTimeout(function(){contagem()}, 1000);
				} else {
					tooltip.destroy_tooltips();
				}
			}
			contagem();		
		}
		tooltip.watch_touches();

		return tooltip;
	}
})(jQuery);

