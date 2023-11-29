const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Serve static files
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(
  "/kpi/website/assets/metrics",
  express.static(path.join(__dirname, "assets", "metrics"))
);
app.use("/assets/pics", express.static(path.join(__dirname, "assets", "pics")));
app.use(
  "/assets/graphs",
  express.static(path.join(__dirname, "assets", "graphs"))
);
app.use("/kpi", express.static(path.join(__dirname, "kpi")));

// API endpoint to get images with optional query parameter for prediction type and model
app.get("/api/images", (req, res) => {
  const predictionType = req.query.prediction || "all";
  const modelName = req.query.model || "";
  const images = [];

  // Define the folders to retrieve images from
  let predictionFolders;
  if (
    predictionType === "correct_prediction" ||
    predictionType === "wrong_prediction"
  ) {
    predictionFolders = [predictionType];
  } else {
    predictionFolders = ["correct_prediction", "wrong_prediction"];
  }

  predictionFolders.forEach((predictionFolder) => {
    const subfolders = [
      "afternoon",
      "are",
      "evening",
      "good",
      "hard",
      "hello",
      "how",
      "morning",
      "of-hearing",
      "thank",
      "today",
      "tomorrow",
      "understand",
      "you",
    ];
  
    subfolders.forEach((subfolder) => {
      const folderPath = path.join(
        __dirname,
        "kpi",
        `predictions_${modelName}`,
        predictionFolder,
        subfolder
      );
  
      try {
        // Check if the directory exists
        if (fs.statSync(folderPath).isDirectory()) {
          const files = fs.readdirSync(folderPath);
          const selectedFiles = getRandomFiles(files, 6);
  
          const imagePaths = selectedFiles.map((file) =>
            path.join("kpi", `predictions_${modelName}`, predictionFolder, subfolder, file).replace(/\\/g, "/")
          );
  
          images.push(...imagePaths);
        } else {
          console.log(`Directory does not exist: ${folderPath}`);
          // You can choose to skip or handle this case as needed
        }
      } catch (err) {
        console.error(`Error checking directory: ${err}`);
      }
    });
  });

  // Send the image paths as JSON
  res.json(images);
});

// API endpoint to get the confusion matrix image
app.get("/api/confusion-matrix-image/:model", (req, res) => {
  const modelName = req.params.model;
  const imagePath = path.join(
    __dirname,
    "kpi",
    "website",
    "assets",
    "graphs",
    modelName,
    `${modelName}_confusion_matrix.png`
  );

  // Check if the file exists before sending
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.status(404).send("Confusion matrix image not found");
    } else {
      res.sendFile(imagePath);
    }
  });
});

// Route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/resnet.html", (req, res) => {
  res.sendFile(path.join(__dirname, "models_page", "resnet.html"));
});

app.get("/svm.html", (req, res) => {
  res.sendFile(path.join(__dirname, "models_page", "svm.html"));
});

app.get("/gradient.html", (req, res) => {
  res.sendFile(path.join(__dirname, "models_page", "gradient.html"));
});

app.get("/smote.html", (req, res) => {
  res.sendFile(path.join(__dirname, "models_page", "smote.html"));
});

app.get("/tool.html", (req, res) => {
  res.sendFile(path.join(__dirname, "models_page", "tool.html"));
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Function to get a random subset of files
function getRandomFiles(files, count) {
  const shuffled = files.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
