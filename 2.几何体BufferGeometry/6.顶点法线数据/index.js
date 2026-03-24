// 引入three.js核心库
import * as THREE from "three";
// 导入 OrbitControls 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 创建场景
const scene = new THREE.Scene();

// 设置背景色为深灰色，方便观察光照效果
scene.background = new THREE.Color(0x1a1a2e);

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
 * 核心概念：顶点法线数据（Normal）
 * =============================================================================
 *
 * 【什么是法线？】
 * 法线是一个垂直于表面的向量（箭头），表示表面的"朝向"
 *
 * 【法线的作用】
 * 法线主要用于光照计算：
 * - 光线照射角度 → 决定表面亮度
 * - 法线朝向光源 → 表面更亮
 * - 法线背向光源 → 表面更暗
 *
 * 【为什么 MeshBasicMaterial 不需要法线？】
 * MeshBasicMaterial 不受光照影响，所以不需要法线数据
 * 但 MeshStandardMaterial、MeshPhongMaterial 等材质需要法线
 *
 * 【法线示意图】
 *
 *        ↑ 法线（垂直于表面）
 *        |
 *   ─────┼─────  表面
 *        |
 *        ↓
 *
 * 【两种法线模式】
 * 1. 面法线（Flat Shading）：每个面一个法线，棱角分明
 * 2. 顶点法线（Smooth Shading）：每个顶点一个法线，平滑过渡
 * =============================================================================
 */

/**
 * =============================================================================
 * 添加光源（法线需要配合光照才能看到效果）
 * =============================================================================
 */

// 环境光：均匀照亮所有物体
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// 平行光：模拟太阳光，有方向
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// 点光源：从一个点向四周发光
const pointLight = new THREE.PointLight(0xff6600, 0.5, 200);
pointLight.position.set(-30, 30, 30);
scene.add(pointLight);

/**
 * =============================================================================
 * 对比1：无法线 vs 有法线
 * =============================================================================
 *
 * 左边：使用 MeshBasicMaterial（不需要法线，不受光照影响）
 * 右边：使用 MeshStandardMaterial（需要法线，受光照影响）
 */

// ---------- 无法线：MeshBasicMaterial ----------
const basicGeometry = new THREE.PlaneGeometry(25, 25);
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const basicMesh = new THREE.Mesh(basicGeometry, basicMaterial);
basicMesh.position.x = -40;
basicMesh.rotation.x = -Math.PI / 6;
scene.add(basicMesh);

// ---------- 有法线：MeshStandardMaterial ----------
const standardGeometry = new THREE.PlaneGeometry(25, 25);
// PlaneGeometry 会自动计算法线
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const standardMesh = new THREE.Mesh(standardGeometry, standardMaterial);
standardMesh.position.x = 40;
standardMesh.rotation.x = -Math.PI / 6;
scene.add(standardMesh);

/**
 * =============================================================================
 * 对比2：平面着色 vs 平滑着色
 * =============================================================================
 *
 * 平面着色（Flat Shading）：每个面一个法线，棱角分明
 * 平滑着色（Smooth Shading）：顶点法线平均化，表面平滑
 */

// ---------- 平面着色 ----------
const flatGeometry = new THREE.SphereGeometry(15, 8, 6);
// flatShading: true 使用平面着色
const flatMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6600,
  flatShading: true, // 平面着色
});
const flatMesh = new THREE.Mesh(flatGeometry, flatMaterial);
flatMesh.position.set(-40, -40, 0);
scene.add(flatMesh);

// ---------- 平滑着色 ----------
const smoothGeometry = new THREE.SphereGeometry(15, 8, 6);
const smoothMaterial = new THREE.MeshStandardMaterial({
  color: 0x0099ff,
  // flatShading 默认为 false，使用平滑着色
});
const smoothMesh = new THREE.Mesh(smoothGeometry, smoothMaterial);
smoothMesh.position.set(0, -40, 0);
scene.add(smoothMesh);

/**
 * =============================================================================
 * 示例3：手动定义法线 vs 自动计算法线
 * =============================================================================
 */

// ---------- 手动定义法线的三角形 ----------
const manualGeometry = new THREE.BufferGeometry();

const manualVertices = new Float32Array([0, 20, 0, -15, -10, 0, 15, -10, 0]);

// 手动定义法线（每个顶点一个法线向量）
// 法线向量需要归一化（长度为1）
// 这里三角形在XY平面上，法线指向Z轴正方向 (0, 0, 1)
const manualNormals = new Float32Array([
  0,
  0,
  1, // 顶点0的法线
  0,
  0,
  1, // 顶点1的法线
  0,
  0,
  1, // 顶点2的法线
]);

manualGeometry.attributes.position = new THREE.BufferAttribute(
  manualVertices,
  3,
);
manualGeometry.attributes.normal = new THREE.BufferAttribute(manualNormals, 3);

const manualMaterial = new THREE.MeshStandardMaterial({
  color: 0xff00ff,
  side: THREE.DoubleSide,
});
const manualMesh = new THREE.Mesh(manualGeometry, manualMaterial);
manualMesh.position.set(40, -40, 0);
scene.add(manualMesh);

// ---------- 自动计算法线 ----------
const autoGeometry = new THREE.BufferGeometry();
autoGeometry.attributes.position = new THREE.BufferAttribute(
  new Float32Array([0, 20, 0, -15, -10, 0, 15, -10, 0]),
  3,
);

// 使用 computeVertexNormals() 自动计算法线
autoGeometry.computeVertexNormals();

const autoMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const autoMesh = new THREE.Mesh(autoGeometry, autoMaterial);
autoMesh.position.set(40, -40, 0);
autoMesh.position.z = 20;
scene.add(autoMesh);

/**
 * =============================================================================
 * 示例4：可视化法线（使用箭头辅助器）
 * =============================================================================
 */

// 创建一个简单的矩形来展示法线
const normalDemoGeometry = new THREE.PlaneGeometry(30, 30);
const normalDemoMaterial = new THREE.MeshStandardMaterial({
  color: 0x6666ff,
  side: THREE.DoubleSide,
});
const normalDemoMesh = new THREE.Mesh(normalDemoGeometry, normalDemoMaterial);
normalDemoMesh.position.set(0, -90, 0);
normalDemoMesh.rotation.x = -Math.PI / 3;
scene.add(normalDemoMesh);

// 使用 VertexNormalsHelper 可视化法线
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";

const normalHelper = new VertexNormalsHelper(normalDemoMesh, 5, 0xff0000);
scene.add(normalHelper);

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
  ctx.font = "bold 22px Arial";
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
  createLabel("MeshBasicMaterial(无法线)", { x: -40, y: 25, z: 0 }, 0x00ff00),
);
scene.add(
  createLabel("MeshStandardMaterial(有法线)", { x: 40, y: 25, z: 0 }, 0x00ff00),
);
scene.add(
  createLabel("平面着色(flatShading)", { x: -40, y: -15, z: 0 }, 0xff6600),
);
scene.add(createLabel("平滑着色(默认)", { x: 0, y: -15, z: 0 }, 0x0099ff));
scene.add(createLabel("手动定义法线", { x: 40, y: -15, z: 0 }, 0xff00ff));
scene.add(
  createLabel("法线可视化(红色箭头)", { x: 0, y: -65, z: 0 }, 0xff0000),
);

/**
 * =============================================================================
 * 打印法线信息到控制台（学习用）
 * =============================================================================
 */
console.log("========== 顶点法线数据 ==========");

console.log("\n【PlaneGeometry 的法线】");
console.log("法线数量:", standardGeometry.attributes.normal.count);
console.log(
  "第一个法线向量:",
  standardGeometry.attributes.normal.getX(0),
  standardGeometry.attributes.normal.getY(0),
  standardGeometry.attributes.normal.getZ(0),
);

console.log("\n【手动定义法线】");
console.log("法线数量:", manualGeometry.attributes.normal.count);
console.log("所有法线都是:", "(0, 0, 1) - 指向Z轴正方向");

console.log("\n【computeVertexNormals() 的结果】");
console.log(
  "自动计算的法线:",
  autoGeometry.attributes.normal.getX(0),
  autoGeometry.attributes.normal.getY(0),
  autoGeometry.attributes.normal.getZ(0),
);

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

let time = 0;
function render() {
  time += 0.01;
  controls.update();

  // 让光源移动，观察光照变化
  pointLight.position.x = Math.sin(time) * 50;
  pointLight.position.z = Math.cos(time) * 50;

  // 让几何体旋转，方便观察
  flatMesh.rotation.y += 0.005;
  smoothMesh.rotation.y += 0.005;
  manualMesh.rotation.y += 0.005;
  autoMesh.rotation.y += 0.005;

  // 更新法线辅助器
  normalHelper.update();

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
