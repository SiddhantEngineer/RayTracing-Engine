import Global from "./global.js";
import Fragment from "./shader/fragment.js";
import Vertex from "./shader/vertex.js";
import render from "./render.js";
import Input from "./input.js";
import initInterface from "./interface.js";

const infoContainer = document.getElementById("info-container");
var startTime = Date.now();
main();

function main() {
  initCanvas();
  initWebgl();
  Input.initMovementListeners(Global);
  Global.STATE = "UPDATE";
  calculateNormals();
  initInterface(Global);
  mainLoop();
}

function initCanvas() {
  Global.UI.CANVAS = document.getElementById("viewport");
  Global.UI.CONTEXT = Global.UI.CANVAS.getContext("webgl2");
  const onResize = function () {
    Global.UI.WIDTH = window.innerWidth;
    Global.UI.HEIGHT = window.innerHeight;
    Global.UI.CANVAS.height = Global.UI.HEIGHT;
    Global.UI.CANVAS.width = Global.UI.WIDTH;
    Global.UI.CONTEXT.viewport(0, 0, Global.UI.WIDTH, Global.UI.HEIGHT);
    Global.GL.PREVIOUS_FRAME = new Uint8ClampedArray(
      Global.UI.WIDTH * Global.UI.HEIGHT * 4
    );
  };
  onResize();
  window.addEventListener("resize", onResize);
}

function initWebgl() {
  initShaders();
  initBuffers();
  Global.UI.CONTEXT.useProgram(Global.GL.SHADER_PROGRAM);
}

function initShaders() {
  Global.GL.FRAGMENT_SHADER_SORUCE = Fragment;
  Global.GL.VERTEX_SHADER_SOURCE = Vertex;
  const loadShader = function (ctx, type, source) {
    const shader = ctx.createShader(type);
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      console.warn(
        `An error occurred compiling the shaders: ${ctx.getShaderInfoLog(
          shader
        )}`
      );
      ctx.deleteShader(shader);
      return null;
    }

    return shader;
  };
  const vertexShader = loadShader(
    Global.UI.CONTEXT,
    Global.UI.CONTEXT.VERTEX_SHADER,
    Global.GL.VERTEX_SHADER_SOURCE
  );
  const fragmentShader = loadShader(
    Global.UI.CONTEXT,
    Global.UI.CONTEXT.FRAGMENT_SHADER,
    Global.GL.FRAGMENT_SHADER_SORUCE
  );

  Global.GL.SHADER_PROGRAM = Global.UI.CONTEXT.createProgram();
  Global.UI.CONTEXT.attachShader(Global.GL.SHADER_PROGRAM, vertexShader);
  Global.UI.CONTEXT.attachShader(Global.GL.SHADER_PROGRAM, fragmentShader);
  Global.UI.CONTEXT.linkProgram(Global.GL.SHADER_PROGRAM);
}

function initBuffers() {
  Global.GL.POSITION_BUFFER = Global.UI.CONTEXT.createBuffer();
  Global.UI.CONTEXT.bindBuffer(
    Global.UI.CONTEXT.ARRAY_BUFFER,
    Global.GL.POSITION_BUFFER
  );
  //for dividing the screen into smaller quads.
  // const positions = [];
  // const step = 2 / Global.GL.sampleScale;
  // for (let i = 0; i < 1; i++) {
  //   for (let j = 0; j < 1; j++) {
  //     let x1 = -1 + i * step;
  //     let y1 = 1 - j * step;
  //     let x2 = x1 + step;
  //     let y2 = y1 - step;
  //     let quads = [x2, y1, x1, y1, x2, y2, x1, y2];
  //     positions.push(...quads);
  //   }
  // }
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  Global.UI.CONTEXT.bufferData(
    Global.UI.CONTEXT.ARRAY_BUFFER,
    new Float32Array(positions),
    Global.UI.CONTEXT.STATIC_DRAW
  );

  startTime = Date.now();
}

function calculateNormals() {
  Global.TRIANGLES.forEach((object) => {
    object.normalA = normal(object.vertexA, object.vertexB, object.vertexC);
    object.normalB = normal(object.vertexB, object.vertexC, object.vertexA);
    object.normalC = normal(object.vertexC, object.vertexA, object.vertexB);
  });
}

function mainLoop() {
  render(Global);
  updateCamera(Input.MOVE);
  infoContainer.innerHTML = "samples: " + Global.GL.samples;
  if (Global.GL.samples === 1000) {
    console.log(Date.now() - startTime);
  }
  if (Global.STATE === "UPDATE") {
    Global.GL.samples++;
    requestAnimationFrame(mainLoop);
  }
}

function updateCamera(movement) {
  if (movement.FORWARD == 1 || movement.BACKWARD == 1) {
    moveForward(Global.CAMERA.speed, movement.FORWARD - movement.BACKWARD);
    Global.GL.samples = 0;
  }
  if (movement.RIGHT == 1 || movement.LEFT == 1) {
    moveSide(Global.CAMERA.speed, movement.RIGHT - movement.LEFT);
    Global.GL.samples = 0;
  }
  if (movement.TOP == 1 || movement.BOTTOM == 1) {
    Global.GL.samples = 0;
    Global.CAMERA.location[1] +=
      (movement.BOTTOM - movement.TOP) * Global.CAMERA.speed;
  }
}

function moveForward(step, dir) {
  const forwardVector = getForwardVector(Global.CAMERA.rotation);

  if (Global.CAMERA.shouldMove) {
    Global.GL.samples = 0;
    Global.CAMERA.location[0] += dir * (step * forwardVector[0]);
    Global.CAMERA.location[1] += dir * (step * forwardVector[1]);
    Global.CAMERA.location[2] += dir * (step * forwardVector[2]);
  }
  if (Global.UI.APP.shouldMove) {
    Global.UI.APP.selected.vertexA[2] += dir * step;
    Global.UI.APP.selected.vertexB[2] += dir * step;
    Global.UI.APP.selected.vertexC[2] += dir * step;
  }
}

function moveSide(step, dir) {
  const temp = [
    0,
    Global.CAMERA.rotation[1] - (90 * 3.14) / 180,
    Global.CAMERA.rotation[2],
  ];
  const forwardVector = getForwardVector(temp);
  if (Global.CAMERA.shouldMove) {
    Global.GL.samples = 0;
    Global.CAMERA.location[0] += dir * (step * forwardVector[0]);
    Global.CAMERA.location[1] += dir * (step * forwardVector[1]);
    Global.CAMERA.location[2] += dir * (step * forwardVector[2]);
  }
}

function getForwardVector(dir) {
  const dx = -Math.sin(dir[1]);
  const dy = Math.sin(dir[0]);
  const dz = Math.cos(dir[1]);
  return [dx, dy, dz];
}

function normal(a, b, c) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - c[1], c[2] - a[2]];
  return crossProduct(ab, ac);
}

function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
