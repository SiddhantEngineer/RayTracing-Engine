import Global from "../global.js";
const Vertex = `#version 300 es
in vec2 aVertexPosition;
in vec2 offset;
out vec2 v_texCoord;
void main() {
  v_texCoord = vec2((aVertexPosition.x+1.0+float(gl_InstanceID%${
    Global.GL.sampleScale
  })/${
  Global.GL.sampleScale / 2
}.0)/2.0,(aVertexPosition.y+1.0-float(gl_InstanceID/${Global.GL.sampleScale})/${
  Global.GL.sampleScale / 2
}.0)/2.0);
  gl_Position = vec4(aVertexPosition.x+float(gl_InstanceID%${
    Global.GL.sampleScale
  })/${Global.GL.sampleScale / 2}.0, aVertexPosition.y-float(gl_InstanceID/${
  Global.GL.sampleScale
})/${Global.GL.sampleScale / 2}.0, 0.0, 1.0);
}`;

console.log(Vertex);

export default Vertex;
