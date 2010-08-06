/*!
 * jQuery.xslt - jQuery client-side XSL Transformation plugin.
 *
 * Version: 1.0
 * Released: 2010-08-06
 * Source: http://github.com/appendto/jquery-xslt
 * Author: Andrew Powell (http://shellscape.org)
 * Based on jquery.xslt written by  Johann Burkard jb@eaio.com - http://johannburkard.de/software/xsltjs/
 * License: MIT,GPL
 * 
 * Copyright (c) 2010 appendTo LLC.
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function($) {

	var rXml = /^\s*</, oncomplete = function(){};
	
	$.fn.xslt = function(xml, xsl, completeHandler) {
		
		var target = $(this);

		oncomplete = completeHandler || oncomplete;

		if(document.recalc){
			ie(xml, xsl, target);
		}
		else{
			mokit(xml, xsl, target);
		}
  
		return this;
	}
  
  function ie(xml, xsl, target){
		var xm = document.createElement('xml'),
			xs = document.createElement('xml'),
			ready = function() {
				var c = 'complete';
				if (xm.readyState == c && xs.readyState == c) {
					window.setTimeout(function() {
						target.html(xm.transformNode(xs.XMLDocument));
						oncomplete();
					}, 50);
				}
			};
							
		xm.onreadystatechange = ready;
		xm[rXml.test(xml) ? "innerHTML" : "src"] = xml;

		xs.onreadystatechange = ready;
		xs[rXml.test(xsl) ? "innerHTML" : "src"] = xsl;

		target.append(xm).append(xs);
  }
  
  function mokit(xml, xsl, target){
  
		var processor = new XSLTProcessor(),
			xm,
			xs,
			transform = function() {
				processor.importStylesheet(xs);
				resultDoc = processor.transformToFragment(xm, document);
				target.empty().append(resultDoc);
				oncomplete();
			},
			loadXsl = function(){
				if (rXml.test(xsl)) {
					xs = new DOMParser().parseFromString(xsl, "text/xml");
					transform();
				}
				else {
					xs = $.ajax({ 
						dataType: "xml",
						url: xsl,
						success: function(response){
							xs = response;
							transform();
						}
					});
				}
			};

			if (rXml.test(xml)) {
				xm = new DOMParser().parseFromString(xml, "text/xml");
				loadXsl();
			}
			else {
				$.ajax({
					dataType: "xml",
					url: xml,
					success: function(response){
						xm = response;
						loadXsl();
					}
				});
			}
  }  
})(jQuery);
