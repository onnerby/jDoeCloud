(function($) {
	$.fn["doecloud"] = function(options) {
		return this.each(function() {
			var $this = $(this);
			var opts = $this.data('options');
			if(!opts) {
				  opts = $.extend({}, $.fn.doecloud.defaults, options);
			}else{
				$.extend(opts, options);
				$this.data('options', opts);
			}
			if(opts.ui){
				$(this).addClass('ui-widget');
				$(this).addClass('ui-widget-content');
				$(this).addClass('ui-corner-all');
			}

			var width	= opts.width;
			if(!width){
				width=$(this).width();
			}
			var height	= opts.height;
			if(!height){
				height=$(this).height();
			}
			
			var rel		= height/width;
			var rel2		= rel*rel;
			var rel2e		= rel2;
			$(this).css({overflow:'hidden',width:width+'px',height:height+'px',position:'relative'});
			
			var maxSize	= -1;
			var maxFontsize	 	= opts.maxFontSize;
			var endFontSize		= opts.minFontSize;
			var maxCount		= opts.maxCount;
			var count	= 0;
			var cX	= width*0.5;
			var cY	= height*0.5;
			var spacing = opts.spacing;
			
			var cloud	= [];
			var linesXf	= [];
			var linesXs	= [];
			var linesYf	= [];
			var linesYs	= [];
			
			$(this).find(opts.itemSelector).each(function(){
				if(opts.ui){
					$(this).addClass('ui-state-default');
					$(this).addClass('ui-corner-all');
				}

				var first	= false;
				var val		= parseInt($(this).attr(opts.valueAttribute));
				if(maxSize==-1){
					maxSize	= val;
					first	= true;
				}
				var fontSize	= endFontSize+(maxFontsize-endFontSize)*val/maxSize;
				count++;
				if(count>maxCount){
					$(this).css('display','none');
					return true;
				}
				$(this).css({position:'absolute',display:'inline-block','font-size':Math.round(fontSize)+'px'});
				var iW	= $(this).outerWidth()+spacing;
				var iH	= $(this).outerHeight()+spacing;
				var iX	= Math.round(-iW*0.5);
				var iY	= Math.round(-iH*0.5);
				var radius2	= 10000000;
				var lastRadius2	= 0;
	
				// Lets try everything
				var pX	= 0;
				var pcX	= 0;
				var pcX2	= 0;
				var pY	= 0;
				var pcY	= 0;
				var pcY2	= 0;
				
				//////////////////////////////////////////
				// left
				var l1=linesXf.length;
				for(var i=0;i<l1;i++){
					pX	= linesXf[i]-iW;
					pcX	= linesXf[i]-iW*0.5;
					//pcX	*= rel;
					pcX2	= pcX*pcX;
					if(pcX2*rel2e<lastRadius2){
						continue;
					}
					
					// Try middle first
					pY	= -iH*0.5;
					pcY	= 0;
					
					if(pcX2*rel2<radius2){
						// Object closer
						// Collision?
						if(!doeCollision(cloud,pX,pY,iW,iH)){
							iX	= pX;
							iY	= pY;
							radius2=pcX2*rel2;
						}
					}
					/////////////////////////
					// Top
					var l2=linesYf.length;
					for(var j=0;j<l2;j++){
						pY	= linesYf[j]-iH;
						pcY	= linesYf[j]-iH*0.5;
						pcY2	= pcY*pcY;

						// Closer?
						if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
							// Object closer
							// Collision?
							if(!doeCollision(cloud,pX,pY,iW,iH)){
								iX	= pX;
								iY	= pY;
								radius2=pcY2+pcX2*rel2;
							}
						}
					}
					/////////////////////////
					// Bottom
					var l2=linesYf.length;
					for(var j=0;j<l2;j++){
						pY	= linesYs[j];
						pcY	= linesYs[j]-iH*0.5;
						pcY2 = pcY*pcY;
						// Closer?
						if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
							// Object closer
							// Collision?
							if(!doeCollision(cloud,pX,pY,iW,iH)){
								iX	= pX;
								iY	= pY;
								radius2=pcY2+pcX2*rel2;
							}
						}
					}
				}
	
				//////////////////////////////////////////
				// right
				var l1=linesXs.length;
				for(var i=0;i<linesXs.length;i++){
					pX	= linesXs[i];
					pcX	= linesXs[i]+iW*0.5;
					//pcX	*= rel;
					pcX2	= pcX*pcX;
					if(pcX2*rel2e<lastRadius2){
						continue;
					}

					// Try middle first
					pY	= -iH*0.5;
					pcY	= 0;
					pcY2	= 0;
					if(pcX2*rel2<radius2){
						// Object closer
						// Collision?
						if(!doeCollision(cloud,pX,pY,iW,iH)){
							iX	= pX;
							iY	= pY;
							radius2=pcX2*rel2;
						}
					}
					/////////////////////////
					// Top
					var l2=linesYf.length;
					for(var j=0;j<l2;j++){
						pY	= linesYf[j]-iH;
						pcY	= linesYf[j]-iH*0.5;
						pcY2	= pcY*pcY;
						// Closer?
						if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
							// Object closer
							// Collision?
							if(!doeCollision(cloud,pX,pY,iW,iH)){
								iX	= pX;
								iY	= pY;
								radius2=pcY2+pcX2*rel2;
							}
						}
					}
					/////////////////////////
					// Bottom
					var l2=linesYs.length;
					for(var j=0;j<l2;j++){
						pY	= linesYs[j];
						pcY	= linesYs[j]+iH*0.5;
						pcY2	= pcY*pcY;
						// Closer?
						if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
							// Object closer
							// Collision?
							if(!doeCollision(cloud,pX,pY,iW,iH)){
								iX	= pX;
								iY	= pY;
								radius2=pcY2+pcX2*rel2;
							}
						}
					}
				}
				////////////////////////
				// center top
				pX	= -iW*0.5;
				pcX	= 0;
				pcX2	= 0;
				var l1=linesYf.length;
				for(var i=0;i<l1;i++){
					pY	= linesYf[i]-iH;
					pcY	= linesYf[i]-iH*0.5;
					pcY2	= pcY*pcY;
					if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
						// Object closer
						// Collision?
						if(!doeCollision(cloud,pX,pY,iW,iH)){
							iX	= pX;
							iY	= pY;
							radius2=pcY2+pcX2*rel2;
						}
					}
				}
				////////////////////////
				// center bottom
				var l1=linesYs.length;
				for(var i=0;i<l1;i++){
					pY	= linesYs[i];
					pcY	= linesYs[i]+iH*0.5;
					pcY2	= pcY*pcY;
					if(pcY2+pcX2*rel2<radius2 && pcY2+pcX2*rel2e>lastRadius2){
						// Object closer
						// Collision?
						if(!doeCollision(cloud,pX,pY,iW,iH)){
							iX	= pX;
							iY	= pY;
							radius2=pcY2+pcX2*rel2;
						}
					}
				}
				$(this).css({left:(cX+iX)+'px',top:(cY+iY)+'px'});
				linesXf.push(iX);
				linesXs.push(iX+iW);
				linesYf.push(iY);
				linesYs.push(iY+iH);
				cloud.push({x:iX+1,y:iY+1,w:iW-2,h:iH-2});
				lastRadius2	= radius2;
			});
			
		});
	};
	
	$.fn.doecloud.defaults = {
		itemSelector: ' > li',
		valueAttribute: 'title',
		width: 0,
		height: 0,
		spacing: 0,
		maxFontSize: 40,
		minFontSize: 4,
		maxCount: 100,
		promote: true, 
		ui: true
  };	
})(jQuery);

function doeCollision(objects,x,y,width,height){
	var l=objects.length;
	for(var i=0;i<l;i++){
		var o=objects[i];
		if(
			(x+width)>=o.x && x<=(o.x+o.w) && 
			(y+height)>=o.y && y<=(o.y+o.h) 
		){
			return true;
		} 
	}
	return false;
}

