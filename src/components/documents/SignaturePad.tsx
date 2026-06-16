import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';

interface SignaturePadProps {
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
  disabled?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ initialDataUrl, onSave, disabled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedDataUrl, setSavedDataUrl] = useState<string | null>(initialDataUrl ?? null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 650;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    if (initialDataUrl) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = initialDataUrl;
    }
  }, [initialDataUrl]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext('2d');
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (disabled) return;
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSavedDataUrl(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setSavedDataUrl(dataUrl);
    onSave(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-800 mb-3">Sign below</p>
        <canvas
          ref={canvasRef}
          className="w-full min-h-[220px] rounded-lg border border-dashed border-gray-300 bg-white"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={clearSignature} disabled={disabled}>
          Clear
        </Button>
        <Button variant="primary" size="sm" onClick={saveSignature} disabled={disabled}>
          Save Signature
        </Button>
      </div>
      {savedDataUrl && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600 mb-2">Saved signature preview</p>
          <img src={savedDataUrl} alt="Saved signature" className="max-w-full rounded-lg border border-gray-200" />
        </div>
      )}
    </div>
  );
};
