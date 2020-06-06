let capture;
let width, height;
let bw = 10;
let featureExtractor, classifier;
let labelInput, trainBtn, addImgBtn;
let label, labelText;
let learnCounter;
let startClassification = false;

function preload() {
  featureExtractor = ml5.featureExtractor("MobileNet", () => {
    showText(
      "You can enter a label, show the object on camera and click Learn button. Do it multiple times for atleast 40-50 per label."
    );
  });
}

function setup() {
  capture = createCapture(VIDEO);
  capture.hide();

  classifier = featureExtractor.classification(capture, () => {
    showText("Please wait while the model is being loaded!");
  });

  width = windowWidth - 50;
  height = width / 1.6 + 2 * bw + 50;
  CANVAS = createCanvas(width, height);
  CANVAS.parent("#canvas-container");
  learnCounter = 0;

  // create the interaction fields
  createInteractionSet();
}

function draw() {
  background(0);
  // draw image from video into cannvas
  image(capture, bw, bw, width - 2 * bw, height - 2 * bw - 50);

  // if the flag is on, start classification
  if (startClassification) {
    classifier.classify(response);
  }

  // Text to be written below the camera vdo
  textSize(14);
  fill("yellow");
  stroke(4);
  textAlign(CENTER);
  text(labelText, width / 2, height - 20);
}

// Callback method after classifier classify the image
function response(err, data) {
  if (err) {
    console.err(err);
  }
  showText(data[0].label);
}

// Show text on bottom of video
// Using this text to show the Classifier output
function showText(txt) {
  labelText = txt;
}

// To create interaction fields below the vdo
function createInteractionSet() {
  // Label
  createSpan("Label:").parent("#interaction-container");

  // Input box for label
  labelInput = createInput();
  labelInput.parent("#interaction-container");
  labelInput.input(function () {
    label = this.value();
  });

  // Learn button
  addImgBtn = createButton("Learn as per Label");
  addImgBtn.mousePressed(() => {
    learnCounter++;
    showText(`Machine got ${learnCounter} image`);
    classifier.addImage(label);
    startClassification = false;
  });
  addImgBtn.parent("#interaction-container");

  // Train button
  trainBtn = createButton("Train Machine");
  trainBtn.mousePressed(() => {
    classifier.train(function (loss) {
      // if the loss is null then the training is complete.
      if (!loss) {
        showText("Training Complete.. Show any trained object on camera.");
        startClassification = true;
      } else {
        showText("Training in progress");
        startClassification = false;
      }
    });
  });
  trainBtn.parent("#interaction-container");
}
