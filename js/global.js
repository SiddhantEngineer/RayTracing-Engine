const cubeSize = 50;
const Global = {
  UI: {
    CANVAS: null,
    CONTEXT: null,
    WIDTH: 500,
    HEIGHT: 500,
    APP: {
      selected: null,
      shouldMove: false,
    },
  },
  CAMERA: {
    location: [0, 0, -100],
    rotation: [0, 0, 0],
    speed: 1,
    rotationSpeed: 0.005,
    focalLength: 250,
    shouldMove: false,
  },
  GL: {
    VERTEX_SHADER_SOURCE: null,
    FRAGMENT_SHADER_SORUCE: null,
    SHADER_PROGRAM: null,
    POSITION_BUFFER: null,
    BUFFER_DATA: null,
    PREVIOUS_FRAME: null,
    samples: 0,
    sampleScale: 16,
  },
  STATE: null,
  TRIANGLES: [
    //back
    {
      vertexA: [-cubeSize, -cubeSize, cubeSize],
      vertexB: [-cubeSize, cubeSize, cubeSize],
      vertexC: [cubeSize, cubeSize, cubeSize],
      materialIndex: 0,
    },
    {
      vertexA: [cubeSize, cubeSize, cubeSize],
      vertexB: [cubeSize, -cubeSize, cubeSize],
      vertexC: [-cubeSize, -cubeSize, cubeSize],
      materialIndex: 2,
    },
    //front
    {
      vertexC: [-cubeSize, -cubeSize, -cubeSize],
      vertexB: [-cubeSize, cubeSize, -cubeSize],
      vertexA: [cubeSize, cubeSize, -cubeSize],
      materialIndex: 0,
    },
    {
      vertexC: [cubeSize, cubeSize, -cubeSize],
      vertexB: [cubeSize, -cubeSize, -cubeSize],
      vertexA: [-cubeSize, -cubeSize, -cubeSize],
      materialIndex: 0,
    },
    //bottom
    {
      vertexA: [cubeSize, -cubeSize, cubeSize],
      vertexB: [cubeSize, -cubeSize, -cubeSize],
      vertexC: [-cubeSize, -cubeSize, -cubeSize],
      materialIndex: 0,
    },
    {
      vertexA: [-cubeSize, -cubeSize, -cubeSize],
      vertexB: [-cubeSize, -cubeSize, cubeSize],
      vertexC: [cubeSize, -cubeSize, cubeSize],
      materialIndex: 0,
    },
    //left
    {
      vertexC: [-cubeSize, cubeSize, cubeSize],
      vertexB: [-cubeSize, cubeSize, -cubeSize],
      vertexA: [-cubeSize, -cubeSize, -cubeSize],
      materialIndex: 4,
    },
    {
      vertexC: [-cubeSize, -cubeSize, -cubeSize],
      vertexB: [-cubeSize, -cubeSize, cubeSize],
      vertexA: [-cubeSize, cubeSize, cubeSize],
      materialIndex: 4,
    },
    //right
    {
      vertexA: [cubeSize, cubeSize, cubeSize],
      vertexB: [cubeSize, cubeSize, -cubeSize],
      vertexC: [cubeSize, -cubeSize, -cubeSize],
      materialIndex: 3,
    },
    {
      vertexA: [cubeSize, -cubeSize, -cubeSize],
      vertexB: [cubeSize, -cubeSize, cubeSize],
      vertexC: [cubeSize, cubeSize, cubeSize],
      materialIndex: 3,
    },
    // top
    {
      vertexC: [cubeSize, cubeSize, cubeSize],
      vertexB: [cubeSize, cubeSize, -cubeSize],
      vertexA: [-cubeSize, cubeSize, -cubeSize],
      materialIndex: 0,
    },
    {
      vertexC: [-cubeSize, cubeSize, -cubeSize],
      vertexB: [-cubeSize, cubeSize, cubeSize],
      vertexA: [cubeSize, cubeSize, cubeSize],
      materialIndex: 0,
    },
  ],
  SPHERES: [
    {
      location: [0, 40, 0],
      radius: 20,
      materialIndex: 1,
    },
    {
      location: [0, -30, 0],
      radius: 20,
      materialIndex: 5,
    },
  ],
  MATERIALS: [
    {
      color: [1, 1, 1],
      emmision: [0, 0, 0],
      specular: 0,
    },
    {
      color: [1, 1, 1],
      emmision: [2, 2, 2],
      specular: 1,
    },
    {
      color: [1, 0, 0],
      emmision: [0, 0, 0],
      specular: 0,
    },
    {
      color: [1, 1, 0],
      emmision: [0, 0, 0],
      specular: 0,
    },
    {
      color: [0, 0, 1],
      emmision: [0, 0, 0],
      specular: 0,
    },
    {
      color: [1, 1, 1],
      emmision: [0, 0, 0],
      specular: 1,
    },
  ],
  INPUT: {
    FORWARD: "w",
    LEFT: "a",
    RIGHT: "d",
    BACKWARD: "s",
    TOP: "q",
    BOTTOM: "e",
  },
};
export default Global;
