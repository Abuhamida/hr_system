import { NextResponse } from 'next/server';
import { predictAttrition } from '@/lib/inference';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await predictAttrition(body);
    
    // Process probabilities
    // result.probabilities is likely a sequence of maps.
    // In JS/Node, it might be an array of objects or a Tensor.
    // Let's assume it returns the probability of class 1.
    
    // For sklearn-onnx with ZipMap (default), output_probability is a sequence of maps.
    // But onnxruntime-node might return it as a Map or object.
    // Let's inspect what we get or try to simplify.
    // If we can't easily parse it, we'll return the raw structure for inspection first.
    
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
