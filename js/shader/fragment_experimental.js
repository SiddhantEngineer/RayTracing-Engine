const Fragment = `#version 300 es
#define MAX_TRIANGLES 14
#define MAX_SPHERE 2
#define MAX_MATERIALS 6
#define EPSILON 0.0000001

precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D uPreviousFrame;
const vec3 sunlightColor = vec3(1.0, 1.0, 1.0);
const vec3 sunlightDirection = normalize(vec3(-100.0, -100.0, 100.0)); 

struct Material{
  vec3 color;
  vec3 emmision;
  float specular;
};

struct Triangle{
  vec3 vertexA;
  vec3 vertexB;
  vec3 vertexC;
  vec3 normalA;
  vec3 normalB;
  vec3 normalC;
  int materialIndex;
};

struct Sphere{
  vec3 location;
  float radius;
  int materialIndex;
};

struct Ray{
  vec3 origin;
  vec3 dir;
};

struct HitInfo{
  vec3 point;
  vec3 normal;
  float dist;
  int materialIndex;
};

struct World{
  int triangleCount;
  int sphereCount;
  float height;
  float width;
  float samples;
};

struct Camera{
  float focalLength;
  vec3 location;
  vec3 rotation;
};

uniform Triangle triangles[MAX_TRIANGLES];
uniform Sphere spheres[MAX_SPHERE];
uniform Material materials[MAX_MATERIALS];
uniform vec3 externalSeed;
uniform World world;
uniform Camera camera;

bool sphereCollision(Sphere sphere, Ray ray, inout HitInfo hitInfo){
  vec3 offsetRayOrigin = ray.origin - sphere.location;
  float a = dot(ray.dir, ray.dir);
  float b = 2.0*dot(offsetRayOrigin, ray.dir);
  float c = dot(offsetRayOrigin, offsetRayOrigin) - sphere.radius * sphere.radius;
  float d = b * b - (4.0 * a * c);
  if(d>=0.0){
    float dist = (-b - sqrt(d));
    if(dist>=0.0){
      dist /= ( a + a);
      hitInfo.dist = dist;
      hitInfo.point = ray.origin + (ray.dir * dist);
      hitInfo.normal = normalize(hitInfo.point - sphere.location);
      return true;
    }
  }
  return false;
}

bool triangleCollision(Triangle triangle, Ray ray, inout HitInfo hitInfo){
  vec3 edgeAB = triangle.vertexB - triangle.vertexA;
  vec3 edgeAC = triangle.vertexC - triangle.vertexA;
  vec3 normalVector = cross(edgeAB, edgeAC);
  vec3 ao = ray.origin - triangle.vertexA;
  vec3 dao = cross(ao, ray.dir);

  float determinant = -dot(ray.dir, normalVector);
  float invDet = 1.0 / determinant;

  float dst = dot(ao, normalVector) * invDet;
  float u = dot(edgeAC, dao) * invDet;
  float v = -dot(edgeAB, dao) * invDet;
  float w = 1.0 - u - v;

  if(determinant >= 1e-6 && dst>0.0 && u>=0.0 && v>=0.0 && w >= 0.0){
    hitInfo.point = ray.origin + ray.dir*dst;
    hitInfo.dist = dst;
    // hitInfo.normal = normalize(triangle.normalA*w + triangle.normalB*u + triangle.normalC*v);
    hitInfo.normal = normalize(normalVector);
    return true;
  }
  return false;
}

bool findNearest(Ray ray,inout HitInfo resultHitInfo){
  float minDist = 1000000000.0;
  bool collided = false;
  for(int i=0; i<world.triangleCount; i++){
    HitInfo hitInfo;
    if(triangleCollision(triangles[i], ray, hitInfo)){
      if( hitInfo.dist < minDist){
        collided = true;
        resultHitInfo = hitInfo;
        minDist = hitInfo.dist;
        resultHitInfo.materialIndex = triangles[i].materialIndex;
      }
    }
  }
  for(int i=0; i<world.sphereCount; i++){
    HitInfo hitInfo;
    if(sphereCollision(spheres[i], ray, hitInfo)){
      if( hitInfo.dist < minDist ){
        collided = true;
        resultHitInfo = hitInfo;
        minDist = hitInfo.dist;
        resultHitInfo.materialIndex = spheres[i].materialIndex;
      }
    }
  }
  return collided;
}

float random(inout uint state){
  state = state * uint(747796405 + 2891336453);
  uint result = ((state>>((state >> 28)+uint(4)))^state)+uint(277803737);
  result = (result>>22)^result;
  return float(result)/4294967295.0;
}

vec3 randomDirection(inout uint state){
  for(int i=0; i<10; i++){
    vec3 point;
    point.x = random(state) * 2.0 - 1.0;
    point.y = random(state) * 2.0 - 1.0;
    point.z = random(state) * 2.0 - 1.0;
    float dist = dot(point, point);
    if(dist <= 1.0){
      return point / sqrt(dist);
    }
  }
}

vec3 trace(Ray ray, uint state){
  vec3 incomingLight = vec3(0.0, 0.0, 0.0);
  vec3 rayColor = vec3(1.0, 1.0, 1.0);
  vec3 specular, diffuse;
  float isHit = 0.0;
  for(int i=0; i<4; i++){
    HitInfo hitInfo;
    if(findNearest(ray, hitInfo)){
      ray.origin = hitInfo.point;
      specular = reflect(ray.dir, hitInfo.normal);
      diffuse = normalize(hitInfo.normal+randomDirection(state));
      ray.dir = mix(diffuse, specular, materials[hitInfo.materialIndex].specular);
      incomingLight += rayColor * materials[hitInfo.materialIndex].emmision;
      rayColor *= materials[hitInfo.materialIndex].color;
      isHit += 0.1;
    } else {
      float a = 1.0*(ray.dir.y+0.5);
      incomingLight = ((0.3-a)*vec3(0.1, 0.1, 0.1) + a*vec3(0.5, 0.7, 1.0))*rayColor;
      // float sunlightIntensity = max(dot(ray.dir, -sunlightDirection), 0.0);
      // vec3 sunlightContribution;
      // if(sunlightIntensity > 0.01){
      //   sunlightContribution = (sunlightIntensity - 0.01) * sunlightColor;
      // }
      // vec3 finalColor = ambientLight + sunlightContribution;
      // finalColor = clamp(finalColor, 0.0, 1.0);
      // incomingLight += finalColor;
      break;
    }
  }
  return incomingLight;
  // return ray.dir;
  // return vec3(isHit, isHit, isHit);
}

vec3 denoise(float sigmaSpatial, float sigmaRange){
  vec3 result = vec3(0.0);
  float totalWeight = 0.0;
  vec3 centerColor = texture(uPreviousFrame, v_texCoord).rgb;
  for(int i=-3; i<=3; i++){
    for(int j=-3; j<=3; j++){
      vec2 offset = vec2(float(i), float(j));
      vec2 sampleCoord = v_texCoord + offset;
      vec3 sampleColor = texture(uPreviousFrame, sampleCoord).rgb;
      float spatialWeight = exp(-length(offset)/sigmaSpatial);
      float colorWeight = exp(-length(sampleColor - centerColor)/sigmaRange);
      float weight = spatialWeight * colorWeight;
      result += sampleColor * weight;
      totalWeight += weight;
    }
  }
  return result/ totalWeight ;
}

void main() {
  vec3 point;
  point.x = gl_FragCoord.x-world.width/2.0 + externalSeed.x;
  point.y = gl_FragCoord.y-world.height/2.0 + externalSeed.y;
  point.z = camera.focalLength;
  mat3x3 rotationMatrixX = mat3x3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, cos(camera.rotation.x), -sin(camera.rotation.x)),
    vec3(0.0, sin(camera.rotation.x), cos(camera.rotation.x))
  );

  mat3x3 rotationMatrixY = mat3x3(
    vec3(cos(camera.rotation.y), 0.0, sin(camera.rotation.y)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(camera.rotation.y), 0.0, cos(camera.rotation.y))
  );
  
  mat3x3 rotationMatrixZ = mat3x3(
    vec3(cos(camera.rotation.z), -sin(camera.rotation.z), 0.0),
    vec3(sin(camera.rotation.z), cos(camera.rotation.z), 0.0),
    vec3(0.0, 0.0, 1.0)
  );
  point = rotationMatrixZ * rotationMatrixY * rotationMatrixX * point;
  Ray ray;
  ray.origin = camera.location;
  ray.dir = normalize(point);
  vec4 prevColor = texture(uPreviousFrame, v_texCoord);
  uint pixelIndex = uint(gl_FragCoord.y * world.width + gl_FragCoord.x);
  float x = fract(sin(dot(gl_FragCoord.xyz, vec3(12.9898, 78.233, 45.5432)+externalSeed.x))*(43758.5453));
  vec3 color;
  for(int i=0; i<5; i++){
    color += trace(ray, pixelIndex + uint(world.samples * 546184.0 * x+float(i)*5610.0));
  }
  color /= 5.0;
  float weight = 1.0 / (world.samples + 1.0);
  color = color*weight + prevColor.xyz * (1.0 - weight);
 
  fragColor = vec4(color, 1.0);
}`;

export default Fragment;
