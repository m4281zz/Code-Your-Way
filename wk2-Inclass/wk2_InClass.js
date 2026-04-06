/*
Inspired by Jongmin Park's sketch from Programming for Artists @ CUNY CCNY Spring 2022
*/

let rowHeight;

function setup() {
  createCanvas(600, 600);
  noStroke(); // no borders apply to all
  rowHeight = height / 3; // each row will be 1/3 canvas height
}

function draw() {
  
  if (mouseIsPressed) {    //color chanage when mouse is pressed
    background(80, 150);
  } else {
    background(150, 80);
  }
  
  let x = mouseX; //value change with mouse move
  let y = mouseY;
  
  fill(255, 150); // white with transparency 
  circle(x, height / 2, y); // A circle that horizontal position changes w/ mouse, fixed hight, r change on y

  let inverseX = width - mouseX; //get the inverse of the former value
  let inverseY = height - mouseY;

  fill(0, 150); // balck wirh alpha
  circle(inverseX, height / 2, inverseY); // 2nd circle move in the opposite

  if (mouseY < rowHeight) {  //draw the rows and give different color based on mouse position
    fill(20, 150);
    rect(0, 0, width, rowHeight);
  } else if (mouseY < rowHeight * 2) {
    fill(80, 150);
    rect(0, rowHeight, width, rowHeight);
  } else {
    fill(140, 150);
    rect(0, rowHeight * 2, width, rowHeight);
  }
}