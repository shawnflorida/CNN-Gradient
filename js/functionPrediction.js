const GRADIENT = "../kpi/models/gradient/";
const RESNET50 = "../kpi/models/resnet/";

let gradientModel, resnetModel, webcam, gradientContainer, resnetContainer;
let gradientPredictions, resnetPredictions;
let classColors = {};

async function init() {
  const modelGradientURL = GRADIENT + "gradient_model.json";
  const metadataGradientURL = GRADIENT + "gradient_metadata.json";

  const modelResnet50URL = RESNET50 + "resnet_model.json";
  const metadataResnet50URL = RESNET50 + "resnet_metadata.json";

  gradientModel = await tmImage.load(modelGradientURL, metadataGradientURL);
  gradientPredictions = gradientModel.getTotalClasses();

  resnetModel = await tmImage.load(modelResnet50URL, metadataResnet50URL);
  resnetPredictions = resnetModel.getTotalClasses();

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

  predictionGradient.forEach((result, i) => {
    const barContainer = document.createElement("div");
    barContainer.classList.add("label");

    const progressBar = document.createElement("div");
    progressBar.style.width = `${result.probability * 100}%`;
    progressBar.classList.add("progress-bar");
    progressBar.style.backgroundColor = classColors[i]; // Use the consistent color for the class

    const label = document.createElement("span");
    label.textContent = `${result.className}: ${result.probability.toFixed(2)}`;

    barContainer.appendChild(progressBar);
    barContainer.appendChild(label);
    gradientContainer.appendChild(barContainer);
  });

  predictionResnet.forEach((result, i) => {
    const barContainer = document.createElement("div");
    barContainer.classList.add("label");

    const progressBar = document.createElement("div");
    progressBar.style.width = `${result.probability * 100}%`;
    progressBar.classList.add("progress-bar");
    progressBar.style.backgroundColor = classColors[i]; // Use the consistent color for the class

    const label = document.createElement("span");
    label.textContent = `${result.className}: ${result.probability.toFixed(2)}`;

    barContainer.appendChild(progressBar);
    barContainer.appendChild(label);
    resnetContainer.appendChild(barContainer);
  });

  // Do something similar for resnet predictions if needed
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
