document.body.innerHTML = `
  <div class="wrapper">
    <div class="theme-toggle">
      <button id="dark-mode-toggle">Dark Mode</button>
    </div>
    <div class="container">
      <div class="image-container">
        <img id="image" />
      </div>
      <div class="preview-container">
        <img id="preview-image" />
      </div>
    </div>
    <input type="file" id="file" accept="image/*" />
    <label for="file">Choose A Photo</label>
    <div class="options hide">
      <input type="number" id="height-input" placeholder="Enter Height" max="780" />
      <input type="number" id="width-input" placeholder="Enter Width" max="780" />
      <button class="aspect-ratio-button">16:9</button>
      <button class="aspect-ratio-button">4:3</button>
      <button class="aspect-ratio-button">1:1</button>
      <button class="aspect-ratio-button">2:3</button>
      <button class="aspect-ratio-button">Free</button>
      <button id="fit-square">Fit to Square</button>
      <input type="number" id="custom-width" placeholder="Custom Width">
      <input type="number" id="custom-height" placeholder="Custom Height">
    </div>
    <div class="tools">
      <input type="range" id="zoom" min="1" max="3" step="0.1" value="1" />
      <button id="rotate-left">Rotate Left</button>
      <button id="rotate-right">Rotate Right</button>
      <button id="flip-horizontal">Flip Horizontal</button>
      <button id="flip-vertical">Flip Vertical</button>
      <button id="reset">Reset</button>
    </div>
    <div class="btns">
      <button id="preview" class="hide">Preview</button>
      <a href="" id="download" class="hide">Download</a>
    </div>
  </div>
  <div id="loading" class="hide">Loading...</div>
`;

let fileInput = document.getElementById("file");
let image = document.getElementById("image");
let downloadButton = document.getElementById("download");
let aspectRatio = document.querySelectorAll(".aspect-ratio-button");
const previewButton = document.getElementById("preview");
const previewImage = document.getElementById("preview-image");
const options = document.querySelector(".options");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const zoomSlider = document.getElementById("zoom");
const rotateLeft = document.getElementById("rotate-left");
const rotateRight = document.getElementById("rotate-right");
const flipHorizontal = document.getElementById("flip-horizontal");
const flipVertical = document.getElementById("flip-vertical");
const resetButton = document.getElementById("reset");
const darkModeToggle = document.getElementById("dark-mode-toggle");
let cropper = "";
let fileName = "";
let zoomValue = 1;
let rotateValue = 0;
let flipH = 1, flipV = 1;

fileInput.onchange = () => {
  previewImage.src = "";
  heightInput.value = 0;
  widthInput.value = 0;
  downloadButton.classList.add("hide");
  
  const reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);

  reader.onload = () => {
    image.setAttribute("src", reader.result);
    if (cropper) cropper.destroy();
    cropper = new Cropper(image, {
      ready() {
        options.classList.remove("hide");
        previewButton.classList.remove("hide");
      }
    });
  };
  fileName = fileInput.files[0].name.split(".")[0];
};

aspectRatio.forEach((element) => {
  element.addEventListener("click", () => {
    const ratio = element.innerText === "Free" ? NaN : eval(element.innerText.replace(":", "/"));
    cropper.setAspectRatio(ratio);
  });
});

heightInput.addEventListener("input", () => {
  const { height } = cropper.getImageData();
  let newHeight = Math.min(parseInt(heightInput.value), height);
  cropper.setCropBoxData({ height: newHeight });
});

widthInput.addEventListener("input", () => {
  const { width } = cropper.getImageData();
  let newWidth = Math.min(parseInt(widthInput.value), width);
  cropper.setCropBoxData({ width: newWidth });
});

previewButton.addEventListener("click", (e) => {
  e.preventDefault();
  downloadButton.classList.remove("hide");
  const imgSrc = cropper.getCroppedCanvas().toDataURL();
  previewImage.src = imgSrc;
  downloadButton.download = `cropped_${fileName}.png`;
  downloadButton.href = imgSrc;
});

zoomSlider.addEventListener("input", () => {
  zoomValue = zoomSlider.value;
  cropper.zoomTo(zoomValue);
});

rotateLeft.addEventListener("click", () => {
  rotateValue -= 45;
  cropper.rotate(rotateValue);
});

rotateRight.addEventListener("click", () => {
  rotateValue += 45;
  cropper.rotate(rotateValue);
});

flipHorizontal.addEventListener("click", () => {
  flipH *= -1;
  cropper.scaleX(flipH);
});

flipVertical.addEventListener("click", () => {
  flipV *= -1;
  cropper.scaleY(flipV);
});

resetButton.addEventListener("click", () => {
  cropper.reset();
  zoomValue = 1;
  rotateValue = 0;
  flipH = 1;
  flipV = 1;
  zoomSlider.value = 1;
});

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

window.onload = () => {
  downloadButton.classList.add("hide");
  options.classList.add("hide");
  previewButton.classList.add("hide");
};
