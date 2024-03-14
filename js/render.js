var doOnce = true;
export default function render(Global) {
  Global.UI.CONTEXT.clearColor(0.0, 0.0, 0.0, 1.0);
  Global.UI.CONTEXT.clearDepth(1.0); // Clear everything
  Global.UI.CONTEXT.clear(
    Global.UI.CONTEXT.COLOR_BUFFER_BIT | Global.UI.CONTEXT.DEPTH_BUFFER_BIT
  );
  setVertex(Global);
  setTexture(
    Global,
    Global.GL.PREVIOUS_FRAME,
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `previousFrame`
    ),
    0,
    Global.UI.CONTEXT.TEXTURE0
  );
  setTriangles(Global);
  setSpheres(Global);
  setMaterials(Global);
  setCamera(Global);
  setParams(Global);
  // Global.UI.CONTEXT.drawArraysInstanced(
  //   Global.UI.CONTEXT.TRIANGLE_STRIP,
  //   0,
  //   4,
  //   Global.GL.sampleScale * Global.GL.sampleScale
  // );
  Global.UI.CONTEXT.drawArrays(Global.UI.CONTEXT.TRIANGLE_STRIP, 0, 4);
  Global.UI.CONTEXT.readPixels(
    0,
    0,
    Global.UI.WIDTH,
    Global.UI.HEIGHT,
    Global.UI.CONTEXT.RGBA,
    Global.UI.CONTEXT.UNSIGNED_BYTE,
    Global.GL.PREVIOUS_FRAME
  );
}

function setVertex(Global) {
  Global.UI.CONTEXT.bindBuffer(
    Global.UI.CONTEXT.ARRAY_BUFFER,
    Global.GL.POSITION_BUFFER
  );
  Global.UI.CONTEXT.vertexAttribPointer(
    Global.UI.CONTEXT.getAttribLocation(
      Global.GL.SHADER_PROGRAM,
      "aVertexPosition"
    ),
    2,
    Global.UI.CONTEXT.FLOAT,
    false,
    0,
    0
  );
  Global.UI.CONTEXT.enableVertexAttribArray(
    Global.UI.CONTEXT.getAttribLocation(
      Global.GL.SHADER_PROGRAM,
      "aVertexPosition"
    )
  );
}

function setTexture(Global, image, location, index, param) {
  const texture = Global.UI.CONTEXT.createTexture();
  Global.UI.CONTEXT.activeTexture(param);
  Global.UI.CONTEXT.bindTexture(Global.UI.CONTEXT.TEXTURE_2D, texture);
  Global.UI.CONTEXT.texImage2D(
    Global.UI.CONTEXT.TEXTURE_2D,
    0,
    Global.UI.CONTEXT.RGBA,
    Global.UI.WIDTH,
    Global.UI.HEIGHT,
    0,
    Global.UI.CONTEXT.RGBA,
    Global.UI.CONTEXT.UNSIGNED_BYTE,
    image
  );

  // Global.UI.CONTEXT.generateMipmap(Global.UI.CONTEXT.TEXTURE_2D);
  Global.UI.CONTEXT.texParameteri(
    Global.UI.CONTEXT.TEXTURE_2D,
    Global.UI.CONTEXT.TEXTURE_WRAP_S,
    Global.UI.CONTEXT.CLAMP_TO_EDGE
  );
  Global.UI.CONTEXT.texParameteri(
    Global.UI.CONTEXT.TEXTURE_2D,
    Global.UI.CONTEXT.TEXTURE_WRAP_T,
    Global.UI.CONTEXT.CLAMP_TO_EDGE
  );
  Global.UI.CONTEXT.texParameteri(
    Global.UI.CONTEXT.TEXTURE_2D,
    Global.UI.CONTEXT.TEXTURE_MIN_FILTER,
    Global.UI.CONTEXT.LINEAR
  );
  Global.UI.CONTEXT.uniform1i(location, index);
}

function setTriangles(Global) {
  Global.TRIANGLES.forEach((object, index) => {
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].vertexA`
      ),
      object.vertexA
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].vertexB`
      ),
      object.vertexB
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].vertexC`
      ),
      object.vertexC
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].normalA`
      ),
      object.normalA
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].normalB`
      ),
      object.normalB
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].normalC`
      ),
      object.normalC
    );
    Global.UI.CONTEXT.uniform1i(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `triangles[${index}].materialIndex`
      ),
      object.materialIndex
    );
  });
}

function setSpheres(Global) {
  Global.SPHERES.forEach((object, index) => {
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `spheres[${index}].location`
      ),
      object.location
    );
    Global.UI.CONTEXT.uniform1f(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `spheres[${index}].radius`
      ),
      object.radius
    );
    Global.UI.CONTEXT.uniform1i(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `spheres[${index}].materialIndex`
      ),
      object.materialIndex
    );
  });
}

function setMaterials(Global) {
  Global.MATERIALS.forEach((material, index) => {
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `materials[${index}].color`
      ),
      material.color
    );
    Global.UI.CONTEXT.uniform3fv(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `materials[${index}].emmision`
      ),
      material.emmision
    );
    Global.UI.CONTEXT.uniform1f(
      Global.UI.CONTEXT.getUniformLocation(
        Global.GL.SHADER_PROGRAM,
        `materials[${index}].specular`
      ),
      material.specular
    );
  });
}

function setParams(Global) {
  Global.UI.CONTEXT.uniform3fv(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `externalSeed`
    ),
    [Math.random(), Math.random(), Math.random()]
  );
  Global.UI.CONTEXT.uniform1f(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `world.width`
    ),
    Global.UI.WIDTH
  );
  Global.UI.CONTEXT.uniform1f(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `world.samples`
    ),
    Global.GL.samples
  );

  Global.UI.CONTEXT.uniform1f(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `world.height`
    ),
    Global.UI.HEIGHT
  );

  Global.UI.CONTEXT.uniform1i(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `world.sphereCount`
    ),
    Global.SPHERES.length
  );

  Global.UI.CONTEXT.uniform1i(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `world.triangleCount`
    ),
    Global.TRIANGLES.length
  );
}

function setCamera(Global) {
  Global.UI.CONTEXT.uniform3fv(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `camera.location`
    ),
    Global.CAMERA.location
  );
  Global.UI.CONTEXT.uniform3fv(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `camera.rotation`
    ),
    Global.CAMERA.rotation
  );
  Global.UI.CONTEXT.uniform1f(
    Global.UI.CONTEXT.getUniformLocation(
      Global.GL.SHADER_PROGRAM,
      `camera.focalLength`
    ),
    Global.CAMERA.focalLength
  );
}
