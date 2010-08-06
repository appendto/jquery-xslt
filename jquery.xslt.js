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

	var rXml = /^\s*</;
	
	$.fn.xslt = function(xml, xsl, completeHandler) {
		(document.recalc ? ie : mokit).call(this, xml, xsl, $(this), completeHandler || oncomplete);
  
		return this;
	}
  
  function ie(xml, xsl, target, callback){
		var xm = document.createElement('xml'),
			xs = document.createElement('xml'),
			complete = 'complete';
							
		xm.onreadystatechange = function(){
			if(xm.readyState == complete){
				xs[rXml.test(xsl) ? "innerHTML" : "src"] = xsl;		
			}
		};

		xs.onreadystatechange = function(){
			if(xs.readyState == complete){
				window.setTimeout(function() {
					target.html(xm.transformNode(xs.XMLDocument));
					callback();
				}, 50);
			}
		};	
		
		xm[rXml.test(xml) ? "innerHTML" : "src"] = xml;
		target.append(xm).append(xs);
  }
  
  function load(data, callback){
		var o;
		
		if (rXml.test(data)) {
			o = new DOMParser().parseFromString(data, "text/xml");
			callback(o);
		}
		else {
			$.ajax({
				dataType: "xml",
				url: data,
				success: function(response){
					o = response;
					callback(o);
				}
			});
		}  
  }
  
  function mokit(xml, xsl, target, callback){
  
		var processor = new XSLTProcessor(), xm, xs,
			transform = function() {
				processor.importStylesheet(xs);
				resultDoc = processor.transformToFragment(xm, document);
				target.empty().append(resultDoc);
				callback();
			};

		load(xml, function(o){
			xm = o;
			load(xsl, function(o){
				xs = o;
				transform();
			});
		});
  }  
})(jQuery);
