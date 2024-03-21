const Input = {
  MOVE: {
    FORWARD: 0,
    LEFT: 0,
    RIGHT: 0,
    BACKWARD: 0,
    TOP: 0,
    BOTTOM: 0,
  },
};

Input.initMovementListeners = function (Global) {
  const buttonW = document.getElementById("buttonW");
  const buttonA = document.getElementById("buttonA");
  const buttonS = document.getElementById("buttonS");
  const buttonD = document.getElementById("buttonD");
  buttonA.addEventListener("touchstart", () => {
    Input.MOVE.LEFT = 1;
    Global.CAMERA.shouldMove = true;
  });
  buttonA.addEventListener("touchend", () => {
    Input.MOVE.LEFT = 0;
  });
  buttonS.addEventListener("touchstart", () => {
    Input.MOVE.BACKWARD = 1;
    Global.CAMERA.shouldMove = true;
  });
  buttonS.addEventListener("touchend", () => {
    Input.MOVE.BACKWARD = 0;
  });
  buttonW.addEventListener("touchstart", () => {
    Input.MOVE.FORWARD = 1;
    Global.CAMERA.shouldMove = true;
  });
  buttonW.addEventListener("touchend", () => {
    Input.MOVE.FORWARD = 0;
  });
  buttonD.addEventListener("touchstart", () => {
    Input.MOVE.RIGHT = 1;
    Global.CAMERA.shouldMove = true;
  });
  buttonD.addEventListener("touchend", () => {
    Input.MOVE.RIGHT = 0;
  });
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case Global.INPUT.FORWARD: {
        Input.MOVE.FORWARD = 1;
        break;
      }
      case Global.INPUT.BACKWARD: {
        Input.MOVE.BACKWARD = 1;
        break;
      }
      case Global.INPUT.LEFT: {
        Input.MOVE.LEFT = 1;
        break;
      }
      case Global.INPUT.RIGHT: {
        Input.MOVE.RIGHT = 1;
        break;
      }
      case Global.INPUT.TOP: {
        Input.MOVE.TOP = 1;
        break;
      }
      case Global.INPUT.BOTTOM: {
        Input.MOVE.BOTTOM = 1;
        break;
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    switch (event.key) {
      case Global.INPUT.FORWARD: {
        Input.MOVE.FORWARD = 0;
        break;
      }
      case Global.INPUT.BACKWARD: {
        Input.MOVE.BACKWARD = 0;
        break;
      }
      case Global.INPUT.LEFT: {
        Input.MOVE.LEFT = 0;
        break;
      }
      case Global.INPUT.RIGHT: {
        Input.MOVE.RIGHT = 0;
        break;
      }
      case Global.INPUT.TOP: {
        Input.MOVE.TOP = 0;
        break;
      }
      case Global.INPUT.BOTTOM: {
        Input.MOVE.BOTTOM = 0;
        break;
      }
    }
  });

  document.addEventListener("mousedown", function () {
    Global.CAMERA.shouldMove = true;
  });
  document.addEventListener("mouseup", function () {
    Global.CAMERA.shouldMove = false;
  });
  document.addEventListener("mousemove", function (event) {
    if (Global.CAMERA.shouldMove) {
      Global.GL.samples = 0;
      Global.CAMERA.rotation[0] -=
        event.movementY * Global.CAMERA.rotationSpeed;
      Global.CAMERA.rotation[1] -=
        event.movementX * Global.CAMERA.rotationSpeed;
    }
  });
  let touchStart = [0, 0];
  document.addEventListener("touchstart", function (event) {
    Global.CAMERA.shouldMove = true;
    touchStart[0] = event.touches[0].clientX;
    touchStart[1] = event.touches[0].clientY;
  });
  document.addEventListener("touchend", function () {
    Global.CAMERA.shouldMove = false;
    Global.GL.samples = 0;
  });
  document.addEventListener("touchmove", (event) => {
    event.preventDefault();
    Global.GL.samples = 0;
    var deltaX = touchStart[0] - event.touches[0].clientX;
    var deltaY = touchStart[1] - event.touches[0].clientY;
    Global.CAMERA.rotation[1] += deltaX / 200;
    Global.CAMERA.rotation[0] += deltaY / 200;
    touchStart[0] = event.touches[0].clientX;
    touchStart[1] = event.touches[0].clientY;
    gl.samples = 1;
    gl.shouldResetSamples = true;
  });
};

export default Input;
