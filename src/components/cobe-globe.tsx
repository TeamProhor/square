"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function CobeGlobe({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		let globe: ReturnType<typeof createGlobe> | null = null;
		let rafId = 0;
		let phi = 0;

		const init = (width: number) => {
			if (width === 0 || globe) {
				return;
			}

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const size = width * dpr;

			globe = createGlobe(canvas, {
				devicePixelRatio: dpr,
				width: size,
				height: size,
				phi: 0,
				theta: 0.15,
				dark: 1,
				diffuse: 1.2,
				mapSamples: 16_000,
				mapBrightness: 6,
				baseColor: [0.25, 0.25, 0.25],
				markerColor: [0.1, 0.8, 1],
				glowColor: [0.8, 0.8, 0.8],
				markers: [
					{ location: [23.8103, 90.4125], size: 0.08 }, // Dhaka / Bangladesh
					{ location: [37.7595, -122.4367], size: 0.04 },
					{ location: [40.7128, -74.006], size: 0.05 },
					{ location: [51.5074, -0.1278], size: 0.04 },
				],
			});

			const loop = () => {
				phi += 0.005;
				globe?.update({ phi });
				rafId = requestAnimationFrame(loop);
			};
			loop();
		};

		const width = canvas.offsetWidth || 350;
		init(width);

		const ro = new ResizeObserver((entries) => {
			const w = entries[0]?.contentRect.width;
			if (w && w > 0 && !globe) {
				init(w);
			}
		});
		ro.observe(canvas);

		return () => {
			ro.disconnect();
			cancelAnimationFrame(rafId);
			globe?.destroy();
		};
	}, []);

	return (
		<div className={`relative flex items-center justify-center overflow-visible ${className ?? ""}`}>
			<canvas
				ref={canvasRef}
				className="w-full h-auto max-w-[340px] md:max-w-[400px] aspect-square object-contain"
				style={{ width: "100%", height: "100%" }}
			/>
		</div>
	);
}
