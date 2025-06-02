 
export const brushTypes = {

    pencil :(ctx , x,y , settings) => {
        ctx.lineTo(x,y);
        ctx.strokeStyle = settings.color;
        ctx.lineWidth= settings.size;
        ctx.globalAlpha = 1.0 ;
        ctx.lineCap = 'round';
        ctx.stroke();
    },
    crayon: (ctx, x, y, settings) => {
    ctx.lineTo(x + Math.random(), y + Math.random());
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.size + 1;
    ctx.globalAlpha = 0.6;
    ctx.lineCap = 'butt';
    ctx.stroke();
  },

  watercolor: (ctx, x, y, settings) => {
    ctx.lineTo(x, y);
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.size * 2;
    ctx.globalAlpha = 0.2;
    ctx.lineCap = 'round';
    ctx.stroke();
  },
  oil: (ctx, x, y, settings) => {
    ctx.lineTo(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.size;
    ctx.globalAlpha = 0.9;
    ctx.lineCap = 'round';
    ctx.stroke();
  },
}