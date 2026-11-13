const sharp = require("sharp"), potrace = require("potrace") /* npm i --no-save potrace@2.1.8 */, fs = require("fs");
const [src] = process.argv.slice(2);
(async () => {
  const K = 4;
  const meta = await sharp(src).metadata();
  // alpha -> black ink on white, upscaled for smoother curves
  const a = await sharp(src).extractChannel(3).resize(meta.width * K, meta.height * K, { kernel: "cubic" }).blur(12).negate().png().toBuffer();
  fs.writeFileSync("ink4x.png", a);
  potrace.trace(a, { threshold: 128, turdSize: 40, optTolerance: 4, alphaMax: 1.2 }, (err, svg) => {
    if (err) throw err;
    const d = svg.match(/ d="([^"]+)"/)[1];
    // scale coordinates back to 1x
    const scaled = d.replace(/-?\d+(\.\d+)?/g, (n) => (+(n / K).toFixed(2)).toString());
    fs.writeFileSync("fill.d.txt", scaled);
    console.log(meta.width, meta.height, "path chars", scaled.length);
  });
})();
