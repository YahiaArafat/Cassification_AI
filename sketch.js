
var allDataPoints = [], learningRate, activationFun, ratioOftrainingData, numberOfIterations, SumSSE = 0, usermMSE = 0;
var currentDataColor, canvasWidth, canvasHeight, y1ForLine = 0, y2ForLine = 0, isReady = false, numberOFClasses = 0,
  classes, colors, testingArr = [], validationArr = [], onlyFirstTime = true, perceptronsToTest, testingModeFlag = false;

  
function getRnd(min, max) {
  return (((max - min) * Math.random()) + min);

  console.log("hiiii yahia");
}

function DataPoint(posX, posY, col) {
  this.positionX = posX;
  this.positionY = posY;
  this.color = col;
}

function Perceptron(weights, threshol, output) {

  this.weight1 = weights[0];
  this.weight2 = weights[1];
  this.threshold = threshol;
  this.actualOutput = output;
}

function activate(type, BigX) {

  if (type == "Tanh") {
    return ((2 / (1 + Math.exp(-2 * BigX))) - 1)
  }
  else if (type == "ReLU") {
    if (BigX < 0)
      return 0;
    else {
      return BigX;
    }
  }
  else if (type == "Leaky ReLU") {
    if (BigX < 0)
      return 0;
    else {
      return 0.01 * BigX;
    }
  }
  else if (type == "Sigmoid") {
    return 1 / (1 + Math.exp(-1 * BigX))
  }
  else if (type == "Linear") {
    return BigX
  }
}
function setTestingDataAndValidation() {
  var dataLength = allDataPoints.length;
  console.log("dataLength : " + dataLength)

  numberOfDataPointsToTest = Math.floor(((100 - ratioOftrainingData) * 0.01) * dataLength * 0.5);
  console.log("numberOfDataPointsToTest : " + numberOfDataPointsToTest)
  for (let i = 0; i < numberOfDataPointsToTest; i++) {
    var rendomIndex = Math.floor(Math.random() *  allDataPoints.length);
    testingArr.push(allDataPoints[rendomIndex]);
    allDataPoints.splice(rendomIndex, 1);
  }
  numberOfDataPointsToValidation = Math.floor(((100 - ratioOftrainingData) * 0.01) * dataLength * 0.5);
  console.log("numberOfDataPointsToValidation : " + numberOfDataPointsToValidation)

  for (let i = 0; i < numberOfDataPointsToValidation; i++) {
    var rendomIndex = Math.floor(Math.random() *  allDataPoints.length);
    validationArr.push(allDataPoints[rendomIndex]);
    allDataPoints.splice(rendomIndex, 1);
  }

}
function train() {
  console.log("hiiii yahia");

  SumSSE = 0;
  var percptrons;
  if (onlyFirstTime) {
    setTestingDataAndValidation();
    onlyFirstTime = false;
  }
  numberOFClasses = getNumberOfClasses(allDataPoints);

  if (numberOFClasses == 1 || numberOFClasses == 0) {
    window.alert("Please add two classes at least");
  }
  else if (numberOFClasses == 2) {
    colors = getColors(numberOFClasses);
    console.log(colors)
    percptrons = new Perceptron([getRnd(-0.5, 0.5), getRnd(-0.5, 0.5)], getRnd(-0.5, 0.5), 0);
    trainPerceptron(percptrons, colors[0]);
    var accuracy = computePreformance([percptrons,], colors);
    console.log("accuracy : " + accuracy)
    document.getElementById('confusionAccuracy').innerHTML = accuracy * 100 + "%";
    document.getElementById('misclassificationRate').innerHTML = (1 - accuracy) * 100 + "%";
    perceptronsToTest = [percptrons,];
  }
  else {
    colors = getColors(numberOFClasses);
    console.log(colors);
    percptrons = new Array(numberOFClasses);
    for (let i = 0; i < numberOFClasses; i++) {
      percptrons[i] = new Perceptron([getRnd(-0.5, 0.5), getRnd(-0.5, 0.5)], getRnd(-0.5, 0.5), 0);
      trainPerceptron(percptrons[i], colors[i]);
    }
    var accuracy = computePreformance(percptrons, colors);
    document.getElementById('confusionAccuracy').innerHTML = accuracy * 100 + "%";
    document.getElementById('misclassificationRate').innerHTML = (1 - accuracy) * 100 + "%";
    perceptronsToTest = percptrons;
  }
  testingModeFlag = true;
}

function computePreformance(perceptrons, colors) {
  var numOfTruePositive = 0, numOfTrueNegative = 0;
  for (let i = 0; i < testingArr.length; i++) {
    for (let j = 0; j < perceptrons.length; j++) {
      var bigX = (testingArr[i].positionX * perceptrons[j].weight1) + (testingArr[i].positionY * perceptrons[j].weight2) + perceptrons[j].threshold;
      var actualOutput = Math.round(activate(activationFun, bigX));
      console.log("hello");
      if ((testingArr[i].color == colors[j]) && (actualOutput == 1)) {
        numOfTruePositive++;
        break;
      }
      else if ((testingArr[i].color != colors[j]) && (actualOutput == -1)) {
        numOfTrueNegative++;
        break;
      }
    }
  }
  console.log("numOfTruePositive" + numOfTruePositive)
  return (numOfTruePositive + numOfTrueNegative) / testingArr.length;
}
function getColors(numberOfclas) {
  var colors = new Array(numberOfclas);
  for (let i = 0, j = 0; i < classes[0].length; i++) {
    if (classes[1][i]) {
      colors[j] = i + 1;
      j++;
    }
  }
  return colors
}
function getNumberOfClasses(arrDataPoints) {
  classes = new Array(2);

  classes[0] = new Array(4);
  classes[1] = new Array(4).fill(false);

  classes[0][0] = 1;
  classes[0][1] = 2;
  classes[0][2] = 3;
  classes[0][3] = 4;

  var numOfClasses = 0;
  for (let i = 0; i < arrDataPoints.length; i++) {
    if (arrDataPoints[i].color == 1)
      classes[1][0] = true;
    else if (arrDataPoints[i].color == 2)
      classes[1][1] = true;
    else if (arrDataPoints[i].color == 3)
      classes[1][2] = true;
    else if (arrDataPoints[i].color == 4)
      classes[1][3] = true;
  }
  for (let i = 0; i < classes[1].length; i++) {
    if (classes[1][i])
      numOfClasses++;
  }
  return numOfClasses
}
function trainPerceptron(perceptron, color1) {
  // console.log(perceptron)
  var mMSE = 0;
  var t = 0, i, bigX = 0, colorToTrain = 0, SumSSE = 0, epochNum = 0;
  var arrEpoch = new Array(), arrOFMSE = new Array(), mSEValidation = new Array(),arrEpochValidation = new Array();
  for (i = 0; i < numberOfIterations; i++, t++)/* while(true)*/ {

    if (allDataPoints[t].color == color1) {
      colorToTrain = 1
    }
    else {
      colorToTrain = -1;
    }
    bigX = (allDataPoints[t].positionX * perceptron.weight1) + (allDataPoints[t].positionY * perceptron.weight2) + perceptron.threshold;
    perceptron.actualOutput = activate(activationFun, bigX);
    var errorIteration = colorToTrain - perceptron.actualOutput;
    SumSSE = SumSSE + Math.pow(errorIteration, 2);
    var deltaWeight1 = learningRate * allDataPoints[t].positionX * errorIteration;
    perceptron.weight1 = deltaWeight1 + perceptron.weight1;
    var deltaWeight2 = learningRate * allDataPoints[t].positionY * errorIteration;
    perceptron.weight2 = deltaWeight2 + perceptron.weight2;
    y1ForLine = (perceptron.threshold - (perceptron.weight1 * -1)) / perceptron.weight2;
    // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    y1ForLine = scaleOutput(y1ForLine, 0, 500);
    // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    y2ForLine = (perceptron.threshold - (perceptron.weight1 * 1)) / perceptron.weight2;
    // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy2222222222222222");
    y2ForLine = scaleOutput(y2ForLine, 0, 500);
    // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy222222222222");
    isReady = true;
    if (t == (allDataPoints.length - 1))     {
      t = -1;
      epochNum++;
      arrEpoch.push(epochNum);
      mMSE = (SumSSE / allDataPoints.length);
      arrOFMSE.push(mMSE);
      if((epochNum%2) == 0){
        var sumSSEValidation = 0;
        for(let i = 0; i < validationArr.length; i++){
          if (validationArr[i].color == color1) {
            colorToTrain = 1
          }
          else {
            colorToTrain = -1;
          }
          bigX = (validationArr[i].positionX * perceptron.weight1) + (validationArr[i].positionY * perceptron.weight2) + perceptron.threshold;
          perceptron.actualOutput = activate(activationFun, bigX);
          var errorIteration = colorToTrain - perceptron.actualOutput;
          sumSSEValidation = sumSSEValidation + Math.pow(errorIteration, 2);
        }
        var mSEVal = (sumSSEValidation / validationArr.length)
        mSEValidation.push(mSEVal);
        arrEpochValidation.push(epochNum);
      }
      drawPlot(arrEpoch, arrOFMSE, arrEpochValidation, mSEValidation);
      // console.log("M S E "+mMSE);
      
      if (mMSE < usermMSE) {
        // console.log("mMSE < usermMSE"); 
        window.alert("Training ends because MSE is less than"+usermMSE);
        break;
      }
      //  console.log("MSE " +mMSE );
      // getSumSEE(SumSSE / allDataPoints.length );
      SumSSE = 0;
    }
  }
  draw();
}
function scaleInput(input, min, max) {
  return ((input - min) * ((1 - (-1)) / (max - min)) + -1)
}
function scaleOutput(output, min, max) {
  return ((output - (-1)) * ((max - min) / (1 - (-1))) + min)
}
function setup() {
  canvasWidth = 500;
  canvasHeight = 500;
  var canvas1 = createCanvas(500, 500);
  canvas1.parent('canvasDiv');
  background(255);
}

function draw() {
  if (isReady) {
    for (let i = 0; i < allDataPoints.length; i++) {

      xscaleOutput = scaleOutput(allDataPoints[i].positionX, 0, 500)
      yscaleOutput = scaleOutput(allDataPoints[i].positionY, 0, 500)
      if (allDataPoints[i].color == 1)
        fill(231, 29, 54)
      else if (allDataPoints[i].color == 2)
        fill(255, 159, 28)
      else if (allDataPoints[i].color == 3)
        fill(46, 196, 182)
      else if (allDataPoints[i].color == 4)
        fill(1, 22, 39);

      ellipse(xscaleOutput, yscaleOutput, 7, 7);
    }
    line(0, y1ForLine, 500, y2ForLine);
  }
  // testCurrentPosition();
}
   
// function testCurrentPosition() {
//   if (testingModeFlag) {
//     document.getElementById('modeDiv').innerHTML = "Testing Mode";

//     // document.getElementById('testMode').innerHTML = "Class 2";
//     // document.getElementById('testMode').innerHTML = "Class 3";
//     // document.getElementById('testMode').innerHTML = "Class 4";

//     if (mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
//       var bigX = 0, maximumOutput = -1000, perceptronIndex = -1;
//       var positionX = scaleInput(mouseX, 0, 500)
//       var positionY = scaleInput(mouseY, 0, 500)
//       // console.log("positionX : "+positionX)
//       // console.log("positionY : "+positionY)

//       for (let i = 0; i < perceptronsToTest.length; i++) {
//         bigX = (positionX * perceptronsToTest[i].weight1) + (positionY * perceptronsToTest[i].weight2) + perceptronsToTest[i].threshold;
//         actualOutput = (activate(activationFun, bigX));
//         if (actualOutput > maximumOutput) {
//           maximumOutput = actualOutput;
//           perceptronIndex = i ;
//         }
//         // console.log("actualOutput : "+actualOutput)
//       }
//       if (colors.length > 2) {
//         document.getElementById('testMode').innerHTML = "Class "+colors[perceptronIndex];
//       }
//       else {
//         for (let i = 1; i < 5; i++) {
//           if (actualOutput >= 0.1 && colors[0] == i) {
//             document.getElementById('testMode').innerHTML = "Class " + i;
//           }
//           else if (actualOutput <= -0.1 && colors[1] == i) {
//             document.getElementById('testMode').innerHTML = "Class " + i;
//           }
//         }

//       }
//     }
//   }
// }

function mouseClicked(event) {
  fill(currentDataColor)
  ellipse(mouseX, mouseY, 7, 7);
  //  console.log("mouseX" + mouseX + " mouseY" + mouseY + " color : " + currentDataColor);
  if (mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight) {
    var inputColor
    console.log('currentDataColor' + currentDataColor)
    if (currentDataColor == "rgb(231, 29, 54)")
      inputColor = 1;
    else if (currentDataColor == "rgb(255, 159, 28)")
      inputColor = 2;
    else if (currentDataColor == "rgb(46, 196, 182)")
      inputColor = 3;
    else if (currentDataColor == "rgb(1, 22, 39)")
      inputColor = 4;
    var x = scaleInput(mouseX, 0, 500)
    var y = scaleInput(mouseY, 0, 500)
    var newPoint = new DataPoint(x, y, inputColor);
    allDataPoints.push(newPoint);
    // console.log(newPoint.color)
    // console.log("currentDataColor" + currentDataColor);
  }
}
function setColor(color) {
  currentDataColor = color
}

function setActivationFun(actfun) {
  activationFun = actfun
}

function setLearningRate(learningRat) {
  learningRate = learningRat
}

function setRatioOfTrainingData(ratio) {
  ratioOftrainingData = ratio;
}

function setIterationNumber(iteration) {
  numberOfIterations = iteration;
}

function setSSE(sse) {
  SSE = sse;
}

function getMSE() {
  return mMSE;
}
function setUserMSE(mse) {
  usermMSE = mse;
}

function drawPlot(arrsEpochTraining, arrsOFMSETraining, arrsEpochVal, arrsMSEVal) {

  var trace1 = {
    x: arrsEpochTraining,
    y: arrsOFMSETraining,
    type: 'scatter',
    name: 'Training',
    label: 'Training',
    fill: 'tozeroy',
  };
    var trace2 = {
      x: arrsEpochVal,
      y: arrsMSEVal,
      name: 'Validation',
  //arrsEpoch
    type: 'scatter',
      fill: 'tozeroy',
    };
  var data = [trace1,trace2,];
  var layout = {
    autosize: true,
    width: 470,
    height: 470,
    margin: {
      l: 120,
      r: 10,
      b: 100,
      t: 100,
      pad: 4
    },
    xaxis: {
      autotick: false,
      ticks: 'outside',
      tick0: 0,
      dtick: 1,
      ticklen: 2,
      tickwidth: 1,
      tickcolor: '#000'
    },
    yaxis: {
      autotick: false,
      ticks: 'outside',
      tick0: 0,
      dtick: 1,
      ticklen: 10,
      tickwidth: 1,
      tickcolor: '#000'
    },
  };
  var plotDiv = document.getElementById('myDiv');
  Plotly.newPlot(plotDiv, data, layout);
}