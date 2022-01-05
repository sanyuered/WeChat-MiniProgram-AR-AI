var renderer;
var program;

// 创建webgl着色器
function initGL(_renderer) {
  console.log('initGL')
  renderer = _renderer
  const gl = renderer.getContext()
  const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
  const vs = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat3 displayTransform;
        varying vec2 v_texCoord;
        void main() {
          vec3 p = displayTransform * vec3(a_position, 0);
          gl_Position = vec4(p.x, p.y, -1, 1);
          v_texCoord = a_texCoord;
        }
      `
  const fs = `
        precision highp float;

        uniform sampler2D y_texture;
        uniform sampler2D uv_texture;
        varying vec2 v_texCoord;
        void main() {
          vec4 y_color = texture2D(y_texture, v_texCoord);
          vec4 uv_color = texture2D(uv_texture, v_texCoord);

          float Y, U, V;
          float R ,G, B;
          Y = y_color.r;
          U = uv_color.r - 0.5;
          V = uv_color.a - 0.5;
          
          R = Y + 1.402 * V;
          G = Y - 0.344 * U - 0.714 * V;
          B = Y + 1.772 * U;
          
          gl_FragColor = vec4(R, G, B, 1.0);
        }
      `
  const vertShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertShader, vs)
  gl.compileShader(vertShader)

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragShader, fs)
  gl.compileShader(fragShader)

  program = gl.createProgram()
  program.gl = gl
  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.deleteShader(vertShader)
  gl.deleteShader(fragShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  const uniformYTexture = gl.getUniformLocation(program, 'y_texture')
  gl.uniform1i(uniformYTexture, 5)
  const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture')
  gl.uniform1i(uniformUVTexture, 6)

  gl.useProgram(currentProgram)
}

// 将YUV格式图像转换为RGB格式图像
function renderGL(frame) {
  const gl = renderer.getContext()
  // 从AR帧图像中获取YUV格式图像
  const { yTexture, uvTexture } = frame.getCameraTexture(gl, 'yuv')
  // 获取YUV格式纹理图像的调整矩阵
  const displayTransform = frame.getDisplayTransform()

  if (yTexture && uvTexture) {
    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
    const currentTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
    gl.useProgram(program)

    const posAttr = gl.getAttribLocation(program, 'a_position')
    const pos = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pos)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(posAttr)

    const texcoordAttr = gl.getAttribLocation(program, 'a_texCoord')
    const texcoord = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoord)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(texcoordAttr)

    const dt = gl.getUniformLocation(program, 'displayTransform')
    gl.uniformMatrix3fv(dt, false, displayTransform)

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

    gl.activeTexture(gl.TEXTURE0 + 5)
    gl.bindTexture(gl.TEXTURE_2D, yTexture)

    gl.activeTexture(gl.TEXTURE0 + 6)
    gl.bindTexture(gl.TEXTURE_2D, uvTexture)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.useProgram(currentProgram)
    gl.activeTexture(currentTexture)
  }
}

// 将对象回收
function dispose(){
  if (program && program.gl) {
    program.gl.deleteProgram(program)
    program = null
}
}

module.exports = {
  initGL,
  renderGL,
  dispose,
}