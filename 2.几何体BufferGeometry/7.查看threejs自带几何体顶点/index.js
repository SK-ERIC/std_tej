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
camera.position.set(0, 30, 100);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * =============================================================================
 * 核心概念：查看 Three.js 自带几何体的顶点数据
 * =============================================================================
 *
 * 【为什么要了解顶点数据？】
 * 1. 理解3D模型的底层结构
 * 2. 进行高级的几何体操作（变形、动画等）
 * 3. 调试和优化性能
 *
 * 【如何访问顶点数据？】
 * 几何体.attributes.position 包含所有顶点的位置数据
 * - .count: 顶点数量
 * - .array: Float32Array 类型的原始数据
 * - .getX(i), .getY(i), .getZ(i): 获取第i个顶点的坐标
 *
 * 【索引数据】
 * 几何体.index 包含顶点索引
 * - .count: 索引数量
 * - .array: 索引数组
 *
 * 【常用属性】
 * - position: 顶点位置
 * - normal: 顶点法线
 * - uv: 纹理坐标
 * - color: 顶点颜色
 * =============================================================================
 */

/**
 * =============================================================================
 * 创建多个 Three.js 内置几何体，并展示它们的顶点信息
 * =============================================================================
 */

// 存储所有几何体信息，用于后续显示
const geometryInfoList = [];

/**
 * -----------------------------------------------------------------------------
 * 1. BoxGeometry（立方体）
 * -----------------------------------------------------------------------------
 */
const boxGeometry = new THREE.BoxGeometry(15, 15, 15);
const boxMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  wireframe: true, // 将几何体渲染为线框
});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(-50, 20, 0);
scene.add(boxMesh);

// 创建顶点可视化（用点显示每个顶点）
const boxPoints = createPointsVisualization(boxGeometry, 0xff0000);
boxPoints.position.copy(boxMesh.position);
scene.add(boxPoints);

geometryInfoList.push({
  name: "BoxGeometry",
  geometry: boxGeometry,
  mesh: boxMesh,
  points: boxPoints,
  description: "立方体：6个面 × 2三角形 × 3顶点 = 36顶点",
});

/**
 * -----------------------------------------------------------------------------
 * 2. SphereGeometry（球体）
 * -----------------------------------------------------------------------------
 */
const sphereGeometry = new THREE.SphereGeometry(12, 16, 12);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 20, 0);
scene.add(sphereMesh);

const spherePoints = createPointsVisualization(sphereGeometry, 0x00ff00);
spherePoints.position.copy(sphereMesh.position);
scene.add(spherePoints);

geometryInfoList.push({
  name: "SphereGeometry",
  geometry: sphereGeometry,
  mesh: sphereMesh,
  points: sphereMesh,
  description: "球体：宽度分段 × 高度分段 × 2三角形 × 3顶点",
});

/**
 * -----------------------------------------------------------------------------
 * 3. CylinderGeometry（圆柱体）
 * -----------------------------------------------------------------------------
 */
const cylinderGeometry = new THREE.CylinderGeometry(10, 10, 20, 16);
const cylinderMaterial = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  wireframe: true,
});
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(50, 20, 0);
scene.add(cylinderMesh);

const cylinderPoints = createPointsVisualization(cylinderGeometry, 0x0099ff);
cylinderPoints.position.copy(cylinderMesh.position);
scene.add(cylinderPoints);

geometryInfoList.push({
  name: "CylinderGeometry",
  geometry: cylinderGeometry,
  mesh: cylinderMesh,
  points: cylinderPoints,
  description: "圆柱体：顶面 + 底面 + 侧面",
});

/**
 * -----------------------------------------------------------------------------
 * 4. PlaneGeometry（平面）
 * -----------------------------------------------------------------------------
 */
const planeGeometry = new THREE.PlaneGeometry(25, 25, 4, 4);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.set(-50, -30, 0);
scene.add(planeMesh);

const planePoints = createPointsVisualization(planeGeometry, 0xff00ff);
planePoints.position.copy(planeMesh.position);
scene.add(planePoints);

geometryInfoList.push({
  name: "PlaneGeometry",
  geometry: planeGeometry,
  mesh: planeMesh,
  points: planePoints,
  description: "平面：(宽度分段+1) × (高度分段+1) 个顶点",
});

/**
 * -----------------------------------------------------------------------------
 * 5. ConeGeometry（圆锥）
 * -----------------------------------------------------------------------------
 */
const coneGeometry = new THREE.ConeGeometry(10, 20, 16);
const coneMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.set(0, -30, 0);
scene.add(coneMesh);

const conePoints = createPointsVisualization(coneGeometry, 0xffff00);
conePoints.position.copy(coneMesh.position);
scene.add(conePoints);

geometryInfoList.push({
  name: "ConeGeometry",
  geometry: coneGeometry,
  mesh: coneMesh,
  points: conePoints,
  description: "圆锥：底面 + 侧面三角形",
});

/**
 * -----------------------------------------------------------------------------
 * 6. TorusGeometry（圆环）
 * -----------------------------------------------------------------------------
 */
const torusGeometry = new THREE.TorusGeometry(12, 4, 8, 16);
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: true,
});
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(50, -30, 0);
scene.add(torusMesh);

const torusPoints = createPointsVisualization(torusGeometry, 0x00ffff);
torusPoints.position.copy(torusMesh.position);
scene.add(torusPoints);

geometryInfoList.push({
  name: "TorusGeometry",
  geometry: torusGeometry,
  mesh: torusMesh,
  points: torusPoints,
  description: "圆环：环形分段 × 管道分段 × 2三角形 × 3顶点",
});

/**
 * =============================================================================
 * 辅助函数：创建顶点可视化（用点模型显示每个顶点位置）
 * =============================================================================
 */
function createPointsVisualization(geometry, color) {
  const pointsGeometry = new THREE.BufferGeometry();

  // 复制顶点位置数据
  const positions = geometry.attributes.position.array;
  pointsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );

  const pointsMaterial = new THREE.PointsMaterial({
    color: color,
    size: 2,
    sizeAttenuation: true,
  });

  return new THREE.Points(pointsGeometry, pointsMaterial);
}

/**
 * =============================================================================
 * 辅助函数：创建文字标签
 * =============================================================================
 */
function createLabel(text, position, color = 0xffffff) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 200, 42);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(40, 6.4, 1);
  return sprite;
}

// 为每个几何体添加标签
scene.add(
  createLabel("BoxGeometry(立方体)", { x: -50, y: 45, z: 0 }, 0xff6600),
);
scene.add(createLabel("SphereGeometry(球体)", { x: 0, y: 45, z: 0 }, 0x00ff00));
scene.add(
  createLabel("CylinderGeometry(圆柱)", { x: 50, y: 45, z: 0 }, 0x0099ff),
);
scene.add(
  createLabel("PlaneGeometry(平面)", { x: -50, y: -5, z: 0 }, 0xff00ff),
);
scene.add(createLabel("ConeGeometry(圆锥)", { x: 0, y: -5, z: 0 }, 0xffff00));
scene.add(createLabel("TorusGeometry(圆环)", { x: 50, y: -5, z: 0 }, 0x00ffff));

/**
 * =============================================================================
 * 打印所有几何体的顶点信息到控制台
 * =============================================================================
 */
console.log("=".repeat(60));
console.log("Three.js 内置几何体顶点信息");
console.log("=".repeat(60));

geometryInfoList.forEach((info, index) => {
  const geometry = info.geometry;

  console.log(`\n【${index + 1}. ${info.name}】`);
  console.log(`  描述: ${info.description}`);
  console.log(`  顶点数量: ${geometry.attributes.position.count}`);
  console.log(`  是否使用索引: ${geometry.index ? "是" : "否"}`);

  if (geometry.index) {
    console.log(`  索引数量: ${geometry.index.count}`);
  }

  // 打印前3个顶点的坐标
  console.log(`  前3个顶点坐标:`);
  for (let i = 0; i < Math.min(3, geometry.attributes.position.count); i++) {
    const x = geometry.attributes.position.getX(i).toFixed(2);
    const y = geometry.attributes.position.getY(i).toFixed(2);
    const z = geometry.attributes.position.getZ(i).toFixed(2);
    console.log(`    顶点${i}: (${x}, ${y}, ${z})`);
  }

  // 打印其他属性
  const attributes = Object.keys(geometry.attributes);
  console.log(`  包含的属性: ${attributes.join(", ")}`);
});

console.log("\n" + "=".repeat(60));
console.log("提示: 彩色小点表示每个顶点的位置");
console.log("提示: 线框显示三角形的边界");
console.log("=".repeat(60));

/**
 * =============================================================================
 * 演示：如何访问和修改顶点数据
 * =============================================================================
 */
console.log("\n【演示：访问和修改顶点数据】");

// 创建一个简单的平面来演示
const demoGeometry = new THREE.PlaneGeometry(10, 10, 2, 2);
console.log("演示用平面顶点数:", demoGeometry.attributes.position.count);

// 方法1：通过 getX/Y/Z 访问
console.log("方法1 - getX/Y/Z:");
console.log(
  "  顶点0:",
  demoGeometry.attributes.position.getX(0),
  demoGeometry.attributes.position.getY(0),
  demoGeometry.attributes.position.getZ(0),
);

// 方法2：直接访问 array
console.log("方法2 - 直接访问 array:");
const posArray = demoGeometry.attributes.position.array;
console.log("  顶点0 (array[0-2]):", posArray[0], posArray[1], posArray[2]);

// 方法3：遍历所有顶点
console.log("方法3 - 遍历顶点:");
const positionAttribute = demoGeometry.attributes.position;
for (let i = 0; i < positionAttribute.count; i++) {
  // 可以在这里对每个顶点进行操作
}

// 修改顶点位置
console.log("\n【修改顶点位置】");
demoGeometry.attributes.position.setZ(0, 5); // 将第一个顶点的z坐标设为5
demoGeometry.attributes.position.needsUpdate = true; // 必须通知GPU更新
console.log("已将顶点0的z坐标修改为5");

/**
 * AxesHelper：辅助观察坐标系
 */
const axesHelper = new THREE.AxesHelper(60);
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

  // 让所有几何体缓慢旋转
  geometryInfoList.forEach((info) => {
    info.mesh.rotation.y += 0.005;
    info.points.rotation.y += 0.005;
  });

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
