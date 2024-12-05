

// ==========================================================================================================
//    		MagicClock
//	Author: Al-Khafaji, Ali Kifah
//	Date:   11.08.2022
//  Description: A simple, yet powerful and easy modifiable analog clock for your website, made with pure Javascript
// ===========================================================================================================

class MagicClock {
    #clockRadius = 0;
	
    #hours;
    #minutes;
    #seconds;
    #scale = 0;
    #pivotPointHX = 0;
    #pivotPointHY = 0;
    #pivotPointMX = 0;
    #pivotPointMY = 0;
    #pivotPointSX = 0;
    #pivotPointSY = 0;
    #loader;
    #canvas = null;
    #ctx = null;

    #secondMinuteHandRotationCorrection = -15;
    #hourHandRotationCorrection = -3;
    #shadowWidth = 5;
    #frameWidth = 10;

    // Basic themes styles
    #secondHandColor = 'Black';
    #minuteHandColor = 'Black';
    #hourHandColor = 'Black';
    #backgroundColor = '#fffff';
    #borderColor;
    #timePointMarkerColor;
    #centralPointColor;



	#captions = [];

    constructor(PositionX, PositionY, width, theme = null) {
        if (width < 220)
            width = 220;
        this.#canvas = this.#initCanvas(PositionX, PositionY, width);
        this.#ctx = this.#canvas.getContext("2d");
        if (!this.#isValidTheme(theme)) {
            this.#loadColors("Black", "Black", "Black", "White");
            this.#initializeClockBasic();
        }
        else {
            if (theme["secondHandColor"] != undefined)
                this.#loadThemeBasic(theme);
            else
                this.#loadTheme(theme, this.#loadingComplete.bind(this), this.#onError.bind(this));
        }
		
		
    }
    #initCanvas(canvasX, canvasY, w) {
        let canvas = document.createElement('canvas');
        canvas.id = "clockCanvas";
        canvas.width = w;
        canvas.height = w;
        canvas.style.position = "absolute";
        document.body.appendChild(canvas);
        this.#clockRadius = canvas.width / 2;
        canvas.style.left = canvasX + "px";
        canvas.style.top = canvasY + "px";
        canvas.style.position = "absolute";
        return canvas;
    }
	

	
	
    #isValidTheme(theme) {
        if (this.#isObject(theme)) {
            if ((this.#isValidColor(theme["secondHandColor"]) &&
                this.#isValidColor(theme["secondHandColor"]) &&
                this.#isValidColor(theme["secondHandColor"]) &&
                this.#isValidColor(theme["secondHandColor"])
            )
                ||
                (theme["secondHandSrc"] !== undefined &&
                    theme["minuteHandSrc"] !== undefined &&
                    theme["hourHandSrc"] !== undefined &&
                    theme["backgroundSrc"] !== undefined &&
                    theme["handPivotHX"] !== undefined &&
                    theme["handPivotHY"] !== undefined &&
                    theme["handPivotMX"] !== undefined &&
                    theme["handPivotMY"] !== undefined &&
                    theme["handPivotSX"] !== undefined &&
                    theme["handPivotSY"] !== undefined
                ))
                return true;
        }
        return false;
    }

    #loadTheme(theme, onLoadCallback, onerrorCallback) {
        this.#loader = new imageLoader(onLoadCallback, onerrorCallback);
        let hourImgSrc = theme["hourHandSrc"];
        let minuteImgSrc = theme["minuteHandSrc"];
        let secondImgSrc = theme["secondHandSrc"];
        let backgroundImgSrc = theme["backgroundSrc"];
        this.#pivotPointHX = theme["handPivotHX"];
        this.#pivotPointHY = theme["handPivotHY"];
        this.#pivotPointMX = theme["handPivotMX"];
        this.#pivotPointMY = theme["handPivotMY"];
        this.#pivotPointSX = theme["handPivotSX"];
        this.#pivotPointSY = theme["handPivotSY"];
        this.#loader.add('secondHandImg', secondImgSrc);
        this.#loader.add('minuteHandImg', minuteImgSrc);
        this.#loader.add('hourHandImg', hourImgSrc);
        this.#loader.add('BGImg', backgroundImgSrc);
    }
    #onError() {
		this.#initializeClockBasic();
	}
    #loadingComplete() {
        // get scale from loaded background
		this.#updateScale();
        this.#loop();
        setInterval(this.#loop.bind(this), 1000);
    }
	#updateScale(){
		let bgImg = this.#loader.get('BGImg');
        this.#scale = this.#canvas.width / bgImg.width;
	}
    #renderHand(context, image, pivotX, pivotY, posCanvasX, posCanvasY, scaleFactor, angle) {
        context.save();
        context.translate(posCanvasX, posCanvasY);
        context.rotate(angle);
        context.translate(-image.width * (pivotX * scaleFactor), -image.height * (pivotY * scaleFactor));
        this.#shadow(context);
        context.drawImage(image, 0, 0, image.width * scaleFactor, image.height * scaleFactor);
        context.restore();
    }
    #renderBg(context) {
        this.#cls();
        context.save();
        this.#shadow(context);
        context.drawImage(this.#loader.get('BGImg'), 0, 0,
            (this.#loader.get('BGImg').width - this.#shadowWidth) * this.#scale,
            (this.#loader.get('BGImg').height - this.#shadowWidth) * this.#scale);
        context.restore();
    }
	
	// main render loop 
    #loop() {
        this.#updateTime();
        this.#renderBg(this.#ctx);
        		
		// render captions
		this.#renderCaptions();		

		this.#renderClock(this.#hours, this.#minutes, this.#seconds);	
    }
	
	#renderCaptions(){
		for (let i = 0; i < this.#captions.length; i++) {
			this.#renderText(this.#captions[i].text ,
						this.#clockRadius +  this.#captions[i].x  ,
						this.#clockRadius +   this.#captions[i].y ,
						this.#captions[i].font,
						this.#captions[i].color
						);
		}	
	}
	
	addCaption(t, x, y, font = 'bold 20px Arial', color = 'black'){
		const caption = new Caption(t, x, y, font, color );
		this.#captions.push(caption);
	}
	
    #renderClock(hour, minute, second) {
        let hoursHandAngle = this.#getClockAngle(hour, true);
        this.#renderHand(this.#ctx, this.#loader.get('hourHandImg'), this.#pivotPointHX, this.#pivotPointHY, this.#clockRadius, this.#clockRadius, this.#scale, hoursHandAngle);

        let minutesHandAngle = this.#getClockAngle(minute, false);
        this.#renderHand(this.#ctx, this.#loader.get('minuteHandImg'), this.#pivotPointMX, this.#pivotPointMY, this.#clockRadius, this.#clockRadius, this.#scale, minutesHandAngle);

        let secondsHandAngle = this.#getClockAngle(second, false);
        this.#renderHand(this.#ctx, this.#loader.get('secondHandImg'), this.#pivotPointSX, this.#pivotPointSY, this.#clockRadius, this.#clockRadius, this.#scale, secondsHandAngle);
    }

    #updateTime() {
        let time = new Date();
        this.#hours = time.getHours();
        this.#minutes = time.getMinutes();
        this.#seconds = time.getSeconds();
    }


	#renderText(text, x, y, font, color) {
    this.#ctx.font = font; 
    this.#ctx.fillStyle = color; 
    this.#ctx.fillText(text, x, y);
	
	}
	
	
    //#################################################################
    //#########   Basic themes... (no external images) ##################
    //#################################################################

    #loadThemeBasic(theme) {
        if (theme === null || theme === undefined) {
            this.#onErrorbasicTheme();
            return;
        }
        let themeTemp = Object.assign({}, theme);
        for (let e in themeTemp) {
            if (!this.#isValidColor(themeTemp[e])) {
                this.#onErrorbasicTheme();
                return;
            }
            if (themeTemp[e].toLowerCase() === "random")
                themeTemp[e] = this.#getRandomColor();
        }
        this.#loadColors(themeTemp["hourHandColor"], themeTemp["minuteHandColor"], themeTemp["secondHandColor"],
            themeTemp["backgroundColor"], themeTemp["borderColor"], themeTemp["timePointMarkerColor"], themeTemp["centralPointColor"]);
        this.#initializeClockBasic();
    }

    #onErrorbasicTheme() {
        this.#loadColors("Black", "Black", "Black", "White");
        this.#initializeClockBasic();
    }
    #loadColors(hourHandColor = "Black", minuteHandColor = "Black", secondHandColor = "Black", backgroundColor = "White",
        borderColor = "Black", timePointMarkerColor = "Black", centralPointColor = "Black") {
        this.#secondHandColor = secondHandColor;
        this.#minuteHandColor = minuteHandColor;
        this.#hourHandColor = hourHandColor;
        this.#backgroundColor = backgroundColor;
        this.#borderColor = borderColor;
        this.#timePointMarkerColor = timePointMarkerColor;
        this.#centralPointColor = centralPointColor;
    }
    #initializeClockBasic() {
        this.#updateTime();
        this.#renderClockBasic(this.#hours, this.#minutes, this.#seconds);
        setInterval(function () {
            this.#cls();
            this.#updateTime();
            this.#renderClockBasic(this.#hours, this.#minutes, this.#seconds);
        }.bind(this), 1000);
    }

    #renderClockBasic(hour, minute, second) {
        hour += this.#hourHandRotationCorrection;
        minute += this.#secondMinuteHandRotationCorrection;
        second += this.#secondMinuteHandRotationCorrection;
        this.#bGPrimitive();
        this.#frame();
        let h = this.#getClockAngle(hour);
        let m = this.#getClockAngle(minute, false);
        let s = this.#getClockAngle(second, false);

        let xH = this.#getCircleX(h, this.#clockRadius * 0.6);
        let yH = this.#getCircleY(h, this.#clockRadius * 0.6);

        let xM = this.#getCircleX(m, this.#clockRadius * 0.7);
        let yM = this.#getCircleY(m, this.#clockRadius * 0.7);

        let xS = this.#getCircleX(s, this.#clockRadius * 0.75);
        let yS = this.#getCircleY(s, this.#clockRadius * 0.75);

        this.#line(0 + this.#clockRadius, 0 + this.#clockRadius, xH + this.#clockRadius, yH + this.#clockRadius, 6, this.#hourHandColor);
        this.#line(0 + this.#clockRadius, 0 + this.#clockRadius, xM + this.#clockRadius, yM + this.#clockRadius, 4, this.#minuteHandColor);
        this.#line(0 + this.#clockRadius, 0 + this.#clockRadius, xS + this.#clockRadius, yS + this.#clockRadius, 1, this.#secondHandColor);

        this.#circle(this.#clockRadius, this.#clockRadius, 5, 1, this.#centralPointColor, true);
        		
		// render captions
		this.#renderCaptions();		
		
		// draw markers 
        let radius = (this.#clockRadius - this.#shadowWidth - this.#frameWidth) * 0.9;
        for (let i = 0; i < 60; i++) {
            if (i % 15 === 0)
                this.#drawMarker(i, radius, 5, this.#timePointMarkerColor);
            else if (i % 5 === 0)
                this.#drawMarker(i, radius, 3, this.#timePointMarkerColor);
            else
                this.#drawMarker(i, radius, 1, this.#timePointMarkerColor);
        }
    }

    #drawMarker(seconds, radius, size = 2, color = "Black") {
        seconds -= 15;
        let angle = this.#getClockAngle(seconds, false);
        let x = this.#getCircleX(angle, radius);
        let y = this.#getCircleY(angle, radius);
        this.#circle(x + this.#clockRadius, y + this.#clockRadius, size, 1, color, true);
    }

    #bGPrimitive() { this.#circle(this.#clockRadius, this.#clockRadius, this.#clockRadius - this.#shadowWidth - this.#frameWidth, 1, this.#backgroundColor, true); }
    
	
	
	
	#frame() {
        this.#circle(this.#clockRadius, this.#clockRadius,
            this.#clockRadius - this.#shadowWidth - this.#frameWidth,
            this.#frameWidth, this.#borderColor);
			
    }

    #line(startX, startY, endX, endY, thickness = 1, color = "black") {
        this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.moveTo(startX, startY);
        this.#ctx.lineTo(endX, endY);
        this.#ctx.lineWidth = thickness;
        this.#shadow(this.#ctx);
        this.#ctx.strokeStyle = color;
        this.#ctx.lineCap = 'round';
        this.#ctx.stroke();
        this.#ctx.restore();
    }
    #shadow(context, color = "Black") {
        this.#ctx.shadowColor = color;
        this.#ctx.shadowBlur = this.#shadowWidth;
        this.#ctx.shadowOffsetX = 0;
        this.#ctx.shadowOffsetY = 2;
    }

    #circle(x, y, radius, lineWidth = 1, color = "Black", isFilled = false) {
        this.#ctx.save();
        this.#ctx.beginPath();
        if (isFilled) {
            this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.#ctx.fillStyle = color;
            this.#shadow(this.#ctx);
            this.#ctx.fill();
        }
        else {
            this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.strokeStyle = color;
            this.#shadow(this.#ctx);
            this.#ctx.stroke();
        }
        this.#ctx.restore();
    }
    #getClockAngle(value, isHours = true) {
        let c = 0;
        if (isHours)
            c = 12;
        else
            c = 60;
        return this.#getRad((360 * value) / c);
    }
    #cls() {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
	}
    #getRad(grad){
		return grad * (Math.PI / 180);
	}

    #getCircleX(radians, radius){
		return Math.cos(radians) * radius;
	}
    #getCircleY(radians, radius){
		return Math.sin(radians) * radius;
	}

    #isObject(obj) {
		return obj !== undefined && obj !== null && obj.constructor == Object;
	}
    #isValidColor(strColor) {
        if (strColor === undefined || strColor === null || strColor === '')
            return false;
        if (strColor.toLowerCase() === "random")
            return true;
        var s = new Option().style;
        s.color = strColor;
        return s.color == strColor.toLowerCase();
    }

    #getRandomColor() {
        return "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }


} // end class clock



/* a simple class that loads images and triggers an event handler when all images are fully loaded,
// or an error when loading fails
*/
class imageLoader {
    #images = new Map();
    #imagesLoadedCount = 0;
    #onLoadCallback = null;
    #onerrorCallback = null;
    constructor(onLoadCallback, onerrorCallback) {
        this.#onLoadCallback = onLoadCallback;
        this.#onerrorCallback = onerrorCallback;
    }
    add(name, src) {
        let img = new Image();
        img.src = src;
        img.onload = this.#onLoad.bind(this);
        img.onerror = this.#onError.bind(this);
        this.#images.set(name, img);
    }
    #onLoad() {
        this.#imagesLoadedCount++;
        if (this.#imagesLoadedCount === this.#images.size)
            this.#onLoadCallback();
    }
    #onError() {
        this.#onerrorCallback();
    }
    get(name) {
        if (this.#images.has(name))
            return this.#images.get(name);
        return null;

    }
    getAll() { return this.#images; }
}// end class image loader




class Caption {
	 constructor(text, x, y, font, color) {
		this.text=text;
		this.x=x;
		this.y=y;			
		this.font=font;
		this.color=color;	
	 }
}
