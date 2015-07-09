class Step {
	constructor(config = {}) {
		self.elem = config.elem;
		self.text = config.text;
		self.before = typeof before == Function ? before : function(){};
		self.tooltip = config.tooltip;
		self.cta = config.cta || 'Next';
	}

	render() {

	}

	next() {

	}

	static cloneElement(elem) {
		var clone = $(elem).clone(),
			style = document.defaultView.getComputedStyle($(elem)[0],"").cssText;
		clone[0].style.cssText = style;
		clone.css({'z-index': 20, position:'absolute'});
		clone.offset($(elem).offset());
		return clone;
	}

	static overlay(clones) {
		var overlay = $("<div class='overlay'></div>");
		// left = $(elem).offset().left,
		// top = $(elem).offset().top

		//clone.css({'z-index': 20, position:'absolute', top: top, left, left});
		overlay.css({top: 0, left: 0, background: 'black', 'z-index':10, opacity: 0.5, position:'absolute', height: '1000px', width: '100%'});
		$("body").append(clones);
		$("body").append(overlay);
	}
}

export default Step;
