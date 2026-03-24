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
camera.position.set(0, 40, 120);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * =============================================================================
 * 核心概念：旋转、缩放、平移几何体
 * =============================================================================
 *
 * 【两种变换方式的区别】
 *
 * 1. 变换 Mesh（模型矩阵变换）
 *    - mesh.position / mesh.rotation / mesh.scale
 *    - 不修改几何体的顶点数据
 *    - 多个Mesh共享同一个几何体时，可以有不同的变换
 *
 * 2. 变换 Geometry（直接修改顶点）
 *    - geometry.translate() / rotateX() / scale()
 *    - 永久修改几何体的顶点坐标
 *    - 所有使用该几何体的Mesh都会受影响
 *
 * 【几何体变换方法】
 * - geometry.translate(x, y, z)：平移几何体
 * - geometry.rotateX(angle)：绕X轴旋转
 * - geometry.rotateY(angle)：绕Y轴旋转
 * - geometry.rotateZ(angle)：绕Z轴旋转
 * - geometry.scale(x, y, z)：缩放几何体
 * - geometry.center()：将几何体中心移到原点
 *
 * 【注意事项】
 * - 几何体变换是永久性的，会修改顶点数据
 * - 旋转角度单位是弧度（radians）
 * - 变换顺序很重要！先旋转再平移 vs 先平移再旋转，结果不同
 * =============================================================================
 */

/**
 * =============================================================================
 * 示例1：原始几何体（未变换）
 * =============================================================================
 */
const originalGeometry = new THREE.BoxGeometry(15, 15, 15);
const originalMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const originalMesh = new THREE.Mesh(originalGeometry, originalMaterial);
originalMesh.position.set(-60, 30, 0);
scene.add(originalMesh);

// 添加坐标轴辅助
const originalAxes = new THREE.AxesHelper(20);
originalAxes.position.copy(originalMesh.position);
scene.add(originalAxes);

/**
 * =============================================================================
 * 示例2：平移几何体 - geometry.translate()
 * =============================================================================
 *
 * 将几何体的所有顶点沿指定方向移动
 * 注意：这是相对于几何体自身的原点(0,0,0)进行平移
 */
const translatedGeometry = new THREE.BoxGeometry(15, 15, 15);
// 将几何体沿X轴平移20单位，Y轴平移10单位
translatedGeometry.translate(20, 10, 0);

const translatedMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const translatedMesh = new THREE.Mesh(translatedGeometry, translatedMaterial);
translatedMesh.position.set(-60, 30, 0); // Mesh位置与原始相同
scene.add(translatedMesh);

// 添加坐标轴辅助（与原始位置相同）
const translatedAxes = new THREE.AxesHelper(20);
translatedAxes.position.set(0, 30, 0);
scene.add(translatedAxes);

/**
 * =============================================================================
 * 示例3：旋转几何体 - geometry.rotateX/Y/Z()
 * =============================================================================
 *
 * 绕几何体自身的轴旋转（通过原点）
 * 注意：旋转是绕原点进行的，所以如果几何体不在原点，旋转后会"甩出去"
 */
const rotatedGeometry = new THREE.BoxGeometry(15, 15, 15);
// 绕X轴旋转45度（π/4弧度）
rotatedGeometry.rotateX(Math.PI / 4);
// 再绕Y轴旋转30度
rotatedGeometry.rotateY(Math.PI / 6);

const rotatedMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  wireframe: true,
});
const rotatedMesh = new THREE.Mesh(rotatedGeometry, rotatedMaterial);
rotatedMesh.position.set(0, 30, 0);
scene.add(rotatedMesh);

const rotatedAxes = new THREE.AxesHelper(20);
rotatedAxes.position.copy(rotatedMesh.position);
scene.add(rotatedAxes);

/**
 * =============================================================================
 * 示例4：缩放几何体 - geometry.scale()
 * =============================================================================
 *
 * 沿X/Y/Z轴缩放几何体
 * scale(2, 1, 1) 表示X方向放大2倍，Y和Z不变
 */
const scaledGeometry = new THREE.BoxGeometry(15, 15, 15);
// X方向放大2倍，Y方向缩小0.5倍，Z方向不变
scaledGeometry.scale(2, 0.5, 1);

const scaledMaterial = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  wireframe: true,
});
const scaledMesh = new THREE.Mesh(scaledGeometry, scaledMaterial);
scaledMesh.position.set(60, 30, 0);
scene.add(scaledMesh);

const scaledAxes = new THREE.AxesHelper(20);
scaledAxes.position.copy(scaledMesh.position);
scene.add(scaledAxes);

/**
 * =============================================================================
 * 示例5：组合变换 - 平移 + 旋转 + 缩放
 * =============================================================================
 *
 * 变换顺序很重要！
 * 不同的顺序会产生不同的结果
 */

// ---------- 组合1：先旋转再平移 ----------
const combo1Geometry = new THREE.BoxGeometry(10, 10, 10);
combo1Geometry.rotateZ(Math.PI / 4);  // 先旋转
combo1Geometry.translate(15, 0, 0);   // 再平移

const combo1Material = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
});
const combo1Mesh = new THREE.Mesh(combo1Geometry, combo1Material);
combo1Mesh.position.set(-50, -30, 0);
scene.add(combo1Mesh);

// ---------- 组合2：先平移再旋转（结果不同！）----------
const combo2Geometry = new THREE.BoxGeometry(10, 10, 10);
combo2Geometry.translate(15, 0, 0);   // 先平移
combo2Geometry.rotateZ(Math.PI / 4);  // 再旋转

const combo2Material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const combo2Mesh = new THREE.Mesh(combo2Geometry, combo2Material);
combo2Mesh.position.set(0, -30, 0);
scene.add(combo2Mesh);

// ---------- 组合3：完整变换 ----------
const combo3Geometry = new THREE.BoxGeometry(10, 10, 10);
combo3Geometry.scale(1.5, 1, 0.5);    // 先缩放
combo3Geometry.rotateY(Math.PI / 4);  // 再旋转
combo3Geometry.translate(10, 5, 0);   // 最后平移

const combo3Material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: true,
});
const combo3Mesh = new THREE.Mesh(combo3Geometry, combo3Material);
combo3Mesh.position.set(50, -30, 0);
scene.add(combo3Mesh);

/**
 * =============================================================================
 * 示例6：geometry.center() - 将几何体中心移到原点
 * =============================================================================
 *
 * 如果几何体经过多次变换后不在原点，
 * 可以使用 center() 方法将其中心重新移到原点
 */
const offCenterGeometry = new THREE.BoxGeometry(10, 10, 10);
offCenterGeometry.translate(20, 10, 0); // 先移走
// offCenterGeometry.center(); // 取消注释这行，几何体会回到原点

const offCenterMaterial = new THREE.MeshBasicMaterial({
  color: 0x9900ff,
  wireframe: true,
});
const offCenterMesh = new THREE.Mesh(offCenterGeometry, offCenterMaterial);
offCenterMesh.position.set(0, -80, 0);
scene.add(offCenterMesh);

// 显示边界框辅助
const offCenterBox = new THREE.Box3Helper(
  new THREE.Box3().setFromObject(offCenterMesh),
  0xff0000
);
offCenterBox.position.copy(offCenterMesh.position);
scene.add(offCenterBox);

/**
 * =============================================================================
 * 对比：Mesh变换 vs Geometry变换
 * =============================================================================
 *
 * 左边：通过 Mesh.position 移动（不修改顶点）
 * 右边：通过 Geometry.translate 移动（修改顶点）
 */

// Mesh变换
const meshTransformGeometry = new THREE.BoxGeometry(10, 10, 10);
const meshTransformMaterial = new THREE.MeshBasicMaterial({
  color: 0x66ff66,
  wireframe: true,
});
const meshTransformMesh = new THREE.Mesh(meshTransformGeometry, meshTransformMaterial);
meshTransformMesh.position.set(-40, -80, 0); // 通过Mesh的position移动
scene.add(meshTransformMesh);

// Geometry变换
const geoTransformGeometry = new THREE.BoxGeometry(10, 10, 10);
geoTransformGeometry.translate(0, 0, 0); // 几何体本身不变
const geoTransformMaterial = new THREE.MeshBasicMaterial({
  color: 0x6666ff,
  wireframe: true,
});
const geoTransformMesh = new THREE.Mesh(geoTransformGeometry, geoTransformMaterial);
geoTransformMesh.position.set(40, -80, 0);
scene.add(geoTransformMesh);

/**
 * =============================================================================
 * 辅助函数：创建文字标签
 * =============================================================================
 */
function createLabel(text, position, color = 0xffffff) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 200, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(45, 5.6, 1);
  return sprite;
}

// 添加标签
scene.add(createLabel("原始几何体", { x: -60, y: 55, z: 0 }, 0xffffff));
scene.add(createLabel("translate(20,10,0)", { x: -60, y: 5, z: 0 }, 0x00ff00));
scene.add(createLabel("rotateX+rotateY", { x: 0, y: 55, z: 0 }, 0xff6600));
scene.add(createLabel("scale(2,0.5,1)", { x: 60, y: 55, z: 0 }, 0x0099ff));
scene.add(createLabel("先旋转再平移", { x: -50, y: -5, z: 0 }, 0xff00ff));
scene.add(createLabel("先平移再旋转", { x: 0, y: -5, z: 0 }, 0xffff00));
scene.add(createLabel("缩放+旋转+平移", { x: 50, y: -5, z: 0 }, 0x00ffff));
scene.add(createLabel("translate(20,10,0)后", { x: 0, y: -55, z: 0 }, 0x9900ff));
scene.add(createLabel("Mesh.position变换", { x: -40, y: -55, z: 0 }, 0x66ff66));
scene.add(createLabel("Geometry变换对比", { x: 40, y: -55, z: 0 }, 0x6666ff));

/**
 * =============================================================================
 * 打印顶点信息到控制台（观察变换前后的差异）
 * =============================================================================
 */
console.log("=".repeat(60));
console.log("几何体变换 - 顶点数据对比");
console.log("=".repeat(60));

// 打印原始几何体的边界
const originalBox = new THREE.Box3().setFromBufferAttribute(
  originalGeometry.attributes.position
);
console.log("\n【原始几何体】");
console.log("  边界:", 
  `(${originalBox.min.x.toFixed(1)}, ${originalBox.min.y.toFixed(1)}, ${originalBox.min.z.toFixed(1)})`,
  `→ (${originalBox.max.x.toFixed(1)}, ${originalBox.max.y.toFixed(1)}, ${originalBox.max.z.toFixed(1)})`
);

// 打印平移后几何体的边界
const translatedBox = new THREE.Box3().setFromBufferAttribute(
  translatedGeometry.attributes.position
);
console.log("\n【平移后几何体 translate(20, 10, 0)】");
console.log("  边界:", 
  `(${translatedBox.min.x.toFixed(1)}, ${translatedBox.min.y.toFixed(1)}, ${translatedBox.min.z.toFixed(1)})`,
  `→ (${translatedBox.max.x.toFixed(1)}, ${translatedBox.max.y.toFixed(1)}, ${translatedBox.max.z.toFixed(1)})`
);

// 打印缩放后几何体的边界
const scaledBox = new THREE.Box3().setFromBufferAttribute(
  scaledGeometry.attributes.position
);
console.log("\n【缩放后几何体 scale(2, 0.5, 1)】");
console.log("  边界:", 
  `(${scaledBox.min.x.toFixed(1)}, ${scaledBox.min.y.toFixed(1)}, ${scaledBox.min.z.toFixed(1)})`,
  `→ (${scaledBox.max.x.toFixed(1)}, ${scaledBox.max.y.toFixed(1)}, ${scaledBox.max.z.toFixed(1)})`
);

console.log("\n" + "=".repeat(60));
console.log("提示: 变换顺序很重要！");
console.log("先旋转再平移 ≠ 先平移再旋转");
console.log("=".repeat(60));

/**
 * AxesHelper：全局辅助坐标系
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
