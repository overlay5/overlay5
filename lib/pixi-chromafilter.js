/* from https://gist.github.com/IbeVanmeenen/d4f5225ad7d2fa54fabcc38d740ba30e */
(function () {
  const fragmentShader = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float thresholdSensitivity;
    uniform float smoothing;
    uniform vec3 colorToReplace;

    void main(void) {
      vec4 textureColor = texture2D(uSampler, vTextureCoord);

      // float maskY = 0.2989  * colorToReplace.r + 0.5866 * colorToReplace.g + 0.1145 * colorToReplace.b;
      // float maskCr = 0.7132 * (colorToReplace.r - maskY);
      // float maskCb = 0.5647 * (colorToReplace.b - maskY);
      float maskY = (0.2989 * colorToReplace.r / 255.0 ) + (0.5866 * colorToReplace.g / 255.0) + (0.1145 * colorToReplace.b / 255.0);
      float maskCr = 0.7132 * (colorToReplace.r / 255.0 - maskY);
      float maskCb = 0.5647 * (colorToReplace.b / 255.0 - maskY);

      float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
      float Cr = 0.7132 * (textureColor.r - Y);
      float Cb = 0.5647 * (textureColor.b - Y);

      float d = distance(vec2(Cr, Cb), vec2(maskCr, maskCb));
      // d = clamp(d * 10.0 - 1.0, 0.0, 1.0);

      float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, d);
      gl_FragColor = vec4(textureColor.rgb, textureColor.a * blendValue * 255.0);
      // gl_FragColor = vec4(d, d, d , 1);
    }
  `;

  const fragmentShader2 = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float thresholdSensitivity;
    uniform float smoothing;
    uniform vec3 colorToReplace;

    void main() {
      vec4 textureColor = texture2D(uSampler, vTextureCoord);

      float maskY = (0.2989 * colorToReplace.r / 255.0 ) + (0.5866 * colorToReplace.g / 255.0) + (0.1145 * colorToReplace.b / 255.0);
      float maskCr = 0.7132 * (colorToReplace.r / 255.0 - maskY);
      float maskCb = 0.5647 * (colorToReplace.b / 255.0 - maskY);

      float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
      float Cr = 0.7132 * (textureColor.r - Y);
      float Cb = 0.5647 * (textureColor.b - Y);

      float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));
      gl_FragColor = vec4(textureColor.rgb, textureColor.a * blendValue * 255.0);
    }
  `;
  class ChromaFilter extends PIXI.Filter {
    constructor(thresholdSensitivity = 0.1, smoothing = 0.5, colorToReplace = [48, 130, 72]) {
      super(PIXI.defaultVertex, fragmentShader)
      this.uniforms.thresholdSensitivity = thresholdSensitivity
      this.uniforms.smoothing = smoothing
      this.uniforms.colorToReplace = colorToReplace
      // this.padding = 1
    }

    // get thresholdSensitivity() { return this.uniforms.thresholdSensitivity }
    // get smoothing() { return this.uniforms.smoothing }
    // get colorToReplace() { return this.uniforms.colorToReplace }

    // set thresholdSensitivity(newVal) { this.uniforms.thresholdSensitivity = newVal }
    // set smoothing(newVal) { this.uniforms.smoothing = newVal }
    // set colorToReplace(newVal) { this.uniforms.colorToReplace = new Float32Array(newVal) }
  }
  ChromaFilter.prototype = Object.create(PIXI.Filter.prototype)
  PIXI.filters.ChromaFilter = ChromaFilter
})()

// /* from https://gist.github.com/IbeVanmeenen/d4f5225ad7d2fa54fabcc38d740ba30e */
// (function(){
//   const vertexShader = null
//   const fragmentShader = `
//     varying vec2 vTextureCoord;

//     uniform float thresholdSensitivity;
//     uniform float smoothing;
//     uniform vec3 colorToReplace;
//     uniform sampler2D uSampler;

//     void main() {
//       vec4 textureColor = texture2D(uSampler, vTextureCoord);

//       float maskY = (0.2989 * colorToReplace.r / 255.0 ) + (0.5866 * colorToReplace.g / 255.0) + (0.1145 * colorToReplace.b / 255.0);
//       float maskCr = 0.7132 * (colorToReplace.r / 255.0 - maskY);
//       float maskCb = 0.5647 * (colorToReplace.b / 255.0 - maskY);

//       float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
//       float Cr = 0.7132 * (textureColor.r - Y);
//       float Cb = 0.5647 * (textureColor.b - Y);

//       float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));
//       gl_FragColor = vec4(textureColor.rgb, textureColor.a * blendValue * 255.0);
//     }
//   `
//   class ChromaFilter extends PIXI.Filter {
//     constructor(options = {}) {
//       super(vertexShader, fragmentShader)
//       this.uniforms.thresholdSensitivity = 0.13
//       this.uniforms.smoothing = 0.20
//       this.uniforms.colorToReplace = new Float32Array(3)
//       Object.assign(this, {
//         thresholdSensitivity: 0.13,
//         smoothing: 0.20,
//         colorToReplace: 0x010203
//       }, options)
//       this.padding = 1
//     }
//   }

//   PIXI.filters.ChromaFilter = ChromaFilter
// })()
