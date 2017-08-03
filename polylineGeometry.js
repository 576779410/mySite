function polylineGeometry(polyline, width) {
    function lineGeometry(start, end, width) {
        function subtract(a, b) {
            var c = {}
            c.x = a.x - b.x
            c.y = a.y - b.y
            c.z = a.z - b.z
            return c
        }

        function lengthOf(a, b) {
            var c = subtract(a, b)
            return Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z)
        }

        function unitization(a) {
            var len = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
            var b = {}
            b.x = a.x / len
            b.y = a.y / len
            b.z = a.z / len
            return b
        }

        function getRotateMatrix(a, b) {
            function vector3MutiplyMatrix3(v, m) {
                var r = {};
                r.x = v.x * m[3 * 0 + 0] + v.y * m[3 * 1 + 0] + v.z * m[3 * 2 + 0];
                r.y = v.x * m[3 * 0 + 1] + v.y * m[3 * 1 + 1] + v.z * m[3 * 2 + 1];
                r.z = v.x * m[3 * 0 + 2] + v.y * m[3 * 1 + 2] + v.z * m[3 * 2 + 2];
                return r;
            }

            function matrix3MutiplyMatrix3(m1, m2) {
                var m = new Array();
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        m[i * 3 + j] = 0;
                        for (var k = 0; k < 3; k++) {
                            m[i * 3 + j] += m1[i * 3 + k] * m2[k * 3 + j];
                        }
                    }
                }
                return m;
            }

            function crossProduct(a, b) {
                var c = {};
                c.x = a.y * b.z - a.z * b.y;
                c.y = a.z * b.x - a.x * b.z;
                c.z = a.x * b.y - a.y * b.x;
                return c;
            }

            function rotateX(radians) {
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var m = [1, 0, 0, 0, cos, sin, 0, -1 * sin, cos];
                return m;
            }

            function rotateY(radians) {
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var m = [cos, 0, -1 * sin, 0, 1, 0, sin, 0, cos];
                return m;
            }

            function rotateZ(radians) {
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var m = [cos, sin, 0, -1 * sin, cos, 0, 0, 0, 1];
                return m;
            }

            function abs(a) {
                if (a < 0) {
                    a *= -1;
                }
                return a;
            }

            function dotProduct(a, b) {
                return a.x * b.x + a.y * b.y + a.z * b.z;
            }

            function lengthOf(v) {
                return Math.sqrt(dotProduct(v, v));
            }

            function unitization(v) {
                var u = {};
                var len = lengthOf(v);
                u.x = v.x / len;
                u.y = v.y / len;
                u.z = v.z / len;
                return u;
            }

            const X = {x: 1, y: 0, z: 0};
            const Y = {x: 0, y: 1, z: 0};
            const Z = {x: 0, y: 0, z: 1};

            function rotate(axis, rad) {
                var r;
                var dotAxisX = dotProduct(axis, X);
                var radAxisX = Math.acos(dotAxisX);
                var dotAxisY = dotProduct(axis, Y);
                var radAxisY = Math.acos(dotAxisY);
                if (abs(dotAxisX) < abs(dotAxisY)) {
                    var b = unitization(crossProduct(axis, X));
                    var dotBY = dotProduct(b, Y);
                    var radBY = Math.acos(dotBY);
                    var dotBZ = dotProduct(b, Z);
                    var radBZ = Math.acos(dotBZ);
                    if (abs(dotBY) < abs(dotBZ)) {
                        if (b.z > 0) {
                            radBY *= -1;
                        }
                        r = rotateX(radBY);
                        axis = vector3MutiplyMatrix3(axis, r);
                        if (axis.z < 0) {
                            radAxisX *= -1;
                        }
                        r = matrix3MutiplyMatrix3(r, rotateY(radAxisX));
                        r = matrix3MutiplyMatrix3(r, rotateX(rad));
                        r = matrix3MutiplyMatrix3(r, rotateY(-1 * radAxisX));
                        r = matrix3MutiplyMatrix3(r, rotateX(-1 * radBY));
                    } else {
                        if (b.y < 0) {
                            radBZ *= -1;
                        }
                        r = rotateX(radBZ);
                        axis = vector3MutiplyMatrix3(axis, r);
                        if (axis.y > 0) {
                            radAxisX *= -1;
                        }
                        r = matrix3MutiplyMatrix3(r, rotateZ(radAxisX));
                        r = matrix3MutiplyMatrix3(r, rotateX(rad));
                        r = matrix3MutiplyMatrix3(r, rotateZ(-1 * radAxisX));
                        r = matrix3MutiplyMatrix3(r, rotateX(-1 * radBZ));
                    }
                } else {
                    var b = unitization(crossProduct(axis, Y));
                    var dotBX = dotProduct(b, X);
                    var radBX = Math.acos(dotBX);
                    var dotBZ = dotProduct(b, Z);
                    var radBZ = Math.acos(dotBZ);
                    if (abs(dotBX) < abs(dotBZ)) {
                        if (b.z < 0) {
                            radBX *= -1;
                        }
                        r = rotateY(radBX);
                        axis = vector3MutiplyMatrix3(axis, r);
                        if (axis.z > 0) {
                            radAxisY *= -1;
                        }
                        r = matrix3MutiplyMatrix3(r, rotateX(radAxisY));
                        r = matrix3MutiplyMatrix3(r, rotateY(rad));
                        r = matrix3MutiplyMatrix3(r, rotateX(-1 * radAxisY));
                        r = matrix3MutiplyMatrix3(r, rotateY(-1 * radBX));
                    } else {
                        if (b.x > 0) {
                            radBZ *= -1;
                        }
                        r = rotateY(radBZ);
                        axis = vector3MutiplyMatrix3(axis, r);
                        if (axis.x < 0) {
                            radAxisY *= -1;
                        }
                        r = matrix3MutiplyMatrix3(r, rotateZ(radAxisY));
                        r = matrix3MutiplyMatrix3(r, rotateY(rad));
                        r = matrix3MutiplyMatrix3(r, rotateZ(-1 * radAxisY));
                        r = matrix3MutiplyMatrix3(r, rotateY(-1 * radBZ));
                    }
                }
                return r;
            }

            var angle = dotProduct(a, b)
            var angle = Math.acos(angle)

            var axis = crossProduct(a, b)
            var alen = lengthOf(axis)
            if (alen < 0.00000001) {
                return [1, 0, 0, 0, 1, 0, 0, 0, 1]
            }
            else {
                axis = unitization(axis)
                return rotate(axis, angle);
            }
        }

        function rotateObject3D(object, rotateMatrix) {
            function matrix3MutiplyMatrix3(m1, m2) {
                var m = new Array();
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        m[i * 3 + j] = 0;
                        for (var k = 0; k < 3; k++) {
                            m[i * 3 + j] += m1[i * 3 + k] * m2[k * 3 + j];
                        }
                    }
                }
                return m;
            }

            var m = [
                object.matrix.elements[0],
                object.matrix.elements[1],
                object.matrix.elements[2],
                object.matrix.elements[4],
                object.matrix.elements[5],
                object.matrix.elements[6],
                object.matrix.elements[8],
                object.matrix.elements[9],
                object.matrix.elements[10]
            ];

            var nm = matrix3MutiplyMatrix3(m, rotateMatrix);

            object.matrix.elements = [
                nm[0],
                nm[1],
                nm[2],
                object.matrix.elements[3],
                nm[3],
                nm[4],
                nm[5],
                object.matrix.elements[7],
                nm[6],
                nm[7],
                nm[8],
                object.matrix.elements[11],
                object.matrix.elements[12],
                object.matrix.elements[13],
                object.matrix.elements[14],
                object.matrix.elements[15]
            ];
            object.matrix.decompose(object.position, object.quaternion, object.scale);
        }


        var length = lengthOf(start, end)
        var geometry = new THREE.BoxGeometry(length, width, width);
        var originDirection = {x: 1, y: 0, z: 0}
        var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        var line = new THREE.Mesh(geometry, material);

        var direction = unitization(subtract(start, end))


        var m = getRotateMatrix(originDirection, direction)
        rotateObject3D(line, m)


        line.position.x = (start.x + end.x) / 2
        line.position.y = (start.y + end.y) / 2
        line.position.z = (start.z + end.z) / 2

        return line
    }

    var group = new THREE.Group()
    for (let i = 0; i < polyline.length - 1; i++) {
        var line = lineGeometry(polyline[i], polyline[i + 1], width)
        group.add(line)
    }
    return group
}