let generatorSkill = 0.3; // Initial generator skill level
let discriminatorSkill = 0.7; // Initial discriminator skill level
const learningRate = 0.05;

const generateBtn = document.getElementById("generateBtn");
const logList = document.getElementById("logList");
const resetBtn = document.getElementById("resetBtn");
const noiseBtn = document.getElementById("noiseBtn");
const genArrow = document.getElementById("genArrow");
const fakeData = document.getElementById("fakeData");
const decisionBox = document.getElementById("decisionBox");
const generatorNetwork = document.getElementById("generatorNetwork");
const discriminatorNetwork = document.getElementById("discriminatorNetwork");
const realData = document.getElementById("realData");

noiseBtn.addEventListener("click", () => {
  const flow = document.createElement("div");
  flow.className = "data-flow";
  generatorNetwork.appendChild(flow);
  setTimeout(() => flow.remove(), 1200);
});

generateBtn.addEventListener("click", () => {
  genArrow.style.width = "100px";
  const flow1 = document.createElement("div");
  flow1.className = "data-flow";
  generatorNetwork.appendChild(flow1);
  const fakeValue = Math.random() * generatorSkill; // Generator quality improves with skill
  setTimeout(() => {
    flow1.remove();
    genArrow.style.width = "60px";
    const flow2 = document.createElement("div");
    flow2.className = "data-flow";
    fakeData.appendChild(flow2);
    setTimeout(() => {
      flow2.remove();
      const flow3 = document.createElement("div");
      flow3.className = "data-flow";
      discriminatorNetwork.appendChild(flow3);
      const decisionThreshold = Math.random();
      let result = (fakeValue > discriminatorSkill) ? "Real" : "Fake";
      setTimeout(() => {
        flow3.remove();
        decisionBox.classList.remove("bg-success", "bg-danger");
        decisionBox.classList.add(result === "Real" ? "bg-success" : "bg-danger");
        // Update skills based on outcome
        if (result === "Real") {
          generatorSkill = Math.min(1, generatorSkill + learningRate);
          discriminatorSkill = Math.max(0, discriminatorSkill - learningRate);
        } else {
          generatorSkill = Math.max(0, generatorSkill - learningRate);
          discriminatorSkill = Math.min(1, discriminatorSkill + learningRate);
        }
        const logItem = document.createElement("li");
        logItem.className = "list-group-item";
        logItem.textContent = `Generated ${fakeValue.toFixed(2)} → ${result} (G: ${generatorSkill.toFixed(2)}, D: ${discriminatorSkill.toFixed(2)})`;
        logList.appendChild(logItem);
      }, 1200);
    }, 1200);
  }, 1200);
});

resetBtn.addEventListener("click", () => {
  logList.innerHTML = "";
  genArrow.style.width = "60px";
  decisionBox.classList.remove("bg-success", "bg-danger");
  generatorSkill = 0.3;
  discriminatorSkill = 0.7;
});