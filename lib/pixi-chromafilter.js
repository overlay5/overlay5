/* from https://gist.github.com/IbeVanmeenen/d4f5225ad7d2fa54fabcc38d740ba30e */
(function(){
  function ChromaFilter() {
    const vertexShader = null
    const fragmentShader = `
      varying vec2 vTextureCoord;

      uniform float thresholdSensitivity;
      uniform float smoothing;
      uniform vec3 colorToReplace;
      uniform sampler2D uSampler;

      void main() {
        vec4 textureColor = texture2D(uSampler, vTextureCoord);

        float maskY = (0.2989 * colorToReplace.r / 255.0 ) + (0.5866 * colorToReplace.g / 255.0) + (0.1145 * colorToReplace.b / 255.0);
        float maskCr = 0.7132 * (colorToReplace.r / 255.0 - maskY);
        float maskCb = 0.5647 * (colorToReplace.b / 255.0 - maskY);

        float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
        float Cr = 0.7132 * (textureColor.r - Y);
        float Cb = 0.5647 * (textureColor.b - Y);

        float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));
        gl_FragColor = vec4(textureColor.rgb, textureColor.a * blendValue);
      }
    `
    let uniforms = {}
    PIXI.Filter.call(this, vertexShader, fragmentShader)
    this.uniforms.thresholdSensitivity = 0.115
    this.uniforms.smoothing = 2.4
    this.uniforms.colorToReplace = [110, 222, 137]
  }
  ChromaFilter.prototype = Object.create(PIXI.Filter.prototype)
  ChromaFilter.prototype.constructor = ChromaFilter;
  PIXI.filters.ChromaFilter = ChromaFilter
})()
