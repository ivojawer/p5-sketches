/**
 * @param {number} t
 * @param {Point[]} curvePoints
 * @returns {Point}
 **/
function bezierPointAt(t, curvePoints) {
  if (curvePoints.length === 1) {
    return curvePoints[0];
  } else {
    const bDrop = bezierPointAt(
      t,
      curvePoints.slice(0, curvePoints.length - 1)
    );
    const bTake = bezierPointAt(t, curvePoints.slice(1, curvePoints.length));
    return bDrop.mult(1 - t).add(bTake.mult(t));
  }
}
