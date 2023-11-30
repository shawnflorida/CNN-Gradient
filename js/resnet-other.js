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
