export const brushTypes = {
    pencil: (ctx, x, y, settings) => {
        ctx.lineTo(x, y);
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = settings.size;
        ctx.globalAlpha = 1.0;
        ctx.lineCap = "round";
        ctx.stroke();
    },

    crayon: (ctx, x, y, settings) => {
        ctx.lineTo(x + Math.random(), y + Math.random());
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = settings.size + 1;
        ctx.globalAlpha = 0.6;
        ctx.lineCap = "butt";
        ctx.stroke();
    },

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
            ctx.globalAlpha = settings.opacity*0.2;
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
        const smudgeSize = settings.size * 2;
        const imageData = ctx.getImageData(
            x - smudgeSize / 2,
            y - smudgeSize / 2,
            smudgeSize,
            smudgeSize
        );
        ctx.putImageData(imageData, x - smudgeSize / 2 + 1, y - smudgeSize / 2 + 1);
    },





    dabBrush: (ctx, x, y, settings, lastX, lastY, img) => {
        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.ceil(dist / (settings.size * 0.5));

        const offCanvas = document.createElement("canvas");
        const size = settings.size*2;
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
};
