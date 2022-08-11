# MagicClock
A simple, yet powerfull and easy modifiable analog clock for you website, made with pure Javascript


![Magic-clock-showcase](https://user-images.githubusercontent.com/20050723/184226867-b2f40a2c-b9e9-4960-a06a-014664ba2d14.jpg)




## class content:

### constructor(PositionX, PositionY, width, theme = null)

### parameters:

- PositionX: x-coordinate of the left upper corner of the clock rectangle.

- PositionY: y-coordinate of the left upper corner of the clock rectangle.

- width: width(and height) of the clock rectangle.

- theme(optional parameter): the theme object used to load the styling information of the clock. when left empty a default theme will be loaded automatically.




Example of use:


```js
let theme={"secondHandColor" : "Blue" ,
 "minuteHandColor":"Green",
 "hourHandColor":"Red",
 "backgroundColor":"Yellow",
 "borderColor":"Yellow", 
 "timePointMarkerColor":"Green" ,
 "centralPointColor":"Blue" 
 };
 let myClock = new MagicClock( 0, 250 , 250, theme );
 
 ```

## The styling system:

there are two styling options:

## 1. extrinsic styling system:

This styling system makes use of vector art in order to give our clock the desired look. 

theme object structure:
```
extrinsicThemeObject = {
 "secondHandSrc" : [path to second hand image] ,
 "minuteHandSrc": [path to minute hand image],
 "hourHandSrc":  [path to hour hand image],
 "backgroundSrc":[path to background image],
 "handPivotHX": [float 0-1],
 "handPivotHY": [float 0-1],
 "handPivotMX": [float 0-1],
 "handPivotMY": [float 0-1],
 "handPivotSX": [float 0-1],
 "handPivotSY": [float 0-1]
 };
```
## principle:

The main principle is, that there's a pivot point in the clock hand images. This pivot point must be mapped directly over the central point of the clock background. To achieve this we must know beforehand the relative position of this point within the image of the clock hand. For example, the image was 50px in width and 200px in height and the coordinates of the pivot was (25,100), i.e in the exact center of the image, then the relative pivot point in the theme settings will be (0.5, 0.5). If this hand was the second hand then the associated values will be handPivotSX and handPivotSY and thier values will be like this:
```
{
......
"handPivotSX": 0.5,
 "handPivotSY": 0.5
{
```
### Values:
- handPivotSY: a value that represents the ratio of the distance between the pivot point and the upper border of the second hand image to the total height of the second hand image.

- handPivotSX: a value that represents the ratio of the distance between the pivot point and the left border of the second hand image to the total width of the second hand image.

- handPivotMY: a value that represents the ratio of the distance between the pivot point and the upper border of the minute hand image to the total height of the minute hand image.

- handPivotMX: a value that represents the ratio of the distance between the pivot point and the left border of the minute hand image to the total width of the minute hand image.

- handPivotHY: a value that represents the ratio of the distance between the pivot point and the upper border of the hour hand image to the total height of the hour hand image.

- handPivotHX: a value that represents the ratio of the distance between the pivot point and the left border of the hour hand image to the total width of the hour hand image.

### here is a visual presentation of the extrinsic styling system:

![](https://user-images.githubusercontent.com/20050723/184260479-e3f79be7-6005-4e89-a675-3e3c29ca7d57.png)


## 2. intrinsic styling system:




