const createFooter = () => {
    let nav = document.querySelector(".footer");
  
    nav.innerHTML = `
      <footer>
    <div class="footer-container">
      <div class="footer-logo">
        <img src="/assets/pics/logo.png" alt="Logo" />
      </div>
      <div class="footer-social">
        <a href="https://www.facebook.com/"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.twitter.com/"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/"><i class="fab fa-instagram"></i></a>
        <a href="https://www.youtube.com/"><i class="fab fa-youtube"></i></a>
      </div>
      <div class="footer-copy">
        <p>&copy; 2023 vercingetorix. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
      `;
  };
  
  createFooter();
  