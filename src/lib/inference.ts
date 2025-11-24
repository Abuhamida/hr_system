import * as ort from "onnxruntime-node";
import fs from "fs/promises";
import path from "path";

type InputData = Record<string, string | number>;

interface LabelEncoderMapping {
  [key: string]: { [key: string]: number };
}

let session: ort.InferenceSession | null = null;
let mappings: LabelEncoderMapping | null = null;
let featureNames: string[] | null = null;

const MODEL_PATH = path.join(process.cwd(), "src", "models", "model.onnx");
const MAPPINGS_PATH = path.join(process.cwd(), "src", "models", "label_encoder_mapping.json");
const FEATURES_PATH = path.join(process.cwd(), "src", "models", "feature_names.json");

async function loadResources() {
  if (!session) {
    session = await ort.InferenceSession.create(MODEL_PATH);
  }

  if (!mappings) {
    const data = await fs.readFile(MAPPINGS_PATH, "utf-8");
    mappings = JSON.parse(data);
  }

  if (!featureNames) {
    const data = await fs.readFile(FEATURES_PATH, "utf-8");
    featureNames = JSON.parse(data);
  }
}

export async function predictAttrition(input: InputData) {
  await loadResources();

  if (!session || !mappings || !featureNames) {
    throw new Error("Failed to load model resources.");
  }

  const inputValues: number[] = [];

  for (const feature of featureNames) {
    let value = input[feature];

    if (mappings[feature]) {
      if (typeof value === "string") {
        const mapped = mappings[feature][value];
        value = mapped !== undefined ? mapped : 0;
      }
    }

    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Invalid value for feature ${feature}: ${value}`);
    }

    inputValues.push(num);
  }

  const tensor = new ort.Tensor("float32", Float32Array.from(inputValues), [
    1,
    inputValues.length,
  ]);

  const inputName = session.inputNames[0];
  const result = await session.run({ [inputName]: tensor });

  const label = result[session.outputNames[0]];
  const probability = result[session.outputNames[1]];

  const probData = probability.data as Float32Array;

  return {
    prediction: Number(label.data[0]),
    probabilities: { 0: probData[0], 1: probData[1] },
  };
}
