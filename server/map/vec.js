function addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function scaleVector(v, scalar) {
  return [v[0] * scalar, v[1] * scalar];
}
function vectorSubtraction(v1, v2) {
  return [v2[0] - v1[0], v2[1] - v1[1]];
}

function dotProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function magnitude(v) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

function equalVectors(v1, v2) {
  return v1[0] === v2[0] && v1[1] === v2[1];
}

function distance(v1, v2) {
  return magnitude(vectorSubtraction(v1, v2));
}

function calculateAngle(a, b, c) {
  const dp = dotProduct(AB, BC);
  const distAB = distance(a, b);
  const distBC = distance(b, c);
  const cosTheta = dp / (distAB * distBC);
  const theta = Math.acos(cosTheta);
  return theta;
}

function rotatePointAround(basePoint, pointToRotate, theta) {
  const translated = vectorSubtraction(basePoint, pointToRotate);
  const rotated = [
    translated[0] * Math.cos(theta) - translated[1] * Math.sin(theta),
    translated[0] * Math.sin(theta) + translated[1] * Math.cos(theta),
  ];
  return addVectors(rotated, basePoint);
}

function scalePointFrom(basePoint, pointToMove, scale) {
  const projectToOrigin = vectorSubtraction(pointToMove, basePoint);
  const scaled = scaleVector(projectToOrigin, scale);
  const reProject = addVectors(basePoint, scaled);
  return reProject;
}

const vec = {};

module.export = {
  addVectors,
  scaleVector,
  vectorSubtraction,
  dotProduct,
  magnitude,
  equalVectors,
  distance,
  calculateAngle,
  rotatePointAround,
  scalePointFrom,
};
