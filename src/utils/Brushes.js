export const brushTypes = {
    // pencil: (ctx, x, y, settings) => {
    //     ctx.lineTo(x, y);
    //     ctx.strokeStyle = settings.color;
    //     ctx.lineWidth = settings.size;
    //     ctx.globalAlpha = 1.0;
    //     ctx.lineCap = "round";
    //     ctx.stroke();
    // },

    pencil: (ctx, x, y, settings, lastX, lastY, dabImage) => {
    if (!dabImage) return;

    const size = settings.size/6 || 1.5;
    const color = settings.color || "#000000";

    // Calculate distance between points
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Spacing between dabs (smaller = denser)
    const spacing = size * 0.6;

    for (let i = 0; i < dist; i += spacing) {
        const t = i / dist;
        const dabX = lastX + t * dx;
        const dabY = lastY + t * dy;

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.translate(dabX, dabY);
        ctx.drawImage(dabImage, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}
,

    watercolor: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));

        const size = settings.size * 2;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            // Create a fresh offscreen canvas for each dab
            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            // Draw base dab
            offCtx.globalAlpha = settings.opacity;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            // Tint it
            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            // Blend it with opacity
            ctx.globalAlpha = settings.opacity * 0.2;
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.globalAlpha = 1.0;
        }
    },

    oil: (ctx, x, y, settings) => {
        ctx.lineTo(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = settings.size;
        ctx.globalAlpha = 0.9;
        ctx.lineCap = "round";
        ctx.stroke();
    },

    blender: (ctx, x, y, settings, lastX, lastY) => {
        const size = settings.size * 2;
        const radius = size / 2;

        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.ceil(dist / 2);

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = Math.floor(lastX + dx * t);
            const yi = Math.floor(lastY + dy * t);

            const sampleX = xi - radius;
            const sampleY = yi - radius;

            try {
                // 1. Sample the region
                const imageData = ctx.getImageData(sampleX, sampleY, size, size);

                // 2. Place it slightly forward to smear
                const offsetX = sampleX + dx * 0.4;
                const offsetY = sampleY + dy * 0.4;

                ctx.putImageData(imageData, offsetX, offsetY);
            } catch (err) {
                // Silently ignore out-of-bound errors
            }
        }
    },
    dabBrush: (ctx, x, y, settings, lastX, lastY, img) => {
        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));

        const offCanvas = document.createElement("canvas");
        const size = settings.size * 2;
        offCanvas.width = size;
        offCanvas.height = size;
        const offCtx = offCanvas.getContext("2d");

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            offCtx.clearRect(0, 0, size, size);
            offCtx.globalAlpha = settings.opacity;
            offCtx.drawImage(img, 0, 0, size, size);

            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);
            offCtx.globalCompositeOperation = "source-over";

            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
        }
    },

    spray: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));

        const size = settings.size * 3;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            // Create a fresh offscreen canvas for each dab
            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            // Draw base dab
            offCtx.globalAlpha = settings.opacity;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            // Tint it
            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            // Blend it with opacity
            ctx.globalAlpha = settings.opacity * 0.15;
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.globalAlpha = 1.0;
        }
    },

    flat: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));

        const size = settings.size * 2;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            // Create a fresh offscreen canvas for each dab
            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            // Draw base dab
            offCtx.globalAlpha = settings.opacity;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            // Tint it
            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            // Blend it with opacity
            ctx.globalAlpha = settings.opacity * 0.15;
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.globalAlpha = 1.0;
        }
    },

    // Dry Brush
    dry: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));
        const size = settings.size * 2.5;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            offCtx.globalAlpha = settings.opacity * 0.8;
            offCtx.drawImage(dabImage, 0, 0, size, size);
            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            ctx.globalAlpha = settings.opacity * 0.2;
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.globalAlpha = 1.0;
        }
    },

    crayon: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.4));
        const size = settings.size * 2;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            offCtx.globalAlpha = settings.opacity;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            ctx.globalAlpha = settings.opacity * 0.25;
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.globalAlpha = 1.0;
        }
    },

    // Waterstamp
    waterstamp: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.4));
        const size = settings.size * 3;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            offCtx.globalAlpha = settings.opacity * 0.5;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            offCtx.globalCompositeOperation = "source-in";
            offCtx.fillStyle = settings.color;
            offCtx.fillRect(0, 0, size, size);

            ctx.globalAlpha = settings.opacity * 0.1;
            ctx.drawImage(offCanvas, xi - size / 4, yi - size / 4);
            ctx.globalAlpha = 1.0;
        }
    },

    eraserBrush: (ctx, x, y, settings, lastX, lastY, dabImage) => {
        if (!dabImage) return;

        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));
        const size = settings.size * 2;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const xi = lastX + (x - lastX) * t;
            const yi = lastY + (y - lastY) * t;

            const offCanvas = document.createElement("canvas");
            offCanvas.width = size;
            offCanvas.height = size;
            const offCtx = offCanvas.getContext("2d");

            offCtx.globalAlpha = 1.0;
            offCtx.drawImage(dabImage, 0, 0, size, size);

            ctx.save();
            // ctx.globalCompositeOperation = "destination-out";
            ctx.drawImage(offCanvas, xi - size / 2, yi - size / 2);
            ctx.restore();
        }
    },

    ballpen: (ctx, x, y, settings) => {
        const color = settings.color || "#0000ff";
        const size = settings.size || 1.2;

        const segments = 5;
        for (let i = 0; i < segments; i++) {
            const offsetX = (Math.random() - 0.5) * 1.2;
            const offsetY = (Math.random() - 0.5) * 1.2;

            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY);
            ctx.lineTo(x + offsetX + 0.1, y + offsetY + 0.1);  
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.globalAlpha = 0.2;
            ctx.lineCap = "round";
            ctx.stroke();
        }
    },
};
