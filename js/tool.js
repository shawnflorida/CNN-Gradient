const GRADIENT = "../kpi/models/gradient/";
const RESNET50 = "../kpi/models/resnet/";

let gradientModel, resnetModel, webcam, gradientContainer, resnetContainer, highestPredictionContainer;
let gradientPredictions, resnetPredictions;
let classColors = {};
init();
async function init() {
  document.querySelector('button').disabled = true;
  const modelGradientURL = GRADIENT + "gradient_model.json";
  const metadataGradientURL = GRADIENT + "gradient_metadata.json";

  const modelResnet50URL = RESNET50 + "resnet_model.json";
  const metadataResnet50URL = RESNET50 + "resnet_metadata.json";

  gradientModel = await tmImage.load(modelGradientURL, metadataGradientURL);
  gradientPredictions = gradientModel.getTotalClasses();

  resnetModel = await tmImage.load(modelResnet50URL, metadataResnet50URL);
  resnetPredictions = resnetModel.getTotalClasses();

  document.getElementById('webcam-container').style.display = 'block';
  document.getElementById('label-container-resnet').style.display = 'block';
  document.getElementById('label-container-gradient').style.display = 'block';

  for (let i = 0; i < gradientPredictions; i++) {
    classColors[i] = getRandomColor();
  }
  for (let i = 0; i < resnetPredictions; i++) {
    classColors[i] = getRandomColor();
  }

  const flip = true;
  webcam = new tmImage.Webcam(700, 700, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  gradientContainer = document.getElementById("label-container-gradient");
  for (let i = 0; i < gradientPredictions; i++) {
    gradientContainer.appendChild(document.createElement("div"));
  }
  resnetContainer = document.getElementById("label-container-resnet");
  for (let i = 0; i < resnetPredictions; i++) {
    resnetContainer.appendChild(document.createElement("div"));
  }

  // Create a container for the highest prediction label
  highestPredictionContainer = document.createElement("div");
  highestPredictionContainer.classList.add("highest-prediction-container");
  document.getElementById("webcam-container").appendChild(highestPredictionContainer);
}


async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const predictionGradient = await gradientModel.predict(webcam.canvas);
  const predictionResnet = await resnetModel.predict(webcam.canvas);

  gradientContainer.innerHTML = "";
  resnetContainer.innerHTML = "";

  // Display the highest prediction for Gradient model with pink shadow
  displayHighestPrediction(predictionGradient, gradientContainer, "gradient", "pink");

  // Display the highest prediction for ResNet model with yellow shadow
  displayHighestPrediction(predictionResnet, resnetContainer, "resnet", "yellow");
}

function displayHighestPrediction(predictions, container, modelName, color) {
  let highestProbability = 0;
  let highestIndex = 0;

  predictions.forEach((result, i) => {
    const barContainer = document.createElement("div");
    barContainer.classList.add("label");

    const progressBar = document.createElement("div");
    progressBar.style.width = `${result.probability * 95}%`;
    progressBar.classList.add("progress-bar");
    progressBar.style.backgroundColor = classColors[i];

    const label = document.createElement("span");
    label.textContent = `${result.className}: ${result.probability.toFixed(2)}`;

    barContainer.appendChild(progressBar);
    barContainer.appendChild(label);
    container.appendChild(barContainer);

    // Check for the highest probability
    if (result.probability > highestProbability) {
      highestProbability = result.probability;
      highestIndex = i;
    }
  });

  // Get the color of the highest probability class
  const highestPredictionColor = classColors[highestIndex];

  // Display the highest prediction with shadows on the webcam
  const highestPredictionLabel = document.createElement("div");
  highestPredictionLabel.textContent = `Highest Prediction (${modelName}): ${predictions[highestIndex].className}`;
  highestPredictionLabel.classList.add("highest-prediction");
  highestPredictionLabel.style.textShadow = `2px 2px 4px ${color}`; // Add shadows with the specified color
  highestPredictionLabel.style.color = highestPredictionColor; // Set text color to the color of the highest probability class

  // Create a child container for individual predictions
  const childContainer = document.createElement("div");
  childContainer.classList.add("child-container");

  predictions.forEach((result, i) => {
    const predictionElement = document.createElement("div");
    predictionElement.textContent = `${result.className}: ${result.probability.toFixed(2)}`;
    predictionElement.style.color = classColors[i];
    childContainer.appendChild(predictionElement);
  });

  highestPredictionContainer.innerHTML = "";
  highestPredictionContainer.appendChild(highestPredictionLabel);
  highestPredictionContainer.appendChild(childContainer);
}





function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
