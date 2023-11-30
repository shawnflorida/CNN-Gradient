document.addEventListener("DOMContentLoaded", function () {
  // Load metrics data

  class_mapping = {
    glioma: 0,
    meningioma: 1,
    notumor: 2,
    pituitary: 3,
    mild_demented: 4,
    moderate_demented: 5,
    non_demented: 6,
    very_mild_demented: 7,
  };
  fetch("/kpi/website/assets/metrics/gradient_others_metrics.json")
    .then((response) => response.json())
    .then((data) => {
      // Display metrics on the webpage
      document.getElementById("accuracy").innerText = formatDecimal(
        data.accuracy
      );
      document.getElementById("precisionAvg").innerText = formatDecimal(
        data.precision_avg
      );
      document.getElementById("recallAvg").innerText = formatDecimal(
        data.recall_avg
      );
      document.getElementById("f1ScoreAvg").innerText = formatDecimal(
        data.f1_score_avg
      );

      document.getElementById("precision").innerText = data.precision
        .map((val) => formatDecimal(val))
        .join("\n");

      document.getElementById("recall").innerText = data.recall
        .map((val) => formatDecimal(val))
        .join("\n");
      document.getElementById("f1Score").innerText = data.f1_score
        .map((val) => formatDecimal(val))
        .join("\n");

      // Display class names in the new column
      document.getElementById("class").innerText = Object.keys(class_mapping)
        .map((className) => className)
        .join("\n");
    })
    .catch((error) => console.error("Error fetching metrics data:", error));

  // Function to format a number to three decimal places
  function formatDecimal(number) {
    return number.toFixed(3);
  }
  // Define the model name (replace 'resnet' with the desired model name)
  const modelName = "gradient";

  // Load confusion matrix image dynamically based on the model name
  fetch(`/api/confusion-matrix-image/${modelName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Confusion matrix image not found");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      // Set the source of the image
      document.getElementById("confusionMatrixImage").src = url;
    })
    .catch((error) =>
      console.error("Error fetching confusion matrix image:", error)
    );
});

//For gallery
document.addEventListener("DOMContentLoaded", function () {
  const correctGallery = document.getElementById("correctGalleryGradient");
  const wrongGallery = document.getElementById("wrongGalleryGradient");

  // Specify the model name (e.g., 'resnet', 'svm', 'smote', 'gradient')
  const modelName = "gradient";

  // Fetch images dynamically for correct predictions
  fetch(`/api/images?prediction=correct_prediction&model=${modelName}`)
    .then((response) => response.json())
    .then((images) => {
      // Display images for each folder on a new row in the correct gallery
      displayImagesInGrid(images, correctGallery);
    })
    .catch((error) =>
      console.error(
        `Error fetching images for correct predictions of ${modelName}:`,
        error
      )
    );

  // Fetch images dynamically for wrong predictions
  fetch(`/api/images?prediction=wrong_prediction&model=${modelName}`)
    .then((response) => response.json())
    .then((images) => {
      // Display images for each folder on a new row in the wrong gallery
      displayImagesInGrid(images, wrongGallery);
    })
    .catch((error) =>
      console.error(
        `Error fetching images for wrong predictions of ${modelName}:`,
        error
      )
    );
});


document.addEventListener("DOMContentLoaded", function () {
  const correctGallery = document.getElementById("correctGalleryResnet");
  const wrongGallery = document.getElementById("wrongGalleryResnet");

  // Specify the model name (e.g., 'resnet', 'svm', 'smote', 'gradient')
  const modelName = "resnet";

  // Fetch images dynamically for correct predictions
  fetch(`/api/images?prediction=correct_prediction&model=${modelName}`)
    .then((response) => response.json())
    .then((images) => {
      // Display images for each folder on a new row in the correct gallery
      displayImagesInGrid(images, correctGallery);
    })
    .catch((error) =>
      console.error(
        `Error fetching images for correct predictions of ${modelName}:`,
        error
      )
    );

  // Fetch images dynamically for wrong predictions
  fetch(`/api/images?prediction=wrong_prediction&model=${modelName}`)
    .then((response) => response.json())
    .then((images) => {
      // Display images for each folder on a new row in the wrong gallery
      displayImagesInGrid(images, wrongGallery);
    })
    .catch((error) =>
      console.error(
        `Error fetching images for wrong predictions of ${modelName}:`,
        error
      )
    );
});



function displayImagesInGrid(images, gallery) {
  let currentRow;
  let currentFolder;

  // List of classes to exclude
  const excludedClasses = ["afternoon", "are", "evening", "good", "hard", "hello", "how", "morning", "of-hearing", "thank", "today", "tomorrow", "understand", "you"];

  // Iterate over images and create a new row for each folder
  images.forEach((image, index) => {
    // Extract folder name from the image path
    const folderTitle = getFolderTitle(image);

    // Skip excluded classes
    if (!isExcludedClass(folderTitle)) {
      // Start a new row for the next folder
      if (currentFolder !== folderTitle) {
        currentFolder = folderTitle;
        currentRow = document.createElement("div");
        currentRow.classList.add("image-row");
        gallery.appendChild(currentRow);

        // Display folder title before the images
        const titleElement = document.createElement("h4");
        titleElement.innerText = currentFolder;
        currentRow.appendChild(titleElement);
      }

      // Create image element and add to the current row
      const imgElement = document.createElement("img");
      imgElement.src = image;
      imgElement.classList.add("gallery-image");
      currentRow.appendChild(imgElement);
    }
  });
}

// Function to check if the class is an excluded class
function isExcludedClass(className) {
  // List of classes to exclude
  const excludedClasses = ["afternoon", "are", "evening", "good", "hard", "hello", "how", "morning", "of-hearing", "thank", "today", "tomorrow", "understand", "you"];

  return excludedClasses.includes(className);
}

// Function to extract folder title from the image path
function getFolderTitle(imagePath) {
  // Split the path by '/'
  const pathParts = imagePath.split("/");

  // The folder title is the second-to-last part of the path
  return pathParts[pathParts.length - 2];
}
