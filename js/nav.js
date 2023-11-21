const createNav = () => {
  let nav = document.querySelector('.navbar');
  nav.innerHTML = `
    <nav>
    <div>
    <a href="#"><img src="/assets/pics/logo.png" alt="Logo" /></a> 
      <div>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li class="models">
            <a href="#">Models</a>
            <ul>
              <li><a href="/resnet.html">ResNet50</a></li>
              <li><a href="/smote.html">Smote</a></li>
              <li><a href="/svm.html">Support Vector Machine</a></li>
              <li><a href="/gradient.html">Gradient Boosting</a></li>
            </ul>
          </li>
          <li><a href="/tool.html">Tool</a></li>
          <li><a href="/background.html">Background</a></li>
          <li><a href="/thesis.html">Thesis Study</a></li>
          <li><a href="/dataset.html">Dataset</a></li>
          <li><a href="/researchers.html">Researchers</a></li>
        </ul>
      </div>
    </div>
  </nav>
    `;
}

createNav();
