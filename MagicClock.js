

// ==========================================================================================================
//    				MagicClock
//	Author: Al-Khafaji, Ali Kifah
//	Date:   11.08.2022
//  Description: A simple, yet powerfull and easy modifiable analog clock for you website, made with pure Javascript
// ===========================================================================================================

class clock {
    #clockCentralX = 100;
    #clockCentralY = 100;
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
    #secondHandImg = new Image();
    #minuteHandImg = new Image();
    #hourHandImg = new Image();
    #BGImg = new Image();
    #loader;
    #canvas = null;
    #ctx = null;
    #secondHandColor = 'Black';
    #minuteHandColor = 'Black';
    #hourHandColor = 'Black';
    #backgroundColor = '#fffff';

    constructor(canvas, theme = null) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
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
                theme["scale"] !== undefined &&
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
        this.#scale = theme["scale"];
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

    #onError() { this.#initializeClockBasic(); }
    #loadingComplete() {
        this.#loop();
        setInterval(this.#loop.bind(this), 1000);
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
        this.#drawImage(context, this.#loader.get('BGImg'), 0, 0, this.#scale);
        context.restore();
    }
    #loop() {
        this.#updateTime();
        this.#renderBg(this.#ctx);
        this.#drawClockImage(this.#hours, this.#minutes, this.#seconds);
    }
    #drawClockImage(hour, minute, second) {
        let hoursHandAngle = this.#getClockAngle(hour, true);
        this.#renderHand(this.#ctx, this.#loader.get('hourHandImg'), this.#pivotPointHX, this.#pivotPointHY, 100, 100, this.#scale, hoursHandAngle);

        let minutesHandAngle = this.#getClockAngle(minute, false);
        this.#renderHand(this.#ctx, this.#loader.get('minuteHandImg'), this.#pivotPointMX, this.#pivotPointMY, 100, 100, this.#scale, minutesHandAngle);

        let secondsHandAngle = this.#getClockAngle(second, false);
        this.#renderHand(this.#ctx, this.#loader.get('secondHandImg'), this.#pivotPointSX, this.#pivotPointSY, 100, 100, this.#scale, secondsHandAngle);
    }

    #getClockAngle(value, isHours = true) {
        let c = 0;
        if (isHours)
            c = 12;
        else
            c = 60;
        return this.#getRad((360 * value) / c);
    }

    #updateTime() {
        let time = new Date();
        this.#hours = time.getHours();
        this.#minutes = time.getMinutes();
        this.#seconds = time.getSeconds();
    }

    #drawImage(context, image, x, y, scale) {
        context.drawImage(image, 0, 0, image.width * scale, image.height * this.#scale);
    }

    //Basic themes... (no external images)
    #loadThemeBasic(theme) {
        if (theme === null || theme === undefined) {
            this.#onErrorbasicTheme();
            return;
        }
        for (let e in theme) {
            if (!this.#isValidColor(theme[e])) {
                this.#onErrorbasicTheme();
                return;
            }
        }
        this.#loadColors(theme["hourHandColor"], theme["minuteHandColor"], theme["secondHandColor"], theme["backgroundColor"]);

        this.#initializeClockBasic();

    }

    #onErrorbasicTheme() {

        this.#loadColors("Black", "Black", "Black", "White");
        this.#initializeClockBasic();
    }
    #loadColors(hourHandColor = "Black", minuteHandColor = "Black", secondHandColor = "Black", backgroundColor = "White") {
        this.#secondHandColor = secondHandColor;
        this.#minuteHandColor = minuteHandColor;
        this.#hourHandColor = hourHandColor;
        this.#backgroundColor = backgroundColor;
    }
    #initializeClockBasic() {
        this.#updateTime();
        this.#drawClockBasic(this.#hours, this.#minutes, this.#seconds);
        setInterval(function () {
            this.#cls();
            this.#updateTime();
            this.#drawClockBasic(this.#hours, this.#minutes, this.#seconds);
        }.bind(this), 1000);
    }

    #drawClockBasic(hour, minute, second) {
        hour -= 3;
        minute -= 3;
        second += 3;
        this.#bGPrimitive();
        this.#frame();
        let h = this.#getClockAngle(hour);
        let m = this.#getClockAngle(minute, false);
        let s = this.#getClockAngle(second, false);

        let xH = this.#getCircleX(h, 60);
        let yH = this.#getCircleY(h, 60);

        let xM = this.#getCircleX(m, 70);
        let yM = this.#getCircleY(m, 70);

        let xS = this.#getCircleX(s, 80);
        let yS = this.#getCircleY(s, 80);

        this.#line(0 + this.#clockCentralX, 0 + this.#clockCentralY, xH + this.#clockCentralX, yH + this.#clockCentralY, 6, this.#hourHandColor);
        this.#line(0 + this.#clockCentralX, 0 + this.#clockCentralY, xM + this.#clockCentralX, yM + this.#clockCentralY, 4, this.#minuteHandColor);
        this.#line(0 + this.#clockCentralX, 0 + this.#clockCentralY, xS + this.#clockCentralX, yS + this.#clockCentralY, 1, this.#secondHandColor);

        this.#circle(100, 100, 5, 1, "black", true);
        // draw hour markers 
        this.#drawHoursMarker(12, 80, 4);
        this.#drawHoursMarker(3, 80, 4);
        this.#drawHoursMarker(6, 80, 4);
        this.#drawHoursMarker(9, 80, 4);
        this.#drawHoursMarker(1, 80, 2);
        this.#drawHoursMarker(2, 80, 2);
        this.#drawHoursMarker(4, 80, 2);
        this.#drawHoursMarker(5, 80, 2);
        this.#drawHoursMarker(7, 80, 2);
        this.#drawHoursMarker(8, 80, 2);
        this.#drawHoursMarker(10, 80, 2);
        this.#drawHoursMarker(11, 80, 2);
    }
    #drawHoursMarker(hour, radius, size = 2, color = "Black") {
        hour -= 3;
        let angle = this.#getClockAngle(hour);
        let x = this.#getCircleX(angle, radius);
        let y = this.#getCircleY(angle, radius);
        this.#circle(x + this.#clockCentralX, y + this.#clockCentralY, size, 1, color, true);
    }

    #bGPrimitive() { this.#circle(100, 100, 99, 1, this.#backgroundColor, true); }
    #frame() { this.#circle(100, 100, 95, 10); }

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
        this.#ctx.shadowBlur = 5;
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

    #cls() { this.#ctx.clearRect(0, 0, canvas.width, canvas.height); }
    #getRad(grad) { return grad * (Math.PI / 180); }

    #getCircleX(radians, radius) { return Math.cos(radians) * radius; }
    #getCircleY(radians, radius) { return Math.sin(radians) * radius; }

    #isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
    #isValidColor(strColor) {
        if (strColor === undefined || strColor === null || strColor === '')
            return false;
        var s = new Option().style;
        s.color = strColor;
        return s.color == strColor.toLowerCase();
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



