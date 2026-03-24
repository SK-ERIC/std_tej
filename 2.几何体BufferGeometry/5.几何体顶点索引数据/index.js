// 引入three.js核心库
import * as THREE from "three";
// 导入 OrbitControls 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 创建场景
const scene = new THREE.Scene();

/**
 * 透视相机
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 30, 80);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * =============================================================================
 * 核心概念：几何体顶点索引数据（Index）
 * =============================================================================
 *
 * 【什么是顶点索引？】
 * 顶点索引是一种优化技术，用于复用重复的顶点数据。
 *
 * 【为什么需要索引？】
 * 想象一个矩形，由2个三角形组成：
 * - 不使用索引：需要 6 个顶点（2个三角形 × 3个顶点）
 * - 使用索引：只需要 4 个顶点 + 6 个索引
 *
 * 对于复杂模型（如球体有数千个三角形），索引可以节省大量内存！
 *
 * 【索引的工作原理】
 *
 *    0 -------- 2
 *    |        / |
 *    |      /   |
 *    |    /     |
 *    |  /       |
 *    1 -------- 3
 *
 * 顶点数组：[顶点0, 顶点1, 顶点2, 顶点3]（只定义4个不重复的顶点）
 * 索引数组：[0, 1, 2,  2, 1, 3]（告诉GPU如何连接顶点）
 *
 * 索引数组中每3个数字代表一个三角形：
 * - [0, 1, 2] = 三角形1：使用顶点0、1、2
 * - [2, 1, 3] = 三角形2：使用顶点2、1、3
 *
 * 【索引的数据类型】
 * - Uint8Array: 0-255（最多256个顶点）
 * - Uint16Array: 0-65535（最多65536个顶点）
 * - Uint32Array: 0-4294967295（更多顶点）
 * =============================================================================
 */

/**
 * =============================================================================
 * 对比1：矩形 - 不使用索引 vs 使用索引
 * =============================================================================
 */

// ---------- 不使用索引：6个顶点 ----------
const geometryNoIndex = new THREE.BufferGeometry();
const verticesNoIndex = new Float32Array([
  // 三角形1
  -15,
  15,
  0, // 顶点0: 左上
  -15,
  -15,
  0, // 顶点1: 左下
  15,
  15,
  0, // 顶点2: 右上
  // 三角形2
  15,
  15,
  0, // 顶点3: 右上（重复！）
  -15,
  -15,
  0, // 顶点4: 左下（重复！）
  15,
  -15,
  0, // 顶点5: 右下
]);
geometryNoIndex.attributes.position = new THREE.BufferAttribute(
  verticesNoIndex,
  3,
);

const materialNoIndex = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  side: THREE.DoubleSide,
});

const meshNoIndex = new THREE.Mesh(geometryNoIndex, materialNoIndex);
meshNoIndex.position.x = -40;
scene.add(meshNoIndex);

// ---------- 使用索引：4个顶点 ----------
const geometryWithIndex = new THREE.BufferGeometry();
const verticesWithIndex = new Float32Array([
  -15,
  15,
  0, // 索引0: 左上
  -15,
  -15,
  0, // 索引1: 左下
  15,
  15,
  0, // 索引2: 右上
  15,
  -15,
  0, // 索引3: 右下
]);

// 索引数组：定义三角形如何连接顶点
const indices = new Uint16Array([
  0,
  1,
  2, // 三角形1: 顶点0 → 顶点1 → 顶点2
  2,
  1,
  3, // 三角形2: 顶点2 → 顶点1 → 顶点3
]);

geometryWithIndex.attributes.position = new THREE.BufferAttribute(
  verticesWithIndex,
  3,
);
geometryWithIndex.index = new THREE.BufferAttribute(indices, 1);

const materialWithIndex = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

const meshWithIndex = new THREE.Mesh(geometryWithIndex, materialWithIndex);
meshWithIndex.position.x = 40;
scene.add(meshWithIndex);

/**
 * =============================================================================
 * 示例2：立方体 - 展示索引的真正威力
 * =============================================================================
 *
 * 立方体有 6 个面，每个面 2 个三角形
 * - 不使用索引：6面 × 2三角形 × 3顶点 = 36 个顶点
 * - 使用索引：只有 8 个顶点（立方体的8个角）
 *
 * 索引让顶点数量减少了 77%！
 */

// 立方体的 8 个顶点
const cubeVertices = new Float32Array([
  // 前面4个顶点
  -10,
  10,
  10, // 0: 前左上
  -10,
  -10,
  10, // 1: 前左下
  10,
  10,
  10, // 2: 前右上
  10,
  -10,
  10, // 3: 前右下
  // 后面4个顶点
  -10,
  10,
  -10, // 4: 后左上
  -10,
  -10,
  -10, // 5: 后左下
  10,
  10,
  -10, // 6: 后右上
  10,
  -10,
  -10, // 7: 后右下
]);

// 12个三角形 = 36个索引
const cubeIndices = new Uint16Array([
  // 前面
  0, 1, 2, 2, 1, 3,
  // 后面
  6, 5, 4, 7, 5, 6,
  // 上面
  4, 0, 6, 6, 0, 2,
  // 下面
  1, 5, 3, 3, 5, 7,
  // 右面
  2, 3, 6, 6, 3, 7,
  // 左面
  4, 5, 0, 0, 5, 1,
]);

const cubeGeometry = new THREE.BufferGeometry();
cubeGeometry.attributes.position = new THREE.BufferAttribute(cubeVertices, 3);
cubeGeometry.index = new THREE.BufferAttribute(cubeIndices, 1);

const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  side: THREE.DoubleSide,
});

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.y = -45;
scene.add(cubeMesh);

// 为立方体添加线框
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
const cubeLines = new THREE.LineSegments(
  cubeEdges,
  new THREE.LineBasicMaterial({ color: 0xffffff }),
);
cubeLines.position.y = -45;
scene.add(cubeLines);

/**
 * =============================================================================
 * 示例3：动态修改索引顶点
 * =============================================================================
 *
 * 使用索引的一个好处：修改一个顶点，所有使用该顶点的三角形都会更新
 */

const dynamicGeometry = new THREE.BufferGeometry();
const dynamicVertices = new Float32Array([
  0,
  20,
  0, // 0: 顶部
  -15,
  -10,
  0, // 1: 左下
  15,
  -10,
  0, // 2: 右下
  0,
  0,
  15, // 3: 前方凸起
]);

const dynamicIndices = new Uint16Array([
  0,
  1,
  2, // 底面三角形
  0,
  1,
  3, // 左侧面
  0,
  3,
  2, // 右侧面
  3,
  1,
  2, // 前面
]);

dynamicGeometry.attributes.position = new THREE.BufferAttribute(
  dynamicVertices,
  3,
);
dynamicGeometry.index = new THREE.BufferAttribute(dynamicIndices, 1);

const dynamicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  side: THREE.DoubleSide,
});

const dynamicMesh = new THREE.Mesh(dynamicGeometry, dynamicMaterial);
dynamicMesh.position.x = -40;
dynamicMesh.position.y = -45;
scene.add(dynamicMesh);

/**
 * =============================================================================
 * 辅助函数：创建文字标签
 * =============================================================================
 */
function createLabel(text, position, color = 0xffffff) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 256, 42);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(50, 6.25, 1);
  return sprite;
}

// 添加标签
scene.add(
  createLabel("无索引: 6个顶点(有重复)", { x: -40, y: 25, z: 0 }, 0xff6600),
);
scene.add(
  createLabel("有索引: 4个顶点+6个索引", { x: 40, y: 25, z: 0 }, 0x00ff00),
);
scene.add(
  createLabel(
    "立方体: 8个顶点+36个索引(省77%)",
    { x: 0, y: -15, z: 0 },
    0x0099ff,
  ),
);
scene.add(
  createLabel("动态几何体(顶点可动画)", { x: -40, y: -75, z: 0 }, 0xff00ff),
);

/**
 * =============================================================================
 * 打印信息到控制台（学习用）
 * =============================================================================
 */
console.log("========== 顶点索引数据对比 ==========");

console.log("\n【矩形 - 无索引】");
console.log("顶点数量:", geometryNoIndex.attributes.position.count);
console.log("使用索引:", geometryNoIndex.index ? "是" : "否");
console.log(
  "内存占用(顶点):",
  geometryNoIndex.attributes.position.count * 3 * 4,
  "字节",
);

console.log("\n【矩形 - 有索引】");
console.log("顶点数量:", geometryWithIndex.attributes.position.count);
console.log("索引数量:", geometryWithIndex.index.count);
console.log(
  "内存占用(顶点+索引):",
  geometryWithIndex.attributes.position.count * 3 * 4 +
    geometryWithIndex.index.count * 2,
  "字节",
);

console.log("\n【立方体 - 有索引】");
console.log("顶点数量:", cubeGeometry.attributes.position.count);
console.log("索引数量:", cubeGeometry.index.count);
console.log("如果不使用索引需要:", 36, "个顶点");
console.log("使用索引节省:", (((36 - 8) / 36) * 100).toFixed(1) + "%");

/**
 * AxesHelper：辅助观察坐标系
 */
const axesHelper = new THREE.AxesHelper(80);
scene.add(axesHelper);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * OrbitControls 轨道控制器
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let time = 0;
function render() {
  time += 0.02;
  controls.update();

  // 让几何体旋转，方便观察
  meshNoIndex.rotation.y += 0.01;
  meshWithIndex.rotation.y += 0.01;
  cubeMesh.rotation.y += 0.01;
  cubeLines.rotation.y += 0.01;

  // 动态修改顶点位置（演示索引的好处）
  const positions = dynamicGeometry.attributes.position.array;
  // 让顶点3（前方凸起）上下移动
  positions[10] = 15 + Math.sin(time * 2) * 5; // z坐标
  dynamicGeometry.attributes.position.needsUpdate = true;

  dynamicMesh.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

/**
 * 窗口大小变化时，更新相机和渲染器
 */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
