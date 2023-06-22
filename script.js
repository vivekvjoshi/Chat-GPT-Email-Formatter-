const loadingIndicator = document.getElementById('loadingIndicator');
const copyBtn = document.getElementById('copyBtn');
const requestInput = document.getElementById('requestInput');
const responseOutput = document.getElementById('responseOutput');
const shortSweetCheckbox = document.getElementById('shortSweetCheckbox');
copyBtn.style.display="none";

function generateResponse(inputText) {
  const message =
    "Write this professionally" +
    (shortSweetCheckbox.checked ? " and make it short." : "") +
    "\nIn an email format for the below text:\n" +
    inputText;

  console.log("message", message);

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer <<API Token>>"  //add your token here
  );
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      restObj = JSON.parse(result);
      console.log("response", restObj.choices[0].message.content);

      return restObj.choices[0].message.content;
    })
    .catch((error) => console.log("error", error));
}

function copyResponse() {
  const responseText = responseOutput.innerText;

  // Create a temporary textarea element
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = responseText;

  // Append the textarea to the body
  document.body.appendChild(tempTextArea);

  // Select and copy the text
  tempTextArea.select();
  document.execCommand("copy");

  // Remove the temporary textarea
  document.body.removeChild(tempTextArea);

  // Provide visual feedback
  copyBtn.innerText = "Copied!";
  setTimeout(() => {
    copyBtn.innerText = "Copy";
  }, 2000);
}

// Toggle Dark Mode
function toggleDarkMode() {
  const body = document.querySelector("body");
  const container = document.querySelector(".container");
  const inputs = document.querySelectorAll("textarea, input, button, select");

  body.classList.toggle("dark-mode");
  container.classList.toggle("dark-mode");

  inputs.forEach((input) => {
    input.classList.toggle("dark-mode");
  });
}

// Add event listeners
document.getElementById("submitBtn").addEventListener("click", () => {
  // Display loading indicator
  loadingIndicator.style.display = "block";
  const request = requestInput.value;
  responseOutput.innerText = "";
  copyBtn.style.display = "none";
  generateResponse(request).then((response) => {
    responseOutput.innerText = response;
    loadingIndicator.style.display = "none";
    copyBtn.style.display = "block";
  });
});

document.getElementById("copyBtn").addEventListener("click", copyResponse);
