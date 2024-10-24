class ObjectCollisionMatrix {
  constructor() {
    this.matrix = {};
  }
  get(bi, bj) {
    let {
      id: i
    } = bi;
    let {
      id: j
    } = bj;
    if (j > i) {
      const temp = j;
      j = i;
      i = temp;
    }
    return `${i}-${j}` in this.matrix;
  }
  set(bi, bj, value) {
    let {
      id: i
    } = bi;
    let {
      id: j
    } = bj;
    if (j > i) {
      const temp = j;
      j = i;
      i = temp;
    }
    if (value) {
      this.matrix[`${i}-${j}`] = true;
    } else {
      delete this.matrix[`${i}-${j}`];
    }
  }
  reset() {
    this.matrix = {};
  }
  setNumObjects(n) {
  }
}
class Mat3 {
  constructor(elements) {
    if (elements === void 0) {
      elements = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.elements = elements;
  }
  identity() {
    const e = this.elements;
    e[0] = 1;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 1;
    e[5] = 0;
    e[6] = 0;
    e[7] = 0;
    e[8] = 1;
  }
  setZero() {
    const e = this.elements;
    e[0] = 0;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = 0;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
  }
  setTrace(vector) {
    const e = this.elements;
    e[0] = vector.x;
    e[4] = vector.y;
    e[8] = vector.z;
  }
  getTrace(target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const e = this.elements;
    target.x = e[0];
    target.y = e[4];
    target.z = e[8];
    return target;
  }
  vmult(v, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const e = this.elements;
    const x = v.x;
    const y = v.y;
    const z = v.z;
    target.x = e[0] * x + e[1] * y + e[2] * z;
    target.y = e[3] * x + e[4] * y + e[5] * z;
    target.z = e[6] * x + e[7] * y + e[8] * z;
    return target;
  }
  smult(s) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s;
    }
  }
  mmult(matrix, target) {
    if (target === void 0) {
      target = new Mat3();
    }
    const A = this.elements;
    const B = matrix.elements;
    const T = target.elements;
    const a11 = A[0], a12 = A[1], a13 = A[2], a21 = A[3], a22 = A[4], a23 = A[5], a31 = A[6], a32 = A[7], a33 = A[8];
    const b11 = B[0], b12 = B[1], b13 = B[2], b21 = B[3], b22 = B[4], b23 = B[5], b31 = B[6], b32 = B[7], b33 = B[8];
    T[0] = a11 * b11 + a12 * b21 + a13 * b31;
    T[1] = a11 * b12 + a12 * b22 + a13 * b32;
    T[2] = a11 * b13 + a12 * b23 + a13 * b33;
    T[3] = a21 * b11 + a22 * b21 + a23 * b31;
    T[4] = a21 * b12 + a22 * b22 + a23 * b32;
    T[5] = a21 * b13 + a22 * b23 + a23 * b33;
    T[6] = a31 * b11 + a32 * b21 + a33 * b31;
    T[7] = a31 * b12 + a32 * b22 + a33 * b32;
    T[8] = a31 * b13 + a32 * b23 + a33 * b33;
    return target;
  }
  scale(vector, target) {
    if (target === void 0) {
      target = new Mat3();
    }
    const e = this.elements;
    const t = target.elements;
    for (let i = 0; i !== 3; i++) {
      t[3 * i + 0] = vector.x * e[3 * i + 0];
      t[3 * i + 1] = vector.y * e[3 * i + 1];
      t[3 * i + 2] = vector.z * e[3 * i + 2];
    }
    return target;
  }
  solve(b2, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const nr = 3;
    const nc = 4;
    const eqns = [];
    let i;
    let j;
    for (i = 0; i < nr * nc; i++) {
      eqns.push(0);
    }
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 4 * 0] = b2.x;
    eqns[3 + 4 * 1] = b2.y;
    eqns[3 + 4 * 2] = b2.z;
    let n = 3;
    const k = n;
    let np;
    const kp = 4;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    target.z = eqns[2 * nc + 3] / eqns[2 * nc + 2];
    target.y = (eqns[1 * nc + 3] - eqns[1 * nc + 2] * target.z) / eqns[1 * nc + 1];
    target.x = (eqns[0 * nc + 3] - eqns[0 * nc + 2] * target.z - eqns[0 * nc + 1] * target.y) / eqns[0 * nc + 0];
    if (isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x === Infinity || target.y === Infinity || target.z === Infinity) {
      throw `Could not solve equation! Got x=[${target.toString()}], b=[${b2.toString()}], A=[${this.toString()}]`;
    }
    return target;
  }
  e(row, column, value) {
    if (value === void 0) {
      return this.elements[column + 3 * row];
    } else {
      this.elements[column + 3 * row] = value;
    }
  }
  copy(matrix) {
    for (let i = 0; i < matrix.elements.length; i++) {
      this.elements[i] = matrix.elements[i];
    }
    return this;
  }
  toString() {
    let r = "";
    const sep = ",";
    for (let i = 0; i < 9; i++) {
      r += this.elements[i] + sep;
    }
    return r;
  }
  reverse(target) {
    if (target === void 0) {
      target = new Mat3();
    }
    const nr = 3;
    const nc = 6;
    const eqns = reverse_eqns;
    let i;
    let j;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 6 * 0] = 1;
    eqns[3 + 6 * 1] = 0;
    eqns[3 + 6 * 2] = 0;
    eqns[4 + 6 * 0] = 0;
    eqns[4 + 6 * 1] = 1;
    eqns[4 + 6 * 2] = 0;
    eqns[5 + 6 * 0] = 0;
    eqns[5 + 6 * 1] = 0;
    eqns[5 + 6 * 2] = 1;
    let n = 3;
    const k = n;
    let np;
    const kp = nc;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    i = 2;
    do {
      j = i - 1;
      do {
        const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
        np = nc;
        do {
          p = nc - np;
          eqns[p + nc * j] = eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
        } while (--np);
      } while (j--);
    } while (--i);
    i = 2;
    do {
      const multiplier = 1 / eqns[i + nc * i];
      np = nc;
      do {
        p = nc - np;
        eqns[p + nc * i] = eqns[p + nc * i] * multiplier;
      } while (--np);
    } while (i--);
    i = 2;
    do {
      j = 2;
      do {
        p = eqns[nr + j + nc * i];
        if (isNaN(p) || p === Infinity) {
          throw `Could not reverse! A=[${this.toString()}]`;
        }
        target.e(i, j, p);
      } while (j--);
    } while (i--);
    return target;
  }
  setRotationFromQuaternion(q) {
    const x = q.x;
    const y = q.y;
    const z = q.z;
    const w = q.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const e = this.elements;
    e[3 * 0 + 0] = 1 - (yy + zz);
    e[3 * 0 + 1] = xy - wz;
    e[3 * 0 + 2] = xz + wy;
    e[3 * 1 + 0] = xy + wz;
    e[3 * 1 + 1] = 1 - (xx + zz);
    e[3 * 1 + 2] = yz - wx;
    e[3 * 2 + 0] = xz - wy;
    e[3 * 2 + 1] = yz + wx;
    e[3 * 2 + 2] = 1 - (xx + yy);
    return this;
  }
  transpose(target) {
    if (target === void 0) {
      target = new Mat3();
    }
    const M = this.elements;
    const T = target.elements;
    let tmp2;
    T[0] = M[0];
    T[4] = M[4];
    T[8] = M[8];
    tmp2 = M[1];
    T[1] = M[3];
    T[3] = tmp2;
    tmp2 = M[2];
    T[2] = M[6];
    T[6] = tmp2;
    tmp2 = M[5];
    T[5] = M[7];
    T[7] = tmp2;
    return target;
  }
}
const reverse_eqns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
class Vec3 {
  constructor(x, y, z) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }
  cross(vector, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const vx = vector.x;
    const vy = vector.y;
    const vz = vector.z;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = y * vz - z * vy;
    target.y = z * vx - x * vz;
    target.z = x * vy - y * vx;
    return target;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  setZero() {
    this.x = this.y = this.z = 0;
  }
  vadd(vector, target) {
    if (target) {
      target.x = vector.x + this.x;
      target.y = vector.y + this.y;
      target.z = vector.z + this.z;
    } else {
      return new Vec3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
  }
  vsub(vector, target) {
    if (target) {
      target.x = this.x - vector.x;
      target.y = this.y - vector.y;
      target.z = this.z - vector.z;
    } else {
      return new Vec3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
  }
  crossmat() {
    return new Mat3([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  normalize() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const n = Math.sqrt(x * x + y * y + z * z);
    if (n > 0) {
      const invN = 1 / n;
      this.x *= invN;
      this.y *= invN;
      this.z *= invN;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return n;
  }
  unit(target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    let ninv = Math.sqrt(x * x + y * y + z * z);
    if (ninv > 0) {
      ninv = 1 / ninv;
      target.x = x * ninv;
      target.y = y * ninv;
      target.z = z * ninv;
    } else {
      target.x = 1;
      target.y = 0;
      target.z = 0;
    }
    return target;
  }
  length() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  lengthSquared() {
    return this.dot(this);
  }
  distanceTo(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z));
  }
  distanceSquared(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z);
  }
  scale(scalar, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = scalar * x;
    target.y = scalar * y;
    target.z = scalar * z;
    return target;
  }
  vmul(vector, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    target.x = vector.x * this.x;
    target.y = vector.y * this.y;
    target.z = vector.z * this.z;
    return target;
  }
  addScaledVector(scalar, vector, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    target.x = this.x + scalar * vector.x;
    target.y = this.y + scalar * vector.y;
    target.z = this.z + scalar * vector.z;
    return target;
  }
  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  negate(target) {
    if (target === void 0) {
      target = new Vec3();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    return target;
  }
  tangents(t1, t2) {
    const norm = this.length();
    if (norm > 0) {
      const n = Vec3_tangents_n;
      const inorm = 1 / norm;
      n.set(this.x * inorm, this.y * inorm, this.z * inorm);
      const randVec = Vec3_tangents_randVec;
      if (Math.abs(n.x) < 0.9) {
        randVec.set(1, 0, 0);
        n.cross(randVec, t1);
      } else {
        randVec.set(0, 1, 0);
        n.cross(randVec, t1);
      }
      n.cross(t1, t2);
    } else {
      t1.set(1, 0, 0);
      t2.set(0, 1, 0);
    }
  }
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  copy(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }
  lerp(vector, t, target) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = x + (vector.x - x) * t;
    target.y = y + (vector.y - y) * t;
    target.z = z + (vector.z - z) * t;
  }
  almostEquals(vector, precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x - vector.x) > precision || Math.abs(this.y - vector.y) > precision || Math.abs(this.z - vector.z) > precision) {
      return false;
    }
    return true;
  }
  almostZero(precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x) > precision || Math.abs(this.y) > precision || Math.abs(this.z) > precision) {
      return false;
    }
    return true;
  }
  isAntiparallelTo(vector, precision) {
    this.negate(antip_neg);
    return antip_neg.almostEquals(vector, precision);
  }
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
}
Vec3.ZERO = new Vec3(0, 0, 0);
Vec3.UNIT_X = new Vec3(1, 0, 0);
Vec3.UNIT_Y = new Vec3(0, 1, 0);
Vec3.UNIT_Z = new Vec3(0, 0, 1);
const Vec3_tangents_n = new Vec3();
const Vec3_tangents_randVec = new Vec3();
const antip_neg = new Vec3();
class AABB {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.lowerBound = new Vec3();
    this.upperBound = new Vec3();
    if (options.lowerBound) {
      this.lowerBound.copy(options.lowerBound);
    }
    if (options.upperBound) {
      this.upperBound.copy(options.upperBound);
    }
  }
  setFromPoints(points, position, quaternion, skinSize) {
    const l = this.lowerBound;
    const u = this.upperBound;
    const q = quaternion;
    l.copy(points[0]);
    if (q) {
      q.vmult(l, l);
    }
    u.copy(l);
    for (let i = 1; i < points.length; i++) {
      let p = points[i];
      if (q) {
        q.vmult(p, tmp$1);
        p = tmp$1;
      }
      if (p.x > u.x) {
        u.x = p.x;
      }
      if (p.x < l.x) {
        l.x = p.x;
      }
      if (p.y > u.y) {
        u.y = p.y;
      }
      if (p.y < l.y) {
        l.y = p.y;
      }
      if (p.z > u.z) {
        u.z = p.z;
      }
      if (p.z < l.z) {
        l.z = p.z;
      }
    }
    if (position) {
      position.vadd(l, l);
      position.vadd(u, u);
    }
    if (skinSize) {
      l.x -= skinSize;
      l.y -= skinSize;
      l.z -= skinSize;
      u.x += skinSize;
      u.y += skinSize;
      u.z += skinSize;
    }
    return this;
  }
  copy(aabb) {
    this.lowerBound.copy(aabb.lowerBound);
    this.upperBound.copy(aabb.upperBound);
    return this;
  }
  clone() {
    return new AABB().copy(this);
  }
  extend(aabb) {
    this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
    this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
    this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
    this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
    this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z);
    this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
  }
  overlaps(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    const overlapsX = l2.x <= u1.x && u1.x <= u2.x || l1.x <= u2.x && u2.x <= u1.x;
    const overlapsY = l2.y <= u1.y && u1.y <= u2.y || l1.y <= u2.y && u2.y <= u1.y;
    const overlapsZ = l2.z <= u1.z && u1.z <= u2.z || l1.z <= u2.z && u2.z <= u1.z;
    return overlapsX && overlapsY && overlapsZ;
  }
  volume() {
    const l = this.lowerBound;
    const u = this.upperBound;
    return (u.x - l.x) * (u.y - l.y) * (u.z - l.z);
  }
  contains(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z;
  }
  getCorners(a2, b2, c2, d, e, f, g, h) {
    const l = this.lowerBound;
    const u = this.upperBound;
    a2.copy(l);
    b2.set(u.x, l.y, l.z);
    c2.set(u.x, u.y, l.z);
    d.set(l.x, u.y, u.z);
    e.set(u.x, l.y, u.z);
    f.set(l.x, u.y, l.z);
    g.set(l.x, l.y, u.z);
    h.copy(u);
  }
  toLocalFrame(frame, target) {
    const corners = transformIntoFrame_corners;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToLocal(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  toWorldFrame(frame, target) {
    const corners = transformIntoFrame_corners;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToWorld(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  overlapsRay(ray) {
    const {
      direction,
      from
    } = ray;
    const dirFracX = 1 / direction.x;
    const dirFracY = 1 / direction.y;
    const dirFracZ = 1 / direction.z;
    const t1 = (this.lowerBound.x - from.x) * dirFracX;
    const t2 = (this.upperBound.x - from.x) * dirFracX;
    const t3 = (this.lowerBound.y - from.y) * dirFracY;
    const t4 = (this.upperBound.y - from.y) * dirFracY;
    const t5 = (this.lowerBound.z - from.z) * dirFracZ;
    const t6 = (this.upperBound.z - from.z) * dirFracZ;
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
    if (tmax < 0) {
      return false;
    }
    if (tmin > tmax) {
      return false;
    }
    return true;
  }
}
const tmp$1 = new Vec3();
const transformIntoFrame_corners = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
class ArrayCollisionMatrix {
  constructor() {
    this.matrix = [];
  }
  get(bi, bj) {
    let {
      index: i
    } = bi;
    let {
      index: j
    } = bj;
    if (j > i) {
      const temp = j;
      j = i;
      i = temp;
    }
    return this.matrix[(i * (i + 1) >> 1) + j - 1];
  }
  set(bi, bj, value) {
    let {
      index: i
    } = bi;
    let {
      index: j
    } = bj;
    if (j > i) {
      const temp = j;
      j = i;
      i = temp;
    }
    this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0;
  }
  reset() {
    for (let i = 0, l = this.matrix.length; i !== l; i++) {
      this.matrix[i] = 0;
    }
  }
  setNumObjects(n) {
    this.matrix.length = n * (n - 1) >> 1;
  }
}
class EventTarget {
  addEventListener(type, listener) {
    if (this._listeners === void 0) {
      this._listeners = {};
    }
    const listeners = this._listeners;
    if (listeners[type] === void 0) {
      listeners[type] = [];
    }
    if (!listeners[type].includes(listener)) {
      listeners[type].push(listener);
    }
    return this;
  }
  hasEventListener(type, listener) {
    if (this._listeners === void 0) {
      return false;
    }
    const listeners = this._listeners;
    if (listeners[type] !== void 0 && listeners[type].includes(listener)) {
      return true;
    }
    return false;
  }
  hasAnyEventListener(type) {
    if (this._listeners === void 0) {
      return false;
    }
    const listeners = this._listeners;
    return listeners[type] !== void 0;
  }
  removeEventListener(type, listener) {
    if (this._listeners === void 0) {
      return this;
    }
    const listeners = this._listeners;
    if (listeners[type] === void 0) {
      return this;
    }
    const index = listeners[type].indexOf(listener);
    if (index !== -1) {
      listeners[type].splice(index, 1);
    }
    return this;
  }
  dispatchEvent(event) {
    if (this._listeners === void 0) {
      return this;
    }
    const listeners = this._listeners;
    const listenerArray = listeners[event.type];
    if (listenerArray !== void 0) {
      event.target = this;
      for (let i = 0, l = listenerArray.length; i < l; i++) {
        listenerArray[i].call(this, event);
      }
    }
    return this;
  }
}
class Quaternion {
  constructor(x, y, z, w) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    if (w === void 0) {
      w = 1;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  setFromAxisAngle(vector, angle) {
    const s = Math.sin(angle * 0.5);
    this.x = vector.x * s;
    this.y = vector.y * s;
    this.z = vector.z * s;
    this.w = Math.cos(angle * 0.5);
    return this;
  }
  toAxisAngle(targetAxis) {
    if (targetAxis === void 0) {
      targetAxis = new Vec3();
    }
    this.normalize();
    const angle = 2 * Math.acos(this.w);
    const s = Math.sqrt(1 - this.w * this.w);
    if (s < 1e-3) {
      targetAxis.x = this.x;
      targetAxis.y = this.y;
      targetAxis.z = this.z;
    } else {
      targetAxis.x = this.x / s;
      targetAxis.y = this.y / s;
      targetAxis.z = this.z / s;
    }
    return [targetAxis, angle];
  }
  setFromVectors(u, v) {
    if (u.isAntiparallelTo(v)) {
      const t1 = sfv_t1;
      const t2 = sfv_t2;
      u.tangents(t1, t2);
      this.setFromAxisAngle(t1, Math.PI);
    } else {
      const a2 = u.cross(v);
      this.x = a2.x;
      this.y = a2.y;
      this.z = a2.z;
      this.w = Math.sqrt(u.length() ** 2 * v.length() ** 2) + u.dot(v);
      this.normalize();
    }
    return this;
  }
  mult(quat, target) {
    if (target === void 0) {
      target = new Quaternion();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = quat.x;
    const by = quat.y;
    const bz = quat.z;
    const bw = quat.w;
    target.x = ax * bw + aw * bx + ay * bz - az * by;
    target.y = ay * bw + aw * by + az * bx - ax * bz;
    target.z = az * bw + aw * bz + ax * by - ay * bx;
    target.w = aw * bw - ax * bx - ay * by - az * bz;
    return target;
  }
  inverse(target) {
    if (target === void 0) {
      target = new Quaternion();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    this.conjugate(target);
    const inorm2 = 1 / (x * x + y * y + z * z + w * w);
    target.x *= inorm2;
    target.y *= inorm2;
    target.z *= inorm2;
    target.w *= inorm2;
    return target;
  }
  conjugate(target) {
    if (target === void 0) {
      target = new Quaternion();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    target.w = this.w;
    return target;
  }
  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      l = 1 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
    return this;
  }
  normalizeFast() {
    const f = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    if (f === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      this.x *= f;
      this.y *= f;
      this.z *= f;
      this.w *= f;
    }
    return this;
  }
  vmult(v, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const x = v.x;
    const y = v.y;
    const z = v.z;
    const qx = this.x;
    const qy = this.y;
    const qz = this.z;
    const qw = this.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return target;
  }
  copy(quat) {
    this.x = quat.x;
    this.y = quat.y;
    this.z = quat.z;
    this.w = quat.w;
    return this;
  }
  toEuler(target, order) {
    if (order === void 0) {
      order = "YZX";
    }
    let heading;
    let attitude;
    let bank;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    switch (order) {
      case "YZX":
        const test = x * y + z * w;
        if (test > 0.499) {
          heading = 2 * Math.atan2(x, w);
          attitude = Math.PI / 2;
          bank = 0;
        }
        if (test < -0.499) {
          heading = -2 * Math.atan2(x, w);
          attitude = -Math.PI / 2;
          bank = 0;
        }
        if (heading === void 0) {
          const sqx = x * x;
          const sqy = y * y;
          const sqz = z * z;
          heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
          attitude = Math.asin(2 * test);
          bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
        }
        break;
      default:
        throw new Error(`Euler order ${order} not supported yet.`);
    }
    target.y = heading;
    target.z = attitude;
    target.x = bank;
  }
  setFromEuler(x, y, z, order) {
    if (order === void 0) {
      order = "XYZ";
    }
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    if (order === "XYZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "YXZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "ZXY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "ZYX") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "YZX") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "XZY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    }
    return this;
  }
  clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }
  slerp(toQuat, t, target) {
    if (target === void 0) {
      target = new Quaternion();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    let bx = toQuat.x;
    let by = toQuat.y;
    let bz = toQuat.z;
    let bw = toQuat.w;
    let omega;
    let cosom;
    let sinom;
    let scale0;
    let scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    target.x = scale0 * ax + scale1 * bx;
    target.y = scale0 * ay + scale1 * by;
    target.z = scale0 * az + scale1 * bz;
    target.w = scale0 * aw + scale1 * bw;
    return target;
  }
  integrate(angularVelocity, dt, angularFactor, target) {
    if (target === void 0) {
      target = new Quaternion();
    }
    const ax = angularVelocity.x * angularFactor.x, ay = angularVelocity.y * angularFactor.y, az = angularVelocity.z * angularFactor.z, bx = this.x, by = this.y, bz = this.z, bw = this.w;
    const half_dt = dt * 0.5;
    target.x += half_dt * (ax * bw + ay * bz - az * by);
    target.y += half_dt * (ay * bw + az * bx - ax * bz);
    target.z += half_dt * (az * bw + ax * by - ay * bx);
    target.w += half_dt * (-ax * bx - ay * by - az * bz);
    return target;
  }
}
const sfv_t1 = new Vec3();
const sfv_t2 = new Vec3();
const SHAPE_TYPES = {
  SPHERE: 1,
  PLANE: 2,
  BOX: 4,
  COMPOUND: 8,
  CONVEXPOLYHEDRON: 16,
  HEIGHTFIELD: 32,
  PARTICLE: 64,
  CYLINDER: 128,
  TRIMESH: 256
};
class Shape {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.id = Shape.idCounter++;
    this.type = options.type || 0;
    this.boundingSphereRadius = 0;
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true;
    this.collisionFilterGroup = options.collisionFilterGroup !== void 0 ? options.collisionFilterGroup : 1;
    this.collisionFilterMask = options.collisionFilterMask !== void 0 ? options.collisionFilterMask : -1;
    this.material = options.material ? options.material : null;
    this.body = null;
  }
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  calculateLocalInertia(mass, target) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  calculateWorldAABB(pos, quat, min, max) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
}
Shape.idCounter = 0;
Shape.types = SHAPE_TYPES;
class Transform {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.position = new Vec3();
    this.quaternion = new Quaternion();
    if (options.position) {
      this.position.copy(options.position);
    }
    if (options.quaternion) {
      this.quaternion.copy(options.quaternion);
    }
  }
  pointToLocal(worldPoint, result) {
    return Transform.pointToLocalFrame(this.position, this.quaternion, worldPoint, result);
  }
  pointToWorld(localPoint, result) {
    return Transform.pointToWorldFrame(this.position, this.quaternion, localPoint, result);
  }
  vectorToWorldFrame(localVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    this.quaternion.vmult(localVector, result);
    return result;
  }
  static pointToLocalFrame(position, quaternion, worldPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    worldPoint.vsub(position, result);
    quaternion.conjugate(tmpQuat$1);
    tmpQuat$1.vmult(result, result);
    return result;
  }
  static pointToWorldFrame(position, quaternion, localPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.vmult(localPoint, result);
    result.vadd(position, result);
    return result;
  }
  static vectorToWorldFrame(quaternion, localVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.vmult(localVector, result);
    return result;
  }
  static vectorToLocalFrame(position, quaternion, worldVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.w *= -1;
    quaternion.vmult(worldVector, result);
    quaternion.w *= -1;
    return result;
  }
}
const tmpQuat$1 = new Quaternion();
class ConvexPolyhedron extends Shape {
  constructor(props) {
    if (props === void 0) {
      props = {};
    }
    const {
      vertices = [],
      faces = [],
      normals = [],
      axes,
      boundingSphereRadius
    } = props;
    super({
      type: Shape.types.CONVEXPOLYHEDRON
    });
    this.vertices = vertices;
    this.faces = faces;
    this.faceNormals = normals;
    if (this.faceNormals.length === 0) {
      this.computeNormals();
    }
    if (!boundingSphereRadius) {
      this.updateBoundingSphereRadius();
    } else {
      this.boundingSphereRadius = boundingSphereRadius;
    }
    this.worldVertices = [];
    this.worldVerticesNeedsUpdate = true;
    this.worldFaceNormals = [];
    this.worldFaceNormalsNeedsUpdate = true;
    this.uniqueAxes = axes ? axes.slice() : null;
    this.uniqueEdges = [];
    this.computeEdges();
  }
  computeEdges() {
    const faces = this.faces;
    const vertices = this.vertices;
    const edges = this.uniqueEdges;
    edges.length = 0;
    const edge = new Vec3();
    for (let i = 0; i !== faces.length; i++) {
      const face = faces[i];
      const numVertices = face.length;
      for (let j = 0; j !== numVertices; j++) {
        const k = (j + 1) % numVertices;
        vertices[face[j]].vsub(vertices[face[k]], edge);
        edge.normalize();
        let found = false;
        for (let p = 0; p !== edges.length; p++) {
          if (edges[p].almostEquals(edge) || edges[p].almostEquals(edge)) {
            found = true;
            break;
          }
        }
        if (!found) {
          edges.push(edge.clone());
        }
      }
    }
  }
  computeNormals() {
    this.faceNormals.length = this.faces.length;
    for (let i = 0; i < this.faces.length; i++) {
      for (let j = 0; j < this.faces[i].length; j++) {
        if (!this.vertices[this.faces[i][j]]) {
          throw new Error(`Vertex ${this.faces[i][j]} not found!`);
        }
      }
      const n = this.faceNormals[i] || new Vec3();
      this.getFaceNormal(i, n);
      n.negate(n);
      this.faceNormals[i] = n;
      const vertex = this.vertices[this.faces[i][0]];
      if (n.dot(vertex) < 0) {
        console.error(`.faceNormals[${i}] = Vec3(${n.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);
        for (let j = 0; j < this.faces[i].length; j++) {
          console.warn(`.vertices[${this.faces[i][j]}] = Vec3(${this.vertices[this.faces[i][j]].toString()})`);
        }
      }
    }
  }
  getFaceNormal(i, target) {
    const f = this.faces[i];
    const va2 = this.vertices[f[0]];
    const vb2 = this.vertices[f[1]];
    const vc2 = this.vertices[f[2]];
    ConvexPolyhedron.computeNormal(va2, vb2, vc2, target);
  }
  static computeNormal(va2, vb2, vc2, target) {
    const cb2 = new Vec3();
    const ab2 = new Vec3();
    vb2.vsub(va2, ab2);
    vc2.vsub(vb2, cb2);
    cb2.cross(ab2, target);
    if (!target.isZero()) {
      target.normalize();
    }
  }
  clipAgainstHull(posA, quatA, hullB, posB, quatB, separatingNormal, minDist, maxDist, result) {
    const WorldNormal = new Vec3();
    let closestFaceB = -1;
    let dmax = -Number.MAX_VALUE;
    for (let face = 0; face < hullB.faces.length; face++) {
      WorldNormal.copy(hullB.faceNormals[face]);
      quatB.vmult(WorldNormal, WorldNormal);
      const d = WorldNormal.dot(separatingNormal);
      if (d > dmax) {
        dmax = d;
        closestFaceB = face;
      }
    }
    const worldVertsB1 = [];
    for (let i = 0; i < hullB.faces[closestFaceB].length; i++) {
      const b2 = hullB.vertices[hullB.faces[closestFaceB][i]];
      const worldb = new Vec3();
      worldb.copy(b2);
      quatB.vmult(worldb, worldb);
      posB.vadd(worldb, worldb);
      worldVertsB1.push(worldb);
    }
    if (closestFaceB >= 0) {
      this.clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result);
    }
  }
  findSeparatingAxis(hullB, posA, quatA, posB, quatB, target, faceListA, faceListB) {
    const faceANormalWS3 = new Vec3();
    const Worldnormal1 = new Vec3();
    const deltaC = new Vec3();
    const worldEdge0 = new Vec3();
    const worldEdge1 = new Vec3();
    const Cross = new Vec3();
    let dmin = Number.MAX_VALUE;
    const hullA = this;
    if (!hullA.uniqueAxes) {
      const numFacesA = faceListA ? faceListA.length : hullA.faces.length;
      for (let i = 0; i < numFacesA; i++) {
        const fi = faceListA ? faceListA[i] : i;
        faceANormalWS3.copy(hullA.faceNormals[fi]);
        quatA.vmult(faceANormalWS3, faceANormalWS3);
        const d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(faceANormalWS3);
        }
      }
    } else {
      for (let i = 0; i !== hullA.uniqueAxes.length; i++) {
        quatA.vmult(hullA.uniqueAxes[i], faceANormalWS3);
        const d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(faceANormalWS3);
        }
      }
    }
    if (!hullB.uniqueAxes) {
      const numFacesB = faceListB ? faceListB.length : hullB.faces.length;
      for (let i = 0; i < numFacesB; i++) {
        const fi = faceListB ? faceListB[i] : i;
        Worldnormal1.copy(hullB.faceNormals[fi]);
        quatB.vmult(Worldnormal1, Worldnormal1);
        const d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(Worldnormal1);
        }
      }
    } else {
      for (let i = 0; i !== hullB.uniqueAxes.length; i++) {
        quatB.vmult(hullB.uniqueAxes[i], Worldnormal1);
        const d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(Worldnormal1);
        }
      }
    }
    for (let e0 = 0; e0 !== hullA.uniqueEdges.length; e0++) {
      quatA.vmult(hullA.uniqueEdges[e0], worldEdge0);
      for (let e1 = 0; e1 !== hullB.uniqueEdges.length; e1++) {
        quatB.vmult(hullB.uniqueEdges[e1], worldEdge1);
        worldEdge0.cross(worldEdge1, Cross);
        if (!Cross.almostZero()) {
          Cross.normalize();
          const dist = hullA.testSepAxis(Cross, hullB, posA, quatA, posB, quatB);
          if (dist === false) {
            return false;
          }
          if (dist < dmin) {
            dmin = dist;
            target.copy(Cross);
          }
        }
      }
    }
    posB.vsub(posA, deltaC);
    if (deltaC.dot(target) > 0) {
      target.negate(target);
    }
    return true;
  }
  testSepAxis(axis, hullB, posA, quatA, posB, quatB) {
    const hullA = this;
    ConvexPolyhedron.project(hullA, axis, posA, quatA, maxminA);
    ConvexPolyhedron.project(hullB, axis, posB, quatB, maxminB);
    const maxA = maxminA[0];
    const minA = maxminA[1];
    const maxB = maxminB[0];
    const minB = maxminB[1];
    if (maxA < minB || maxB < minA) {
      return false;
    }
    const d0 = maxA - minB;
    const d1 = maxB - minA;
    const depth = d0 < d1 ? d0 : d1;
    return depth;
  }
  calculateLocalInertia(mass, target) {
    const aabbmax = new Vec3();
    const aabbmin = new Vec3();
    this.computeLocalAABB(aabbmin, aabbmax);
    const x = aabbmax.x - aabbmin.x;
    const y = aabbmax.y - aabbmin.y;
    const z = aabbmax.z - aabbmin.z;
    target.x = 1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z);
    target.y = 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z);
    target.z = 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x);
  }
  getPlaneConstantOfFace(face_i) {
    const f = this.faces[face_i];
    const n = this.faceNormals[face_i];
    const v = this.vertices[f[0]];
    const c2 = -n.dot(v);
    return c2;
  }
  clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result) {
    const faceANormalWS = new Vec3();
    const edge0 = new Vec3();
    const WorldEdge0 = new Vec3();
    const worldPlaneAnormal1 = new Vec3();
    const planeNormalWS1 = new Vec3();
    const worldA1 = new Vec3();
    const localPlaneNormal = new Vec3();
    const planeNormalWS = new Vec3();
    const hullA = this;
    const worldVertsB2 = [];
    const pVtxIn = worldVertsB1;
    const pVtxOut = worldVertsB2;
    let closestFaceA = -1;
    let dmin = Number.MAX_VALUE;
    for (let face = 0; face < hullA.faces.length; face++) {
      faceANormalWS.copy(hullA.faceNormals[face]);
      quatA.vmult(faceANormalWS, faceANormalWS);
      const d = faceANormalWS.dot(separatingNormal);
      if (d < dmin) {
        dmin = d;
        closestFaceA = face;
      }
    }
    if (closestFaceA < 0) {
      return;
    }
    const polyA = hullA.faces[closestFaceA];
    polyA.connectedFaces = [];
    for (let i = 0; i < hullA.faces.length; i++) {
      for (let j = 0; j < hullA.faces[i].length; j++) {
        if (polyA.indexOf(hullA.faces[i][j]) !== -1 && i !== closestFaceA && polyA.connectedFaces.indexOf(i) === -1) {
          polyA.connectedFaces.push(i);
        }
      }
    }
    const numVerticesA = polyA.length;
    for (let i = 0; i < numVerticesA; i++) {
      const a2 = hullA.vertices[polyA[i]];
      const b2 = hullA.vertices[polyA[(i + 1) % numVerticesA]];
      a2.vsub(b2, edge0);
      WorldEdge0.copy(edge0);
      quatA.vmult(WorldEdge0, WorldEdge0);
      posA.vadd(WorldEdge0, WorldEdge0);
      worldPlaneAnormal1.copy(this.faceNormals[closestFaceA]);
      quatA.vmult(worldPlaneAnormal1, worldPlaneAnormal1);
      posA.vadd(worldPlaneAnormal1, worldPlaneAnormal1);
      WorldEdge0.cross(worldPlaneAnormal1, planeNormalWS1);
      planeNormalWS1.negate(planeNormalWS1);
      worldA1.copy(a2);
      quatA.vmult(worldA1, worldA1);
      posA.vadd(worldA1, worldA1);
      const otherFace = polyA.connectedFaces[i];
      localPlaneNormal.copy(this.faceNormals[otherFace]);
      const localPlaneEq2 = this.getPlaneConstantOfFace(otherFace);
      planeNormalWS.copy(localPlaneNormal);
      quatA.vmult(planeNormalWS, planeNormalWS);
      const planeEqWS2 = localPlaneEq2 - planeNormalWS.dot(posA);
      this.clipFaceAgainstPlane(pVtxIn, pVtxOut, planeNormalWS, planeEqWS2);
      while (pVtxIn.length) {
        pVtxIn.shift();
      }
      while (pVtxOut.length) {
        pVtxIn.push(pVtxOut.shift());
      }
    }
    localPlaneNormal.copy(this.faceNormals[closestFaceA]);
    const localPlaneEq = this.getPlaneConstantOfFace(closestFaceA);
    planeNormalWS.copy(localPlaneNormal);
    quatA.vmult(planeNormalWS, planeNormalWS);
    const planeEqWS = localPlaneEq - planeNormalWS.dot(posA);
    for (let i = 0; i < pVtxIn.length; i++) {
      let depth = planeNormalWS.dot(pVtxIn[i]) + planeEqWS;
      if (depth <= minDist) {
        console.log(`clamped: depth=${depth} to minDist=${minDist}`);
        depth = minDist;
      }
      if (depth <= maxDist) {
        const point = pVtxIn[i];
        if (depth <= 1e-6) {
          const p = {
            point,
            normal: planeNormalWS,
            depth
          };
          result.push(p);
        }
      }
    }
  }
  clipFaceAgainstPlane(inVertices, outVertices, planeNormal, planeConstant) {
    let n_dot_first;
    let n_dot_last;
    const numVerts = inVertices.length;
    if (numVerts < 2) {
      return outVertices;
    }
    let firstVertex = inVertices[inVertices.length - 1];
    let lastVertex = inVertices[0];
    n_dot_first = planeNormal.dot(firstVertex) + planeConstant;
    for (let vi = 0; vi < numVerts; vi++) {
      lastVertex = inVertices[vi];
      n_dot_last = planeNormal.dot(lastVertex) + planeConstant;
      if (n_dot_first < 0) {
        if (n_dot_last < 0) {
          const newv = new Vec3();
          newv.copy(lastVertex);
          outVertices.push(newv);
        } else {
          const newv = new Vec3();
          firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv);
          outVertices.push(newv);
        }
      } else {
        if (n_dot_last < 0) {
          const newv = new Vec3();
          firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv);
          outVertices.push(newv);
          outVertices.push(lastVertex);
        }
      }
      firstVertex = lastVertex;
      n_dot_first = n_dot_last;
    }
    return outVertices;
  }
  computeWorldVertices(position, quat) {
    while (this.worldVertices.length < this.vertices.length) {
      this.worldVertices.push(new Vec3());
    }
    const verts = this.vertices;
    const worldVerts = this.worldVertices;
    for (let i = 0; i !== this.vertices.length; i++) {
      quat.vmult(verts[i], worldVerts[i]);
      position.vadd(worldVerts[i], worldVerts[i]);
    }
    this.worldVerticesNeedsUpdate = false;
  }
  computeLocalAABB(aabbmin, aabbmax) {
    const vertices = this.vertices;
    aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < this.vertices.length; i++) {
      const v = vertices[i];
      if (v.x < aabbmin.x) {
        aabbmin.x = v.x;
      } else if (v.x > aabbmax.x) {
        aabbmax.x = v.x;
      }
      if (v.y < aabbmin.y) {
        aabbmin.y = v.y;
      } else if (v.y > aabbmax.y) {
        aabbmax.y = v.y;
      }
      if (v.z < aabbmin.z) {
        aabbmin.z = v.z;
      } else if (v.z > aabbmax.z) {
        aabbmax.z = v.z;
      }
    }
  }
  computeWorldFaceNormals(quat) {
    const N = this.faceNormals.length;
    while (this.worldFaceNormals.length < N) {
      this.worldFaceNormals.push(new Vec3());
    }
    const normals = this.faceNormals;
    const worldNormals = this.worldFaceNormals;
    for (let i = 0; i !== N; i++) {
      quat.vmult(normals[i], worldNormals[i]);
    }
    this.worldFaceNormalsNeedsUpdate = false;
  }
  updateBoundingSphereRadius() {
    let max2 = 0;
    const verts = this.vertices;
    for (let i = 0; i !== verts.length; i++) {
      const norm2 = verts[i].lengthSquared();
      if (norm2 > max2) {
        max2 = norm2;
      }
    }
    this.boundingSphereRadius = Math.sqrt(max2);
  }
  calculateWorldAABB(pos, quat, min, max) {
    const verts = this.vertices;
    let minx;
    let miny;
    let minz;
    let maxx;
    let maxy;
    let maxz;
    let tempWorldVertex = new Vec3();
    for (let i = 0; i < verts.length; i++) {
      tempWorldVertex.copy(verts[i]);
      quat.vmult(tempWorldVertex, tempWorldVertex);
      pos.vadd(tempWorldVertex, tempWorldVertex);
      const v = tempWorldVertex;
      if (minx === void 0 || v.x < minx) {
        minx = v.x;
      }
      if (maxx === void 0 || v.x > maxx) {
        maxx = v.x;
      }
      if (miny === void 0 || v.y < miny) {
        miny = v.y;
      }
      if (maxy === void 0 || v.y > maxy) {
        maxy = v.y;
      }
      if (minz === void 0 || v.z < minz) {
        minz = v.z;
      }
      if (maxz === void 0 || v.z > maxz) {
        maxz = v.z;
      }
    }
    min.set(minx, miny, minz);
    max.set(maxx, maxy, maxz);
  }
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  getAveragePointLocal(target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const verts = this.vertices;
    for (let i = 0; i < verts.length; i++) {
      target.vadd(verts[i], target);
    }
    target.scale(1 / verts.length, target);
    return target;
  }
  transformAllPoints(offset, quat) {
    const n = this.vertices.length;
    const verts = this.vertices;
    if (quat) {
      for (let i = 0; i < n; i++) {
        const v = verts[i];
        quat.vmult(v, v);
      }
      for (let i = 0; i < this.faceNormals.length; i++) {
        const v = this.faceNormals[i];
        quat.vmult(v, v);
      }
    }
    if (offset) {
      for (let i = 0; i < n; i++) {
        const v = verts[i];
        v.vadd(offset, v);
      }
    }
  }
  pointIsInside(p) {
    const verts = this.vertices;
    const faces = this.faces;
    const normals = this.faceNormals;
    const pointInside = new Vec3();
    this.getAveragePointLocal(pointInside);
    for (let i = 0; i < this.faces.length; i++) {
      let n = normals[i];
      const v = verts[faces[i][0]];
      const vToP = new Vec3();
      p.vsub(v, vToP);
      const r1 = n.dot(vToP);
      const vToPointInside = new Vec3();
      pointInside.vsub(v, vToPointInside);
      const r2 = n.dot(vToPointInside);
      if (r1 < 0 && r2 > 0 || r1 > 0 && r2 < 0) {
        return false;
      }
    }
    return -1;
  }
  static project(shape, axis, pos, quat, result) {
    const n = shape.vertices.length;
    const localAxis = project_localAxis;
    let max = 0;
    let min = 0;
    const localOrigin = project_localOrigin;
    const vs = shape.vertices;
    localOrigin.setZero();
    Transform.vectorToLocalFrame(pos, quat, axis, localAxis);
    Transform.pointToLocalFrame(pos, quat, localOrigin, localOrigin);
    const add = localOrigin.dot(localAxis);
    min = max = vs[0].dot(localAxis);
    for (let i = 1; i < n; i++) {
      const val = vs[i].dot(localAxis);
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }
    min -= add;
    max -= add;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    result[0] = max;
    result[1] = min;
  }
}
const maxminA = [];
const maxminB = [];
const project_worldVertex = new Vec3();
const project_localAxis = new Vec3();
const project_localOrigin = new Vec3();
class Box extends Shape {
  constructor(halfExtents) {
    super({
      type: Shape.types.BOX
    });
    this.halfExtents = halfExtents;
    this.convexPolyhedronRepresentation = null;
    this.updateConvexPolyhedronRepresentation();
    this.updateBoundingSphereRadius();
  }
  updateConvexPolyhedronRepresentation() {
    const sx = this.halfExtents.x;
    const sy = this.halfExtents.y;
    const sz = this.halfExtents.z;
    const V = Vec3;
    const vertices = [new V(-sx, -sy, -sz), new V(sx, -sy, -sz), new V(sx, sy, -sz), new V(-sx, sy, -sz), new V(-sx, -sy, sz), new V(sx, -sy, sz), new V(sx, sy, sz), new V(-sx, sy, sz)];
    const faces = [
      [3, 2, 1, 0],
      [4, 5, 6, 7],
      [5, 4, 0, 1],
      [2, 3, 7, 6],
      [0, 4, 7, 3],
      [1, 2, 6, 5]
    ];
    const axes = [new V(0, 0, 1), new V(0, 1, 0), new V(1, 0, 0)];
    const h = new ConvexPolyhedron({
      vertices,
      faces,
      axes
    });
    this.convexPolyhedronRepresentation = h;
    h.material = this.material;
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    Box.calculateInertia(this.halfExtents, mass, target);
    return target;
  }
  static calculateInertia(halfExtents, mass, target) {
    const e = halfExtents;
    target.x = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.z * 2 * e.z);
    target.y = 1 / 12 * mass * (2 * e.x * 2 * e.x + 2 * e.z * 2 * e.z);
    target.z = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.x * 2 * e.x);
  }
  getSideNormals(sixTargetVectors, quat) {
    const sides = sixTargetVectors;
    const ex = this.halfExtents;
    sides[0].set(ex.x, 0, 0);
    sides[1].set(0, ex.y, 0);
    sides[2].set(0, 0, ex.z);
    sides[3].set(-ex.x, 0, 0);
    sides[4].set(0, -ex.y, 0);
    sides[5].set(0, 0, -ex.z);
    if (quat !== void 0) {
      for (let i = 0; i !== sides.length; i++) {
        quat.vmult(sides[i], sides[i]);
      }
    }
    return sides;
  }
  volume() {
    return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.halfExtents.length();
  }
  forEachWorldCorner(pos, quat, callback) {
    const e = this.halfExtents;
    const corners = [[e.x, e.y, e.z], [-e.x, e.y, e.z], [-e.x, -e.y, e.z], [-e.x, -e.y, -e.z], [e.x, -e.y, -e.z], [e.x, e.y, -e.z], [-e.x, e.y, -e.z], [e.x, -e.y, e.z]];
    for (let i = 0; i < corners.length; i++) {
      worldCornerTempPos.set(corners[i][0], corners[i][1], corners[i][2]);
      quat.vmult(worldCornerTempPos, worldCornerTempPos);
      pos.vadd(worldCornerTempPos, worldCornerTempPos);
      callback(worldCornerTempPos.x, worldCornerTempPos.y, worldCornerTempPos.z);
    }
  }
  calculateWorldAABB(pos, quat, min, max) {
    const e = this.halfExtents;
    worldCornersTemp[0].set(e.x, e.y, e.z);
    worldCornersTemp[1].set(-e.x, e.y, e.z);
    worldCornersTemp[2].set(-e.x, -e.y, e.z);
    worldCornersTemp[3].set(-e.x, -e.y, -e.z);
    worldCornersTemp[4].set(e.x, -e.y, -e.z);
    worldCornersTemp[5].set(e.x, e.y, -e.z);
    worldCornersTemp[6].set(-e.x, e.y, -e.z);
    worldCornersTemp[7].set(e.x, -e.y, e.z);
    const wc = worldCornersTemp[0];
    quat.vmult(wc, wc);
    pos.vadd(wc, wc);
    max.copy(wc);
    min.copy(wc);
    for (let i = 1; i < 8; i++) {
      const wc2 = worldCornersTemp[i];
      quat.vmult(wc2, wc2);
      pos.vadd(wc2, wc2);
      const x = wc2.x;
      const y = wc2.y;
      const z = wc2.z;
      if (x > max.x) {
        max.x = x;
      }
      if (y > max.y) {
        max.y = y;
      }
      if (z > max.z) {
        max.z = z;
      }
      if (x < min.x) {
        min.x = x;
      }
      if (y < min.y) {
        min.y = y;
      }
      if (z < min.z) {
        min.z = z;
      }
    }
  }
}
const worldCornerTempPos = new Vec3();
const worldCornersTemp = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
const BODY_TYPES = {
  DYNAMIC: 1,
  STATIC: 2,
  KINEMATIC: 4
};
const BODY_SLEEP_STATES = {
  AWAKE: 0,
  SLEEPY: 1,
  SLEEPING: 2
};
class Body extends EventTarget {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    super();
    this.id = Body.idCounter++;
    this.index = -1;
    this.world = null;
    this.vlambda = new Vec3();
    this.collisionFilterGroup = typeof options.collisionFilterGroup === "number" ? options.collisionFilterGroup : 1;
    this.collisionFilterMask = typeof options.collisionFilterMask === "number" ? options.collisionFilterMask : -1;
    this.collisionResponse = typeof options.collisionResponse === "boolean" ? options.collisionResponse : true;
    this.position = new Vec3();
    this.previousPosition = new Vec3();
    this.interpolatedPosition = new Vec3();
    this.initPosition = new Vec3();
    if (options.position) {
      this.position.copy(options.position);
      this.previousPosition.copy(options.position);
      this.interpolatedPosition.copy(options.position);
      this.initPosition.copy(options.position);
    }
    this.velocity = new Vec3();
    if (options.velocity) {
      this.velocity.copy(options.velocity);
    }
    this.initVelocity = new Vec3();
    this.force = new Vec3();
    const mass = typeof options.mass === "number" ? options.mass : 0;
    this.mass = mass;
    this.invMass = mass > 0 ? 1 / mass : 0;
    this.material = options.material || null;
    this.linearDamping = typeof options.linearDamping === "number" ? options.linearDamping : 0.01;
    this.type = mass <= 0 ? Body.STATIC : Body.DYNAMIC;
    if (typeof options.type === typeof Body.STATIC) {
      this.type = options.type;
    }
    this.allowSleep = typeof options.allowSleep !== "undefined" ? options.allowSleep : true;
    this.sleepState = Body.AWAKE;
    this.sleepSpeedLimit = typeof options.sleepSpeedLimit !== "undefined" ? options.sleepSpeedLimit : 0.1;
    this.sleepTimeLimit = typeof options.sleepTimeLimit !== "undefined" ? options.sleepTimeLimit : 1;
    this.timeLastSleepy = 0;
    this.wakeUpAfterNarrowphase = false;
    this.torque = new Vec3();
    this.quaternion = new Quaternion();
    this.initQuaternion = new Quaternion();
    this.previousQuaternion = new Quaternion();
    this.interpolatedQuaternion = new Quaternion();
    if (options.quaternion) {
      this.quaternion.copy(options.quaternion);
      this.initQuaternion.copy(options.quaternion);
      this.previousQuaternion.copy(options.quaternion);
      this.interpolatedQuaternion.copy(options.quaternion);
    }
    this.angularVelocity = new Vec3();
    if (options.angularVelocity) {
      this.angularVelocity.copy(options.angularVelocity);
    }
    this.initAngularVelocity = new Vec3();
    this.shapes = [];
    this.shapeOffsets = [];
    this.shapeOrientations = [];
    this.inertia = new Vec3();
    this.invInertia = new Vec3();
    this.invInertiaWorld = new Mat3();
    this.invMassSolve = 0;
    this.invInertiaSolve = new Vec3();
    this.invInertiaWorldSolve = new Mat3();
    this.fixedRotation = typeof options.fixedRotation !== "undefined" ? options.fixedRotation : false;
    this.angularDamping = typeof options.angularDamping !== "undefined" ? options.angularDamping : 0.01;
    this.linearFactor = new Vec3(1, 1, 1);
    if (options.linearFactor) {
      this.linearFactor.copy(options.linearFactor);
    }
    this.angularFactor = new Vec3(1, 1, 1);
    if (options.angularFactor) {
      this.angularFactor.copy(options.angularFactor);
    }
    this.aabb = new AABB();
    this.aabbNeedsUpdate = true;
    this.boundingRadius = 0;
    this.wlambda = new Vec3();
    this.isTrigger = Boolean(options.isTrigger);
    if (options.shape) {
      this.addShape(options.shape);
    }
    this.updateMassProperties();
  }
  wakeUp() {
    const prevState = this.sleepState;
    this.sleepState = Body.AWAKE;
    this.wakeUpAfterNarrowphase = false;
    if (prevState === Body.SLEEPING) {
      this.dispatchEvent(Body.wakeupEvent);
    }
  }
  sleep() {
    this.sleepState = Body.SLEEPING;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.wakeUpAfterNarrowphase = false;
  }
  sleepTick(time) {
    if (this.allowSleep) {
      const sleepState = this.sleepState;
      const speedSquared = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared();
      const speedLimitSquared = this.sleepSpeedLimit ** 2;
      if (sleepState === Body.AWAKE && speedSquared < speedLimitSquared) {
        this.sleepState = Body.SLEEPY;
        this.timeLastSleepy = time;
        this.dispatchEvent(Body.sleepyEvent);
      } else if (sleepState === Body.SLEEPY && speedSquared > speedLimitSquared) {
        this.wakeUp();
      } else if (sleepState === Body.SLEEPY && time - this.timeLastSleepy > this.sleepTimeLimit) {
        this.sleep();
        this.dispatchEvent(Body.sleepEvent);
      }
    }
  }
  updateSolveMassProperties() {
    if (this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC) {
      this.invMassSolve = 0;
      this.invInertiaSolve.setZero();
      this.invInertiaWorldSolve.setZero();
    } else {
      this.invMassSolve = this.invMass;
      this.invInertiaSolve.copy(this.invInertia);
      this.invInertiaWorldSolve.copy(this.invInertiaWorld);
    }
  }
  pointToLocalFrame(worldPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    worldPoint.vsub(this.position, result);
    this.quaternion.conjugate().vmult(result, result);
    return result;
  }
  vectorToLocalFrame(worldVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    this.quaternion.conjugate().vmult(worldVector, result);
    return result;
  }
  pointToWorldFrame(localPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    this.quaternion.vmult(localPoint, result);
    result.vadd(this.position, result);
    return result;
  }
  vectorToWorldFrame(localVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    this.quaternion.vmult(localVector, result);
    return result;
  }
  addShape(shape, _offset, _orientation) {
    const offset = new Vec3();
    const orientation = new Quaternion();
    if (_offset) {
      offset.copy(_offset);
    }
    if (_orientation) {
      orientation.copy(_orientation);
    }
    this.shapes.push(shape);
    this.shapeOffsets.push(offset);
    this.shapeOrientations.push(orientation);
    this.updateMassProperties();
    this.updateBoundingRadius();
    this.aabbNeedsUpdate = true;
    shape.body = this;
    return this;
  }
  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index === -1) {
      console.warn("Shape does not belong to the body");
      return this;
    }
    this.shapes.splice(index, 1);
    this.shapeOffsets.splice(index, 1);
    this.shapeOrientations.splice(index, 1);
    this.updateMassProperties();
    this.updateBoundingRadius();
    this.aabbNeedsUpdate = true;
    shape.body = null;
    return this;
  }
  updateBoundingRadius() {
    const shapes = this.shapes;
    const shapeOffsets = this.shapeOffsets;
    const N = shapes.length;
    let radius = 0;
    for (let i = 0; i !== N; i++) {
      const shape = shapes[i];
      shape.updateBoundingSphereRadius();
      const offset = shapeOffsets[i].length();
      const r = shape.boundingSphereRadius;
      if (offset + r > radius) {
        radius = offset + r;
      }
    }
    this.boundingRadius = radius;
  }
  updateAABB() {
    const shapes = this.shapes;
    const shapeOffsets = this.shapeOffsets;
    const shapeOrientations = this.shapeOrientations;
    const N = shapes.length;
    const offset = tmpVec;
    const orientation = tmpQuat;
    const bodyQuat = this.quaternion;
    const aabb = this.aabb;
    const shapeAABB = updateAABB_shapeAABB;
    for (let i = 0; i !== N; i++) {
      const shape = shapes[i];
      bodyQuat.vmult(shapeOffsets[i], offset);
      offset.vadd(this.position, offset);
      bodyQuat.mult(shapeOrientations[i], orientation);
      shape.calculateWorldAABB(offset, orientation, shapeAABB.lowerBound, shapeAABB.upperBound);
      if (i === 0) {
        aabb.copy(shapeAABB);
      } else {
        aabb.extend(shapeAABB);
      }
    }
    this.aabbNeedsUpdate = false;
  }
  updateInertiaWorld(force) {
    const I = this.invInertia;
    if (I.x === I.y && I.y === I.z && !force)
      ;
    else {
      const m1 = uiw_m1;
      const m2 = uiw_m2;
      m1.setRotationFromQuaternion(this.quaternion);
      m1.transpose(m2);
      m1.scale(I, m1);
      m1.mmult(m2, this.invInertiaWorld);
    }
  }
  applyForce(force, relativePoint) {
    if (relativePoint === void 0) {
      relativePoint = new Vec3();
    }
    if (this.type !== Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === Body.SLEEPING) {
      this.wakeUp();
    }
    const rotForce = Body_applyForce_rotForce;
    relativePoint.cross(force, rotForce);
    this.force.vadd(force, this.force);
    this.torque.vadd(rotForce, this.torque);
  }
  applyLocalForce(localForce, localPoint) {
    if (localPoint === void 0) {
      localPoint = new Vec3();
    }
    if (this.type !== Body.DYNAMIC) {
      return;
    }
    const worldForce = Body_applyLocalForce_worldForce;
    const relativePointWorld = Body_applyLocalForce_relativePointWorld;
    this.vectorToWorldFrame(localForce, worldForce);
    this.vectorToWorldFrame(localPoint, relativePointWorld);
    this.applyForce(worldForce, relativePointWorld);
  }
  applyTorque(torque2) {
    if (this.type !== Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === Body.SLEEPING) {
      this.wakeUp();
    }
    this.torque.vadd(torque2, this.torque);
  }
  applyImpulse(impulse, relativePoint) {
    if (relativePoint === void 0) {
      relativePoint = new Vec3();
    }
    if (this.type !== Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === Body.SLEEPING) {
      this.wakeUp();
    }
    const r = relativePoint;
    const velo = Body_applyImpulse_velo;
    velo.copy(impulse);
    velo.scale(this.invMass, velo);
    this.velocity.vadd(velo, this.velocity);
    const rotVelo = Body_applyImpulse_rotVelo;
    r.cross(impulse, rotVelo);
    this.invInertiaWorld.vmult(rotVelo, rotVelo);
    this.angularVelocity.vadd(rotVelo, this.angularVelocity);
  }
  applyLocalImpulse(localImpulse, localPoint) {
    if (localPoint === void 0) {
      localPoint = new Vec3();
    }
    if (this.type !== Body.DYNAMIC) {
      return;
    }
    const worldImpulse = Body_applyLocalImpulse_worldImpulse;
    const relativePointWorld = Body_applyLocalImpulse_relativePoint;
    this.vectorToWorldFrame(localImpulse, worldImpulse);
    this.vectorToWorldFrame(localPoint, relativePointWorld);
    this.applyImpulse(worldImpulse, relativePointWorld);
  }
  updateMassProperties() {
    const halfExtents = Body_updateMassProperties_halfExtents;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    const I = this.inertia;
    const fixed = this.fixedRotation;
    this.updateAABB();
    halfExtents.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2);
    Box.calculateInertia(halfExtents, this.mass, I);
    this.invInertia.set(I.x > 0 && !fixed ? 1 / I.x : 0, I.y > 0 && !fixed ? 1 / I.y : 0, I.z > 0 && !fixed ? 1 / I.z : 0);
    this.updateInertiaWorld(true);
  }
  getVelocityAtWorldPoint(worldPoint, result) {
    const r = new Vec3();
    worldPoint.vsub(this.position, r);
    this.angularVelocity.cross(r, result);
    this.velocity.vadd(result, result);
    return result;
  }
  integrate(dt, quatNormalize, quatNormalizeFast) {
    this.previousPosition.copy(this.position);
    this.previousQuaternion.copy(this.quaternion);
    if (!(this.type === Body.DYNAMIC || this.type === Body.KINEMATIC) || this.sleepState === Body.SLEEPING) {
      return;
    }
    const velo = this.velocity;
    const angularVelo = this.angularVelocity;
    const pos = this.position;
    const force = this.force;
    const torque2 = this.torque;
    const quat = this.quaternion;
    const invMass = this.invMass;
    const invInertia = this.invInertiaWorld;
    const linearFactor = this.linearFactor;
    const iMdt = invMass * dt;
    velo.x += force.x * iMdt * linearFactor.x;
    velo.y += force.y * iMdt * linearFactor.y;
    velo.z += force.z * iMdt * linearFactor.z;
    const e = invInertia.elements;
    const angularFactor = this.angularFactor;
    const tx = torque2.x * angularFactor.x;
    const ty = torque2.y * angularFactor.y;
    const tz = torque2.z * angularFactor.z;
    angularVelo.x += dt * (e[0] * tx + e[1] * ty + e[2] * tz);
    angularVelo.y += dt * (e[3] * tx + e[4] * ty + e[5] * tz);
    angularVelo.z += dt * (e[6] * tx + e[7] * ty + e[8] * tz);
    pos.x += velo.x * dt;
    pos.y += velo.y * dt;
    pos.z += velo.z * dt;
    quat.integrate(this.angularVelocity, dt, this.angularFactor, quat);
    if (quatNormalize) {
      if (quatNormalizeFast) {
        quat.normalizeFast();
      } else {
        quat.normalize();
      }
    }
    this.aabbNeedsUpdate = true;
    this.updateInertiaWorld();
  }
}
Body.idCounter = 0;
Body.COLLIDE_EVENT_NAME = "collide";
Body.DYNAMIC = BODY_TYPES.DYNAMIC;
Body.STATIC = BODY_TYPES.STATIC;
Body.KINEMATIC = BODY_TYPES.KINEMATIC;
Body.AWAKE = BODY_SLEEP_STATES.AWAKE;
Body.SLEEPY = BODY_SLEEP_STATES.SLEEPY;
Body.SLEEPING = BODY_SLEEP_STATES.SLEEPING;
Body.wakeupEvent = {
  type: "wakeup"
};
Body.sleepyEvent = {
  type: "sleepy"
};
Body.sleepEvent = {
  type: "sleep"
};
const tmpVec = new Vec3();
const tmpQuat = new Quaternion();
const updateAABB_shapeAABB = new AABB();
const uiw_m1 = new Mat3();
const uiw_m2 = new Mat3();
const uiw_m3 = new Mat3();
const Body_applyForce_rotForce = new Vec3();
const Body_applyLocalForce_worldForce = new Vec3();
const Body_applyLocalForce_relativePointWorld = new Vec3();
const Body_applyImpulse_velo = new Vec3();
const Body_applyImpulse_rotVelo = new Vec3();
const Body_applyLocalImpulse_worldImpulse = new Vec3();
const Body_applyLocalImpulse_relativePoint = new Vec3();
const Body_updateMassProperties_halfExtents = new Vec3();
class Broadphase {
  constructor() {
    this.world = null;
    this.useBoundingBoxes = false;
    this.dirty = true;
  }
  collisionPairs(world, p1, p2) {
    throw new Error("collisionPairs not implemented for this BroadPhase class!");
  }
  needBroadphaseCollision(bodyA, bodyB) {
    if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 || (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
      return false;
    }
    if (((bodyA.type & Body.STATIC) !== 0 || bodyA.sleepState === Body.SLEEPING) && ((bodyB.type & Body.STATIC) !== 0 || bodyB.sleepState === Body.SLEEPING)) {
      return false;
    }
    return true;
  }
  intersectionTest(bodyA, bodyB, pairs1, pairs2) {
    if (this.useBoundingBoxes) {
      this.doBoundingBoxBroadphase(bodyA, bodyB, pairs1, pairs2);
    } else {
      this.doBoundingSphereBroadphase(bodyA, bodyB, pairs1, pairs2);
    }
  }
  doBoundingSphereBroadphase(bodyA, bodyB, pairs1, pairs2) {
    const r = Broadphase_collisionPairs_r;
    bodyB.position.vsub(bodyA.position, r);
    const boundingRadiusSum2 = (bodyA.boundingRadius + bodyB.boundingRadius) ** 2;
    const norm2 = r.lengthSquared();
    if (norm2 < boundingRadiusSum2) {
      pairs1.push(bodyA);
      pairs2.push(bodyB);
    }
  }
  doBoundingBoxBroadphase(bodyA, bodyB, pairs1, pairs2) {
    if (bodyA.aabbNeedsUpdate) {
      bodyA.updateAABB();
    }
    if (bodyB.aabbNeedsUpdate) {
      bodyB.updateAABB();
    }
    if (bodyA.aabb.overlaps(bodyB.aabb)) {
      pairs1.push(bodyA);
      pairs2.push(bodyB);
    }
  }
  makePairsUnique(pairs1, pairs2) {
    const t = Broadphase_makePairsUnique_temp;
    const p1 = Broadphase_makePairsUnique_p1;
    const p2 = Broadphase_makePairsUnique_p2;
    const N = pairs1.length;
    for (let i = 0; i !== N; i++) {
      p1[i] = pairs1[i];
      p2[i] = pairs2[i];
    }
    pairs1.length = 0;
    pairs2.length = 0;
    for (let i = 0; i !== N; i++) {
      const id1 = p1[i].id;
      const id2 = p2[i].id;
      const key = id1 < id2 ? `${id1},${id2}` : `${id2},${id1}`;
      t[key] = i;
      t.keys.push(key);
    }
    for (let i = 0; i !== t.keys.length; i++) {
      const key = t.keys.pop();
      const pairIndex = t[key];
      pairs1.push(p1[pairIndex]);
      pairs2.push(p2[pairIndex]);
      delete t[key];
    }
  }
  setWorld(world) {
  }
  static boundingSphereCheck(bodyA, bodyB) {
    const dist = new Vec3();
    bodyA.position.vsub(bodyB.position, dist);
    const sa = bodyA.shapes[0];
    const sb = bodyB.shapes[0];
    return Math.pow(sa.boundingSphereRadius + sb.boundingSphereRadius, 2) > dist.lengthSquared();
  }
  aabbQuery(world, aabb, result) {
    console.warn(".aabbQuery is not implemented in this Broadphase subclass.");
    return [];
  }
}
const Broadphase_collisionPairs_r = new Vec3();
new Vec3();
new Quaternion();
new Vec3();
const Broadphase_makePairsUnique_temp = {
  keys: []
};
const Broadphase_makePairsUnique_p1 = [];
const Broadphase_makePairsUnique_p2 = [];
new Vec3();
class GridBroadphase extends Broadphase {
  constructor(aabbMin, aabbMax, nx, ny, nz) {
    if (aabbMin === void 0) {
      aabbMin = new Vec3(100, 100, 100);
    }
    if (aabbMax === void 0) {
      aabbMax = new Vec3(-100, -100, -100);
    }
    if (nx === void 0) {
      nx = 10;
    }
    if (ny === void 0) {
      ny = 10;
    }
    if (nz === void 0) {
      nz = 10;
    }
    super();
    this.nx = nx;
    this.ny = ny;
    this.nz = nz;
    this.aabbMin = aabbMin;
    this.aabbMax = aabbMax;
    const nbins = this.nx * this.ny * this.nz;
    if (nbins <= 0) {
      throw "GridBroadphase: Each dimension's n must be >0";
    }
    this.bins = [];
    this.binLengths = [];
    this.bins.length = nbins;
    this.binLengths.length = nbins;
    for (let i = 0; i < nbins; i++) {
      this.bins[i] = [];
      this.binLengths[i] = 0;
    }
  }
  collisionPairs(world, pairs1, pairs2) {
    const N = world.bodies.length;
    const bodies = world.bodies;
    const max = this.aabbMax;
    const min = this.aabbMin;
    const nx = this.nx;
    const ny = this.ny;
    const nz = this.nz;
    const xstep = ny * nz;
    const ystep = nz;
    const zstep = 1;
    const xmax = max.x;
    const ymax = max.y;
    const zmax = max.z;
    const xmin = min.x;
    const ymin = min.y;
    const zmin = min.z;
    const xmult = nx / (xmax - xmin);
    const ymult = ny / (ymax - ymin);
    const zmult = nz / (zmax - zmin);
    const binsizeX = (xmax - xmin) / nx;
    const binsizeY = (ymax - ymin) / ny;
    const binsizeZ = (zmax - zmin) / nz;
    const binRadius = Math.sqrt(binsizeX * binsizeX + binsizeY * binsizeY + binsizeZ * binsizeZ) * 0.5;
    const types = Shape.types;
    const SPHERE = types.SPHERE;
    const PLANE = types.PLANE;
    types.BOX;
    types.COMPOUND;
    types.CONVEXPOLYHEDRON;
    const bins = this.bins;
    const binLengths = this.binLengths;
    const Nbins = this.bins.length;
    for (let i = 0; i !== Nbins; i++) {
      binLengths[i] = 0;
    }
    const ceil = Math.ceil;
    function addBoxToBins(x0, y0, z0, x1, y1, z1, bi) {
      let xoff0 = (x0 - xmin) * xmult | 0;
      let yoff0 = (y0 - ymin) * ymult | 0;
      let zoff0 = (z0 - zmin) * zmult | 0;
      let xoff1 = ceil((x1 - xmin) * xmult);
      let yoff1 = ceil((y1 - ymin) * ymult);
      let zoff1 = ceil((z1 - zmin) * zmult);
      if (xoff0 < 0) {
        xoff0 = 0;
      } else if (xoff0 >= nx) {
        xoff0 = nx - 1;
      }
      if (yoff0 < 0) {
        yoff0 = 0;
      } else if (yoff0 >= ny) {
        yoff0 = ny - 1;
      }
      if (zoff0 < 0) {
        zoff0 = 0;
      } else if (zoff0 >= nz) {
        zoff0 = nz - 1;
      }
      if (xoff1 < 0) {
        xoff1 = 0;
      } else if (xoff1 >= nx) {
        xoff1 = nx - 1;
      }
      if (yoff1 < 0) {
        yoff1 = 0;
      } else if (yoff1 >= ny) {
        yoff1 = ny - 1;
      }
      if (zoff1 < 0) {
        zoff1 = 0;
      } else if (zoff1 >= nz) {
        zoff1 = nz - 1;
      }
      xoff0 *= xstep;
      yoff0 *= ystep;
      zoff0 *= zstep;
      xoff1 *= xstep;
      yoff1 *= ystep;
      zoff1 *= zstep;
      for (let xoff = xoff0; xoff <= xoff1; xoff += xstep) {
        for (let yoff = yoff0; yoff <= yoff1; yoff += ystep) {
          for (let zoff = zoff0; zoff <= zoff1; zoff += zstep) {
            const idx = xoff + yoff + zoff;
            bins[idx][binLengths[idx]++] = bi;
          }
        }
      }
    }
    for (let i = 0; i !== N; i++) {
      const bi = bodies[i];
      const si = bi.shapes[0];
      switch (si.type) {
        case SPHERE: {
          const shape = si;
          const x = bi.position.x;
          const y = bi.position.y;
          const z = bi.position.z;
          const r = shape.radius;
          addBoxToBins(x - r, y - r, z - r, x + r, y + r, z + r, bi);
          break;
        }
        case PLANE: {
          const shape = si;
          if (shape.worldNormalNeedsUpdate) {
            shape.computeWorldNormal(bi.quaternion);
          }
          const planeNormal = shape.worldNormal;
          const xreset = xmin + binsizeX * 0.5 - bi.position.x;
          const yreset = ymin + binsizeY * 0.5 - bi.position.y;
          const zreset = zmin + binsizeZ * 0.5 - bi.position.z;
          const d = GridBroadphase_collisionPairs_d;
          d.set(xreset, yreset, zreset);
          for (let xi = 0, xoff = 0; xi !== nx; xi++, xoff += xstep, d.y = yreset, d.x += binsizeX) {
            for (let yi = 0, yoff = 0; yi !== ny; yi++, yoff += ystep, d.z = zreset, d.y += binsizeY) {
              for (let zi = 0, zoff = 0; zi !== nz; zi++, zoff += zstep, d.z += binsizeZ) {
                if (d.dot(planeNormal) < binRadius) {
                  const idx = xoff + yoff + zoff;
                  bins[idx][binLengths[idx]++] = bi;
                }
              }
            }
          }
          break;
        }
        default: {
          if (bi.aabbNeedsUpdate) {
            bi.updateAABB();
          }
          addBoxToBins(bi.aabb.lowerBound.x, bi.aabb.lowerBound.y, bi.aabb.lowerBound.z, bi.aabb.upperBound.x, bi.aabb.upperBound.y, bi.aabb.upperBound.z, bi);
          break;
        }
      }
    }
    for (let i = 0; i !== Nbins; i++) {
      const binLength = binLengths[i];
      if (binLength > 1) {
        const bin = bins[i];
        for (let xi = 0; xi !== binLength; xi++) {
          const bi = bin[xi];
          for (let yi = 0; yi !== xi; yi++) {
            const bj = bin[yi];
            if (this.needBroadphaseCollision(bi, bj)) {
              this.intersectionTest(bi, bj, pairs1, pairs2);
            }
          }
        }
      }
    }
    this.makePairsUnique(pairs1, pairs2);
  }
}
const GridBroadphase_collisionPairs_d = new Vec3();
new Vec3();
class NaiveBroadphase extends Broadphase {
  constructor() {
    super();
  }
  collisionPairs(world, pairs1, pairs2) {
    const bodies = world.bodies;
    const n = bodies.length;
    let bi;
    let bj;
    for (let i = 0; i !== n; i++) {
      for (let j = 0; j !== i; j++) {
        bi = bodies[i];
        bj = bodies[j];
        if (!this.needBroadphaseCollision(bi, bj)) {
          continue;
        }
        this.intersectionTest(bi, bj, pairs1, pairs2);
      }
    }
  }
  aabbQuery(world, aabb, result) {
    if (result === void 0) {
      result = [];
    }
    for (let i = 0; i < world.bodies.length; i++) {
      const b2 = world.bodies[i];
      if (b2.aabbNeedsUpdate) {
        b2.updateAABB();
      }
      if (b2.aabb.overlaps(aabb)) {
        result.push(b2);
      }
    }
    return result;
  }
}
class RaycastResult {
  constructor() {
    this.rayFromWorld = new Vec3();
    this.rayToWorld = new Vec3();
    this.hitNormalWorld = new Vec3();
    this.hitPointWorld = new Vec3();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  reset() {
    this.rayFromWorld.setZero();
    this.rayToWorld.setZero();
    this.hitNormalWorld.setZero();
    this.hitPointWorld.setZero();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  abort() {
    this.shouldStop = true;
  }
  set(rayFromWorld, rayToWorld, hitNormalWorld, hitPointWorld, shape, body, distance) {
    this.rayFromWorld.copy(rayFromWorld);
    this.rayToWorld.copy(rayToWorld);
    this.hitNormalWorld.copy(hitNormalWorld);
    this.hitPointWorld.copy(hitPointWorld);
    this.shape = shape;
    this.body = body;
    this.distance = distance;
  }
}
let _Shape$types$SPHERE, _Shape$types$PLANE, _Shape$types$BOX, _Shape$types$CYLINDER, _Shape$types$CONVEXPO, _Shape$types$HEIGHTFI, _Shape$types$TRIMESH;
const RAY_MODES = {
  CLOSEST: 1,
  ANY: 2,
  ALL: 4
};
_Shape$types$SPHERE = Shape.types.SPHERE;
_Shape$types$PLANE = Shape.types.PLANE;
_Shape$types$BOX = Shape.types.BOX;
_Shape$types$CYLINDER = Shape.types.CYLINDER;
_Shape$types$CONVEXPO = Shape.types.CONVEXPOLYHEDRON;
_Shape$types$HEIGHTFI = Shape.types.HEIGHTFIELD;
_Shape$types$TRIMESH = Shape.types.TRIMESH;
class Ray {
  get [_Shape$types$SPHERE]() {
    return this._intersectSphere;
  }
  get [_Shape$types$PLANE]() {
    return this._intersectPlane;
  }
  get [_Shape$types$BOX]() {
    return this._intersectBox;
  }
  get [_Shape$types$CYLINDER]() {
    return this._intersectConvex;
  }
  get [_Shape$types$CONVEXPO]() {
    return this._intersectConvex;
  }
  get [_Shape$types$HEIGHTFI]() {
    return this._intersectHeightfield;
  }
  get [_Shape$types$TRIMESH]() {
    return this._intersectTrimesh;
  }
  constructor(from, to) {
    if (from === void 0) {
      from = new Vec3();
    }
    if (to === void 0) {
      to = new Vec3();
    }
    this.from = from.clone();
    this.to = to.clone();
    this.direction = new Vec3();
    this.precision = 1e-4;
    this.checkCollisionResponse = true;
    this.skipBackfaces = false;
    this.collisionFilterMask = -1;
    this.collisionFilterGroup = -1;
    this.mode = Ray.ANY;
    this.result = new RaycastResult();
    this.hasHit = false;
    this.callback = (result) => {
    };
  }
  intersectWorld(world, options) {
    this.mode = options.mode || Ray.ANY;
    this.result = options.result || new RaycastResult();
    this.skipBackfaces = !!options.skipBackfaces;
    this.collisionFilterMask = typeof options.collisionFilterMask !== "undefined" ? options.collisionFilterMask : -1;
    this.collisionFilterGroup = typeof options.collisionFilterGroup !== "undefined" ? options.collisionFilterGroup : -1;
    this.checkCollisionResponse = typeof options.checkCollisionResponse !== "undefined" ? options.checkCollisionResponse : true;
    if (options.from) {
      this.from.copy(options.from);
    }
    if (options.to) {
      this.to.copy(options.to);
    }
    this.callback = options.callback || (() => {
    });
    this.hasHit = false;
    this.result.reset();
    this.updateDirection();
    this.getAABB(tmpAABB$1);
    tmpArray.length = 0;
    world.broadphase.aabbQuery(world, tmpAABB$1, tmpArray);
    this.intersectBodies(tmpArray);
    return this.hasHit;
  }
  intersectBody(body, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    const checkCollisionResponse = this.checkCollisionResponse;
    if (checkCollisionResponse && !body.collisionResponse) {
      return;
    }
    if ((this.collisionFilterGroup & body.collisionFilterMask) === 0 || (body.collisionFilterGroup & this.collisionFilterMask) === 0) {
      return;
    }
    const xi = intersectBody_xi;
    const qi = intersectBody_qi;
    for (let i = 0, N = body.shapes.length; i < N; i++) {
      const shape = body.shapes[i];
      if (checkCollisionResponse && !shape.collisionResponse) {
        continue;
      }
      body.quaternion.mult(body.shapeOrientations[i], qi);
      body.quaternion.vmult(body.shapeOffsets[i], xi);
      xi.vadd(body.position, xi);
      this.intersectShape(shape, qi, xi, body);
      if (this.result.shouldStop) {
        break;
      }
    }
  }
  intersectBodies(bodies, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    for (let i = 0, l = bodies.length; !this.result.shouldStop && i < l; i++) {
      this.intersectBody(bodies[i]);
    }
  }
  updateDirection() {
    this.to.vsub(this.from, this.direction);
    this.direction.normalize();
  }
  intersectShape(shape, quat, position, body) {
    const from = this.from;
    const distance = distanceFromIntersection(from, this.direction, position);
    if (distance > shape.boundingSphereRadius) {
      return;
    }
    const intersectMethod = this[shape.type];
    if (intersectMethod) {
      intersectMethod.call(this, shape, quat, position, body, shape);
    }
  }
  _intersectBox(box, quat, position, body, reportedShape) {
    return this._intersectConvex(box.convexPolyhedronRepresentation, quat, position, body, reportedShape);
  }
  _intersectPlane(shape, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    const worldNormal = new Vec3(0, 0, 1);
    quat.vmult(worldNormal, worldNormal);
    const len = new Vec3();
    from.vsub(position, len);
    const planeToFrom = len.dot(worldNormal);
    to.vsub(position, len);
    const planeToTo = len.dot(worldNormal);
    if (planeToFrom * planeToTo > 0) {
      return;
    }
    if (from.distanceTo(to) < planeToFrom) {
      return;
    }
    const n_dot_dir = worldNormal.dot(direction);
    if (Math.abs(n_dot_dir) < this.precision) {
      return;
    }
    const planePointToFrom = new Vec3();
    const dir_scaled_with_t = new Vec3();
    const hitPointWorld = new Vec3();
    from.vsub(position, planePointToFrom);
    const t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
    direction.scale(t, dir_scaled_with_t);
    from.vadd(dir_scaled_with_t, hitPointWorld);
    this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1);
  }
  getAABB(aabb) {
    const {
      lowerBound,
      upperBound
    } = aabb;
    const to = this.to;
    const from = this.from;
    lowerBound.x = Math.min(to.x, from.x);
    lowerBound.y = Math.min(to.y, from.y);
    lowerBound.z = Math.min(to.z, from.z);
    upperBound.x = Math.max(to.x, from.x);
    upperBound.y = Math.max(to.y, from.y);
    upperBound.z = Math.max(to.z, from.z);
  }
  _intersectHeightfield(shape, quat, position, body, reportedShape) {
    shape.data;
    shape.elementSize;
    const localRay = intersectHeightfield_localRay;
    localRay.from.copy(this.from);
    localRay.to.copy(this.to);
    Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from);
    Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to);
    localRay.updateDirection();
    const index = intersectHeightfield_index;
    let iMinX;
    let iMinY;
    let iMaxX;
    let iMaxY;
    iMinX = iMinY = 0;
    iMaxX = iMaxY = shape.data.length - 1;
    const aabb = new AABB();
    localRay.getAABB(aabb);
    shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, true);
    iMinX = Math.max(iMinX, index[0]);
    iMinY = Math.max(iMinY, index[1]);
    shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, true);
    iMaxX = Math.min(iMaxX, index[0] + 1);
    iMaxY = Math.min(iMaxY, index[1] + 1);
    for (let i = iMinX; i < iMaxX; i++) {
      for (let j = iMinY; j < iMaxY; j++) {
        if (this.result.shouldStop) {
          return;
        }
        shape.getAabbAtIndex(i, j, aabb);
        if (!aabb.overlapsRay(localRay)) {
          continue;
        }
        shape.getConvexTrianglePillar(i, j, false);
        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
        if (this.result.shouldStop) {
          return;
        }
        shape.getConvexTrianglePillar(i, j, true);
        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
      }
    }
  }
  _intersectSphere(sphere, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const r = sphere.radius;
    const a2 = (to.x - from.x) ** 2 + (to.y - from.y) ** 2 + (to.z - from.z) ** 2;
    const b2 = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z));
    const c2 = (from.x - position.x) ** 2 + (from.y - position.y) ** 2 + (from.z - position.z) ** 2 - r ** 2;
    const delta = b2 ** 2 - 4 * a2 * c2;
    const intersectionPoint = Ray_intersectSphere_intersectionPoint;
    const normal = Ray_intersectSphere_normal;
    if (delta < 0) {
      return;
    } else if (delta === 0) {
      from.lerp(to, delta, intersectionPoint);
      intersectionPoint.vsub(position, normal);
      normal.normalize();
      this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
    } else {
      const d1 = (-b2 - Math.sqrt(delta)) / (2 * a2);
      const d2 = (-b2 + Math.sqrt(delta)) / (2 * a2);
      if (d1 >= 0 && d1 <= 1) {
        from.lerp(to, d1, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
      if (this.result.shouldStop) {
        return;
      }
      if (d2 >= 0 && d2 <= 1) {
        from.lerp(to, d2, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
    }
  }
  _intersectConvex(shape, quat, position, body, reportedShape, options) {
    const normal = intersectConvex_normal;
    const vector = intersectConvex_vector;
    const faceList = options && options.faceList || null;
    const faces = shape.faces;
    const vertices = shape.vertices;
    const normals = shape.faceNormals;
    const direction = this.direction;
    const from = this.from;
    const to = this.to;
    const fromToDistance = from.distanceTo(to);
    const Nfaces = faceList ? faceList.length : faces.length;
    const result = this.result;
    for (let j = 0; !result.shouldStop && j < Nfaces; j++) {
      const fi = faceList ? faceList[j] : j;
      const face = faces[fi];
      const faceNormal = normals[fi];
      const q = quat;
      const x = position;
      vector.copy(vertices[face[0]]);
      q.vmult(vector, vector);
      vector.vadd(x, vector);
      vector.vsub(from, vector);
      q.vmult(faceNormal, normal);
      const dot = direction.dot(normal);
      if (Math.abs(dot) < this.precision) {
        continue;
      }
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      direction.scale(scalar, intersectPoint);
      intersectPoint.vadd(from, intersectPoint);
      a.copy(vertices[face[0]]);
      q.vmult(a, a);
      x.vadd(a, a);
      for (let i = 1; !result.shouldStop && i < face.length - 1; i++) {
        b.copy(vertices[face[i]]);
        c.copy(vertices[face[i + 1]]);
        q.vmult(b, b);
        q.vmult(c, c);
        x.vadd(b, b);
        x.vadd(c, c);
        const distance = intersectPoint.distanceTo(from);
        if (!(Ray.pointInTriangle(intersectPoint, a, b, c) || Ray.pointInTriangle(intersectPoint, b, a, c)) || distance > fromToDistance) {
          continue;
        }
        this.reportIntersection(normal, intersectPoint, reportedShape, body, fi);
      }
    }
  }
  _intersectTrimesh(mesh, quat, position, body, reportedShape, options) {
    const normal = intersectTrimesh_normal;
    const triangles = intersectTrimesh_triangles;
    const treeTransform = intersectTrimesh_treeTransform;
    const vector = intersectConvex_vector;
    const localDirection = intersectTrimesh_localDirection;
    const localFrom = intersectTrimesh_localFrom;
    const localTo = intersectTrimesh_localTo;
    const worldIntersectPoint = intersectTrimesh_worldIntersectPoint;
    const worldNormal = intersectTrimesh_worldNormal;
    const indices = mesh.indices;
    mesh.vertices;
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    treeTransform.position.copy(position);
    treeTransform.quaternion.copy(quat);
    Transform.vectorToLocalFrame(position, quat, direction, localDirection);
    Transform.pointToLocalFrame(position, quat, from, localFrom);
    Transform.pointToLocalFrame(position, quat, to, localTo);
    localTo.x *= mesh.scale.x;
    localTo.y *= mesh.scale.y;
    localTo.z *= mesh.scale.z;
    localFrom.x *= mesh.scale.x;
    localFrom.y *= mesh.scale.y;
    localFrom.z *= mesh.scale.z;
    localTo.vsub(localFrom, localDirection);
    localDirection.normalize();
    const fromToDistanceSquared = localFrom.distanceSquared(localTo);
    mesh.tree.rayQuery(this, treeTransform, triangles);
    for (let i = 0, N = triangles.length; !this.result.shouldStop && i !== N; i++) {
      const trianglesIndex = triangles[i];
      mesh.getNormal(trianglesIndex, normal);
      mesh.getVertex(indices[trianglesIndex * 3], a);
      a.vsub(localFrom, vector);
      const dot = localDirection.dot(normal);
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      localDirection.scale(scalar, intersectPoint);
      intersectPoint.vadd(localFrom, intersectPoint);
      mesh.getVertex(indices[trianglesIndex * 3 + 1], b);
      mesh.getVertex(indices[trianglesIndex * 3 + 2], c);
      const squaredDistance = intersectPoint.distanceSquared(localFrom);
      if (!(Ray.pointInTriangle(intersectPoint, b, a, c) || Ray.pointInTriangle(intersectPoint, a, b, c)) || squaredDistance > fromToDistanceSquared) {
        continue;
      }
      Transform.vectorToWorldFrame(quat, normal, worldNormal);
      Transform.pointToWorldFrame(position, quat, intersectPoint, worldIntersectPoint);
      this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex);
    }
    triangles.length = 0;
  }
  reportIntersection(normal, hitPointWorld, shape, body, hitFaceIndex) {
    const from = this.from;
    const to = this.to;
    const distance = from.distanceTo(hitPointWorld);
    const result = this.result;
    if (this.skipBackfaces && normal.dot(this.direction) > 0) {
      return;
    }
    result.hitFaceIndex = typeof hitFaceIndex !== "undefined" ? hitFaceIndex : -1;
    switch (this.mode) {
      case Ray.ALL:
        this.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.hasHit = true;
        this.callback(result);
        break;
      case Ray.CLOSEST:
        if (distance < result.distance || !result.hasHit) {
          this.hasHit = true;
          result.hasHit = true;
          result.set(from, to, normal, hitPointWorld, shape, body, distance);
        }
        break;
      case Ray.ANY:
        this.hasHit = true;
        result.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.shouldStop = true;
        break;
    }
  }
  static pointInTriangle(p, a2, b2, c2) {
    c2.vsub(a2, v0);
    b2.vsub(a2, v1);
    p.vsub(a2, v2);
    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);
    let u;
    let v;
    return (u = dot11 * dot02 - dot01 * dot12) >= 0 && (v = dot00 * dot12 - dot01 * dot02) >= 0 && u + v < dot00 * dot11 - dot01 * dot01;
  }
}
Ray.CLOSEST = RAY_MODES.CLOSEST;
Ray.ANY = RAY_MODES.ANY;
Ray.ALL = RAY_MODES.ALL;
const tmpAABB$1 = new AABB();
const tmpArray = [];
const v1 = new Vec3();
const v2 = new Vec3();
const intersectBody_xi = new Vec3();
const intersectBody_qi = new Quaternion();
const intersectPoint = new Vec3();
const a = new Vec3();
const b = new Vec3();
const c = new Vec3();
new Vec3();
new RaycastResult();
const intersectConvexOptions = {
  faceList: [0]
};
const worldPillarOffset = new Vec3();
const intersectHeightfield_localRay = new Ray();
const intersectHeightfield_index = [];
const Ray_intersectSphere_intersectionPoint = new Vec3();
const Ray_intersectSphere_normal = new Vec3();
const intersectConvex_normal = new Vec3();
const intersectConvex_minDistNormal = new Vec3();
const intersectConvex_minDistIntersect = new Vec3();
const intersectConvex_vector = new Vec3();
const intersectTrimesh_normal = new Vec3();
const intersectTrimesh_localDirection = new Vec3();
const intersectTrimesh_localFrom = new Vec3();
const intersectTrimesh_localTo = new Vec3();
const intersectTrimesh_worldNormal = new Vec3();
const intersectTrimesh_worldIntersectPoint = new Vec3();
new AABB();
const intersectTrimesh_triangles = [];
const intersectTrimesh_treeTransform = new Transform();
const v0 = new Vec3();
const intersect = new Vec3();
function distanceFromIntersection(from, direction, position) {
  position.vsub(from, v0);
  const dot = v0.dot(direction);
  direction.scale(dot, intersect);
  intersect.vadd(from, intersect);
  const distance = position.distanceTo(intersect);
  return distance;
}
class SAPBroadphase extends Broadphase {
  static checkBounds(bi, bj, axisIndex) {
    let biPos;
    let bjPos;
    if (axisIndex === 0) {
      biPos = bi.position.x;
      bjPos = bj.position.x;
    } else if (axisIndex === 1) {
      biPos = bi.position.y;
      bjPos = bj.position.y;
    } else if (axisIndex === 2) {
      biPos = bi.position.z;
      bjPos = bj.position.z;
    }
    const ri = bi.boundingRadius, rj = bj.boundingRadius, boundA2 = biPos + ri, boundB1 = bjPos - rj;
    return boundB1 < boundA2;
  }
  static insertionSortX(a2) {
    for (let i = 1, l = a2.length; i < l; i++) {
      const v = a2[i];
      let j;
      for (j = i - 1; j >= 0; j--) {
        if (a2[j].aabb.lowerBound.x <= v.aabb.lowerBound.x) {
          break;
        }
        a2[j + 1] = a2[j];
      }
      a2[j + 1] = v;
    }
    return a2;
  }
  static insertionSortY(a2) {
    for (let i = 1, l = a2.length; i < l; i++) {
      const v = a2[i];
      let j;
      for (j = i - 1; j >= 0; j--) {
        if (a2[j].aabb.lowerBound.y <= v.aabb.lowerBound.y) {
          break;
        }
        a2[j + 1] = a2[j];
      }
      a2[j + 1] = v;
    }
    return a2;
  }
  static insertionSortZ(a2) {
    for (let i = 1, l = a2.length; i < l; i++) {
      const v = a2[i];
      let j;
      for (j = i - 1; j >= 0; j--) {
        if (a2[j].aabb.lowerBound.z <= v.aabb.lowerBound.z) {
          break;
        }
        a2[j + 1] = a2[j];
      }
      a2[j + 1] = v;
    }
    return a2;
  }
  constructor(world) {
    super();
    this.axisList = [];
    this.world = null;
    this.axisIndex = 0;
    const axisList = this.axisList;
    this._addBodyHandler = (event) => {
      axisList.push(event.body);
    };
    this._removeBodyHandler = (event) => {
      const idx = axisList.indexOf(event.body);
      if (idx !== -1) {
        axisList.splice(idx, 1);
      }
    };
    if (world) {
      this.setWorld(world);
    }
  }
  setWorld(world) {
    this.axisList.length = 0;
    for (let i = 0; i < world.bodies.length; i++) {
      this.axisList.push(world.bodies[i]);
    }
    world.removeEventListener("addBody", this._addBodyHandler);
    world.removeEventListener("removeBody", this._removeBodyHandler);
    world.addEventListener("addBody", this._addBodyHandler);
    world.addEventListener("removeBody", this._removeBodyHandler);
    this.world = world;
    this.dirty = true;
  }
  collisionPairs(world, p1, p2) {
    const bodies = this.axisList;
    const N = bodies.length;
    const axisIndex = this.axisIndex;
    let i;
    let j;
    if (this.dirty) {
      this.sortList();
      this.dirty = false;
    }
    for (i = 0; i !== N; i++) {
      const bi = bodies[i];
      for (j = i + 1; j < N; j++) {
        const bj = bodies[j];
        if (!this.needBroadphaseCollision(bi, bj)) {
          continue;
        }
        if (!SAPBroadphase.checkBounds(bi, bj, axisIndex)) {
          break;
        }
        this.intersectionTest(bi, bj, p1, p2);
      }
    }
  }
  sortList() {
    const axisList = this.axisList;
    const axisIndex = this.axisIndex;
    const N = axisList.length;
    for (let i = 0; i !== N; i++) {
      const bi = axisList[i];
      if (bi.aabbNeedsUpdate) {
        bi.updateAABB();
      }
    }
    if (axisIndex === 0) {
      SAPBroadphase.insertionSortX(axisList);
    } else if (axisIndex === 1) {
      SAPBroadphase.insertionSortY(axisList);
    } else if (axisIndex === 2) {
      SAPBroadphase.insertionSortZ(axisList);
    }
  }
  autoDetectAxis() {
    let sumX = 0;
    let sumX2 = 0;
    let sumY = 0;
    let sumY2 = 0;
    let sumZ = 0;
    let sumZ2 = 0;
    const bodies = this.axisList;
    const N = bodies.length;
    const invN = 1 / N;
    for (let i = 0; i !== N; i++) {
      const b2 = bodies[i];
      const centerX = b2.position.x;
      sumX += centerX;
      sumX2 += centerX * centerX;
      const centerY = b2.position.y;
      sumY += centerY;
      sumY2 += centerY * centerY;
      const centerZ = b2.position.z;
      sumZ += centerZ;
      sumZ2 += centerZ * centerZ;
    }
    const varianceX = sumX2 - sumX * sumX * invN;
    const varianceY = sumY2 - sumY * sumY * invN;
    const varianceZ = sumZ2 - sumZ * sumZ * invN;
    if (varianceX > varianceY) {
      if (varianceX > varianceZ) {
        this.axisIndex = 0;
      } else {
        this.axisIndex = 2;
      }
    } else if (varianceY > varianceZ) {
      this.axisIndex = 1;
    } else {
      this.axisIndex = 2;
    }
  }
  aabbQuery(world, aabb, result) {
    if (result === void 0) {
      result = [];
    }
    if (this.dirty) {
      this.sortList();
      this.dirty = false;
    }
    const axisIndex = this.axisIndex;
    let axis = "x";
    if (axisIndex === 1) {
      axis = "y";
    }
    if (axisIndex === 2) {
      axis = "z";
    }
    const axisList = this.axisList;
    aabb.lowerBound[axis];
    aabb.upperBound[axis];
    for (let i = 0; i < axisList.length; i++) {
      const b2 = axisList[i];
      if (b2.aabbNeedsUpdate) {
        b2.updateAABB();
      }
      if (b2.aabb.overlaps(aabb)) {
        result.push(b2);
      }
    }
    return result;
  }
}
class Utils {
  static defaults(options, defaults) {
    if (options === void 0) {
      options = {};
    }
    for (let key in defaults) {
      if (!(key in options)) {
        options[key] = defaults[key];
      }
    }
    return options;
  }
}
class Constraint {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    options = Utils.defaults(options, {
      collideConnected: true,
      wakeUpBodies: true
    });
    this.equations = [];
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.id = Constraint.idCounter++;
    this.collideConnected = options.collideConnected;
    if (options.wakeUpBodies) {
      if (bodyA) {
        bodyA.wakeUp();
      }
      if (bodyB) {
        bodyB.wakeUp();
      }
    }
  }
  update() {
    throw new Error("method update() not implmemented in this Constraint subclass!");
  }
  enable() {
    const eqs = this.equations;
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = true;
    }
  }
  disable() {
    const eqs = this.equations;
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = false;
    }
  }
}
Constraint.idCounter = 0;
class JacobianElement {
  constructor() {
    this.spatial = new Vec3();
    this.rotational = new Vec3();
  }
  multiplyElement(element) {
    return element.spatial.dot(this.spatial) + element.rotational.dot(this.rotational);
  }
  multiplyVectors(spatial, rotational) {
    return spatial.dot(this.spatial) + rotational.dot(this.rotational);
  }
}
class Equation {
  constructor(bi, bj, minForce, maxForce) {
    if (minForce === void 0) {
      minForce = -1e6;
    }
    if (maxForce === void 0) {
      maxForce = 1e6;
    }
    this.id = Equation.idCounter++;
    this.minForce = minForce;
    this.maxForce = maxForce;
    this.bi = bi;
    this.bj = bj;
    this.a = 0;
    this.b = 0;
    this.eps = 0;
    this.jacobianElementA = new JacobianElement();
    this.jacobianElementB = new JacobianElement();
    this.enabled = true;
    this.multiplier = 0;
    this.setSpookParams(1e7, 4, 1 / 60);
  }
  setSpookParams(stiffness, relaxation, timeStep) {
    const d = relaxation;
    const k = stiffness;
    const h = timeStep;
    this.a = 4 / (h * (1 + 4 * d));
    this.b = 4 * d / (1 + 4 * d);
    this.eps = 4 / (h * h * k * (1 + 4 * d));
  }
  computeB(a2, b2, h) {
    const GW = this.computeGW();
    const Gq = this.computeGq();
    const GiMf = this.computeGiMf();
    return -Gq * a2 - GW * b2 - GiMf * h;
  }
  computeGq() {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const xi = bi.position;
    const xj = bj.position;
    return GA.spatial.dot(xi) + GB.spatial.dot(xj);
  }
  computeGW() {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const vi = bi.velocity;
    const vj = bj.velocity;
    const wi = bi.angularVelocity;
    const wj = bj.angularVelocity;
    return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj);
  }
  computeGWlambda() {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const vi = bi.vlambda;
    const vj = bj.vlambda;
    const wi = bi.wlambda;
    const wj = bj.wlambda;
    return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj);
  }
  computeGiMf() {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const fi = bi.force;
    const ti = bi.torque;
    const fj = bj.force;
    const tj = bj.torque;
    const invMassi = bi.invMassSolve;
    const invMassj = bj.invMassSolve;
    fi.scale(invMassi, iMfi);
    fj.scale(invMassj, iMfj);
    bi.invInertiaWorldSolve.vmult(ti, invIi_vmult_taui);
    bj.invInertiaWorldSolve.vmult(tj, invIj_vmult_tauj);
    return GA.multiplyVectors(iMfi, invIi_vmult_taui) + GB.multiplyVectors(iMfj, invIj_vmult_tauj);
  }
  computeGiMGt() {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const invMassi = bi.invMassSolve;
    const invMassj = bj.invMassSolve;
    const invIi = bi.invInertiaWorldSolve;
    const invIj = bj.invInertiaWorldSolve;
    let result = invMassi + invMassj;
    invIi.vmult(GA.rotational, tmp);
    result += tmp.dot(GA.rotational);
    invIj.vmult(GB.rotational, tmp);
    result += tmp.dot(GB.rotational);
    return result;
  }
  addToWlambda(deltalambda) {
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const bi = this.bi;
    const bj = this.bj;
    const temp = addToWlambda_temp;
    bi.vlambda.addScaledVector(bi.invMassSolve * deltalambda, GA.spatial, bi.vlambda);
    bj.vlambda.addScaledVector(bj.invMassSolve * deltalambda, GB.spatial, bj.vlambda);
    bi.invInertiaWorldSolve.vmult(GA.rotational, temp);
    bi.wlambda.addScaledVector(deltalambda, temp, bi.wlambda);
    bj.invInertiaWorldSolve.vmult(GB.rotational, temp);
    bj.wlambda.addScaledVector(deltalambda, temp, bj.wlambda);
  }
  computeC() {
    return this.computeGiMGt() + this.eps;
  }
}
Equation.idCounter = 0;
const iMfi = new Vec3();
const iMfj = new Vec3();
const invIi_vmult_taui = new Vec3();
const invIj_vmult_tauj = new Vec3();
const tmp = new Vec3();
const addToWlambda_temp = new Vec3();
class ContactEquation extends Equation {
  constructor(bodyA, bodyB, maxForce) {
    if (maxForce === void 0) {
      maxForce = 1e6;
    }
    super(bodyA, bodyB, 0, maxForce);
    this.restitution = 0;
    this.ri = new Vec3();
    this.rj = new Vec3();
    this.ni = new Vec3();
  }
  computeB(h) {
    const a2 = this.a;
    const b2 = this.b;
    const bi = this.bi;
    const bj = this.bj;
    const ri = this.ri;
    const rj = this.rj;
    const rixn = ContactEquation_computeB_temp1;
    const rjxn = ContactEquation_computeB_temp2;
    const vi = bi.velocity;
    const wi = bi.angularVelocity;
    bi.force;
    bi.torque;
    const vj = bj.velocity;
    const wj = bj.angularVelocity;
    bj.force;
    bj.torque;
    const penetrationVec = ContactEquation_computeB_temp3;
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    const n = this.ni;
    ri.cross(n, rixn);
    rj.cross(n, rjxn);
    n.negate(GA.spatial);
    rixn.negate(GA.rotational);
    GB.spatial.copy(n);
    GB.rotational.copy(rjxn);
    penetrationVec.copy(bj.position);
    penetrationVec.vadd(rj, penetrationVec);
    penetrationVec.vsub(bi.position, penetrationVec);
    penetrationVec.vsub(ri, penetrationVec);
    const g = n.dot(penetrationVec);
    const ePlusOne = this.restitution + 1;
    const GW = ePlusOne * vj.dot(n) - ePlusOne * vi.dot(n) + wj.dot(rjxn) - wi.dot(rixn);
    const GiMf = this.computeGiMf();
    const B = -g * a2 - GW * b2 - h * GiMf;
    return B;
  }
  getImpactVelocityAlongNormal() {
    const vi = ContactEquation_getImpactVelocityAlongNormal_vi;
    const vj = ContactEquation_getImpactVelocityAlongNormal_vj;
    const xi = ContactEquation_getImpactVelocityAlongNormal_xi;
    const xj = ContactEquation_getImpactVelocityAlongNormal_xj;
    const relVel = ContactEquation_getImpactVelocityAlongNormal_relVel;
    this.bi.position.vadd(this.ri, xi);
    this.bj.position.vadd(this.rj, xj);
    this.bi.getVelocityAtWorldPoint(xi, vi);
    this.bj.getVelocityAtWorldPoint(xj, vj);
    vi.vsub(vj, relVel);
    return this.ni.dot(relVel);
  }
}
const ContactEquation_computeB_temp1 = new Vec3();
const ContactEquation_computeB_temp2 = new Vec3();
const ContactEquation_computeB_temp3 = new Vec3();
const ContactEquation_getImpactVelocityAlongNormal_vi = new Vec3();
const ContactEquation_getImpactVelocityAlongNormal_vj = new Vec3();
const ContactEquation_getImpactVelocityAlongNormal_xi = new Vec3();
const ContactEquation_getImpactVelocityAlongNormal_xj = new Vec3();
const ContactEquation_getImpactVelocityAlongNormal_relVel = new Vec3();
class PointToPointConstraint extends Constraint {
  constructor(bodyA, pivotA, bodyB, pivotB, maxForce) {
    if (pivotA === void 0) {
      pivotA = new Vec3();
    }
    if (pivotB === void 0) {
      pivotB = new Vec3();
    }
    if (maxForce === void 0) {
      maxForce = 1e6;
    }
    super(bodyA, bodyB);
    this.pivotA = pivotA.clone();
    this.pivotB = pivotB.clone();
    const x = this.equationX = new ContactEquation(bodyA, bodyB);
    const y = this.equationY = new ContactEquation(bodyA, bodyB);
    const z = this.equationZ = new ContactEquation(bodyA, bodyB);
    this.equations.push(x, y, z);
    x.minForce = y.minForce = z.minForce = -maxForce;
    x.maxForce = y.maxForce = z.maxForce = maxForce;
    x.ni.set(1, 0, 0);
    y.ni.set(0, 1, 0);
    z.ni.set(0, 0, 1);
  }
  update() {
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const x = this.equationX;
    const y = this.equationY;
    const z = this.equationZ;
    bodyA.quaternion.vmult(this.pivotA, x.ri);
    bodyB.quaternion.vmult(this.pivotB, x.rj);
    y.ri.copy(x.ri);
    y.rj.copy(x.rj);
    z.ri.copy(x.ri);
    z.rj.copy(x.rj);
  }
}
class ConeEquation extends Equation {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    const maxForce = typeof options.maxForce !== "undefined" ? options.maxForce : 1e6;
    super(bodyA, bodyB, -maxForce, maxForce);
    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0);
    this.angle = typeof options.angle !== "undefined" ? options.angle : 0;
  }
  computeB(h) {
    const a2 = this.a;
    const b2 = this.b;
    const ni = this.axisA;
    const nj = this.axisB;
    const nixnj = tmpVec1$2;
    const njxni = tmpVec2$2;
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    ni.cross(nj, nixnj);
    nj.cross(ni, njxni);
    GA.rotational.copy(njxni);
    GB.rotational.copy(nixnj);
    const g = Math.cos(this.angle) - ni.dot(nj);
    const GW = this.computeGW();
    const GiMf = this.computeGiMf();
    const B = -g * a2 - GW * b2 - h * GiMf;
    return B;
  }
}
const tmpVec1$2 = new Vec3();
const tmpVec2$2 = new Vec3();
class RotationalEquation extends Equation {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    const maxForce = typeof options.maxForce !== "undefined" ? options.maxForce : 1e6;
    super(bodyA, bodyB, -maxForce, maxForce);
    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0);
    this.maxAngle = Math.PI / 2;
  }
  computeB(h) {
    const a2 = this.a;
    const b2 = this.b;
    const ni = this.axisA;
    const nj = this.axisB;
    const nixnj = tmpVec1$1;
    const njxni = tmpVec2$1;
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    ni.cross(nj, nixnj);
    nj.cross(ni, njxni);
    GA.rotational.copy(njxni);
    GB.rotational.copy(nixnj);
    const g = Math.cos(this.maxAngle) - ni.dot(nj);
    const GW = this.computeGW();
    const GiMf = this.computeGiMf();
    const B = -g * a2 - GW * b2 - h * GiMf;
    return B;
  }
}
const tmpVec1$1 = new Vec3();
const tmpVec2$1 = new Vec3();
class ConeTwistConstraint extends PointToPointConstraint {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    const maxForce = typeof options.maxForce !== "undefined" ? options.maxForce : 1e6;
    const pivotA = options.pivotA ? options.pivotA.clone() : new Vec3();
    const pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();
    super(bodyA, pivotA, bodyB, pivotB, maxForce);
    this.axisA = options.axisA ? options.axisA.clone() : new Vec3();
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3();
    this.collideConnected = !!options.collideConnected;
    this.angle = typeof options.angle !== "undefined" ? options.angle : 0;
    const c2 = this.coneEquation = new ConeEquation(bodyA, bodyB, options);
    const t = this.twistEquation = new RotationalEquation(bodyA, bodyB, options);
    this.twistAngle = typeof options.twistAngle !== "undefined" ? options.twistAngle : 0;
    c2.maxForce = 0;
    c2.minForce = -maxForce;
    t.maxForce = 0;
    t.minForce = -maxForce;
    this.equations.push(c2, t);
  }
  update() {
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const cone = this.coneEquation;
    const twist = this.twistEquation;
    super.update();
    bodyA.vectorToWorldFrame(this.axisA, cone.axisA);
    bodyB.vectorToWorldFrame(this.axisB, cone.axisB);
    this.axisA.tangents(twist.axisA, twist.axisA);
    bodyA.vectorToWorldFrame(twist.axisA, twist.axisA);
    this.axisB.tangents(twist.axisB, twist.axisB);
    bodyB.vectorToWorldFrame(twist.axisB, twist.axisB);
    cone.angle = this.angle;
    twist.maxAngle = this.twistAngle;
  }
}
new Vec3();
new Vec3();
class DistanceConstraint extends Constraint {
  constructor(bodyA, bodyB, distance, maxForce) {
    if (maxForce === void 0) {
      maxForce = 1e6;
    }
    super(bodyA, bodyB);
    if (typeof distance === "undefined") {
      distance = bodyA.position.distanceTo(bodyB.position);
    }
    this.distance = distance;
    const eq = this.distanceEquation = new ContactEquation(bodyA, bodyB);
    this.equations.push(eq);
    eq.minForce = -maxForce;
    eq.maxForce = maxForce;
  }
  update() {
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const eq = this.distanceEquation;
    const halfDist = this.distance * 0.5;
    const normal = eq.ni;
    bodyB.position.vsub(bodyA.position, normal);
    normal.normalize();
    normal.scale(halfDist, eq.ri);
    normal.scale(-halfDist, eq.rj);
  }
}
class LockConstraint extends PointToPointConstraint {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    const maxForce = typeof options.maxForce !== "undefined" ? options.maxForce : 1e6;
    const pivotA = new Vec3();
    const pivotB = new Vec3();
    const halfWay = new Vec3();
    bodyA.position.vadd(bodyB.position, halfWay);
    halfWay.scale(0.5, halfWay);
    bodyB.pointToLocalFrame(halfWay, pivotB);
    bodyA.pointToLocalFrame(halfWay, pivotA);
    super(bodyA, pivotA, bodyB, pivotB, maxForce);
    this.xA = bodyA.vectorToLocalFrame(Vec3.UNIT_X);
    this.xB = bodyB.vectorToLocalFrame(Vec3.UNIT_X);
    this.yA = bodyA.vectorToLocalFrame(Vec3.UNIT_Y);
    this.yB = bodyB.vectorToLocalFrame(Vec3.UNIT_Y);
    this.zA = bodyA.vectorToLocalFrame(Vec3.UNIT_Z);
    this.zB = bodyB.vectorToLocalFrame(Vec3.UNIT_Z);
    const r1 = this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options);
    const r2 = this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options);
    const r3 = this.rotationalEquation3 = new RotationalEquation(bodyA, bodyB, options);
    this.equations.push(r1, r2, r3);
  }
  update() {
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    this.motorEquation;
    const r1 = this.rotationalEquation1;
    const r2 = this.rotationalEquation2;
    const r3 = this.rotationalEquation3;
    super.update();
    bodyA.vectorToWorldFrame(this.xA, r1.axisA);
    bodyB.vectorToWorldFrame(this.yB, r1.axisB);
    bodyA.vectorToWorldFrame(this.yA, r2.axisA);
    bodyB.vectorToWorldFrame(this.zB, r2.axisB);
    bodyA.vectorToWorldFrame(this.zA, r3.axisA);
    bodyB.vectorToWorldFrame(this.xB, r3.axisB);
  }
}
const LockConstraint_update_tmpVec1 = new Vec3();
const LockConstraint_update_tmpVec2 = new Vec3();
class RotationalMotorEquation extends Equation {
  constructor(bodyA, bodyB, maxForce) {
    if (maxForce === void 0) {
      maxForce = 1e6;
    }
    super(bodyA, bodyB, -maxForce, maxForce);
    this.axisA = new Vec3();
    this.axisB = new Vec3();
    this.targetVelocity = 0;
  }
  computeB(h) {
    this.a;
    const b2 = this.b;
    this.bi;
    this.bj;
    const axisA = this.axisA;
    const axisB = this.axisB;
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    GA.rotational.copy(axisA);
    axisB.negate(GB.rotational);
    const GW = this.computeGW() - this.targetVelocity;
    const GiMf = this.computeGiMf();
    const B = -GW * b2 - h * GiMf;
    return B;
  }
}
class HingeConstraint extends PointToPointConstraint {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    const maxForce = typeof options.maxForce !== "undefined" ? options.maxForce : 1e6;
    const pivotA = options.pivotA ? options.pivotA.clone() : new Vec3();
    const pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();
    super(bodyA, pivotA, bodyB, pivotB, maxForce);
    const axisA = this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
    axisA.normalize();
    const axisB = this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1, 0, 0);
    axisB.normalize();
    this.collideConnected = !!options.collideConnected;
    const rotational1 = this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options);
    const rotational2 = this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options);
    const motor = this.motorEquation = new RotationalMotorEquation(bodyA, bodyB, maxForce);
    motor.enabled = false;
    this.equations.push(rotational1, rotational2, motor);
  }
  enableMotor() {
    this.motorEquation.enabled = true;
  }
  disableMotor() {
    this.motorEquation.enabled = false;
  }
  setMotorSpeed(speed) {
    this.motorEquation.targetVelocity = speed;
  }
  setMotorMaxForce(maxForce) {
    this.motorEquation.maxForce = maxForce;
    this.motorEquation.minForce = -maxForce;
  }
  update() {
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const motor = this.motorEquation;
    const r1 = this.rotationalEquation1;
    const r2 = this.rotationalEquation2;
    const worldAxisA = HingeConstraint_update_tmpVec1;
    const worldAxisB = HingeConstraint_update_tmpVec2;
    const axisA = this.axisA;
    const axisB = this.axisB;
    super.update();
    bodyA.quaternion.vmult(axisA, worldAxisA);
    bodyB.quaternion.vmult(axisB, worldAxisB);
    worldAxisA.tangents(r1.axisA, r2.axisA);
    r1.axisB.copy(worldAxisB);
    r2.axisB.copy(worldAxisB);
    if (this.motorEquation.enabled) {
      bodyA.quaternion.vmult(this.axisA, motor.axisA);
      bodyB.quaternion.vmult(this.axisB, motor.axisB);
    }
  }
}
const HingeConstraint_update_tmpVec1 = new Vec3();
const HingeConstraint_update_tmpVec2 = new Vec3();
class FrictionEquation extends Equation {
  constructor(bodyA, bodyB, slipForce) {
    super(bodyA, bodyB, -slipForce, slipForce);
    this.ri = new Vec3();
    this.rj = new Vec3();
    this.t = new Vec3();
  }
  computeB(h) {
    this.a;
    const b2 = this.b;
    this.bi;
    this.bj;
    const ri = this.ri;
    const rj = this.rj;
    const rixt = FrictionEquation_computeB_temp1;
    const rjxt = FrictionEquation_computeB_temp2;
    const t = this.t;
    ri.cross(t, rixt);
    rj.cross(t, rjxt);
    const GA = this.jacobianElementA;
    const GB = this.jacobianElementB;
    t.negate(GA.spatial);
    rixt.negate(GA.rotational);
    GB.spatial.copy(t);
    GB.rotational.copy(rjxt);
    const GW = this.computeGW();
    const GiMf = this.computeGiMf();
    const B = -GW * b2 - h * GiMf;
    return B;
  }
}
const FrictionEquation_computeB_temp1 = new Vec3();
const FrictionEquation_computeB_temp2 = new Vec3();
class ContactMaterial {
  constructor(m1, m2, options) {
    options = Utils.defaults(options, {
      friction: 0.3,
      restitution: 0.3,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e7,
      frictionEquationRelaxation: 3
    });
    this.id = ContactMaterial.idCounter++;
    this.materials = [m1, m2];
    this.friction = options.friction;
    this.restitution = options.restitution;
    this.contactEquationStiffness = options.contactEquationStiffness;
    this.contactEquationRelaxation = options.contactEquationRelaxation;
    this.frictionEquationStiffness = options.frictionEquationStiffness;
    this.frictionEquationRelaxation = options.frictionEquationRelaxation;
  }
}
ContactMaterial.idCounter = 0;
class Material {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    let name = "";
    if (typeof options === "string") {
      name = options;
      options = {};
    }
    this.name = name;
    this.id = Material.idCounter++;
    this.friction = typeof options.friction !== "undefined" ? options.friction : -1;
    this.restitution = typeof options.restitution !== "undefined" ? options.restitution : -1;
  }
}
Material.idCounter = 0;
class Spring {
  constructor(bodyA, bodyB, options) {
    if (options === void 0) {
      options = {};
    }
    this.restLength = typeof options.restLength === "number" ? options.restLength : 1;
    this.stiffness = options.stiffness || 100;
    this.damping = options.damping || 1;
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.localAnchorA = new Vec3();
    this.localAnchorB = new Vec3();
    if (options.localAnchorA) {
      this.localAnchorA.copy(options.localAnchorA);
    }
    if (options.localAnchorB) {
      this.localAnchorB.copy(options.localAnchorB);
    }
    if (options.worldAnchorA) {
      this.setWorldAnchorA(options.worldAnchorA);
    }
    if (options.worldAnchorB) {
      this.setWorldAnchorB(options.worldAnchorB);
    }
  }
  setWorldAnchorA(worldAnchorA) {
    this.bodyA.pointToLocalFrame(worldAnchorA, this.localAnchorA);
  }
  setWorldAnchorB(worldAnchorB) {
    this.bodyB.pointToLocalFrame(worldAnchorB, this.localAnchorB);
  }
  getWorldAnchorA(result) {
    this.bodyA.pointToWorldFrame(this.localAnchorA, result);
  }
  getWorldAnchorB(result) {
    this.bodyB.pointToWorldFrame(this.localAnchorB, result);
  }
  applyForce() {
    const k = this.stiffness;
    const d = this.damping;
    const l = this.restLength;
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const r = applyForce_r;
    const r_unit = applyForce_r_unit;
    const u = applyForce_u;
    const f = applyForce_f;
    const tmp2 = applyForce_tmp;
    const worldAnchorA = applyForce_worldAnchorA;
    const worldAnchorB = applyForce_worldAnchorB;
    const ri = applyForce_ri;
    const rj = applyForce_rj;
    const ri_x_f = applyForce_ri_x_f;
    const rj_x_f = applyForce_rj_x_f;
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);
    worldAnchorA.vsub(bodyA.position, ri);
    worldAnchorB.vsub(bodyB.position, rj);
    worldAnchorB.vsub(worldAnchorA, r);
    const rlen = r.length();
    r_unit.copy(r);
    r_unit.normalize();
    bodyB.velocity.vsub(bodyA.velocity, u);
    bodyB.angularVelocity.cross(rj, tmp2);
    u.vadd(tmp2, u);
    bodyA.angularVelocity.cross(ri, tmp2);
    u.vsub(tmp2, u);
    r_unit.scale(-k * (rlen - l) - d * u.dot(r_unit), f);
    bodyA.force.vsub(f, bodyA.force);
    bodyB.force.vadd(f, bodyB.force);
    ri.cross(f, ri_x_f);
    rj.cross(f, rj_x_f);
    bodyA.torque.vsub(ri_x_f, bodyA.torque);
    bodyB.torque.vadd(rj_x_f, bodyB.torque);
  }
}
const applyForce_r = new Vec3();
const applyForce_r_unit = new Vec3();
const applyForce_u = new Vec3();
const applyForce_f = new Vec3();
const applyForce_worldAnchorA = new Vec3();
const applyForce_worldAnchorB = new Vec3();
const applyForce_ri = new Vec3();
const applyForce_rj = new Vec3();
const applyForce_ri_x_f = new Vec3();
const applyForce_rj_x_f = new Vec3();
const applyForce_tmp = new Vec3();
class WheelInfo {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    options = Utils.defaults(options, {
      chassisConnectionPointLocal: new Vec3(),
      chassisConnectionPointWorld: new Vec3(),
      directionLocal: new Vec3(),
      directionWorld: new Vec3(),
      axleLocal: new Vec3(),
      axleWorld: new Vec3(),
      suspensionRestLength: 1,
      suspensionMaxLength: 2,
      radius: 1,
      suspensionStiffness: 100,
      dampingCompression: 10,
      dampingRelaxation: 10,
      frictionSlip: 10.5,
      forwardAcceleration: 1,
      sideAcceleration: 1,
      steering: 0,
      rotation: 0,
      deltaRotation: 0,
      rollInfluence: 0.01,
      maxSuspensionForce: Number.MAX_VALUE,
      isFrontWheel: true,
      clippedInvContactDotSuspension: 1,
      suspensionRelativeVelocity: 0,
      suspensionForce: 0,
      slipInfo: 0,
      skidInfo: 0,
      suspensionLength: 0,
      maxSuspensionTravel: 1,
      useCustomSlidingRotationalSpeed: false,
      customSlidingRotationalSpeed: -0.1
    });
    this.maxSuspensionTravel = options.maxSuspensionTravel;
    this.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed;
    this.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed;
    this.sliding = false;
    this.chassisConnectionPointLocal = options.chassisConnectionPointLocal.clone();
    this.chassisConnectionPointWorld = options.chassisConnectionPointWorld.clone();
    this.directionLocal = options.directionLocal.clone();
    this.directionWorld = options.directionWorld.clone();
    this.axleLocal = options.axleLocal.clone();
    this.axleWorld = options.axleWorld.clone();
    this.suspensionRestLength = options.suspensionRestLength;
    this.suspensionMaxLength = options.suspensionMaxLength;
    this.radius = options.radius;
    this.suspensionStiffness = options.suspensionStiffness;
    this.dampingCompression = options.dampingCompression;
    this.dampingRelaxation = options.dampingRelaxation;
    this.frictionSlip = options.frictionSlip;
    this.forwardAcceleration = options.forwardAcceleration;
    this.sideAcceleration = options.sideAcceleration;
    this.steering = 0;
    this.rotation = 0;
    this.deltaRotation = 0;
    this.rollInfluence = options.rollInfluence;
    this.maxSuspensionForce = options.maxSuspensionForce;
    this.engineForce = 0;
    this.brake = 0;
    this.isFrontWheel = options.isFrontWheel;
    this.clippedInvContactDotSuspension = 1;
    this.suspensionRelativeVelocity = 0;
    this.suspensionForce = 0;
    this.slipInfo = 0;
    this.skidInfo = 0;
    this.suspensionLength = 0;
    this.sideImpulse = 0;
    this.forwardImpulse = 0;
    this.raycastResult = new RaycastResult();
    this.worldTransform = new Transform();
    this.isInContact = false;
  }
  updateWheel(chassis) {
    const raycastResult = this.raycastResult;
    if (this.isInContact) {
      const project = raycastResult.hitNormalWorld.dot(raycastResult.directionWorld);
      raycastResult.hitPointWorld.vsub(chassis.position, relpos);
      chassis.getVelocityAtWorldPoint(relpos, chassis_velocity_at_contactPoint);
      const projVel = raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint);
      if (project >= -0.1) {
        this.suspensionRelativeVelocity = 0;
        this.clippedInvContactDotSuspension = 1 / 0.1;
      } else {
        const inv = -1 / project;
        this.suspensionRelativeVelocity = projVel * inv;
        this.clippedInvContactDotSuspension = inv;
      }
    } else {
      raycastResult.suspensionLength = this.suspensionRestLength;
      this.suspensionRelativeVelocity = 0;
      raycastResult.directionWorld.scale(-1, raycastResult.hitNormalWorld);
      this.clippedInvContactDotSuspension = 1;
    }
  }
}
const chassis_velocity_at_contactPoint = new Vec3();
const relpos = new Vec3();
class RaycastVehicle {
  constructor(options) {
    this.chassisBody = options.chassisBody;
    this.wheelInfos = [];
    this.sliding = false;
    this.world = null;
    this.indexRightAxis = typeof options.indexRightAxis !== "undefined" ? options.indexRightAxis : 2;
    this.indexForwardAxis = typeof options.indexForwardAxis !== "undefined" ? options.indexForwardAxis : 0;
    this.indexUpAxis = typeof options.indexUpAxis !== "undefined" ? options.indexUpAxis : 1;
    this.constraints = [];
    this.preStepCallback = () => {
    };
    this.currentVehicleSpeedKmHour = 0;
    this.numWheelsOnGround = 0;
  }
  addWheel(options) {
    if (options === void 0) {
      options = {};
    }
    const info = new WheelInfo(options);
    const index = this.wheelInfos.length;
    this.wheelInfos.push(info);
    return index;
  }
  setSteeringValue(value, wheelIndex) {
    const wheel = this.wheelInfos[wheelIndex];
    wheel.steering = value;
  }
  applyEngineForce(value, wheelIndex) {
    this.wheelInfos[wheelIndex].engineForce = value;
  }
  setBrake(brake, wheelIndex) {
    this.wheelInfos[wheelIndex].brake = brake;
  }
  addToWorld(world) {
    world.addBody(this.chassisBody);
    const that = this;
    this.preStepCallback = () => {
      that.updateVehicle(world.dt);
    };
    world.addEventListener("preStep", this.preStepCallback);
    this.world = world;
  }
  getVehicleAxisWorld(axisIndex, result) {
    result.set(axisIndex === 0 ? 1 : 0, axisIndex === 1 ? 1 : 0, axisIndex === 2 ? 1 : 0);
    this.chassisBody.vectorToWorldFrame(result, result);
  }
  updateVehicle(timeStep) {
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;
    const chassisBody = this.chassisBody;
    for (let i = 0; i < numWheels; i++) {
      this.updateWheelTransform(i);
    }
    this.currentVehicleSpeedKmHour = 3.6 * chassisBody.velocity.length();
    const forwardWorld = new Vec3();
    this.getVehicleAxisWorld(this.indexForwardAxis, forwardWorld);
    if (forwardWorld.dot(chassisBody.velocity) < 0) {
      this.currentVehicleSpeedKmHour *= -1;
    }
    for (let i = 0; i < numWheels; i++) {
      this.castRay(wheelInfos[i]);
    }
    this.updateSuspension(timeStep);
    const impulse = new Vec3();
    const relpos2 = new Vec3();
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      let suspensionForce = wheel.suspensionForce;
      if (suspensionForce > wheel.maxSuspensionForce) {
        suspensionForce = wheel.maxSuspensionForce;
      }
      wheel.raycastResult.hitNormalWorld.scale(suspensionForce * timeStep, impulse);
      wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, relpos2);
      chassisBody.applyImpulse(impulse, relpos2);
    }
    this.updateFriction(timeStep);
    const hitNormalWorldScaledWithProj = new Vec3();
    const fwd = new Vec3();
    const vel = new Vec3();
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      chassisBody.getVelocityAtWorldPoint(wheel.chassisConnectionPointWorld, vel);
      let m = 1;
      switch (this.indexUpAxis) {
        case 1:
          m = -1;
          break;
      }
      if (wheel.isInContact) {
        this.getVehicleAxisWorld(this.indexForwardAxis, fwd);
        const proj = fwd.dot(wheel.raycastResult.hitNormalWorld);
        wheel.raycastResult.hitNormalWorld.scale(proj, hitNormalWorldScaledWithProj);
        fwd.vsub(hitNormalWorldScaledWithProj, fwd);
        const proj2 = fwd.dot(vel);
        wheel.deltaRotation = m * proj2 * timeStep / wheel.radius;
      }
      if ((wheel.sliding || !wheel.isInContact) && wheel.engineForce !== 0 && wheel.useCustomSlidingRotationalSpeed) {
        wheel.deltaRotation = (wheel.engineForce > 0 ? 1 : -1) * wheel.customSlidingRotationalSpeed * timeStep;
      }
      if (Math.abs(wheel.brake) > Math.abs(wheel.engineForce)) {
        wheel.deltaRotation = 0;
      }
      wheel.rotation += wheel.deltaRotation;
      wheel.deltaRotation *= 0.99;
    }
  }
  updateSuspension(deltaTime) {
    const chassisBody = this.chassisBody;
    const chassisMass = chassisBody.mass;
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;
    for (let w_it = 0; w_it < numWheels; w_it++) {
      const wheel = wheelInfos[w_it];
      if (wheel.isInContact) {
        let force;
        const susp_length = wheel.suspensionRestLength;
        const current_length = wheel.suspensionLength;
        const length_diff = susp_length - current_length;
        force = wheel.suspensionStiffness * length_diff * wheel.clippedInvContactDotSuspension;
        const projected_rel_vel = wheel.suspensionRelativeVelocity;
        let susp_damping;
        if (projected_rel_vel < 0) {
          susp_damping = wheel.dampingCompression;
        } else {
          susp_damping = wheel.dampingRelaxation;
        }
        force -= susp_damping * projected_rel_vel;
        wheel.suspensionForce = force * chassisMass;
        if (wheel.suspensionForce < 0) {
          wheel.suspensionForce = 0;
        }
      } else {
        wheel.suspensionForce = 0;
      }
    }
  }
  removeFromWorld(world) {
    this.constraints;
    world.removeBody(this.chassisBody);
    world.removeEventListener("preStep", this.preStepCallback);
    this.world = null;
  }
  castRay(wheel) {
    const rayvector = castRay_rayvector;
    const target = castRay_target;
    this.updateWheelTransformWorld(wheel);
    const chassisBody = this.chassisBody;
    let depth = -1;
    const raylen = wheel.suspensionRestLength + wheel.radius;
    wheel.directionWorld.scale(raylen, rayvector);
    const source = wheel.chassisConnectionPointWorld;
    source.vadd(rayvector, target);
    const raycastResult = wheel.raycastResult;
    raycastResult.reset();
    const oldState = chassisBody.collisionResponse;
    chassisBody.collisionResponse = false;
    this.world.rayTest(source, target, raycastResult);
    chassisBody.collisionResponse = oldState;
    const object = raycastResult.body;
    wheel.raycastResult.groundObject = 0;
    if (object) {
      depth = raycastResult.distance;
      wheel.raycastResult.hitNormalWorld = raycastResult.hitNormalWorld;
      wheel.isInContact = true;
      const hitDistance = raycastResult.distance;
      wheel.suspensionLength = hitDistance - wheel.radius;
      const minSuspensionLength = wheel.suspensionRestLength - wheel.maxSuspensionTravel;
      const maxSuspensionLength = wheel.suspensionRestLength + wheel.maxSuspensionTravel;
      if (wheel.suspensionLength < minSuspensionLength) {
        wheel.suspensionLength = minSuspensionLength;
      }
      if (wheel.suspensionLength > maxSuspensionLength) {
        wheel.suspensionLength = maxSuspensionLength;
        wheel.raycastResult.reset();
      }
      const denominator = wheel.raycastResult.hitNormalWorld.dot(wheel.directionWorld);
      const chassis_velocity_at_contactPoint2 = new Vec3();
      chassisBody.getVelocityAtWorldPoint(wheel.raycastResult.hitPointWorld, chassis_velocity_at_contactPoint2);
      const projVel = wheel.raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint2);
      if (denominator >= -0.1) {
        wheel.suspensionRelativeVelocity = 0;
        wheel.clippedInvContactDotSuspension = 1 / 0.1;
      } else {
        const inv = -1 / denominator;
        wheel.suspensionRelativeVelocity = projVel * inv;
        wheel.clippedInvContactDotSuspension = inv;
      }
    } else {
      wheel.suspensionLength = wheel.suspensionRestLength + 0 * wheel.maxSuspensionTravel;
      wheel.suspensionRelativeVelocity = 0;
      wheel.directionWorld.scale(-1, wheel.raycastResult.hitNormalWorld);
      wheel.clippedInvContactDotSuspension = 1;
    }
    return depth;
  }
  updateWheelTransformWorld(wheel) {
    wheel.isInContact = false;
    const chassisBody = this.chassisBody;
    chassisBody.pointToWorldFrame(wheel.chassisConnectionPointLocal, wheel.chassisConnectionPointWorld);
    chassisBody.vectorToWorldFrame(wheel.directionLocal, wheel.directionWorld);
    chassisBody.vectorToWorldFrame(wheel.axleLocal, wheel.axleWorld);
  }
  updateWheelTransform(wheelIndex) {
    const up = tmpVec4;
    const right = tmpVec5;
    const fwd = tmpVec6;
    const wheel = this.wheelInfos[wheelIndex];
    this.updateWheelTransformWorld(wheel);
    wheel.directionLocal.scale(-1, up);
    right.copy(wheel.axleLocal);
    up.cross(right, fwd);
    fwd.normalize();
    right.normalize();
    const steering = wheel.steering;
    const steeringOrn = new Quaternion();
    steeringOrn.setFromAxisAngle(up, steering);
    const rotatingOrn = new Quaternion();
    rotatingOrn.setFromAxisAngle(right, wheel.rotation);
    const q = wheel.worldTransform.quaternion;
    this.chassisBody.quaternion.mult(steeringOrn, q);
    q.mult(rotatingOrn, q);
    q.normalize();
    const p = wheel.worldTransform.position;
    p.copy(wheel.directionWorld);
    p.scale(wheel.suspensionLength, p);
    p.vadd(wheel.chassisConnectionPointWorld, p);
  }
  getWheelTransformWorld(wheelIndex) {
    return this.wheelInfos[wheelIndex].worldTransform;
  }
  updateFriction(timeStep) {
    const surfNormalWS_scaled_proj = updateFriction_surfNormalWS_scaled_proj;
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;
    const chassisBody = this.chassisBody;
    const forwardWS = updateFriction_forwardWS;
    const axle = updateFriction_axle;
    this.numWheelsOnGround = 0;
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      const groundObject = wheel.raycastResult.body;
      if (groundObject) {
        this.numWheelsOnGround++;
      }
      wheel.sideImpulse = 0;
      wheel.forwardImpulse = 0;
      if (!forwardWS[i]) {
        forwardWS[i] = new Vec3();
      }
      if (!axle[i]) {
        axle[i] = new Vec3();
      }
    }
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      const groundObject = wheel.raycastResult.body;
      if (groundObject) {
        const axlei = axle[i];
        const wheelTrans = this.getWheelTransformWorld(i);
        wheelTrans.vectorToWorldFrame(directions[this.indexRightAxis], axlei);
        const surfNormalWS = wheel.raycastResult.hitNormalWorld;
        const proj = axlei.dot(surfNormalWS);
        surfNormalWS.scale(proj, surfNormalWS_scaled_proj);
        axlei.vsub(surfNormalWS_scaled_proj, axlei);
        axlei.normalize();
        surfNormalWS.cross(axlei, forwardWS[i]);
        forwardWS[i].normalize();
        wheel.sideImpulse = resolveSingleBilateral(chassisBody, wheel.raycastResult.hitPointWorld, groundObject, wheel.raycastResult.hitPointWorld, axlei);
        wheel.sideImpulse *= sideFrictionStiffness2;
      }
    }
    const sideFactor = 1;
    const fwdFactor = 0.5;
    this.sliding = false;
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      const groundObject = wheel.raycastResult.body;
      let rollingFriction = 0;
      wheel.slipInfo = 1;
      if (groundObject) {
        const defaultRollingFrictionImpulse = 0;
        const maxImpulse = wheel.brake ? wheel.brake : defaultRollingFrictionImpulse;
        rollingFriction = calcRollingFriction(chassisBody, groundObject, wheel.raycastResult.hitPointWorld, forwardWS[i], maxImpulse);
        rollingFriction += wheel.engineForce * timeStep;
        const factor = maxImpulse / rollingFriction;
        wheel.slipInfo *= factor;
      }
      wheel.forwardImpulse = 0;
      wheel.skidInfo = 1;
      if (groundObject) {
        wheel.skidInfo = 1;
        const maximp = wheel.suspensionForce * timeStep * wheel.frictionSlip;
        const maximpSide = maximp;
        const maximpSquared = maximp * maximpSide;
        wheel.forwardImpulse = rollingFriction;
        const x = wheel.forwardImpulse * fwdFactor / wheel.forwardAcceleration;
        const y = wheel.sideImpulse * sideFactor / wheel.sideAcceleration;
        const impulseSquared = x * x + y * y;
        wheel.sliding = false;
        if (impulseSquared > maximpSquared) {
          this.sliding = true;
          wheel.sliding = true;
          const factor = maximp / Math.sqrt(impulseSquared);
          wheel.skidInfo *= factor;
        }
      }
    }
    if (this.sliding) {
      for (let i = 0; i < numWheels; i++) {
        const wheel = wheelInfos[i];
        if (wheel.sideImpulse !== 0) {
          if (wheel.skidInfo < 1) {
            wheel.forwardImpulse *= wheel.skidInfo;
            wheel.sideImpulse *= wheel.skidInfo;
          }
        }
      }
    }
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      const rel_pos = new Vec3();
      wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, rel_pos);
      if (wheel.forwardImpulse !== 0) {
        const impulse = new Vec3();
        forwardWS[i].scale(wheel.forwardImpulse, impulse);
        chassisBody.applyImpulse(impulse, rel_pos);
      }
      if (wheel.sideImpulse !== 0) {
        const groundObject = wheel.raycastResult.body;
        const rel_pos2 = new Vec3();
        wheel.raycastResult.hitPointWorld.vsub(groundObject.position, rel_pos2);
        const sideImp = new Vec3();
        axle[i].scale(wheel.sideImpulse, sideImp);
        chassisBody.vectorToLocalFrame(rel_pos, rel_pos);
        rel_pos["xyz"[this.indexUpAxis]] *= wheel.rollInfluence;
        chassisBody.vectorToWorldFrame(rel_pos, rel_pos);
        chassisBody.applyImpulse(sideImp, rel_pos);
        sideImp.scale(-1, sideImp);
        groundObject.applyImpulse(sideImp, rel_pos2);
      }
    }
  }
}
new Vec3();
new Vec3();
new Vec3();
const tmpVec4 = new Vec3();
const tmpVec5 = new Vec3();
const tmpVec6 = new Vec3();
new Ray();
new Vec3();
const castRay_rayvector = new Vec3();
const castRay_target = new Vec3();
const directions = [new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)];
const updateFriction_surfNormalWS_scaled_proj = new Vec3();
const updateFriction_axle = [];
const updateFriction_forwardWS = [];
const sideFrictionStiffness2 = 1;
const calcRollingFriction_vel1 = new Vec3();
const calcRollingFriction_vel2 = new Vec3();
const calcRollingFriction_vel = new Vec3();
function calcRollingFriction(body0, body1, frictionPosWorld, frictionDirectionWorld, maxImpulse) {
  let j1 = 0;
  const contactPosWorld = frictionPosWorld;
  const vel1 = calcRollingFriction_vel1;
  const vel2 = calcRollingFriction_vel2;
  const vel = calcRollingFriction_vel;
  body0.getVelocityAtWorldPoint(contactPosWorld, vel1);
  body1.getVelocityAtWorldPoint(contactPosWorld, vel2);
  vel1.vsub(vel2, vel);
  const vrel = frictionDirectionWorld.dot(vel);
  const denom0 = computeImpulseDenominator(body0, frictionPosWorld, frictionDirectionWorld);
  const denom1 = computeImpulseDenominator(body1, frictionPosWorld, frictionDirectionWorld);
  const relaxation = 1;
  const jacDiagABInv = relaxation / (denom0 + denom1);
  j1 = -vrel * jacDiagABInv;
  if (maxImpulse < j1) {
    j1 = maxImpulse;
  }
  if (j1 < -maxImpulse) {
    j1 = -maxImpulse;
  }
  return j1;
}
const computeImpulseDenominator_r0 = new Vec3();
const computeImpulseDenominator_c0 = new Vec3();
const computeImpulseDenominator_vec = new Vec3();
const computeImpulseDenominator_m = new Vec3();
function computeImpulseDenominator(body, pos, normal) {
  const r0 = computeImpulseDenominator_r0;
  const c0 = computeImpulseDenominator_c0;
  const vec = computeImpulseDenominator_vec;
  const m = computeImpulseDenominator_m;
  pos.vsub(body.position, r0);
  r0.cross(normal, c0);
  body.invInertiaWorld.vmult(c0, m);
  m.cross(r0, vec);
  return body.invMass + normal.dot(vec);
}
const resolveSingleBilateral_vel1 = new Vec3();
const resolveSingleBilateral_vel2 = new Vec3();
const resolveSingleBilateral_vel = new Vec3();
function resolveSingleBilateral(body1, pos1, body2, pos2, normal) {
  const normalLenSqr = normal.lengthSquared();
  if (normalLenSqr > 1.1) {
    return 0;
  }
  const vel1 = resolveSingleBilateral_vel1;
  const vel2 = resolveSingleBilateral_vel2;
  const vel = resolveSingleBilateral_vel;
  body1.getVelocityAtWorldPoint(pos1, vel1);
  body2.getVelocityAtWorldPoint(pos2, vel2);
  vel1.vsub(vel2, vel);
  const rel_vel = normal.dot(vel);
  const contactDamping = 0.2;
  const massTerm = 1 / (body1.invMass + body2.invMass);
  const impulse = -contactDamping * rel_vel * massTerm;
  return impulse;
}
class Sphere extends Shape {
  constructor(radius) {
    super({
      type: Shape.types.SPHERE
    });
    this.radius = radius !== void 0 ? radius : 1;
    if (this.radius < 0) {
      throw new Error("The sphere radius cannot be negative.");
    }
    this.updateBoundingSphereRadius();
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const I = 2 * mass * this.radius * this.radius / 5;
    target.x = I;
    target.y = I;
    target.z = I;
    return target;
  }
  volume() {
    return 4 * Math.PI * Math.pow(this.radius, 3) / 3;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.radius;
  }
  calculateWorldAABB(pos, quat, min, max) {
    const r = this.radius;
    const axes = ["x", "y", "z"];
    for (let i = 0; i < axes.length; i++) {
      const ax = axes[i];
      min[ax] = pos[ax] - r;
      max[ax] = pos[ax] + r;
    }
  }
}
class RigidVehicle {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.wheelBodies = [];
    this.coordinateSystem = typeof options.coordinateSystem !== "undefined" ? options.coordinateSystem.clone() : new Vec3(1, 2, 3);
    if (options.chassisBody) {
      this.chassisBody = options.chassisBody;
    } else {
      this.chassisBody = new Body({
        mass: 1,
        shape: new Box(new Vec3(5, 0.5, 2))
      });
    }
    this.constraints = [];
    this.wheelAxes = [];
    this.wheelForces = [];
  }
  addWheel(options) {
    if (options === void 0) {
      options = {};
    }
    let wheelBody;
    if (options.body) {
      wheelBody = options.body;
    } else {
      wheelBody = new Body({
        mass: 1,
        shape: new Sphere(1.2)
      });
    }
    this.wheelBodies.push(wheelBody);
    this.wheelForces.push(0);
    const position = typeof options.position !== "undefined" ? options.position.clone() : new Vec3();
    const worldPosition = new Vec3();
    this.chassisBody.pointToWorldFrame(position, worldPosition);
    wheelBody.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
    const axis = typeof options.axis !== "undefined" ? options.axis.clone() : new Vec3(0, 0, 1);
    this.wheelAxes.push(axis);
    const hingeConstraint = new HingeConstraint(this.chassisBody, wheelBody, {
      pivotA: position,
      axisA: axis,
      pivotB: Vec3.ZERO,
      axisB: axis,
      collideConnected: false
    });
    this.constraints.push(hingeConstraint);
    return this.wheelBodies.length - 1;
  }
  setSteeringValue(value, wheelIndex) {
    const axis = this.wheelAxes[wheelIndex];
    const c2 = Math.cos(value);
    const s = Math.sin(value);
    const x = axis.x;
    const z = axis.z;
    this.constraints[wheelIndex].axisA.set(-c2 * x + s * z, 0, s * x + c2 * z);
  }
  setMotorSpeed(value, wheelIndex) {
    const hingeConstraint = this.constraints[wheelIndex];
    hingeConstraint.enableMotor();
    hingeConstraint.motorTargetVelocity = value;
  }
  disableMotor(wheelIndex) {
    const hingeConstraint = this.constraints[wheelIndex];
    hingeConstraint.disableMotor();
  }
  setWheelForce(value, wheelIndex) {
    this.wheelForces[wheelIndex] = value;
  }
  applyWheelForce(value, wheelIndex) {
    const axis = this.wheelAxes[wheelIndex];
    const wheelBody = this.wheelBodies[wheelIndex];
    const bodyTorque = wheelBody.torque;
    axis.scale(value, torque);
    wheelBody.vectorToWorldFrame(torque, torque);
    bodyTorque.vadd(torque, bodyTorque);
  }
  addToWorld(world) {
    const constraints = this.constraints;
    const bodies = this.wheelBodies.concat([this.chassisBody]);
    for (let i = 0; i < bodies.length; i++) {
      world.addBody(bodies[i]);
    }
    for (let i = 0; i < constraints.length; i++) {
      world.addConstraint(constraints[i]);
    }
    world.addEventListener("preStep", this._update.bind(this));
  }
  _update() {
    const wheelForces = this.wheelForces;
    for (let i = 0; i < wheelForces.length; i++) {
      this.applyWheelForce(wheelForces[i], i);
    }
  }
  removeFromWorld(world) {
    const constraints = this.constraints;
    const bodies = this.wheelBodies.concat([this.chassisBody]);
    for (let i = 0; i < bodies.length; i++) {
      world.removeBody(bodies[i]);
    }
    for (let i = 0; i < constraints.length; i++) {
      world.removeConstraint(constraints[i]);
    }
  }
  getWheelSpeed(wheelIndex) {
    const axis = this.wheelAxes[wheelIndex];
    const wheelBody = this.wheelBodies[wheelIndex];
    const w = wheelBody.angularVelocity;
    this.chassisBody.vectorToWorldFrame(axis, worldAxis);
    return w.dot(worldAxis);
  }
}
const torque = new Vec3();
const worldAxis = new Vec3();
class SPHSystem {
  constructor() {
    this.particles = [];
    this.density = 1;
    this.smoothingRadius = 1;
    this.speedOfSound = 1;
    this.viscosity = 0.01;
    this.eps = 1e-6;
    this.pressures = [];
    this.densities = [];
    this.neighbors = [];
  }
  add(particle) {
    this.particles.push(particle);
    if (this.neighbors.length < this.particles.length) {
      this.neighbors.push([]);
    }
  }
  remove(particle) {
    const idx = this.particles.indexOf(particle);
    if (idx !== -1) {
      this.particles.splice(idx, 1);
      if (this.neighbors.length > this.particles.length) {
        this.neighbors.pop();
      }
    }
  }
  getNeighbors(particle, neighbors) {
    const N = this.particles.length;
    const id = particle.id;
    const R2 = this.smoothingRadius * this.smoothingRadius;
    const dist = SPHSystem_getNeighbors_dist;
    for (let i = 0; i !== N; i++) {
      const p = this.particles[i];
      p.position.vsub(particle.position, dist);
      if (id !== p.id && dist.lengthSquared() < R2) {
        neighbors.push(p);
      }
    }
  }
  update() {
    const N = this.particles.length;
    const dist = SPHSystem_update_dist;
    const cs = this.speedOfSound;
    const eps = this.eps;
    for (let i = 0; i !== N; i++) {
      const p = this.particles[i];
      const neighbors = this.neighbors[i];
      neighbors.length = 0;
      this.getNeighbors(p, neighbors);
      neighbors.push(this.particles[i]);
      const numNeighbors = neighbors.length;
      let sum = 0;
      for (let j = 0; j !== numNeighbors; j++) {
        p.position.vsub(neighbors[j].position, dist);
        const len = dist.length();
        const weight = this.w(len);
        sum += neighbors[j].mass * weight;
      }
      this.densities[i] = sum;
      this.pressures[i] = cs * cs * (this.densities[i] - this.density);
    }
    const a_pressure = SPHSystem_update_a_pressure;
    const a_visc = SPHSystem_update_a_visc;
    const gradW = SPHSystem_update_gradW;
    const r_vec = SPHSystem_update_r_vec;
    const u = SPHSystem_update_u;
    for (let i = 0; i !== N; i++) {
      const particle = this.particles[i];
      a_pressure.set(0, 0, 0);
      a_visc.set(0, 0, 0);
      let Pij;
      let nabla;
      const neighbors = this.neighbors[i];
      const numNeighbors = neighbors.length;
      for (let j = 0; j !== numNeighbors; j++) {
        const neighbor = neighbors[j];
        particle.position.vsub(neighbor.position, r_vec);
        const r = r_vec.length();
        Pij = -neighbor.mass * (this.pressures[i] / (this.densities[i] * this.densities[i] + eps) + this.pressures[j] / (this.densities[j] * this.densities[j] + eps));
        this.gradw(r_vec, gradW);
        gradW.scale(Pij, gradW);
        a_pressure.vadd(gradW, a_pressure);
        neighbor.velocity.vsub(particle.velocity, u);
        u.scale(1 / (1e-4 + this.densities[i] * this.densities[j]) * this.viscosity * neighbor.mass, u);
        nabla = this.nablaw(r);
        u.scale(nabla, u);
        a_visc.vadd(u, a_visc);
      }
      a_visc.scale(particle.mass, a_visc);
      a_pressure.scale(particle.mass, a_pressure);
      particle.force.vadd(a_visc, particle.force);
      particle.force.vadd(a_pressure, particle.force);
    }
  }
  w(r) {
    const h = this.smoothingRadius;
    return 315 / (64 * Math.PI * h ** 9) * (h * h - r * r) ** 3;
  }
  gradw(rVec, resultVec) {
    const r = rVec.length();
    const h = this.smoothingRadius;
    rVec.scale(945 / (32 * Math.PI * h ** 9) * (h * h - r * r) ** 2, resultVec);
  }
  nablaw(r) {
    const h = this.smoothingRadius;
    const nabla = 945 / (32 * Math.PI * h ** 9) * (h * h - r * r) * (7 * r * r - 3 * h * h);
    return nabla;
  }
}
const SPHSystem_getNeighbors_dist = new Vec3();
const SPHSystem_update_dist = new Vec3();
const SPHSystem_update_a_pressure = new Vec3();
const SPHSystem_update_a_visc = new Vec3();
const SPHSystem_update_gradW = new Vec3();
const SPHSystem_update_r_vec = new Vec3();
const SPHSystem_update_u = new Vec3();
class Cylinder extends ConvexPolyhedron {
  constructor(radiusTop, radiusBottom, height, numSegments) {
    if (radiusTop === void 0) {
      radiusTop = 1;
    }
    if (radiusBottom === void 0) {
      radiusBottom = 1;
    }
    if (height === void 0) {
      height = 1;
    }
    if (numSegments === void 0) {
      numSegments = 8;
    }
    if (radiusTop < 0) {
      throw new Error("The cylinder radiusTop cannot be negative.");
    }
    if (radiusBottom < 0) {
      throw new Error("The cylinder radiusBottom cannot be negative.");
    }
    const N = numSegments;
    const vertices = [];
    const axes = [];
    const faces = [];
    const bottomface = [];
    const topface = [];
    const cos = Math.cos;
    const sin = Math.sin;
    vertices.push(new Vec3(-radiusBottom * sin(0), -height * 0.5, radiusBottom * cos(0)));
    bottomface.push(0);
    vertices.push(new Vec3(-radiusTop * sin(0), height * 0.5, radiusTop * cos(0)));
    topface.push(1);
    for (let i = 0; i < N; i++) {
      const theta = 2 * Math.PI / N * (i + 1);
      const thetaN = 2 * Math.PI / N * (i + 0.5);
      if (i < N - 1) {
        vertices.push(new Vec3(-radiusBottom * sin(theta), -height * 0.5, radiusBottom * cos(theta)));
        bottomface.push(2 * i + 2);
        vertices.push(new Vec3(-radiusTop * sin(theta), height * 0.5, radiusTop * cos(theta)));
        topface.push(2 * i + 3);
        faces.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);
      } else {
        faces.push([2 * i, 2 * i + 1, 1, 0]);
      }
      if (N % 2 === 1 || i < N / 2) {
        axes.push(new Vec3(-sin(thetaN), 0, cos(thetaN)));
      }
    }
    faces.push(bottomface);
    axes.push(new Vec3(0, 1, 0));
    const temp = [];
    for (let i = 0; i < topface.length; i++) {
      temp.push(topface[topface.length - i - 1]);
    }
    faces.push(temp);
    super({
      vertices,
      faces,
      axes
    });
    this.type = Shape.types.CYLINDER;
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
    this.numSegments = numSegments;
  }
}
class Particle extends Shape {
  constructor() {
    super({
      type: Shape.types.PARTICLE
    });
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    target.set(0, 0, 0);
    return target;
  }
  volume() {
    return 0;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = 0;
  }
  calculateWorldAABB(pos, quat, min, max) {
    min.copy(pos);
    max.copy(pos);
  }
}
class Plane extends Shape {
  constructor() {
    super({
      type: Shape.types.PLANE
    });
    this.worldNormal = new Vec3();
    this.worldNormalNeedsUpdate = true;
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
  computeWorldNormal(quat) {
    const n = this.worldNormal;
    n.set(0, 0, 1);
    quat.vmult(n, n);
    this.worldNormalNeedsUpdate = false;
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    return target;
  }
  volume() {
    return Number.MAX_VALUE;
  }
  calculateWorldAABB(pos, quat, min, max) {
    tempNormal.set(0, 0, 1);
    quat.vmult(tempNormal, tempNormal);
    const maxVal = Number.MAX_VALUE;
    min.set(-maxVal, -maxVal, -maxVal);
    max.set(maxVal, maxVal, maxVal);
    if (tempNormal.x === 1) {
      max.x = pos.x;
    } else if (tempNormal.x === -1) {
      min.x = pos.x;
    }
    if (tempNormal.y === 1) {
      max.y = pos.y;
    } else if (tempNormal.y === -1) {
      min.y = pos.y;
    }
    if (tempNormal.z === 1) {
      max.z = pos.z;
    } else if (tempNormal.z === -1) {
      min.z = pos.z;
    }
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
}
const tempNormal = new Vec3();
class Heightfield extends Shape {
  constructor(data, options) {
    if (options === void 0) {
      options = {};
    }
    options = Utils.defaults(options, {
      maxValue: null,
      minValue: null,
      elementSize: 1
    });
    super({
      type: Shape.types.HEIGHTFIELD
    });
    this.data = data;
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.elementSize = options.elementSize;
    if (options.minValue === null) {
      this.updateMinValue();
    }
    if (options.maxValue === null) {
      this.updateMaxValue();
    }
    this.cacheEnabled = true;
    this.pillarConvex = new ConvexPolyhedron();
    this.pillarOffset = new Vec3();
    this.updateBoundingSphereRadius();
    this._cachedPillars = {};
  }
  update() {
    this._cachedPillars = {};
  }
  updateMinValue() {
    const data = this.data;
    let minValue = data[0][0];
    for (let i = 0; i !== data.length; i++) {
      for (let j = 0; j !== data[i].length; j++) {
        const v = data[i][j];
        if (v < minValue) {
          minValue = v;
        }
      }
    }
    this.minValue = minValue;
  }
  updateMaxValue() {
    const data = this.data;
    let maxValue = data[0][0];
    for (let i = 0; i !== data.length; i++) {
      for (let j = 0; j !== data[i].length; j++) {
        const v = data[i][j];
        if (v > maxValue) {
          maxValue = v;
        }
      }
    }
    this.maxValue = maxValue;
  }
  setHeightValueAtIndex(xi, yi, value) {
    const data = this.data;
    data[xi][yi] = value;
    this.clearCachedConvexTrianglePillar(xi, yi, false);
    if (xi > 0) {
      this.clearCachedConvexTrianglePillar(xi - 1, yi, true);
      this.clearCachedConvexTrianglePillar(xi - 1, yi, false);
    }
    if (yi > 0) {
      this.clearCachedConvexTrianglePillar(xi, yi - 1, true);
      this.clearCachedConvexTrianglePillar(xi, yi - 1, false);
    }
    if (yi > 0 && xi > 0) {
      this.clearCachedConvexTrianglePillar(xi - 1, yi - 1, true);
    }
  }
  getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, result) {
    if (result === void 0) {
      result = [];
    }
    const data = this.data;
    let max = this.minValue;
    for (let i = iMinX; i <= iMaxX; i++) {
      for (let j = iMinY; j <= iMaxY; j++) {
        const height = data[i][j];
        if (height > max) {
          max = height;
        }
      }
    }
    result[0] = this.minValue;
    result[1] = max;
  }
  getIndexOfPosition(x, y, result, clamp) {
    const w = this.elementSize;
    const data = this.data;
    let xi = Math.floor(x / w);
    let yi = Math.floor(y / w);
    result[0] = xi;
    result[1] = yi;
    if (clamp) {
      if (xi < 0) {
        xi = 0;
      }
      if (yi < 0) {
        yi = 0;
      }
      if (xi >= data.length - 1) {
        xi = data.length - 1;
      }
      if (yi >= data[0].length - 1) {
        yi = data[0].length - 1;
      }
    }
    if (xi < 0 || yi < 0 || xi >= data.length - 1 || yi >= data[0].length - 1) {
      return false;
    }
    return true;
  }
  getTriangleAt(x, y, edgeClamp, a2, b2, c2) {
    const idx = getHeightAt_idx;
    this.getIndexOfPosition(x, y, idx, edgeClamp);
    let xi = idx[0];
    let yi = idx[1];
    const data = this.data;
    if (edgeClamp) {
      xi = Math.min(data.length - 2, Math.max(0, xi));
      yi = Math.min(data[0].length - 2, Math.max(0, yi));
    }
    const elementSize = this.elementSize;
    const lowerDist2 = (x / elementSize - xi) ** 2 + (y / elementSize - yi) ** 2;
    const upperDist2 = (x / elementSize - (xi + 1)) ** 2 + (y / elementSize - (yi + 1)) ** 2;
    const upper = lowerDist2 > upperDist2;
    this.getTriangle(xi, yi, upper, a2, b2, c2);
    return upper;
  }
  getNormalAt(x, y, edgeClamp, result) {
    const a2 = getNormalAt_a;
    const b2 = getNormalAt_b;
    const c2 = getNormalAt_c;
    const e0 = getNormalAt_e0;
    const e1 = getNormalAt_e1;
    this.getTriangleAt(x, y, edgeClamp, a2, b2, c2);
    b2.vsub(a2, e0);
    c2.vsub(a2, e1);
    e0.cross(e1, result);
    result.normalize();
  }
  getAabbAtIndex(xi, yi, _ref) {
    let {
      lowerBound,
      upperBound
    } = _ref;
    const data = this.data;
    const elementSize = this.elementSize;
    lowerBound.set(xi * elementSize, yi * elementSize, data[xi][yi]);
    upperBound.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]);
  }
  getHeightAt(x, y, edgeClamp) {
    const data = this.data;
    const a2 = getHeightAt_a;
    const b2 = getHeightAt_b;
    const c2 = getHeightAt_c;
    const idx = getHeightAt_idx;
    this.getIndexOfPosition(x, y, idx, edgeClamp);
    let xi = idx[0];
    let yi = idx[1];
    if (edgeClamp) {
      xi = Math.min(data.length - 2, Math.max(0, xi));
      yi = Math.min(data[0].length - 2, Math.max(0, yi));
    }
    const upper = this.getTriangleAt(x, y, edgeClamp, a2, b2, c2);
    barycentricWeights(x, y, a2.x, a2.y, b2.x, b2.y, c2.x, c2.y, getHeightAt_weights);
    const w = getHeightAt_weights;
    if (upper) {
      return data[xi + 1][yi + 1] * w.x + data[xi][yi + 1] * w.y + data[xi + 1][yi] * w.z;
    } else {
      return data[xi][yi] * w.x + data[xi + 1][yi] * w.y + data[xi][yi + 1] * w.z;
    }
  }
  getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle) {
    return `${xi}_${yi}_${getUpperTriangle ? 1 : 0}`;
  }
  getCachedConvexTrianglePillar(xi, yi, getUpperTriangle) {
    return this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
  }
  setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, convex, offset) {
    this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)] = {
      convex,
      offset
    };
  }
  clearCachedConvexTrianglePillar(xi, yi, getUpperTriangle) {
    delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
  }
  getTriangle(xi, yi, upper, a2, b2, c2) {
    const data = this.data;
    const elementSize = this.elementSize;
    if (upper) {
      a2.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]);
      b2.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]);
      c2.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]);
    } else {
      a2.set(xi * elementSize, yi * elementSize, data[xi][yi]);
      b2.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]);
      c2.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]);
    }
  }
  getConvexTrianglePillar(xi, yi, getUpperTriangle) {
    let result = this.pillarConvex;
    let offsetResult = this.pillarOffset;
    if (this.cacheEnabled) {
      const data2 = this.getCachedConvexTrianglePillar(xi, yi, getUpperTriangle);
      if (data2) {
        this.pillarConvex = data2.convex;
        this.pillarOffset = data2.offset;
        return;
      }
      result = new ConvexPolyhedron();
      offsetResult = new Vec3();
      this.pillarConvex = result;
      this.pillarOffset = offsetResult;
    }
    const data = this.data;
    const elementSize = this.elementSize;
    const faces = result.faces;
    result.vertices.length = 6;
    for (let i = 0; i < 6; i++) {
      if (!result.vertices[i]) {
        result.vertices[i] = new Vec3();
      }
    }
    faces.length = 5;
    for (let i = 0; i < 5; i++) {
      if (!faces[i]) {
        faces[i] = [];
      }
    }
    const verts = result.vertices;
    const h = (Math.min(data[xi][yi], data[xi + 1][yi], data[xi][yi + 1], data[xi + 1][yi + 1]) - this.minValue) / 2 + this.minValue;
    if (!getUpperTriangle) {
      offsetResult.set((xi + 0.25) * elementSize, (yi + 0.25) * elementSize, h);
      verts[0].set(-0.25 * elementSize, -0.25 * elementSize, data[xi][yi] - h);
      verts[1].set(0.75 * elementSize, -0.25 * elementSize, data[xi + 1][yi] - h);
      verts[2].set(-0.25 * elementSize, 0.75 * elementSize, data[xi][yi + 1] - h);
      verts[3].set(-0.25 * elementSize, -0.25 * elementSize, -Math.abs(h) - 1);
      verts[4].set(0.75 * elementSize, -0.25 * elementSize, -Math.abs(h) - 1);
      verts[5].set(-0.25 * elementSize, 0.75 * elementSize, -Math.abs(h) - 1);
      faces[0][0] = 0;
      faces[0][1] = 1;
      faces[0][2] = 2;
      faces[1][0] = 5;
      faces[1][1] = 4;
      faces[1][2] = 3;
      faces[2][0] = 0;
      faces[2][1] = 2;
      faces[2][2] = 5;
      faces[2][3] = 3;
      faces[3][0] = 1;
      faces[3][1] = 0;
      faces[3][2] = 3;
      faces[3][3] = 4;
      faces[4][0] = 4;
      faces[4][1] = 5;
      faces[4][2] = 2;
      faces[4][3] = 1;
    } else {
      offsetResult.set((xi + 0.75) * elementSize, (yi + 0.75) * elementSize, h);
      verts[0].set(0.25 * elementSize, 0.25 * elementSize, data[xi + 1][yi + 1] - h);
      verts[1].set(-0.75 * elementSize, 0.25 * elementSize, data[xi][yi + 1] - h);
      verts[2].set(0.25 * elementSize, -0.75 * elementSize, data[xi + 1][yi] - h);
      verts[3].set(0.25 * elementSize, 0.25 * elementSize, -Math.abs(h) - 1);
      verts[4].set(-0.75 * elementSize, 0.25 * elementSize, -Math.abs(h) - 1);
      verts[5].set(0.25 * elementSize, -0.75 * elementSize, -Math.abs(h) - 1);
      faces[0][0] = 0;
      faces[0][1] = 1;
      faces[0][2] = 2;
      faces[1][0] = 5;
      faces[1][1] = 4;
      faces[1][2] = 3;
      faces[2][0] = 2;
      faces[2][1] = 5;
      faces[2][2] = 3;
      faces[2][3] = 0;
      faces[3][0] = 3;
      faces[3][1] = 4;
      faces[3][2] = 1;
      faces[3][3] = 0;
      faces[4][0] = 1;
      faces[4][1] = 4;
      faces[4][2] = 5;
      faces[4][3] = 2;
    }
    result.computeNormals();
    result.computeEdges();
    result.updateBoundingSphereRadius();
    this.setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, result, offsetResult);
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    target.set(0, 0, 0);
    return target;
  }
  volume() {
    return Number.MAX_VALUE;
  }
  calculateWorldAABB(pos, quat, min, max) {
    min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }
  updateBoundingSphereRadius() {
    const data = this.data;
    const s = this.elementSize;
    this.boundingSphereRadius = new Vec3(data.length * s, data[0].length * s, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))).length();
  }
  setHeightsFromImage(image, scale) {
    const {
      x,
      z,
      y
    } = scale;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const matrix = this.data;
    matrix.length = 0;
    this.elementSize = Math.abs(x) / imageData.width;
    for (let i = 0; i < imageData.height; i++) {
      const row = [];
      for (let j = 0; j < imageData.width; j++) {
        const a2 = imageData.data[(i * imageData.height + j) * 4];
        const b2 = imageData.data[(i * imageData.height + j) * 4 + 1];
        const c2 = imageData.data[(i * imageData.height + j) * 4 + 2];
        const height = (a2 + b2 + c2) / 4 / 255 * z;
        if (x < 0) {
          row.push(height);
        } else {
          row.unshift(height);
        }
      }
      if (y < 0) {
        matrix.unshift(row);
      } else {
        matrix.push(row);
      }
    }
    this.updateMaxValue();
    this.updateMinValue();
    this.update();
  }
}
const getHeightAt_idx = [];
const getHeightAt_weights = new Vec3();
const getHeightAt_a = new Vec3();
const getHeightAt_b = new Vec3();
const getHeightAt_c = new Vec3();
const getNormalAt_a = new Vec3();
const getNormalAt_b = new Vec3();
const getNormalAt_c = new Vec3();
const getNormalAt_e0 = new Vec3();
const getNormalAt_e1 = new Vec3();
function barycentricWeights(x, y, ax, ay, bx, by, cx, cy, result) {
  result.x = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy));
  result.y = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy));
  result.z = 1 - result.x - result.y;
}
class OctreeNode {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.root = options.root || null;
    this.aabb = options.aabb ? options.aabb.clone() : new AABB();
    this.data = [];
    this.children = [];
  }
  reset() {
    this.children.length = this.data.length = 0;
  }
  insert(aabb, elementData, level) {
    if (level === void 0) {
      level = 0;
    }
    const nodeData = this.data;
    if (!this.aabb.contains(aabb)) {
      return false;
    }
    const children = this.children;
    const maxDepth = this.maxDepth || this.root.maxDepth;
    if (level < maxDepth) {
      let subdivided = false;
      if (!children.length) {
        this.subdivide();
        subdivided = true;
      }
      for (let i = 0; i !== 8; i++) {
        if (children[i].insert(aabb, elementData, level + 1)) {
          return true;
        }
      }
      if (subdivided) {
        children.length = 0;
      }
    }
    nodeData.push(elementData);
    return true;
  }
  subdivide() {
    const aabb = this.aabb;
    const l = aabb.lowerBound;
    const u = aabb.upperBound;
    const children = this.children;
    children.push(new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(0, 0, 0)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(1, 0, 0)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(1, 1, 0)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(1, 1, 1)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(0, 1, 1)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(0, 0, 1)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(1, 0, 1)
      })
    }), new OctreeNode({
      aabb: new AABB({
        lowerBound: new Vec3(0, 1, 0)
      })
    }));
    u.vsub(l, halfDiagonal);
    halfDiagonal.scale(0.5, halfDiagonal);
    const root = this.root || this;
    for (let i = 0; i !== 8; i++) {
      const child = children[i];
      child.root = root;
      const lowerBound = child.aabb.lowerBound;
      lowerBound.x *= halfDiagonal.x;
      lowerBound.y *= halfDiagonal.y;
      lowerBound.z *= halfDiagonal.z;
      lowerBound.vadd(l, lowerBound);
      lowerBound.vadd(halfDiagonal, child.aabb.upperBound);
    }
  }
  aabbQuery(aabb, result) {
    this.data;
    this.children;
    const queue2 = [this];
    while (queue2.length) {
      const node = queue2.pop();
      if (node.aabb.overlaps(aabb)) {
        Array.prototype.push.apply(result, node.data);
      }
      Array.prototype.push.apply(queue2, node.children);
    }
    return result;
  }
  rayQuery(ray, treeTransform, result) {
    ray.getAABB(tmpAABB);
    tmpAABB.toLocalFrame(treeTransform, tmpAABB);
    this.aabbQuery(tmpAABB, result);
    return result;
  }
  removeEmptyNodes() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.children[i].removeEmptyNodes();
      if (!this.children[i].children.length && !this.children[i].data.length) {
        this.children.splice(i, 1);
      }
    }
  }
}
class Octree extends OctreeNode {
  constructor(aabb, options) {
    if (options === void 0) {
      options = {};
    }
    super({
      root: null,
      aabb
    });
    this.maxDepth = typeof options.maxDepth !== "undefined" ? options.maxDepth : 8;
  }
}
const halfDiagonal = new Vec3();
const tmpAABB = new AABB();
class Trimesh extends Shape {
  constructor(vertices, indices) {
    super({
      type: Shape.types.TRIMESH
    });
    this.vertices = new Float32Array(vertices);
    this.indices = new Int16Array(indices);
    this.normals = new Float32Array(indices.length);
    this.aabb = new AABB();
    this.edges = null;
    this.scale = new Vec3(1, 1, 1);
    this.tree = new Octree();
    this.updateEdges();
    this.updateNormals();
    this.updateAABB();
    this.updateBoundingSphereRadius();
    this.updateTree();
  }
  updateTree() {
    const tree = this.tree;
    tree.reset();
    tree.aabb.copy(this.aabb);
    const scale = this.scale;
    tree.aabb.lowerBound.x *= 1 / scale.x;
    tree.aabb.lowerBound.y *= 1 / scale.y;
    tree.aabb.lowerBound.z *= 1 / scale.z;
    tree.aabb.upperBound.x *= 1 / scale.x;
    tree.aabb.upperBound.y *= 1 / scale.y;
    tree.aabb.upperBound.z *= 1 / scale.z;
    const triangleAABB = new AABB();
    const a2 = new Vec3();
    const b2 = new Vec3();
    const c2 = new Vec3();
    const points = [a2, b2, c2];
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      this._getUnscaledVertex(this.indices[i3], a2);
      this._getUnscaledVertex(this.indices[i3 + 1], b2);
      this._getUnscaledVertex(this.indices[i3 + 2], c2);
      triangleAABB.setFromPoints(points);
      tree.insert(triangleAABB, i);
    }
    tree.removeEmptyNodes();
  }
  getTrianglesInAABB(aabb, result) {
    unscaledAABB.copy(aabb);
    const scale = this.scale;
    const isx = scale.x;
    const isy = scale.y;
    const isz = scale.z;
    const l = unscaledAABB.lowerBound;
    const u = unscaledAABB.upperBound;
    l.x /= isx;
    l.y /= isy;
    l.z /= isz;
    u.x /= isx;
    u.y /= isy;
    u.z /= isz;
    return this.tree.aabbQuery(unscaledAABB, result);
  }
  setScale(scale) {
    const wasUniform = this.scale.x === this.scale.y && this.scale.y === this.scale.z;
    const isUniform = scale.x === scale.y && scale.y === scale.z;
    if (!(wasUniform && isUniform)) {
      this.updateNormals();
    }
    this.scale.copy(scale);
    this.updateAABB();
    this.updateBoundingSphereRadius();
  }
  updateNormals() {
    const n = computeNormals_n;
    const normals = this.normals;
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      const a2 = this.indices[i3];
      const b2 = this.indices[i3 + 1];
      const c2 = this.indices[i3 + 2];
      this.getVertex(a2, va);
      this.getVertex(b2, vb);
      this.getVertex(c2, vc);
      Trimesh.computeNormal(vb, va, vc, n);
      normals[i3] = n.x;
      normals[i3 + 1] = n.y;
      normals[i3 + 2] = n.z;
    }
  }
  updateEdges() {
    const edges = {};
    const add = (a2, b2) => {
      const key = a2 < b2 ? `${a2}_${b2}` : `${b2}_${a2}`;
      edges[key] = true;
    };
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      const a2 = this.indices[i3];
      const b2 = this.indices[i3 + 1];
      const c2 = this.indices[i3 + 2];
      add(a2, b2);
      add(b2, c2);
      add(c2, a2);
    }
    const keys = Object.keys(edges);
    this.edges = new Int16Array(keys.length * 2);
    for (let i = 0; i < keys.length; i++) {
      const indices = keys[i].split("_");
      this.edges[2 * i] = parseInt(indices[0], 10);
      this.edges[2 * i + 1] = parseInt(indices[1], 10);
    }
  }
  getEdgeVertex(edgeIndex, firstOrSecond, vertexStore) {
    const vertexIndex = this.edges[edgeIndex * 2 + (firstOrSecond ? 1 : 0)];
    this.getVertex(vertexIndex, vertexStore);
  }
  getEdgeVector(edgeIndex, vectorStore) {
    const va2 = getEdgeVector_va;
    const vb2 = getEdgeVector_vb;
    this.getEdgeVertex(edgeIndex, 0, va2);
    this.getEdgeVertex(edgeIndex, 1, vb2);
    vb2.vsub(va2, vectorStore);
  }
  static computeNormal(va2, vb2, vc2, target) {
    vb2.vsub(va2, ab);
    vc2.vsub(vb2, cb);
    cb.cross(ab, target);
    if (!target.isZero()) {
      target.normalize();
    }
  }
  getVertex(i, out) {
    const scale = this.scale;
    this._getUnscaledVertex(i, out);
    out.x *= scale.x;
    out.y *= scale.y;
    out.z *= scale.z;
    return out;
  }
  _getUnscaledVertex(i, out) {
    const i3 = i * 3;
    const vertices = this.vertices;
    return out.set(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);
  }
  getWorldVertex(i, pos, quat, out) {
    this.getVertex(i, out);
    Transform.pointToWorldFrame(pos, quat, out, out);
    return out;
  }
  getTriangleVertices(i, a2, b2, c2) {
    const i3 = i * 3;
    this.getVertex(this.indices[i3], a2);
    this.getVertex(this.indices[i3 + 1], b2);
    this.getVertex(this.indices[i3 + 2], c2);
  }
  getNormal(i, target) {
    const i3 = i * 3;
    return target.set(this.normals[i3], this.normals[i3 + 1], this.normals[i3 + 2]);
  }
  calculateLocalInertia(mass, target) {
    this.computeLocalAABB(cli_aabb);
    const x = cli_aabb.upperBound.x - cli_aabb.lowerBound.x;
    const y = cli_aabb.upperBound.y - cli_aabb.lowerBound.y;
    const z = cli_aabb.upperBound.z - cli_aabb.lowerBound.z;
    return target.set(1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z), 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z), 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x));
  }
  computeLocalAABB(aabb) {
    const l = aabb.lowerBound;
    const u = aabb.upperBound;
    const n = this.vertices.length;
    this.vertices;
    const v = computeLocalAABB_worldVert;
    this.getVertex(0, v);
    l.copy(v);
    u.copy(v);
    for (let i = 0; i !== n; i++) {
      this.getVertex(i, v);
      if (v.x < l.x) {
        l.x = v.x;
      } else if (v.x > u.x) {
        u.x = v.x;
      }
      if (v.y < l.y) {
        l.y = v.y;
      } else if (v.y > u.y) {
        u.y = v.y;
      }
      if (v.z < l.z) {
        l.z = v.z;
      } else if (v.z > u.z) {
        u.z = v.z;
      }
    }
  }
  updateAABB() {
    this.computeLocalAABB(this.aabb);
  }
  updateBoundingSphereRadius() {
    let max2 = 0;
    const vertices = this.vertices;
    const v = new Vec3();
    for (let i = 0, N = vertices.length / 3; i !== N; i++) {
      this.getVertex(i, v);
      const norm2 = v.lengthSquared();
      if (norm2 > max2) {
        max2 = norm2;
      }
    }
    this.boundingSphereRadius = Math.sqrt(max2);
  }
  calculateWorldAABB(pos, quat, min, max) {
    const frame = calculateWorldAABB_frame;
    const result = calculateWorldAABB_aabb;
    frame.position = pos;
    frame.quaternion = quat;
    this.aabb.toWorldFrame(frame, result);
    min.copy(result.lowerBound);
    max.copy(result.upperBound);
  }
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  static createTorus(radius, tube, radialSegments, tubularSegments, arc) {
    if (radius === void 0) {
      radius = 1;
    }
    if (tube === void 0) {
      tube = 0.5;
    }
    if (radialSegments === void 0) {
      radialSegments = 8;
    }
    if (tubularSegments === void 0) {
      tubularSegments = 6;
    }
    if (arc === void 0) {
      arc = Math.PI * 2;
    }
    const vertices = [];
    const indices = [];
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * arc;
        const v = j / radialSegments * Math.PI * 2;
        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v);
        vertices.push(x, y, z);
      }
    }
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a2 = (tubularSegments + 1) * j + i - 1;
        const b2 = (tubularSegments + 1) * (j - 1) + i - 1;
        const c2 = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;
        indices.push(a2, b2, d);
        indices.push(b2, c2, d);
      }
    }
    return new Trimesh(vertices, indices);
  }
}
const computeNormals_n = new Vec3();
const unscaledAABB = new AABB();
const getEdgeVector_va = new Vec3();
const getEdgeVector_vb = new Vec3();
const cb = new Vec3();
const ab = new Vec3();
const va = new Vec3();
const vb = new Vec3();
const vc = new Vec3();
const cli_aabb = new AABB();
const computeLocalAABB_worldVert = new Vec3();
const calculateWorldAABB_frame = new Transform();
const calculateWorldAABB_aabb = new AABB();
class Solver {
  constructor() {
    this.equations = [];
  }
  solve(dt, world) {
    return 0;
  }
  addEquation(eq) {
    if (eq.enabled && !eq.bi.isTrigger && !eq.bj.isTrigger) {
      this.equations.push(eq);
    }
  }
  removeEquation(eq) {
    const eqs = this.equations;
    const i = eqs.indexOf(eq);
    if (i !== -1) {
      eqs.splice(i, 1);
    }
  }
  removeAllEquations() {
    this.equations.length = 0;
  }
}
class GSSolver extends Solver {
  constructor() {
    super();
    this.iterations = 10;
    this.tolerance = 1e-7;
  }
  solve(dt, world) {
    let iter = 0;
    const maxIter = this.iterations;
    const tolSquared = this.tolerance * this.tolerance;
    const equations = this.equations;
    const Neq = equations.length;
    const bodies = world.bodies;
    const Nbodies = bodies.length;
    const h = dt;
    let B;
    let invC;
    let deltalambda;
    let deltalambdaTot;
    let GWlambda;
    let lambdaj;
    if (Neq !== 0) {
      for (let i = 0; i !== Nbodies; i++) {
        bodies[i].updateSolveMassProperties();
      }
    }
    const invCs = GSSolver_solve_invCs;
    const Bs = GSSolver_solve_Bs;
    const lambda = GSSolver_solve_lambda;
    invCs.length = Neq;
    Bs.length = Neq;
    lambda.length = Neq;
    for (let i = 0; i !== Neq; i++) {
      const c2 = equations[i];
      lambda[i] = 0;
      Bs[i] = c2.computeB(h);
      invCs[i] = 1 / c2.computeC();
    }
    if (Neq !== 0) {
      for (let i = 0; i !== Nbodies; i++) {
        const b2 = bodies[i];
        const vlambda = b2.vlambda;
        const wlambda = b2.wlambda;
        vlambda.set(0, 0, 0);
        wlambda.set(0, 0, 0);
      }
      for (iter = 0; iter !== maxIter; iter++) {
        deltalambdaTot = 0;
        for (let j = 0; j !== Neq; j++) {
          const c2 = equations[j];
          B = Bs[j];
          invC = invCs[j];
          lambdaj = lambda[j];
          GWlambda = c2.computeGWlambda();
          deltalambda = invC * (B - GWlambda - c2.eps * lambdaj);
          if (lambdaj + deltalambda < c2.minForce) {
            deltalambda = c2.minForce - lambdaj;
          } else if (lambdaj + deltalambda > c2.maxForce) {
            deltalambda = c2.maxForce - lambdaj;
          }
          lambda[j] += deltalambda;
          deltalambdaTot += deltalambda > 0 ? deltalambda : -deltalambda;
          c2.addToWlambda(deltalambda);
        }
        if (deltalambdaTot * deltalambdaTot < tolSquared) {
          break;
        }
      }
      for (let i = 0; i !== Nbodies; i++) {
        const b2 = bodies[i];
        const v = b2.velocity;
        const w = b2.angularVelocity;
        b2.vlambda.vmul(b2.linearFactor, b2.vlambda);
        v.vadd(b2.vlambda, v);
        b2.wlambda.vmul(b2.angularFactor, b2.wlambda);
        w.vadd(b2.wlambda, w);
      }
      let l = equations.length;
      const invDt = 1 / h;
      while (l--) {
        equations[l].multiplier = lambda[l] * invDt;
      }
    }
    return iter;
  }
}
const GSSolver_solve_lambda = [];
const GSSolver_solve_invCs = [];
const GSSolver_solve_Bs = [];
class SplitSolver extends Solver {
  constructor(subsolver) {
    super();
    this.iterations = 10;
    this.tolerance = 1e-7;
    this.subsolver = subsolver;
    this.nodes = [];
    this.nodePool = [];
    while (this.nodePool.length < 128) {
      this.nodePool.push(this.createNode());
    }
  }
  createNode() {
    return {
      body: null,
      children: [],
      eqs: [],
      visited: false
    };
  }
  solve(dt, world) {
    const nodes = SplitSolver_solve_nodes;
    const nodePool = this.nodePool;
    const bodies = world.bodies;
    const equations = this.equations;
    const Neq = equations.length;
    const Nbodies = bodies.length;
    const subsolver = this.subsolver;
    while (nodePool.length < Nbodies) {
      nodePool.push(this.createNode());
    }
    nodes.length = Nbodies;
    for (let i = 0; i < Nbodies; i++) {
      nodes[i] = nodePool[i];
    }
    for (let i = 0; i !== Nbodies; i++) {
      const node = nodes[i];
      node.body = bodies[i];
      node.children.length = 0;
      node.eqs.length = 0;
      node.visited = false;
    }
    for (let k = 0; k !== Neq; k++) {
      const eq = equations[k];
      const i = bodies.indexOf(eq.bi);
      const j = bodies.indexOf(eq.bj);
      const ni = nodes[i];
      const nj = nodes[j];
      ni.children.push(nj);
      ni.eqs.push(eq);
      nj.children.push(ni);
      nj.eqs.push(eq);
    }
    let child;
    let n = 0;
    let eqs = SplitSolver_solve_eqs;
    subsolver.tolerance = this.tolerance;
    subsolver.iterations = this.iterations;
    const dummyWorld = SplitSolver_solve_dummyWorld;
    while (child = getUnvisitedNode(nodes)) {
      eqs.length = 0;
      dummyWorld.bodies.length = 0;
      bfs(child, visitFunc, dummyWorld.bodies, eqs);
      const Neqs = eqs.length;
      eqs = eqs.sort(sortById);
      for (let i = 0; i !== Neqs; i++) {
        subsolver.addEquation(eqs[i]);
      }
      subsolver.solve(dt, dummyWorld);
      subsolver.removeAllEquations();
      n++;
    }
    return n;
  }
}
const SplitSolver_solve_nodes = [];
const SplitSolver_solve_eqs = [];
const SplitSolver_solve_dummyWorld = {
  bodies: []
};
const STATIC = Body.STATIC;
function getUnvisitedNode(nodes) {
  const Nnodes = nodes.length;
  for (let i = 0; i !== Nnodes; i++) {
    const node = nodes[i];
    if (!node.visited && !(node.body.type & STATIC)) {
      return node;
    }
  }
  return false;
}
const queue = [];
function bfs(root, visitFunc2, bds, eqs) {
  queue.push(root);
  root.visited = true;
  visitFunc2(root, bds, eqs);
  while (queue.length) {
    const node = queue.pop();
    let child;
    while (child = getUnvisitedNode(node.children)) {
      child.visited = true;
      visitFunc2(child, bds, eqs);
      queue.push(child);
    }
  }
}
function visitFunc(node, bds, eqs) {
  bds.push(node.body);
  const Neqs = node.eqs.length;
  for (let i = 0; i !== Neqs; i++) {
    const eq = node.eqs[i];
    if (!eqs.includes(eq)) {
      eqs.push(eq);
    }
  }
}
function sortById(a2, b2) {
  return b2.id - a2.id;
}
class Pool {
  constructor() {
    this.objects = [];
    this.type = Object;
  }
  release() {
    const Nargs = arguments.length;
    for (let i = 0; i !== Nargs; i++) {
      this.objects.push(i < 0 || arguments.length <= i ? void 0 : arguments[i]);
    }
    return this;
  }
  get() {
    if (this.objects.length === 0) {
      return this.constructObject();
    } else {
      return this.objects.pop();
    }
  }
  constructObject() {
    throw new Error("constructObject() not implemented in this Pool subclass yet!");
  }
  resize(size) {
    const objects = this.objects;
    while (objects.length > size) {
      objects.pop();
    }
    while (objects.length < size) {
      objects.push(this.constructObject());
    }
    return this;
  }
}
class Vec3Pool extends Pool {
  constructor() {
    super(...arguments);
    this.type = Vec3;
  }
  constructObject() {
    return new Vec3();
  }
}
const COLLISION_TYPES = {
  sphereSphere: Shape.types.SPHERE,
  spherePlane: Shape.types.SPHERE | Shape.types.PLANE,
  boxBox: Shape.types.BOX | Shape.types.BOX,
  sphereBox: Shape.types.SPHERE | Shape.types.BOX,
  planeBox: Shape.types.PLANE | Shape.types.BOX,
  convexConvex: Shape.types.CONVEXPOLYHEDRON,
  sphereConvex: Shape.types.SPHERE | Shape.types.CONVEXPOLYHEDRON,
  planeConvex: Shape.types.PLANE | Shape.types.CONVEXPOLYHEDRON,
  boxConvex: Shape.types.BOX | Shape.types.CONVEXPOLYHEDRON,
  sphereHeightfield: Shape.types.SPHERE | Shape.types.HEIGHTFIELD,
  boxHeightfield: Shape.types.BOX | Shape.types.HEIGHTFIELD,
  convexHeightfield: Shape.types.CONVEXPOLYHEDRON | Shape.types.HEIGHTFIELD,
  sphereParticle: Shape.types.PARTICLE | Shape.types.SPHERE,
  planeParticle: Shape.types.PLANE | Shape.types.PARTICLE,
  boxParticle: Shape.types.BOX | Shape.types.PARTICLE,
  convexParticle: Shape.types.PARTICLE | Shape.types.CONVEXPOLYHEDRON,
  cylinderCylinder: Shape.types.CYLINDER,
  sphereCylinder: Shape.types.SPHERE | Shape.types.CYLINDER,
  planeCylinder: Shape.types.PLANE | Shape.types.CYLINDER,
  boxCylinder: Shape.types.BOX | Shape.types.CYLINDER,
  convexCylinder: Shape.types.CONVEXPOLYHEDRON | Shape.types.CYLINDER,
  heightfieldCylinder: Shape.types.HEIGHTFIELD | Shape.types.CYLINDER,
  particleCylinder: Shape.types.PARTICLE | Shape.types.CYLINDER,
  sphereTrimesh: Shape.types.SPHERE | Shape.types.TRIMESH,
  planeTrimesh: Shape.types.PLANE | Shape.types.TRIMESH
};
class Narrowphase {
  get [COLLISION_TYPES.sphereSphere]() {
    return this.sphereSphere;
  }
  get [COLLISION_TYPES.spherePlane]() {
    return this.spherePlane;
  }
  get [COLLISION_TYPES.boxBox]() {
    return this.boxBox;
  }
  get [COLLISION_TYPES.sphereBox]() {
    return this.sphereBox;
  }
  get [COLLISION_TYPES.planeBox]() {
    return this.planeBox;
  }
  get [COLLISION_TYPES.convexConvex]() {
    return this.convexConvex;
  }
  get [COLLISION_TYPES.sphereConvex]() {
    return this.sphereConvex;
  }
  get [COLLISION_TYPES.planeConvex]() {
    return this.planeConvex;
  }
  get [COLLISION_TYPES.boxConvex]() {
    return this.boxConvex;
  }
  get [COLLISION_TYPES.sphereHeightfield]() {
    return this.sphereHeightfield;
  }
  get [COLLISION_TYPES.boxHeightfield]() {
    return this.boxHeightfield;
  }
  get [COLLISION_TYPES.convexHeightfield]() {
    return this.convexHeightfield;
  }
  get [COLLISION_TYPES.sphereParticle]() {
    return this.sphereParticle;
  }
  get [COLLISION_TYPES.planeParticle]() {
    return this.planeParticle;
  }
  get [COLLISION_TYPES.boxParticle]() {
    return this.boxParticle;
  }
  get [COLLISION_TYPES.convexParticle]() {
    return this.convexParticle;
  }
  get [COLLISION_TYPES.cylinderCylinder]() {
    return this.convexConvex;
  }
  get [COLLISION_TYPES.sphereCylinder]() {
    return this.sphereConvex;
  }
  get [COLLISION_TYPES.planeCylinder]() {
    return this.planeConvex;
  }
  get [COLLISION_TYPES.boxCylinder]() {
    return this.boxConvex;
  }
  get [COLLISION_TYPES.convexCylinder]() {
    return this.convexConvex;
  }
  get [COLLISION_TYPES.heightfieldCylinder]() {
    return this.heightfieldCylinder;
  }
  get [COLLISION_TYPES.particleCylinder]() {
    return this.particleCylinder;
  }
  get [COLLISION_TYPES.sphereTrimesh]() {
    return this.sphereTrimesh;
  }
  get [COLLISION_TYPES.planeTrimesh]() {
    return this.planeTrimesh;
  }
  constructor(world) {
    this.contactPointPool = [];
    this.frictionEquationPool = [];
    this.result = [];
    this.frictionResult = [];
    this.v3pool = new Vec3Pool();
    this.world = world;
    this.currentContactMaterial = world.defaultContactMaterial;
    this.enableFrictionReduction = false;
  }
  createContactEquation(bi, bj, si, sj, overrideShapeA, overrideShapeB) {
    let c2;
    if (this.contactPointPool.length) {
      c2 = this.contactPointPool.pop();
      c2.bi = bi;
      c2.bj = bj;
    } else {
      c2 = new ContactEquation(bi, bj);
    }
    c2.enabled = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;
    const cm = this.currentContactMaterial;
    c2.restitution = cm.restitution;
    c2.setSpookParams(cm.contactEquationStiffness, cm.contactEquationRelaxation, this.world.dt);
    const matA = si.material || bi.material;
    const matB = sj.material || bj.material;
    if (matA && matB && matA.restitution >= 0 && matB.restitution >= 0) {
      c2.restitution = matA.restitution * matB.restitution;
    }
    c2.si = overrideShapeA || si;
    c2.sj = overrideShapeB || sj;
    return c2;
  }
  createFrictionEquationsFromContact(contactEquation, outArray) {
    const bodyA = contactEquation.bi;
    const bodyB = contactEquation.bj;
    const shapeA = contactEquation.si;
    const shapeB = contactEquation.sj;
    const world = this.world;
    const cm = this.currentContactMaterial;
    let friction = cm.friction;
    const matA = shapeA.material || bodyA.material;
    const matB = shapeB.material || bodyB.material;
    if (matA && matB && matA.friction >= 0 && matB.friction >= 0) {
      friction = matA.friction * matB.friction;
    }
    if (friction > 0) {
      const mug = friction * (world.frictionGravity || world.gravity).length();
      let reducedMass = bodyA.invMass + bodyB.invMass;
      if (reducedMass > 0) {
        reducedMass = 1 / reducedMass;
      }
      const pool = this.frictionEquationPool;
      const c1 = pool.length ? pool.pop() : new FrictionEquation(bodyA, bodyB, mug * reducedMass);
      const c2 = pool.length ? pool.pop() : new FrictionEquation(bodyA, bodyB, mug * reducedMass);
      c1.bi = c2.bi = bodyA;
      c1.bj = c2.bj = bodyB;
      c1.minForce = c2.minForce = -mug * reducedMass;
      c1.maxForce = c2.maxForce = mug * reducedMass;
      c1.ri.copy(contactEquation.ri);
      c1.rj.copy(contactEquation.rj);
      c2.ri.copy(contactEquation.ri);
      c2.rj.copy(contactEquation.rj);
      contactEquation.ni.tangents(c1.t, c2.t);
      c1.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt);
      c2.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt);
      c1.enabled = c2.enabled = contactEquation.enabled;
      outArray.push(c1, c2);
      return true;
    }
    return false;
  }
  createFrictionFromAverage(numContacts) {
    let c2 = this.result[this.result.length - 1];
    if (!this.createFrictionEquationsFromContact(c2, this.frictionResult) || numContacts === 1) {
      return;
    }
    const f1 = this.frictionResult[this.frictionResult.length - 2];
    const f2 = this.frictionResult[this.frictionResult.length - 1];
    averageNormal.setZero();
    averageContactPointA.setZero();
    averageContactPointB.setZero();
    const bodyA = c2.bi;
    c2.bj;
    for (let i = 0; i !== numContacts; i++) {
      c2 = this.result[this.result.length - 1 - i];
      if (c2.bi !== bodyA) {
        averageNormal.vadd(c2.ni, averageNormal);
        averageContactPointA.vadd(c2.ri, averageContactPointA);
        averageContactPointB.vadd(c2.rj, averageContactPointB);
      } else {
        averageNormal.vsub(c2.ni, averageNormal);
        averageContactPointA.vadd(c2.rj, averageContactPointA);
        averageContactPointB.vadd(c2.ri, averageContactPointB);
      }
    }
    const invNumContacts = 1 / numContacts;
    averageContactPointA.scale(invNumContacts, f1.ri);
    averageContactPointB.scale(invNumContacts, f1.rj);
    f2.ri.copy(f1.ri);
    f2.rj.copy(f1.rj);
    averageNormal.normalize();
    averageNormal.tangents(f1.t, f2.t);
  }
  getContacts(p1, p2, world, result, oldcontacts, frictionResult, frictionPool) {
    this.contactPointPool = oldcontacts;
    this.frictionEquationPool = frictionPool;
    this.result = result;
    this.frictionResult = frictionResult;
    const qi = tmpQuat1;
    const qj = tmpQuat2;
    const xi = tmpVec1;
    const xj = tmpVec2;
    for (let k = 0, N = p1.length; k !== N; k++) {
      const bi = p1[k];
      const bj = p2[k];
      let bodyContactMaterial = null;
      if (bi.material && bj.material) {
        bodyContactMaterial = world.getContactMaterial(bi.material, bj.material) || null;
      }
      const justTest = bi.type & Body.KINEMATIC && bj.type & Body.STATIC || bi.type & Body.STATIC && bj.type & Body.KINEMATIC || bi.type & Body.KINEMATIC && bj.type & Body.KINEMATIC;
      for (let i = 0; i < bi.shapes.length; i++) {
        bi.quaternion.mult(bi.shapeOrientations[i], qi);
        bi.quaternion.vmult(bi.shapeOffsets[i], xi);
        xi.vadd(bi.position, xi);
        const si = bi.shapes[i];
        for (let j = 0; j < bj.shapes.length; j++) {
          bj.quaternion.mult(bj.shapeOrientations[j], qj);
          bj.quaternion.vmult(bj.shapeOffsets[j], xj);
          xj.vadd(bj.position, xj);
          const sj = bj.shapes[j];
          if (!(si.collisionFilterMask & sj.collisionFilterGroup && sj.collisionFilterMask & si.collisionFilterGroup)) {
            continue;
          }
          if (xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius) {
            continue;
          }
          let shapeContactMaterial = null;
          if (si.material && sj.material) {
            shapeContactMaterial = world.getContactMaterial(si.material, sj.material) || null;
          }
          this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || world.defaultContactMaterial;
          const resolverIndex = si.type | sj.type;
          const resolver = this[resolverIndex];
          if (resolver) {
            let retval = false;
            if (si.type < sj.type) {
              retval = resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            } else {
              retval = resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj, justTest);
            }
            if (retval && justTest) {
              world.shapeOverlapKeeper.set(si.id, sj.id);
              world.bodyOverlapKeeper.set(bi.id, bj.id);
            }
          }
        }
      }
    }
  }
  sphereSphere(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    if (justTest) {
      return xi.distanceSquared(xj) < (si.radius + sj.radius) ** 2;
    }
    const contactEq = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
    xj.vsub(xi, contactEq.ni);
    contactEq.ni.normalize();
    contactEq.ri.copy(contactEq.ni);
    contactEq.rj.copy(contactEq.ni);
    contactEq.ri.scale(si.radius, contactEq.ri);
    contactEq.rj.scale(-sj.radius, contactEq.rj);
    contactEq.ri.vadd(xi, contactEq.ri);
    contactEq.ri.vsub(bi.position, contactEq.ri);
    contactEq.rj.vadd(xj, contactEq.rj);
    contactEq.rj.vsub(bj.position, contactEq.rj);
    this.result.push(contactEq);
    this.createFrictionEquationsFromContact(contactEq, this.frictionResult);
  }
  spherePlane(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
    r.ni.set(0, 0, 1);
    qj.vmult(r.ni, r.ni);
    r.ni.negate(r.ni);
    r.ni.normalize();
    r.ni.scale(si.radius, r.ri);
    xi.vsub(xj, point_on_plane_to_sphere);
    r.ni.scale(r.ni.dot(point_on_plane_to_sphere), plane_to_sphere_ortho);
    point_on_plane_to_sphere.vsub(plane_to_sphere_ortho, r.rj);
    if (-point_on_plane_to_sphere.dot(r.ni) <= si.radius) {
      if (justTest) {
        return true;
      }
      const ri = r.ri;
      const rj = r.rj;
      ri.vadd(xi, ri);
      ri.vsub(bi.position, ri);
      rj.vadd(xj, rj);
      rj.vsub(bj.position, rj);
      this.result.push(r);
      this.createFrictionEquationsFromContact(r, this.frictionResult);
    }
  }
  boxBox(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    si.convexPolyhedronRepresentation.material = si.material;
    sj.convexPolyhedronRepresentation.material = sj.material;
    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
    sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse;
    return this.convexConvex(si.convexPolyhedronRepresentation, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest);
  }
  sphereBox(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    const v3pool = this.v3pool;
    const sides = sphereBox_sides;
    xi.vsub(xj, box_to_sphere);
    sj.getSideNormals(sides, qj);
    const R = si.radius;
    let found = false;
    const side_ns = sphereBox_side_ns;
    const side_ns1 = sphereBox_side_ns1;
    const side_ns2 = sphereBox_side_ns2;
    let side_h = null;
    let side_penetrations = 0;
    let side_dot1 = 0;
    let side_dot2 = 0;
    let side_distance = null;
    for (let idx = 0, nsides = sides.length; idx !== nsides && found === false; idx++) {
      const ns = sphereBox_ns;
      ns.copy(sides[idx]);
      const h = ns.length();
      ns.normalize();
      const dot = box_to_sphere.dot(ns);
      if (dot < h + R && dot > 0) {
        const ns1 = sphereBox_ns1;
        const ns2 = sphereBox_ns2;
        ns1.copy(sides[(idx + 1) % 3]);
        ns2.copy(sides[(idx + 2) % 3]);
        const h1 = ns1.length();
        const h2 = ns2.length();
        ns1.normalize();
        ns2.normalize();
        const dot1 = box_to_sphere.dot(ns1);
        const dot2 = box_to_sphere.dot(ns2);
        if (dot1 < h1 && dot1 > -h1 && dot2 < h2 && dot2 > -h2) {
          const dist2 = Math.abs(dot - h - R);
          if (side_distance === null || dist2 < side_distance) {
            side_distance = dist2;
            side_dot1 = dot1;
            side_dot2 = dot2;
            side_h = h;
            side_ns.copy(ns);
            side_ns1.copy(ns1);
            side_ns2.copy(ns2);
            side_penetrations++;
            if (justTest) {
              return true;
            }
          }
        }
      }
    }
    if (side_penetrations) {
      found = true;
      const r2 = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
      side_ns.scale(-R, r2.ri);
      r2.ni.copy(side_ns);
      r2.ni.negate(r2.ni);
      side_ns.scale(side_h, side_ns);
      side_ns1.scale(side_dot1, side_ns1);
      side_ns.vadd(side_ns1, side_ns);
      side_ns2.scale(side_dot2, side_ns2);
      side_ns.vadd(side_ns2, r2.rj);
      r2.ri.vadd(xi, r2.ri);
      r2.ri.vsub(bi.position, r2.ri);
      r2.rj.vadd(xj, r2.rj);
      r2.rj.vsub(bj.position, r2.rj);
      this.result.push(r2);
      this.createFrictionEquationsFromContact(r2, this.frictionResult);
    }
    let rj = v3pool.get();
    const sphere_to_corner = sphereBox_sphere_to_corner;
    for (let j = 0; j !== 2 && !found; j++) {
      for (let k = 0; k !== 2 && !found; k++) {
        for (let l = 0; l !== 2 && !found; l++) {
          rj.set(0, 0, 0);
          if (j) {
            rj.vadd(sides[0], rj);
          } else {
            rj.vsub(sides[0], rj);
          }
          if (k) {
            rj.vadd(sides[1], rj);
          } else {
            rj.vsub(sides[1], rj);
          }
          if (l) {
            rj.vadd(sides[2], rj);
          } else {
            rj.vsub(sides[2], rj);
          }
          xj.vadd(rj, sphere_to_corner);
          sphere_to_corner.vsub(xi, sphere_to_corner);
          if (sphere_to_corner.lengthSquared() < R * R) {
            if (justTest) {
              return true;
            }
            found = true;
            const r2 = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
            r2.ri.copy(sphere_to_corner);
            r2.ri.normalize();
            r2.ni.copy(r2.ri);
            r2.ri.scale(R, r2.ri);
            r2.rj.copy(rj);
            r2.ri.vadd(xi, r2.ri);
            r2.ri.vsub(bi.position, r2.ri);
            r2.rj.vadd(xj, r2.rj);
            r2.rj.vsub(bj.position, r2.rj);
            this.result.push(r2);
            this.createFrictionEquationsFromContact(r2, this.frictionResult);
          }
        }
      }
    }
    v3pool.release(rj);
    rj = null;
    const edgeTangent = v3pool.get();
    const edgeCenter = v3pool.get();
    const r = v3pool.get();
    const orthogonal = v3pool.get();
    const dist = v3pool.get();
    const Nsides = sides.length;
    for (let j = 0; j !== Nsides && !found; j++) {
      for (let k = 0; k !== Nsides && !found; k++) {
        if (j % 3 !== k % 3) {
          sides[k].cross(sides[j], edgeTangent);
          edgeTangent.normalize();
          sides[j].vadd(sides[k], edgeCenter);
          r.copy(xi);
          r.vsub(edgeCenter, r);
          r.vsub(xj, r);
          const orthonorm = r.dot(edgeTangent);
          edgeTangent.scale(orthonorm, orthogonal);
          let l = 0;
          while (l === j % 3 || l === k % 3) {
            l++;
          }
          dist.copy(xi);
          dist.vsub(orthogonal, dist);
          dist.vsub(edgeCenter, dist);
          dist.vsub(xj, dist);
          const tdist = Math.abs(orthonorm);
          const ndist = dist.length();
          if (tdist < sides[l].length() && ndist < R) {
            if (justTest) {
              return true;
            }
            found = true;
            const res = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
            edgeCenter.vadd(orthogonal, res.rj);
            res.rj.copy(res.rj);
            dist.negate(res.ni);
            res.ni.normalize();
            res.ri.copy(res.rj);
            res.ri.vadd(xj, res.ri);
            res.ri.vsub(xi, res.ri);
            res.ri.normalize();
            res.ri.scale(R, res.ri);
            res.ri.vadd(xi, res.ri);
            res.ri.vsub(bi.position, res.ri);
            res.rj.vadd(xj, res.rj);
            res.rj.vsub(bj.position, res.rj);
            this.result.push(res);
            this.createFrictionEquationsFromContact(res, this.frictionResult);
          }
        }
      }
    }
    v3pool.release(edgeTangent, edgeCenter, r, orthogonal, dist);
  }
  planeBox(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    sj.convexPolyhedronRepresentation.material = sj.material;
    sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse;
    sj.convexPolyhedronRepresentation.id = sj.id;
    return this.planeConvex(si, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest);
  }
  convexConvex(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest, faceListA, faceListB) {
    const sepAxis = convexConvex_sepAxis;
    if (xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius) {
      return;
    }
    if (si.findSeparatingAxis(sj, xi, qi, xj, qj, sepAxis, faceListA, faceListB)) {
      const res = [];
      const q = convexConvex_q;
      si.clipAgainstHull(xi, qi, sj, xj, qj, sepAxis, -100, 100, res);
      let numContacts = 0;
      for (let j = 0; j !== res.length; j++) {
        if (justTest) {
          return true;
        }
        const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
        const ri = r.ri;
        const rj = r.rj;
        sepAxis.negate(r.ni);
        res[j].normal.negate(q);
        q.scale(res[j].depth, q);
        res[j].point.vadd(q, ri);
        rj.copy(res[j].point);
        ri.vsub(xi, ri);
        rj.vsub(xj, rj);
        ri.vadd(xi, ri);
        ri.vsub(bi.position, ri);
        rj.vadd(xj, rj);
        rj.vsub(bj.position, rj);
        this.result.push(r);
        numContacts++;
        if (!this.enableFrictionReduction) {
          this.createFrictionEquationsFromContact(r, this.frictionResult);
        }
      }
      if (this.enableFrictionReduction && numContacts) {
        this.createFrictionFromAverage(numContacts);
      }
    }
  }
  sphereConvex(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    const v3pool = this.v3pool;
    xi.vsub(xj, convex_to_sphere);
    const normals = sj.faceNormals;
    const faces = sj.faces;
    const verts = sj.vertices;
    const R = si.radius;
    let found = false;
    for (let i = 0; i !== verts.length; i++) {
      const v = verts[i];
      const worldCorner = sphereConvex_worldCorner;
      qj.vmult(v, worldCorner);
      xj.vadd(worldCorner, worldCorner);
      const sphere_to_corner = sphereConvex_sphereToCorner;
      worldCorner.vsub(xi, sphere_to_corner);
      if (sphere_to_corner.lengthSquared() < R * R) {
        if (justTest) {
          return true;
        }
        found = true;
        const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
        r.ri.copy(sphere_to_corner);
        r.ri.normalize();
        r.ni.copy(r.ri);
        r.ri.scale(R, r.ri);
        worldCorner.vsub(xj, r.rj);
        r.ri.vadd(xi, r.ri);
        r.ri.vsub(bi.position, r.ri);
        r.rj.vadd(xj, r.rj);
        r.rj.vsub(bj.position, r.rj);
        this.result.push(r);
        this.createFrictionEquationsFromContact(r, this.frictionResult);
        return;
      }
    }
    for (let i = 0, nfaces = faces.length; i !== nfaces && found === false; i++) {
      const normal = normals[i];
      const face = faces[i];
      const worldNormal = sphereConvex_worldNormal;
      qj.vmult(normal, worldNormal);
      const worldPoint = sphereConvex_worldPoint;
      qj.vmult(verts[face[0]], worldPoint);
      worldPoint.vadd(xj, worldPoint);
      const worldSpherePointClosestToPlane = sphereConvex_worldSpherePointClosestToPlane;
      worldNormal.scale(-R, worldSpherePointClosestToPlane);
      xi.vadd(worldSpherePointClosestToPlane, worldSpherePointClosestToPlane);
      const penetrationVec = sphereConvex_penetrationVec;
      worldSpherePointClosestToPlane.vsub(worldPoint, penetrationVec);
      const penetration = penetrationVec.dot(worldNormal);
      const worldPointToSphere = sphereConvex_sphereToWorldPoint;
      xi.vsub(worldPoint, worldPointToSphere);
      if (penetration < 0 && worldPointToSphere.dot(worldNormal) > 0) {
        const faceVerts = [];
        for (let j = 0, Nverts = face.length; j !== Nverts; j++) {
          const worldVertex = v3pool.get();
          qj.vmult(verts[face[j]], worldVertex);
          xj.vadd(worldVertex, worldVertex);
          faceVerts.push(worldVertex);
        }
        if (pointInPolygon(faceVerts, worldNormal, xi)) {
          if (justTest) {
            return true;
          }
          found = true;
          const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
          worldNormal.scale(-R, r.ri);
          worldNormal.negate(r.ni);
          const penetrationVec2 = v3pool.get();
          worldNormal.scale(-penetration, penetrationVec2);
          const penetrationSpherePoint = v3pool.get();
          worldNormal.scale(-R, penetrationSpherePoint);
          xi.vsub(xj, r.rj);
          r.rj.vadd(penetrationSpherePoint, r.rj);
          r.rj.vadd(penetrationVec2, r.rj);
          r.rj.vadd(xj, r.rj);
          r.rj.vsub(bj.position, r.rj);
          r.ri.vadd(xi, r.ri);
          r.ri.vsub(bi.position, r.ri);
          v3pool.release(penetrationVec2);
          v3pool.release(penetrationSpherePoint);
          this.result.push(r);
          this.createFrictionEquationsFromContact(r, this.frictionResult);
          for (let j = 0, Nfaceverts = faceVerts.length; j !== Nfaceverts; j++) {
            v3pool.release(faceVerts[j]);
          }
          return;
        } else {
          for (let j = 0; j !== face.length; j++) {
            const v12 = v3pool.get();
            const v22 = v3pool.get();
            qj.vmult(verts[face[(j + 1) % face.length]], v12);
            qj.vmult(verts[face[(j + 2) % face.length]], v22);
            xj.vadd(v12, v12);
            xj.vadd(v22, v22);
            const edge = sphereConvex_edge;
            v22.vsub(v12, edge);
            const edgeUnit = sphereConvex_edgeUnit;
            edge.unit(edgeUnit);
            const p = v3pool.get();
            const v1_to_xi = v3pool.get();
            xi.vsub(v12, v1_to_xi);
            const dot = v1_to_xi.dot(edgeUnit);
            edgeUnit.scale(dot, p);
            p.vadd(v12, p);
            const xi_to_p = v3pool.get();
            p.vsub(xi, xi_to_p);
            if (dot > 0 && dot * dot < edge.lengthSquared() && xi_to_p.lengthSquared() < R * R) {
              if (justTest) {
                return true;
              }
              const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
              p.vsub(xj, r.rj);
              p.vsub(xi, r.ni);
              r.ni.normalize();
              r.ni.scale(R, r.ri);
              r.rj.vadd(xj, r.rj);
              r.rj.vsub(bj.position, r.rj);
              r.ri.vadd(xi, r.ri);
              r.ri.vsub(bi.position, r.ri);
              this.result.push(r);
              this.createFrictionEquationsFromContact(r, this.frictionResult);
              for (let j2 = 0, Nfaceverts = faceVerts.length; j2 !== Nfaceverts; j2++) {
                v3pool.release(faceVerts[j2]);
              }
              v3pool.release(v12);
              v3pool.release(v22);
              v3pool.release(p);
              v3pool.release(xi_to_p);
              v3pool.release(v1_to_xi);
              return;
            }
            v3pool.release(v12);
            v3pool.release(v22);
            v3pool.release(p);
            v3pool.release(xi_to_p);
            v3pool.release(v1_to_xi);
          }
        }
        for (let j = 0, Nfaceverts = faceVerts.length; j !== Nfaceverts; j++) {
          v3pool.release(faceVerts[j]);
        }
      }
    }
  }
  planeConvex(planeShape, convexShape, planePosition, convexPosition, planeQuat, convexQuat, planeBody, convexBody, si, sj, justTest) {
    const worldVertex = planeConvex_v;
    const worldNormal = planeConvex_normal;
    worldNormal.set(0, 0, 1);
    planeQuat.vmult(worldNormal, worldNormal);
    let numContacts = 0;
    const relpos2 = planeConvex_relpos;
    for (let i = 0; i !== convexShape.vertices.length; i++) {
      worldVertex.copy(convexShape.vertices[i]);
      convexQuat.vmult(worldVertex, worldVertex);
      convexPosition.vadd(worldVertex, worldVertex);
      worldVertex.vsub(planePosition, relpos2);
      const dot = worldNormal.dot(relpos2);
      if (dot <= 0) {
        if (justTest) {
          return true;
        }
        const r = this.createContactEquation(planeBody, convexBody, planeShape, convexShape, si, sj);
        const projected = planeConvex_projected;
        worldNormal.scale(worldNormal.dot(relpos2), projected);
        worldVertex.vsub(projected, projected);
        projected.vsub(planePosition, r.ri);
        r.ni.copy(worldNormal);
        worldVertex.vsub(convexPosition, r.rj);
        r.ri.vadd(planePosition, r.ri);
        r.ri.vsub(planeBody.position, r.ri);
        r.rj.vadd(convexPosition, r.rj);
        r.rj.vsub(convexBody.position, r.rj);
        this.result.push(r);
        numContacts++;
        if (!this.enableFrictionReduction) {
          this.createFrictionEquationsFromContact(r, this.frictionResult);
        }
      }
    }
    if (this.enableFrictionReduction && numContacts) {
      this.createFrictionFromAverage(numContacts);
    }
  }
  boxConvex(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    si.convexPolyhedronRepresentation.material = si.material;
    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
    return this.convexConvex(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
  }
  sphereHeightfield(sphereShape, hfShape, spherePos, hfPos, sphereQuat, hfQuat, sphereBody, hfBody, rsi, rsj, justTest) {
    const data = hfShape.data;
    const radius = sphereShape.radius;
    const w = hfShape.elementSize;
    const worldPillarOffset2 = sphereHeightfield_tmp2;
    const localSpherePos = sphereHeightfield_tmp1;
    Transform.pointToLocalFrame(hfPos, hfQuat, spherePos, localSpherePos);
    let iMinX = Math.floor((localSpherePos.x - radius) / w) - 1;
    let iMaxX = Math.ceil((localSpherePos.x + radius) / w) + 1;
    let iMinY = Math.floor((localSpherePos.y - radius) / w) - 1;
    let iMaxY = Math.ceil((localSpherePos.y + radius) / w) + 1;
    if (iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length) {
      return;
    }
    if (iMinX < 0) {
      iMinX = 0;
    }
    if (iMaxX < 0) {
      iMaxX = 0;
    }
    if (iMinY < 0) {
      iMinY = 0;
    }
    if (iMaxY < 0) {
      iMaxY = 0;
    }
    if (iMinX >= data.length) {
      iMinX = data.length - 1;
    }
    if (iMaxX >= data.length) {
      iMaxX = data.length - 1;
    }
    if (iMaxY >= data[0].length) {
      iMaxY = data[0].length - 1;
    }
    if (iMinY >= data[0].length) {
      iMinY = data[0].length - 1;
    }
    const minMax = [];
    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
    const min = minMax[0];
    const max = minMax[1];
    if (localSpherePos.z - radius > max || localSpherePos.z + radius < min) {
      return;
    }
    const result = this.result;
    for (let i = iMinX; i < iMaxX; i++) {
      for (let j = iMinY; j < iMaxY; j++) {
        const numContactsBefore = result.length;
        let intersecting = false;
        hfShape.getConvexTrianglePillar(i, j, false);
        Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset2);
        if (spherePos.distanceTo(worldPillarOffset2) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius) {
          intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset2, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest);
        }
        if (justTest && intersecting) {
          return true;
        }
        hfShape.getConvexTrianglePillar(i, j, true);
        Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset2);
        if (spherePos.distanceTo(worldPillarOffset2) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius) {
          intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset2, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest);
        }
        if (justTest && intersecting) {
          return true;
        }
        const numContacts = result.length - numContactsBefore;
        if (numContacts > 2) {
          return;
        }
      }
    }
  }
  boxHeightfield(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    si.convexPolyhedronRepresentation.material = si.material;
    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
    return this.convexHeightfield(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
  }
  convexHeightfield(convexShape, hfShape, convexPos, hfPos, convexQuat, hfQuat, convexBody, hfBody, rsi, rsj, justTest) {
    const data = hfShape.data;
    const w = hfShape.elementSize;
    const radius = convexShape.boundingSphereRadius;
    const worldPillarOffset2 = convexHeightfield_tmp2;
    const faceList = convexHeightfield_faceList;
    const localConvexPos = convexHeightfield_tmp1;
    Transform.pointToLocalFrame(hfPos, hfQuat, convexPos, localConvexPos);
    let iMinX = Math.floor((localConvexPos.x - radius) / w) - 1;
    let iMaxX = Math.ceil((localConvexPos.x + radius) / w) + 1;
    let iMinY = Math.floor((localConvexPos.y - radius) / w) - 1;
    let iMaxY = Math.ceil((localConvexPos.y + radius) / w) + 1;
    if (iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length) {
      return;
    }
    if (iMinX < 0) {
      iMinX = 0;
    }
    if (iMaxX < 0) {
      iMaxX = 0;
    }
    if (iMinY < 0) {
      iMinY = 0;
    }
    if (iMaxY < 0) {
      iMaxY = 0;
    }
    if (iMinX >= data.length) {
      iMinX = data.length - 1;
    }
    if (iMaxX >= data.length) {
      iMaxX = data.length - 1;
    }
    if (iMaxY >= data[0].length) {
      iMaxY = data[0].length - 1;
    }
    if (iMinY >= data[0].length) {
      iMinY = data[0].length - 1;
    }
    const minMax = [];
    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
    const min = minMax[0];
    const max = minMax[1];
    if (localConvexPos.z - radius > max || localConvexPos.z + radius < min) {
      return;
    }
    for (let i = iMinX; i < iMaxX; i++) {
      for (let j = iMinY; j < iMaxY; j++) {
        let intersecting = false;
        hfShape.getConvexTrianglePillar(i, j, false);
        Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset2);
        if (convexPos.distanceTo(worldPillarOffset2) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius) {
          intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset2, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null);
        }
        if (justTest && intersecting) {
          return true;
        }
        hfShape.getConvexTrianglePillar(i, j, true);
        Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset2);
        if (convexPos.distanceTo(worldPillarOffset2) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius) {
          intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset2, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null);
        }
        if (justTest && intersecting) {
          return true;
        }
      }
    }
  }
  sphereParticle(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
    const normal = particleSphere_normal;
    normal.set(0, 0, 1);
    xi.vsub(xj, normal);
    const lengthSquared = normal.lengthSquared();
    if (lengthSquared <= sj.radius * sj.radius) {
      if (justTest) {
        return true;
      }
      const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
      normal.normalize();
      r.rj.copy(normal);
      r.rj.scale(sj.radius, r.rj);
      r.ni.copy(normal);
      r.ni.negate(r.ni);
      r.ri.set(0, 0, 0);
      this.result.push(r);
      this.createFrictionEquationsFromContact(r, this.frictionResult);
    }
  }
  planeParticle(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
    const normal = particlePlane_normal;
    normal.set(0, 0, 1);
    bj.quaternion.vmult(normal, normal);
    const relpos2 = particlePlane_relpos;
    xi.vsub(bj.position, relpos2);
    const dot = normal.dot(relpos2);
    if (dot <= 0) {
      if (justTest) {
        return true;
      }
      const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
      r.ni.copy(normal);
      r.ni.negate(r.ni);
      r.ri.set(0, 0, 0);
      const projected = particlePlane_projected;
      normal.scale(normal.dot(xi), projected);
      xi.vsub(projected, projected);
      r.rj.copy(projected);
      this.result.push(r);
      this.createFrictionEquationsFromContact(r, this.frictionResult);
    }
  }
  boxParticle(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    si.convexPolyhedronRepresentation.material = si.material;
    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
    return this.convexParticle(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
  }
  convexParticle(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
    let penetratedFaceIndex = -1;
    const penetratedFaceNormal = convexParticle_penetratedFaceNormal;
    const worldPenetrationVec = convexParticle_worldPenetrationVec;
    let minPenetration = null;
    const local = convexParticle_local;
    local.copy(xi);
    local.vsub(xj, local);
    qj.conjugate(cqj);
    cqj.vmult(local, local);
    if (sj.pointIsInside(local)) {
      if (sj.worldVerticesNeedsUpdate) {
        sj.computeWorldVertices(xj, qj);
      }
      if (sj.worldFaceNormalsNeedsUpdate) {
        sj.computeWorldFaceNormals(qj);
      }
      for (let i = 0, nfaces = sj.faces.length; i !== nfaces; i++) {
        const verts = [sj.worldVertices[sj.faces[i][0]]];
        const normal = sj.worldFaceNormals[i];
        xi.vsub(verts[0], convexParticle_vertexToParticle);
        const penetration = -normal.dot(convexParticle_vertexToParticle);
        if (minPenetration === null || Math.abs(penetration) < Math.abs(minPenetration)) {
          if (justTest) {
            return true;
          }
          minPenetration = penetration;
          penetratedFaceIndex = i;
          penetratedFaceNormal.copy(normal);
        }
      }
      if (penetratedFaceIndex !== -1) {
        const r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
        penetratedFaceNormal.scale(minPenetration, worldPenetrationVec);
        worldPenetrationVec.vadd(xi, worldPenetrationVec);
        worldPenetrationVec.vsub(xj, worldPenetrationVec);
        r.rj.copy(worldPenetrationVec);
        penetratedFaceNormal.negate(r.ni);
        r.ri.set(0, 0, 0);
        const ri = r.ri;
        const rj = r.rj;
        ri.vadd(xi, ri);
        ri.vsub(bi.position, ri);
        rj.vadd(xj, rj);
        rj.vsub(bj.position, rj);
        this.result.push(r);
        this.createFrictionEquationsFromContact(r, this.frictionResult);
      } else {
        console.warn("Point found inside convex, but did not find penetrating face!");
      }
    }
  }
  heightfieldCylinder(hfShape, convexShape, hfPos, convexPos, hfQuat, convexQuat, hfBody, convexBody, rsi, rsj, justTest) {
    return this.convexHeightfield(convexShape, hfShape, convexPos, hfPos, convexQuat, hfQuat, convexBody, hfBody, rsi, rsj, justTest);
  }
  particleCylinder(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
    return this.convexParticle(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest);
  }
  sphereTrimesh(sphereShape, trimeshShape, spherePos, trimeshPos, sphereQuat, trimeshQuat, sphereBody, trimeshBody, rsi, rsj, justTest) {
    const edgeVertexA = sphereTrimesh_edgeVertexA;
    const edgeVertexB = sphereTrimesh_edgeVertexB;
    const edgeVector = sphereTrimesh_edgeVector;
    const edgeVectorUnit = sphereTrimesh_edgeVectorUnit;
    const localSpherePos = sphereTrimesh_localSpherePos;
    const tmp2 = sphereTrimesh_tmp;
    const localSphereAABB = sphereTrimesh_localSphereAABB;
    const v22 = sphereTrimesh_v2;
    const relpos2 = sphereTrimesh_relpos;
    const triangles = sphereTrimesh_triangles;
    Transform.pointToLocalFrame(trimeshPos, trimeshQuat, spherePos, localSpherePos);
    const sphereRadius = sphereShape.radius;
    localSphereAABB.lowerBound.set(localSpherePos.x - sphereRadius, localSpherePos.y - sphereRadius, localSpherePos.z - sphereRadius);
    localSphereAABB.upperBound.set(localSpherePos.x + sphereRadius, localSpherePos.y + sphereRadius, localSpherePos.z + sphereRadius);
    trimeshShape.getTrianglesInAABB(localSphereAABB, triangles);
    const v = sphereTrimesh_v;
    const radiusSquared = sphereShape.radius * sphereShape.radius;
    for (let i = 0; i < triangles.length; i++) {
      for (let j = 0; j < 3; j++) {
        trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + j], v);
        v.vsub(localSpherePos, relpos2);
        if (relpos2.lengthSquared() <= radiusSquared) {
          v22.copy(v);
          Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v22, v);
          v.vsub(spherePos, relpos2);
          if (justTest) {
            return true;
          }
          let r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
          r.ni.copy(relpos2);
          r.ni.normalize();
          r.ri.copy(r.ni);
          r.ri.scale(sphereShape.radius, r.ri);
          r.ri.vadd(spherePos, r.ri);
          r.ri.vsub(sphereBody.position, r.ri);
          r.rj.copy(v);
          r.rj.vsub(trimeshBody.position, r.rj);
          this.result.push(r);
          this.createFrictionEquationsFromContact(r, this.frictionResult);
        }
      }
    }
    for (let i = 0; i < triangles.length; i++) {
      for (let j = 0; j < 3; j++) {
        trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + j], edgeVertexA);
        trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + (j + 1) % 3], edgeVertexB);
        edgeVertexB.vsub(edgeVertexA, edgeVector);
        localSpherePos.vsub(edgeVertexB, tmp2);
        const positionAlongEdgeB = tmp2.dot(edgeVector);
        localSpherePos.vsub(edgeVertexA, tmp2);
        let positionAlongEdgeA = tmp2.dot(edgeVector);
        if (positionAlongEdgeA > 0 && positionAlongEdgeB < 0) {
          localSpherePos.vsub(edgeVertexA, tmp2);
          edgeVectorUnit.copy(edgeVector);
          edgeVectorUnit.normalize();
          positionAlongEdgeA = tmp2.dot(edgeVectorUnit);
          edgeVectorUnit.scale(positionAlongEdgeA, tmp2);
          tmp2.vadd(edgeVertexA, tmp2);
          const dist = tmp2.distanceTo(localSpherePos);
          if (dist < sphereShape.radius) {
            if (justTest) {
              return true;
            }
            const r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
            tmp2.vsub(localSpherePos, r.ni);
            r.ni.normalize();
            r.ni.scale(sphereShape.radius, r.ri);
            r.ri.vadd(spherePos, r.ri);
            r.ri.vsub(sphereBody.position, r.ri);
            Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp2, tmp2);
            tmp2.vsub(trimeshBody.position, r.rj);
            Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni);
            Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri);
            this.result.push(r);
            this.createFrictionEquationsFromContact(r, this.frictionResult);
          }
        }
      }
    }
    const va2 = sphereTrimesh_va;
    const vb2 = sphereTrimesh_vb;
    const vc2 = sphereTrimesh_vc;
    const normal = sphereTrimesh_normal;
    for (let i = 0, N = triangles.length; i !== N; i++) {
      trimeshShape.getTriangleVertices(triangles[i], va2, vb2, vc2);
      trimeshShape.getNormal(triangles[i], normal);
      localSpherePos.vsub(va2, tmp2);
      let dist = tmp2.dot(normal);
      normal.scale(dist, tmp2);
      localSpherePos.vsub(tmp2, tmp2);
      dist = tmp2.distanceTo(localSpherePos);
      if (Ray.pointInTriangle(tmp2, va2, vb2, vc2) && dist < sphereShape.radius) {
        if (justTest) {
          return true;
        }
        let r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
        tmp2.vsub(localSpherePos, r.ni);
        r.ni.normalize();
        r.ni.scale(sphereShape.radius, r.ri);
        r.ri.vadd(spherePos, r.ri);
        r.ri.vsub(sphereBody.position, r.ri);
        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp2, tmp2);
        tmp2.vsub(trimeshBody.position, r.rj);
        Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni);
        Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri);
        this.result.push(r);
        this.createFrictionEquationsFromContact(r, this.frictionResult);
      }
    }
    triangles.length = 0;
  }
  planeTrimesh(planeShape, trimeshShape, planePos, trimeshPos, planeQuat, trimeshQuat, planeBody, trimeshBody, rsi, rsj, justTest) {
    const v = new Vec3();
    const normal = planeTrimesh_normal;
    normal.set(0, 0, 1);
    planeQuat.vmult(normal, normal);
    for (let i = 0; i < trimeshShape.vertices.length / 3; i++) {
      trimeshShape.getVertex(i, v);
      const v22 = new Vec3();
      v22.copy(v);
      Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v22, v);
      const relpos2 = planeTrimesh_relpos;
      v.vsub(planePos, relpos2);
      const dot = normal.dot(relpos2);
      if (dot <= 0) {
        if (justTest) {
          return true;
        }
        const r = this.createContactEquation(planeBody, trimeshBody, planeShape, trimeshShape, rsi, rsj);
        r.ni.copy(normal);
        const projected = planeTrimesh_projected;
        normal.scale(relpos2.dot(normal), projected);
        v.vsub(projected, projected);
        r.ri.copy(projected);
        r.ri.vsub(planeBody.position, r.ri);
        r.rj.copy(v);
        r.rj.vsub(trimeshBody.position, r.rj);
        this.result.push(r);
        this.createFrictionEquationsFromContact(r, this.frictionResult);
      }
    }
  }
}
const averageNormal = new Vec3();
const averageContactPointA = new Vec3();
const averageContactPointB = new Vec3();
const tmpVec1 = new Vec3();
const tmpVec2 = new Vec3();
const tmpQuat1 = new Quaternion();
const tmpQuat2 = new Quaternion();
const planeTrimesh_normal = new Vec3();
const planeTrimesh_relpos = new Vec3();
const planeTrimesh_projected = new Vec3();
const sphereTrimesh_normal = new Vec3();
const sphereTrimesh_relpos = new Vec3();
new Vec3();
const sphereTrimesh_v = new Vec3();
const sphereTrimesh_v2 = new Vec3();
const sphereTrimesh_edgeVertexA = new Vec3();
const sphereTrimesh_edgeVertexB = new Vec3();
const sphereTrimesh_edgeVector = new Vec3();
const sphereTrimesh_edgeVectorUnit = new Vec3();
const sphereTrimesh_localSpherePos = new Vec3();
const sphereTrimesh_tmp = new Vec3();
const sphereTrimesh_va = new Vec3();
const sphereTrimesh_vb = new Vec3();
const sphereTrimesh_vc = new Vec3();
const sphereTrimesh_localSphereAABB = new AABB();
const sphereTrimesh_triangles = [];
const point_on_plane_to_sphere = new Vec3();
const plane_to_sphere_ortho = new Vec3();
const pointInPolygon_edge = new Vec3();
const pointInPolygon_edge_x_normal = new Vec3();
const pointInPolygon_vtp = new Vec3();
function pointInPolygon(verts, normal, p) {
  let positiveResult = null;
  const N = verts.length;
  for (let i = 0; i !== N; i++) {
    const v = verts[i];
    const edge = pointInPolygon_edge;
    verts[(i + 1) % N].vsub(v, edge);
    const edge_x_normal = pointInPolygon_edge_x_normal;
    edge.cross(normal, edge_x_normal);
    const vertex_to_p = pointInPolygon_vtp;
    p.vsub(v, vertex_to_p);
    const r = edge_x_normal.dot(vertex_to_p);
    if (positiveResult === null || r > 0 && positiveResult === true || r <= 0 && positiveResult === false) {
      if (positiveResult === null) {
        positiveResult = r > 0;
      }
      continue;
    } else {
      return false;
    }
  }
  return true;
}
const box_to_sphere = new Vec3();
const sphereBox_ns = new Vec3();
const sphereBox_ns1 = new Vec3();
const sphereBox_ns2 = new Vec3();
const sphereBox_sides = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
const sphereBox_sphere_to_corner = new Vec3();
const sphereBox_side_ns = new Vec3();
const sphereBox_side_ns1 = new Vec3();
const sphereBox_side_ns2 = new Vec3();
const convex_to_sphere = new Vec3();
const sphereConvex_edge = new Vec3();
const sphereConvex_edgeUnit = new Vec3();
const sphereConvex_sphereToCorner = new Vec3();
const sphereConvex_worldCorner = new Vec3();
const sphereConvex_worldNormal = new Vec3();
const sphereConvex_worldPoint = new Vec3();
const sphereConvex_worldSpherePointClosestToPlane = new Vec3();
const sphereConvex_penetrationVec = new Vec3();
const sphereConvex_sphereToWorldPoint = new Vec3();
new Vec3();
new Vec3();
const planeConvex_v = new Vec3();
const planeConvex_normal = new Vec3();
const planeConvex_relpos = new Vec3();
const planeConvex_projected = new Vec3();
const convexConvex_sepAxis = new Vec3();
const convexConvex_q = new Vec3();
const particlePlane_normal = new Vec3();
const particlePlane_relpos = new Vec3();
const particlePlane_projected = new Vec3();
const particleSphere_normal = new Vec3();
const cqj = new Quaternion();
const convexParticle_local = new Vec3();
new Vec3();
const convexParticle_penetratedFaceNormal = new Vec3();
const convexParticle_vertexToParticle = new Vec3();
const convexParticle_worldPenetrationVec = new Vec3();
const convexHeightfield_tmp1 = new Vec3();
const convexHeightfield_tmp2 = new Vec3();
const convexHeightfield_faceList = [0];
const sphereHeightfield_tmp1 = new Vec3();
const sphereHeightfield_tmp2 = new Vec3();
class OverlapKeeper {
  constructor() {
    this.current = [];
    this.previous = [];
  }
  getKey(i, j) {
    if (j < i) {
      const temp = j;
      j = i;
      i = temp;
    }
    return i << 16 | j;
  }
  set(i, j) {
    const key = this.getKey(i, j);
    const current = this.current;
    let index = 0;
    while (key > current[index]) {
      index++;
    }
    if (key === current[index]) {
      return;
    }
    for (let j2 = current.length - 1; j2 >= index; j2--) {
      current[j2 + 1] = current[j2];
    }
    current[index] = key;
  }
  tick() {
    const tmp2 = this.current;
    this.current = this.previous;
    this.previous = tmp2;
    this.current.length = 0;
  }
  getDiff(additions2, removals2) {
    const a2 = this.current;
    const b2 = this.previous;
    const al = a2.length;
    const bl = b2.length;
    let j = 0;
    for (let i = 0; i < al; i++) {
      let found = false;
      const keyA = a2[i];
      while (keyA > b2[j]) {
        j++;
      }
      found = keyA === b2[j];
      if (!found) {
        unpackAndPush(additions2, keyA);
      }
    }
    j = 0;
    for (let i = 0; i < bl; i++) {
      let found = false;
      const keyB = b2[i];
      while (keyB > a2[j]) {
        j++;
      }
      found = a2[j] === keyB;
      if (!found) {
        unpackAndPush(removals2, keyB);
      }
    }
  }
}
function unpackAndPush(array, key) {
  array.push((key & 4294901760) >> 16, key & 65535);
}
const getKey = (i, j) => i < j ? `${i}-${j}` : `${j}-${i}`;
class TupleDictionary {
  constructor() {
    this.data = {
      keys: []
    };
  }
  get(i, j) {
    const key = getKey(i, j);
    return this.data[key];
  }
  set(i, j, value) {
    const key = getKey(i, j);
    if (!this.get(i, j)) {
      this.data.keys.push(key);
    }
    this.data[key] = value;
  }
  delete(i, j) {
    const key = getKey(i, j);
    const index = this.data.keys.indexOf(key);
    if (index !== -1) {
      this.data.keys.splice(index, 1);
    }
    delete this.data[key];
  }
  reset() {
    const data = this.data;
    const keys = data.keys;
    while (keys.length > 0) {
      const key = keys.pop();
      delete data[key];
    }
  }
}
class World extends EventTarget {
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    super();
    this.dt = -1;
    this.allowSleep = !!options.allowSleep;
    this.contacts = [];
    this.frictionEquations = [];
    this.quatNormalizeSkip = options.quatNormalizeSkip !== void 0 ? options.quatNormalizeSkip : 0;
    this.quatNormalizeFast = options.quatNormalizeFast !== void 0 ? options.quatNormalizeFast : false;
    this.time = 0;
    this.stepnumber = 0;
    this.default_dt = 1 / 60;
    this.nextId = 0;
    this.gravity = new Vec3();
    if (options.gravity) {
      this.gravity.copy(options.gravity);
    }
    if (options.frictionGravity) {
      this.frictionGravity = new Vec3();
      this.frictionGravity.copy(options.frictionGravity);
    }
    this.broadphase = options.broadphase !== void 0 ? options.broadphase : new NaiveBroadphase();
    this.bodies = [];
    this.hasActiveBodies = false;
    this.solver = options.solver !== void 0 ? options.solver : new GSSolver();
    this.constraints = [];
    this.narrowphase = new Narrowphase(this);
    this.collisionMatrix = new ArrayCollisionMatrix();
    this.collisionMatrixPrevious = new ArrayCollisionMatrix();
    this.bodyOverlapKeeper = new OverlapKeeper();
    this.shapeOverlapKeeper = new OverlapKeeper();
    this.contactmaterials = [];
    this.contactMaterialTable = new TupleDictionary();
    this.defaultMaterial = new Material("default");
    this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial, this.defaultMaterial, {
      friction: 0.3,
      restitution: 0
    });
    this.doProfiling = false;
    this.profile = {
      solve: 0,
      makeContactConstraints: 0,
      broadphase: 0,
      integrate: 0,
      narrowphase: 0
    };
    this.accumulator = 0;
    this.subsystems = [];
    this.addBodyEvent = {
      type: "addBody",
      body: null
    };
    this.removeBodyEvent = {
      type: "removeBody",
      body: null
    };
    this.idToBodyMap = {};
    this.broadphase.setWorld(this);
  }
  getContactMaterial(m1, m2) {
    return this.contactMaterialTable.get(m1.id, m2.id);
  }
  collisionMatrixTick() {
    const temp = this.collisionMatrixPrevious;
    this.collisionMatrixPrevious = this.collisionMatrix;
    this.collisionMatrix = temp;
    this.collisionMatrix.reset();
    this.bodyOverlapKeeper.tick();
    this.shapeOverlapKeeper.tick();
  }
  addConstraint(c2) {
    this.constraints.push(c2);
  }
  removeConstraint(c2) {
    const idx = this.constraints.indexOf(c2);
    if (idx !== -1) {
      this.constraints.splice(idx, 1);
    }
  }
  rayTest(from, to, result) {
    if (result instanceof RaycastResult) {
      this.raycastClosest(from, to, {
        skipBackfaces: true
      }, result);
    } else {
      this.raycastAll(from, to, {
        skipBackfaces: true
      }, result);
    }
  }
  raycastAll(from, to, options, callback) {
    if (options === void 0) {
      options = {};
    }
    options.mode = Ray.ALL;
    options.from = from;
    options.to = to;
    options.callback = callback;
    return tmpRay.intersectWorld(this, options);
  }
  raycastAny(from, to, options, result) {
    if (options === void 0) {
      options = {};
    }
    options.mode = Ray.ANY;
    options.from = from;
    options.to = to;
    options.result = result;
    return tmpRay.intersectWorld(this, options);
  }
  raycastClosest(from, to, options, result) {
    if (options === void 0) {
      options = {};
    }
    options.mode = Ray.CLOSEST;
    options.from = from;
    options.to = to;
    options.result = result;
    return tmpRay.intersectWorld(this, options);
  }
  addBody(body) {
    if (this.bodies.includes(body)) {
      return;
    }
    body.index = this.bodies.length;
    this.bodies.push(body);
    body.world = this;
    body.initPosition.copy(body.position);
    body.initVelocity.copy(body.velocity);
    body.timeLastSleepy = this.time;
    if (body instanceof Body) {
      body.initAngularVelocity.copy(body.angularVelocity);
      body.initQuaternion.copy(body.quaternion);
    }
    this.collisionMatrix.setNumObjects(this.bodies.length);
    this.addBodyEvent.body = body;
    this.idToBodyMap[body.id] = body;
    this.dispatchEvent(this.addBodyEvent);
  }
  removeBody(body) {
    body.world = null;
    const n = this.bodies.length - 1;
    const bodies = this.bodies;
    const idx = bodies.indexOf(body);
    if (idx !== -1) {
      bodies.splice(idx, 1);
      for (let i = 0; i !== bodies.length; i++) {
        bodies[i].index = i;
      }
      this.collisionMatrix.setNumObjects(n);
      this.removeBodyEvent.body = body;
      delete this.idToBodyMap[body.id];
      this.dispatchEvent(this.removeBodyEvent);
    }
  }
  getBodyById(id) {
    return this.idToBodyMap[id];
  }
  getShapeById(id) {
    const bodies = this.bodies;
    for (let i = 0; i < bodies.length; i++) {
      const shapes = bodies[i].shapes;
      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        if (shape.id === id) {
          return shape;
        }
      }
    }
    return null;
  }
  addContactMaterial(cmat) {
    this.contactmaterials.push(cmat);
    this.contactMaterialTable.set(cmat.materials[0].id, cmat.materials[1].id, cmat);
  }
  removeContactMaterial(cmat) {
    const idx = this.contactmaterials.indexOf(cmat);
    if (idx === -1) {
      return;
    }
    this.contactmaterials.splice(idx, 1);
    this.contactMaterialTable.delete(cmat.materials[0].id, cmat.materials[1].id);
  }
  fixedStep(dt, maxSubSteps) {
    if (dt === void 0) {
      dt = 1 / 60;
    }
    if (maxSubSteps === void 0) {
      maxSubSteps = 10;
    }
    const time = performance.now() / 1e3;
    if (!this.lastCallTime) {
      this.step(dt, void 0, maxSubSteps);
    } else {
      const timeSinceLastCalled = time - this.lastCallTime;
      this.step(dt, timeSinceLastCalled, maxSubSteps);
    }
    this.lastCallTime = time;
  }
  step(dt, timeSinceLastCalled, maxSubSteps) {
    if (maxSubSteps === void 0) {
      maxSubSteps = 10;
    }
    if (timeSinceLastCalled === void 0) {
      this.internalStep(dt);
      this.time += dt;
    } else {
      this.accumulator += timeSinceLastCalled;
      const t0 = performance.now();
      let substeps = 0;
      while (this.accumulator >= dt && substeps < maxSubSteps) {
        this.internalStep(dt);
        this.accumulator -= dt;
        substeps++;
        if (performance.now() - t0 > dt * 1e3) {
          break;
        }
      }
      this.accumulator = this.accumulator % dt;
      const t = this.accumulator / dt;
      for (let j = 0; j !== this.bodies.length; j++) {
        const b2 = this.bodies[j];
        b2.previousPosition.lerp(b2.position, t, b2.interpolatedPosition);
        b2.previousQuaternion.slerp(b2.quaternion, t, b2.interpolatedQuaternion);
        b2.previousQuaternion.normalize();
      }
      this.time += timeSinceLastCalled;
    }
  }
  internalStep(dt) {
    this.dt = dt;
    const contacts = this.contacts;
    const p1 = World_step_p1;
    const p2 = World_step_p2;
    const N = this.bodies.length;
    const bodies = this.bodies;
    const solver = this.solver;
    const gravity = this.gravity;
    const doProfiling = this.doProfiling;
    const profile = this.profile;
    const DYNAMIC = Body.DYNAMIC;
    let profilingStart = -Infinity;
    const constraints = this.constraints;
    const frictionEquationPool = World_step_frictionEquationPool;
    gravity.length();
    const gx = gravity.x;
    const gy = gravity.y;
    const gz = gravity.z;
    let i = 0;
    if (doProfiling) {
      profilingStart = performance.now();
    }
    for (i = 0; i !== N; i++) {
      const bi = bodies[i];
      if (bi.type === DYNAMIC) {
        const f = bi.force;
        const m = bi.mass;
        f.x += m * gx;
        f.y += m * gy;
        f.z += m * gz;
      }
    }
    for (let i2 = 0, Nsubsystems = this.subsystems.length; i2 !== Nsubsystems; i2++) {
      this.subsystems[i2].update();
    }
    if (doProfiling) {
      profilingStart = performance.now();
    }
    p1.length = 0;
    p2.length = 0;
    this.broadphase.collisionPairs(this, p1, p2);
    if (doProfiling) {
      profile.broadphase = performance.now() - profilingStart;
    }
    let Nconstraints = constraints.length;
    for (i = 0; i !== Nconstraints; i++) {
      const c2 = constraints[i];
      if (!c2.collideConnected) {
        for (let j = p1.length - 1; j >= 0; j -= 1) {
          if (c2.bodyA === p1[j] && c2.bodyB === p2[j] || c2.bodyB === p1[j] && c2.bodyA === p2[j]) {
            p1.splice(j, 1);
            p2.splice(j, 1);
          }
        }
      }
    }
    this.collisionMatrixTick();
    if (doProfiling) {
      profilingStart = performance.now();
    }
    const oldcontacts = World_step_oldContacts;
    const NoldContacts = contacts.length;
    for (i = 0; i !== NoldContacts; i++) {
      oldcontacts.push(contacts[i]);
    }
    contacts.length = 0;
    const NoldFrictionEquations = this.frictionEquations.length;
    for (i = 0; i !== NoldFrictionEquations; i++) {
      frictionEquationPool.push(this.frictionEquations[i]);
    }
    this.frictionEquations.length = 0;
    this.narrowphase.getContacts(p1, p2, this, contacts, oldcontacts, this.frictionEquations, frictionEquationPool);
    if (doProfiling) {
      profile.narrowphase = performance.now() - profilingStart;
    }
    if (doProfiling) {
      profilingStart = performance.now();
    }
    for (i = 0; i < this.frictionEquations.length; i++) {
      solver.addEquation(this.frictionEquations[i]);
    }
    const ncontacts = contacts.length;
    for (let k = 0; k !== ncontacts; k++) {
      const c2 = contacts[k];
      const bi = c2.bi;
      const bj = c2.bj;
      const si = c2.si;
      const sj = c2.sj;
      let cm;
      if (bi.material && bj.material) {
        cm = this.getContactMaterial(bi.material, bj.material) || this.defaultContactMaterial;
      } else {
        cm = this.defaultContactMaterial;
      }
      cm.friction;
      if (bi.material && bj.material) {
        if (bi.material.friction >= 0 && bj.material.friction >= 0) {
          bi.material.friction * bj.material.friction;
        }
        if (bi.material.restitution >= 0 && bj.material.restitution >= 0) {
          c2.restitution = bi.material.restitution * bj.material.restitution;
        }
      }
      solver.addEquation(c2);
      if (bi.allowSleep && bi.type === Body.DYNAMIC && bi.sleepState === Body.SLEEPING && bj.sleepState === Body.AWAKE && bj.type !== Body.STATIC) {
        const speedSquaredB = bj.velocity.lengthSquared() + bj.angularVelocity.lengthSquared();
        const speedLimitSquaredB = bj.sleepSpeedLimit ** 2;
        if (speedSquaredB >= speedLimitSquaredB * 2) {
          bi.wakeUpAfterNarrowphase = true;
        }
      }
      if (bj.allowSleep && bj.type === Body.DYNAMIC && bj.sleepState === Body.SLEEPING && bi.sleepState === Body.AWAKE && bi.type !== Body.STATIC) {
        const speedSquaredA = bi.velocity.lengthSquared() + bi.angularVelocity.lengthSquared();
        const speedLimitSquaredA = bi.sleepSpeedLimit ** 2;
        if (speedSquaredA >= speedLimitSquaredA * 2) {
          bj.wakeUpAfterNarrowphase = true;
        }
      }
      this.collisionMatrix.set(bi, bj, true);
      if (!this.collisionMatrixPrevious.get(bi, bj)) {
        World_step_collideEvent.body = bj;
        World_step_collideEvent.contact = c2;
        bi.dispatchEvent(World_step_collideEvent);
        World_step_collideEvent.body = bi;
        bj.dispatchEvent(World_step_collideEvent);
      }
      this.bodyOverlapKeeper.set(bi.id, bj.id);
      this.shapeOverlapKeeper.set(si.id, sj.id);
    }
    this.emitContactEvents();
    if (doProfiling) {
      profile.makeContactConstraints = performance.now() - profilingStart;
      profilingStart = performance.now();
    }
    for (i = 0; i !== N; i++) {
      const bi = bodies[i];
      if (bi.wakeUpAfterNarrowphase) {
        bi.wakeUp();
        bi.wakeUpAfterNarrowphase = false;
      }
    }
    Nconstraints = constraints.length;
    for (i = 0; i !== Nconstraints; i++) {
      const c2 = constraints[i];
      c2.update();
      for (let j = 0, Neq = c2.equations.length; j !== Neq; j++) {
        const eq = c2.equations[j];
        solver.addEquation(eq);
      }
    }
    solver.solve(dt, this);
    if (doProfiling) {
      profile.solve = performance.now() - profilingStart;
    }
    solver.removeAllEquations();
    const pow = Math.pow;
    for (i = 0; i !== N; i++) {
      const bi = bodies[i];
      if (bi.type & DYNAMIC) {
        const ld = pow(1 - bi.linearDamping, dt);
        const v = bi.velocity;
        v.scale(ld, v);
        const av = bi.angularVelocity;
        if (av) {
          const ad = pow(1 - bi.angularDamping, dt);
          av.scale(ad, av);
        }
      }
    }
    this.dispatchEvent(World_step_preStepEvent);
    if (doProfiling) {
      profilingStart = performance.now();
    }
    const stepnumber = this.stepnumber;
    const quatNormalize = stepnumber % (this.quatNormalizeSkip + 1) === 0;
    const quatNormalizeFast = this.quatNormalizeFast;
    for (i = 0; i !== N; i++) {
      bodies[i].integrate(dt, quatNormalize, quatNormalizeFast);
    }
    this.clearForces();
    this.broadphase.dirty = true;
    if (doProfiling) {
      profile.integrate = performance.now() - profilingStart;
    }
    this.stepnumber += 1;
    this.dispatchEvent(World_step_postStepEvent);
    let hasActiveBodies = true;
    if (this.allowSleep) {
      hasActiveBodies = false;
      for (i = 0; i !== N; i++) {
        const bi = bodies[i];
        bi.sleepTick(this.time);
        if (bi.sleepState !== Body.SLEEPING) {
          hasActiveBodies = true;
        }
      }
    }
    this.hasActiveBodies = hasActiveBodies;
  }
  emitContactEvents() {
    const hasBeginContact = this.hasAnyEventListener("beginContact");
    const hasEndContact = this.hasAnyEventListener("endContact");
    if (hasBeginContact || hasEndContact) {
      this.bodyOverlapKeeper.getDiff(additions, removals);
    }
    if (hasBeginContact) {
      for (let i = 0, l = additions.length; i < l; i += 2) {
        beginContactEvent.bodyA = this.getBodyById(additions[i]);
        beginContactEvent.bodyB = this.getBodyById(additions[i + 1]);
        this.dispatchEvent(beginContactEvent);
      }
      beginContactEvent.bodyA = beginContactEvent.bodyB = null;
    }
    if (hasEndContact) {
      for (let i = 0, l = removals.length; i < l; i += 2) {
        endContactEvent.bodyA = this.getBodyById(removals[i]);
        endContactEvent.bodyB = this.getBodyById(removals[i + 1]);
        this.dispatchEvent(endContactEvent);
      }
      endContactEvent.bodyA = endContactEvent.bodyB = null;
    }
    additions.length = removals.length = 0;
    const hasBeginShapeContact = this.hasAnyEventListener("beginShapeContact");
    const hasEndShapeContact = this.hasAnyEventListener("endShapeContact");
    if (hasBeginShapeContact || hasEndShapeContact) {
      this.shapeOverlapKeeper.getDiff(additions, removals);
    }
    if (hasBeginShapeContact) {
      for (let i = 0, l = additions.length; i < l; i += 2) {
        const shapeA = this.getShapeById(additions[i]);
        const shapeB = this.getShapeById(additions[i + 1]);
        beginShapeContactEvent.shapeA = shapeA;
        beginShapeContactEvent.shapeB = shapeB;
        if (shapeA)
          beginShapeContactEvent.bodyA = shapeA.body;
        if (shapeB)
          beginShapeContactEvent.bodyB = shapeB.body;
        this.dispatchEvent(beginShapeContactEvent);
      }
      beginShapeContactEvent.bodyA = beginShapeContactEvent.bodyB = beginShapeContactEvent.shapeA = beginShapeContactEvent.shapeB = null;
    }
    if (hasEndShapeContact) {
      for (let i = 0, l = removals.length; i < l; i += 2) {
        const shapeA = this.getShapeById(removals[i]);
        const shapeB = this.getShapeById(removals[i + 1]);
        endShapeContactEvent.shapeA = shapeA;
        endShapeContactEvent.shapeB = shapeB;
        if (shapeA)
          endShapeContactEvent.bodyA = shapeA.body;
        if (shapeB)
          endShapeContactEvent.bodyB = shapeB.body;
        this.dispatchEvent(endShapeContactEvent);
      }
      endShapeContactEvent.bodyA = endShapeContactEvent.bodyB = endShapeContactEvent.shapeA = endShapeContactEvent.shapeB = null;
    }
  }
  clearForces() {
    const bodies = this.bodies;
    const N = bodies.length;
    for (let i = 0; i !== N; i++) {
      const b2 = bodies[i];
      b2.force;
      b2.torque;
      b2.force.set(0, 0, 0);
      b2.torque.set(0, 0, 0);
    }
  }
}
new AABB();
const tmpRay = new Ray();
const performance = globalThis.performance || {};
if (!performance.now) {
  let nowOffset = Date.now();
  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  performance.now = () => Date.now() - nowOffset;
}
new Vec3();
const World_step_postStepEvent = {
  type: "postStep"
};
const World_step_preStepEvent = {
  type: "preStep"
};
const World_step_collideEvent = {
  type: Body.COLLIDE_EVENT_NAME,
  body: null,
  contact: null
};
const World_step_oldContacts = [];
const World_step_frictionEquationPool = [];
const World_step_p1 = [];
const World_step_p2 = [];
const additions = [];
const removals = [];
const beginContactEvent = {
  type: "beginContact",
  bodyA: null,
  bodyB: null
};
const endContactEvent = {
  type: "endContact",
  bodyA: null,
  bodyB: null
};
const beginShapeContactEvent = {
  type: "beginShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
};
const endShapeContactEvent = {
  type: "endShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
};
export {AABB, ArrayCollisionMatrix, BODY_SLEEP_STATES, BODY_TYPES, Body, Box, Broadphase, COLLISION_TYPES, ConeTwistConstraint, Constraint, ContactEquation, ContactMaterial, ConvexPolyhedron, Cylinder, DistanceConstraint, Equation, EventTarget, FrictionEquation, GSSolver, GridBroadphase, Heightfield, HingeConstraint, JacobianElement, LockConstraint, Mat3, Material, NaiveBroadphase, Narrowphase, ObjectCollisionMatrix, Particle, Plane, PointToPointConstraint, Pool, Quaternion, RAY_MODES, Ray, RaycastResult, RaycastVehicle, RigidVehicle, RotationalEquation, RotationalMotorEquation, SAPBroadphase, SHAPE_TYPES, SPHSystem, Shape, Solver, Sphere, SplitSolver, Spring, Transform, Trimesh, Vec3, Vec3Pool, WheelInfo, World};
export default null;