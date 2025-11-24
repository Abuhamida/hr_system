import * as ort from 'onnxruntime-node';
import path from 'path';
import fs from 'fs';

// Define types
type InputData = Record<string, string | number>;

interface LabelEncoderMapping {
  [key: string]: { [key: string]: number };
}

let session: ort.InferenceSession | null = null;
let mappings: LabelEncoderMapping | null = null;
let featureNames: string[] | null = null;

const MODEL_PATH = path.join(process.cwd(), 'src', 'models', 'model.onnx');
const MAPPINGS_PATH = path.join(process.cwd(), 'src', 'models', 'label_encoder_mapping.json');
const FEATURES_PATH = path.join(process.cwd(), 'src', 'models', 'feature_names.json');

async function loadResources() {
  if (!session) {
    session = await ort.InferenceSession.create(MODEL_PATH);
  }
  if (!mappings) {
    const data = fs.readFileSync(MAPPINGS_PATH, 'utf-8');
    mappings = JSON.parse(data);
  }
  if (!featureNames) {
    const data = fs.readFileSync(FEATURES_PATH, 'utf-8');
    featureNames = JSON.parse(data);
  }
}

export async function predictAttrition(input: InputData) {
  await loadResources();

  if (!session || !mappings || !featureNames) {
    throw new Error('Failed to load model resources');
  }

  // Preprocess input
  const feeds: Record<string, ort.Tensor> = {};
  const inputValues: number[] = [];

  for (const feature of featureNames) {
    let value = input[feature];

    // Handle categorical encoding
    if (mappings[feature]) {
      // If value is string, map it. If it's already number (e.g. from form), check if mapping exists
      if (typeof value === 'string') {
        const mappedValue = mappings[feature][value];
        if (mappedValue === undefined) {
           // Handle unknown category or default?
           // For now, try to parse as int if possible or throw
           // Or maybe the input is already mapped?
           // Let's assume input is raw string for categorical
           console.warn(`Unknown value '${value}' for feature '${feature}'. Using 0.`);
           value = 0; 
        } else {
            value = mappedValue;
        }
      }
    }

    // Ensure number
    const numValue = Number(value);
    if (isNaN(numValue)) {
        throw new Error(`Invalid value for feature ${feature}: ${value}`);
    }
    inputValues.push(numValue);
  }

  // Create Tensor
  // Shape: [1, n_features]
  const inputTensor = new ort.Tensor('float32', Float32Array.from(inputValues), [1, inputValues.length]);

  // Run inference
  // The input name for sklearn-onnx converted models is usually 'float_input'
  // We can check session.inputNames
  const inputName = session.inputNames[0];
  const results = await session.run({ [inputName]: inputTensor });

  // Output
  // Usually 'output_label' (prediction) and 'output_probability' (probabilities)
  const label = results[session.outputNames[0]];
  const probability = results[session.outputNames[1]]; 

  // Extract probability for class 1 (Attrition = Yes)
  // With zipmap=False, output_probability is a Tensor of shape [1, 2] (for binary classification)
  // Index 0 is class 0, Index 1 is class 1
  const probData = probability.data as Float32Array;
  const probYes = probData[1];
  
  return {
    prediction: Number(label.data[0]), // 0 or 1
    probabilities: { "0": probData[0], "1": probData[1] } // Return object for frontend consistency
  };
}
