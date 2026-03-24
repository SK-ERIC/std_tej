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
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * =============================================================================
 * 核心概念：构建矩形平面几何体
 * =============================================================================
 *
 * 【什么是矩形平面？】
 * 矩形平面是最基础的 2D 几何体，由两个三角形拼接而成
 *
 * 【三种创建方式】
 * 1. 使用 Three.js 内置的 PlaneGeometry（最简单）
 * 2. 手动定义顶点，不使用索引（6个顶点，有重复）
 * 3. 手动定义顶点，使用索引优化（4个顶点，无重复）
 *
 * 【顶点布局示意图】
 *
 *    左上(0) -------- 右上(2)
 *      |    \        |
 *      |      \      |
 *      |        \    |
 *    左下(1) -------- 右下(3)
 *
 * 两个三角形：
 * - 三角形1: 0 → 1 → 2（逆时针）
 * - 三角形2: 2 → 1 → 3（逆时针）
 * =============================================================================
 */

/**
 * =============================================================================
 * 方法1：使用 Three.js 内置的 PlaneGeometry（推荐）
 * =============================================================================
 *
 * 最简单的方式，Three.js 已经帮我们封装好了
 *
 * PlaneGeometry(width, height, widthSegments, heightSegments)
 * - width: 平面宽度
 * - height: 平面高度
 * - widthSegments: 宽度方向分段数（可选）
 * - heightSegments: 高度方向分段数（可选）
 */
const planeGeometry1 = new THREE.PlaneGeometry(40, 30);

const planeMaterial1 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.position.x = -60;
scene.add(plane1);

/**
 * =============================================================================
 * 方法2：手动定义顶点，不使用索引
 * =============================================================================
 *
 * 两个三角形 = 6 个顶点（有重复）
 * 适合理解原理，但不推荐用于复杂模型（浪费内存）
 */
const geometry2 = new THREE.BufferGeometry();

// 定义 6 个顶点（两个三角形）
// 注意：顶点顺序必须是逆时针（从正面看）
const vertices2 = new Float32Array([
  // 第一个三角形（上半部分）
  -20,
  15,
  0, // 顶点0: 左上
  -20,
  -15,
  0, // 顶点1: 左下
  20,
  15,
  0, // 顶点2: 右上

  // 第二个三角形（下半部分）
  20,
  15,
  0, // 顶点3: 右上（与顶点2重复）
  -20,
  -15,
  0, // 顶点4: 左下（与顶点1重复）
  20,
  -15,
  0, // 顶点5: 右下
]);

geometry2.attributes.position = new THREE.BufferAttribute(vertices2, 3);

const material2 = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  side: THREE.DoubleSide,
});

const plane2 = new THREE.Mesh(geometry2, material2);
scene.add(plane2);

/**
 * =============================================================================
 * 方法3：使用索引优化（推荐用于自定义几何体）
 * =============================================================================
 *
 * 只定义 4 个不重复的顶点，用索引复用
 *
 * 优点：
 * - 节省内存（4个顶点 vs 6个顶点）
 * - 修改顶点时只需改一处
 */
const geometry3 = new THREE.BufferGeometry();

// 只定义 4 个不重复的顶点
const vertices3 = new Float32Array([
  -20,
  15,
  0, // 索引0: 左上
  -20,
  -15,
  0, // 索引1: 左下
  20,
  15,
  0, // 索引2: 右上
  20,
  -15,
  0, // 索引3: 右下
]);

// 索引：定义如何连接顶点形成三角形
const indices3 = new Uint16Array([
  0,
  1,
  2, // 第一个三角形: 左上 → 左下 → 右上
  2,
  1,
  3, // 第二个三角形: 右上 → 左下 → 右下
]);

geometry3.attributes.position = new THREE.BufferAttribute(vertices3, 3);
geometry3.index = new THREE.BufferAttribute(indices3, 1);

const material3 = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  side: THREE.DoubleSide,
});

const plane3 = new THREE.Mesh(geometry3, material3);
plane3.position.x = 60;
scene.add(plane3);

/**
 * =============================================================================
 * 额外示例：添加线框辅助显示
 * =============================================================================
 *
 * 使用 EdgesGeometry 显示矩形边界
 */
const edgesGeometry = new THREE.EdgesGeometry(geometry3);
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
edges.position.x = 60;
edges.position.y = -40;
scene.add(edges);

// 为线框版本也创建一个填充版本
const wireframePlane = new THREE.Mesh(
  geometry3.clone(),
  new THREE.MeshBasicMaterial({
    color: 0x0099ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  }),
);
wireframePlane.position.x = 60;
wireframePlane.position.y = -40;
scene.add(wireframePlane);

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
  ctx.font = "bold 28px Arial";
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
  createLabel("方法1: PlaneGeometry(内置)", { x: -60, y: 30, z: 0 }, 0x00ff00),
);
scene.add(
  createLabel("方法2: 6个顶点(无索引)", { x: 0, y: 30, z: 0 }, 0xff6600),
);
scene.add(
  createLabel("方法3: 4个顶点+索引(推荐)", { x: 60, y: 30, z: 0 }, 0x0099ff),
);
scene.add(
  createLabel("线框显示(EdgesGeometry)", { x: 60, y: -70, z: 0 }, 0xffffff),
);

/**
 * =============================================================================
 * 打印顶点信息（用于学习调试）
 * =============================================================================
 */
console.log("========== 矩形平面几何体信息 ==========");

console.log("\n【方法1: PlaneGeometry】");
console.log("顶点数量:", planeGeometry1.attributes.position.count); // 4

console.log("\n【方法2: 6个顶点无索引】");
console.log("顶点数量:", geometry2.attributes.position.count); // 6
console.log("使用索引:", geometry2.index ? "是" : "否"); // 否

console.log("\n【方法3: 4个顶点+索引】");
console.log("顶点数量:", geometry3.attributes.position.count); // 4
console.log("索引数量:", geometry3.index.count); // 6
console.log("使用索引:", geometry3.index ? "是" : "否"); // 是

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

function render() {
  controls.update();

  // 让平面轻微旋转，方便观察
  plane1.rotation.y += 0.005;
  plane2.rotation.y += 0.005;
  plane3.rotation.y += 0.005;
  wireframePlane.rotation.y += 0.005;
  edges.rotation.y += 0.005;

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
