"use client";

import React, { useRef, useState, useEffect } from "react";
import { Eraser, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const greekLetters = [
  { letter: "α", name: "alpha" },
  { letter: "β", name: "beta" },
  { letter: "γ", name: "gamma" },
  { letter: "δ", name: "delta" },
  { letter: "ε", name: "epsilon" },
  { letter: "ζ", name: "zeta" },
  { letter: "η", name: "eta" },
  { letter: "θ", name: "theta" },
  { letter: "ι", name: "iota" },
  { letter: "κ", name: "kappa" },
  { letter: "λ", name: "lambda" },
  { letter: "μ", name: "mu" },
  { letter: "ν", name: "nu" },
  { letter: "ξ", name: "xi" },
  { letter: "ο", name: "omicron" },
  { letter: "π", name: "pi" },
  { letter: "ρ", name: "rho" },
  { letter: "σ", name: "sigma" },
  { letter: "τ", name: "tau" },
  { letter: "υ", name: "upsilon" },
  { letter: "φ", name: "phi" },
  { letter: "χ", name: "chi" },
  { letter: "ψ", name: "psi" },
  { letter: "ω", name: "omega" },
];

const GreekLetterRecognition = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<{ predicted_letter: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const predicted_confidence = prediction ? Number((prediction.confidence * 100).toFixed(2)) : 0;

  const capitalize = (str: string) => {
    const [first, ...rest] = str;
    return first.toUpperCase() + rest.join("").toLowerCase();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current = context;
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 10;
        context.lineCap = "round";
        context.strokeStyle = "black";
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    contextRef.current?.closePath();
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setPrediction(null);
    }
  };

  const sendToAPI = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setLoading(true);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        });
      });

      const formData = new FormData();
      formData.append("file", blob, "drawing.png");

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error sending image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-4 bg-slate-100">
      <section className="w-1/4 flex flex-col bg-blue-400 m-2 p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-white mb-4">
          Greek Letters <span className="text-4xl leading-none">.</span>
        </h1>
        <hr className="pb-8" />
        <div className="grid grid-cols-4 place-items-center gap-4">
          {greekLetters.map((item) => (
            <div
              key={item.letter}
              className="w-12 h-12 p-8 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-100 group relative overflow-hidden">
              <span className="text-3xl font-semibold text-black group-hover:opacity-20 transition-opacity duration-300">{item.letter}</span>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {capitalize(item.name)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="w-3/4 flex bg-slate-600 m-2 p-6 rounded-lg shadow-md">
        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-6">
          <div className="mt-4 h-20 mb-8 text-center">
            <h3 className="font-semibold text-2xl mb-4">Prediction</h3>
            {prediction ? (
              <>
                <p className="text-lg">
                  Letter: <span className="font-semibold text-blue-600">{capitalize(prediction.predicted_letter)}</span>
                </p>
                <p className="text-lg">
                  Confidence:
                  <span
                    className={`ml-2 p-1 rounded font-semibold ${
                      predicted_confidence > 75 ? "text-green-800 bg-green-100" : predicted_confidence >= 50 ? "text-yellow-600 bg-yellow-100" : "text-red-600 bg-red-100"
                    }`}>
                    {predicted_confidence}%
                  </span>
                </p>
              </>
            ) : loading ? (
              <div className="flex justify-center items-center">
                <div className="border-t-2 border-slate-600 rounded-full w-6 h-6 animate-spin"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <p className="text-gray-500">No prediction yet.</p>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            className="border-2 border-slate-300 rounded-lg mt-4 mb-6 cursor-crosshair"
          />

          <div className="flex justify-center mt-4">
            <Button onClick={clearCanvas} variant="destructive" className="mr-4">
              <Eraser className="mr-2 h-4 w-4" /> Clear Canvas
            </Button>
            <Button onClick={sendToAPI} variant="default">
              <Send className="mr-2 h-4 w-4" /> Send Image
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GreekLetterRecognition;
