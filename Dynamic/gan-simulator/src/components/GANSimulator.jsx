// GANSimulator.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

const GANSimulator = () => {
  const [generatorSkill, setGeneratorSkill] = useState(0.3);
  const [discriminatorSkill, setDiscriminatorSkill] = useState(0.7);
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);

  const [lossHistory, setLossHistory] = useState({
    generator: [],
    discriminator: [],
    labels: [],
  });

  const learningRate = 0.05;

  const explanations = {
    noise: "Latent Space: We start with random noise vector z, representing no structured data.",
    generator:
      "Generator: Converts noise into a data-like output (fake sample) via learned weights.",
    discriminator:
      "Discriminator: Evaluates both real and generated data, outputs real/fake.",
    result:
      "Training: If D is fooled, G improves. If D detects fake, it improves.",
    loss: "Loss Graph: Tracks how good/bad G and D are. The goal is to find balance.",
  };

  const handleGenerate = () => {
    const fakeValue = Math.random() * generatorSkill;
    const result = fakeValue > discriminatorSkill ? "Real" : "Fake";

    let newGenSkill = generatorSkill;
    let newDiscSkill = discriminatorSkill;

    if (result === "Real") {
      newGenSkill = Math.min(1, generatorSkill + learningRate);
      newDiscSkill = Math.max(0, discriminatorSkill - learningRate);
    } else {
      newGenSkill = Math.max(0, generatorSkill - learningRate);
      newDiscSkill = Math.min(1, discriminatorSkill + learningRate);
    }

    const fakeLoss = 1 - fakeValue;
    const realLoss = Math.abs(discriminatorSkill - fakeValue);

    setLossHistory((prev) => ({
      generator: [...prev.generator, fakeLoss].slice(-10),
      discriminator: [...prev.discriminator, realLoss].slice(-10),
      labels: [...prev.labels, log.length + 1].slice(-10),
    }));

    setGeneratorSkill(newGenSkill);
    setDiscriminatorSkill(newDiscSkill);
    setProgress(Math.min(100, progress + 5));

    setLog((prevLog) => [
      `Fake Score: ${fakeValue.toFixed(2)} → ${result} (G: ${newGenSkill.toFixed(
        2
      )}, D: ${newDiscSkill.toFixed(2)})`,
      ...prevLog.slice(0, 9),
    ]);
  };

  const handleReset = () => {
    setGeneratorSkill(0.3);
    setDiscriminatorSkill(0.7);
    setLog([]);
    setProgress(0);
    setLossHistory({ generator: [], discriminator: [], labels: [] });
    setCurrentStep(null);
  };

  return (
    <div>
      <h1 className="text-center mb-4">GAN Simulator</h1>

      <div className="text-center my-4">
        <button
          className="btn btn-outline-info"
          onClick={() => {
            const order = [
              "noise",
              "generator",
              "discriminator",
              "result",
              "loss",
            ];
            const idx = order.indexOf(currentStep);
            const next = order[(idx + 1) % order.length];
            setCurrentStep(next);
          }}
        >
          Step: {currentStep ? currentStep.toUpperCase() : "START"}
        </button>
      </div>

      {currentStep && (
        <div className="alert alert-secondary text-dark">
          <strong>Explanation:</strong> {explanations[currentStep]}
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-light mb-3">
            <div className="card-body">
              <h5 className="card-title">Latent Space</h5>
              <span className="badge bg-info">Input Noise (z)</span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-warning text-dark mb-3">
            <div className="card-body">
              <h5 className="card-title">Generator</h5>
              <p>Skill: {(generatorSkill * 100).toFixed(0)}%</p>
              <div className="progress">
                <div
                  className="progress-bar bg-dark"
                  role="progressbar"
                  style={{ width: `${generatorSkill * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Discriminator</h5>
              <p>Skill: {(discriminatorSkill * 100).toFixed(0)}%</p>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${discriminatorSkill * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-primary" onClick={handleGenerate}>
          Generate
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="card bg-dark text-white mb-4">
        <div className="card-body">
          <h5 className="card-title">Training Log</h5>
          <ul className="list-group list-group-flush bg-dark">
            {log.map((entry, idx) => (
              <li
                key={idx}
                className="list-group-item text-light bg-dark border-bottom"
              >
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-5">
        <h5 className="mb-3">Loss Curve</h5>
        <Line
          data={{
            labels: lossHistory.labels,
            datasets: [
              {
                label: "Generator Loss",
                data: lossHistory.generator,
                borderColor: "orange",
                backgroundColor: "rgba(255,165,0,0.2)",
                tension: 0.4,
              },
              {
                label: "Discriminator Loss",
                data: lossHistory.discriminator,
                borderColor: "cyan",
                backgroundColor: "rgba(0,255,255,0.2)",
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                min: 0,
                max: 1,
              },
            },
          }}
        />
      </div>

      <div className="progress">
        <div
          className="progress-bar bg-info"
          role="progressbar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default GANSimulator;