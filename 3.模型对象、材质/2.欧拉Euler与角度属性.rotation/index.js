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
camera.position.set(100, 100, 100);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * 核心：欧拉 Euler 与角度属性 rotation
 *
 * Euler 是 Three.js 中表示欧拉角的类，包含 x、y、z 三个角度分量（弧度制）
 * 模型的 rotation 属性是 Euler 对象，用于控制模型的旋转
 *
 * 注意：Three.js 中角度使用弧度制，不是角度制
 * 弧度转角度：弧度 * (180 / Math.PI)
 * 角度转弧度：角度 * (Math.PI / 180)
 */

/**
 * 示例1：Euler 的创建方式
 */
// 方式1：使用构造函数（x, y, z 为弧度值）
const euler1 = new THREE.Euler(Math.PI / 4, 0, 0);

// 方式2：使用 set 方法
const euler2 = new THREE.Euler();
euler2.set(Math.PI / 4, 0, 0);

// 方式3：指定旋转顺序（默认为 'XYZ'）
const euler3 = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0, "XYZ");

console.log("Euler 示例:", euler1);

/**
 * 示例2：参考立方体（无旋转）
 */
const geometry0 = new THREE.BoxGeometry(10, 10, 10);
const material0 = new THREE.MeshBasicMaterial({
  color: 0x888888,
  wireframe: true,
});
const cube0 = new THREE.Mesh(geometry0, material0);
cube0.position.set(-50, 0, 0);
scene.add(cube0);

/**
 * 示例3：使用 rotation.set() 设置旋转
 */
const geometry1 = new THREE.BoxGeometry(10, 10, 10);
const material1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const cube1 = new THREE.Mesh(geometry1, material1);

// 方式1：使用 rotation.set() 设置旋转（弧度值）
cube1.rotation.set(Math.PI / 4, 0, 0);
cube1.position.set(0, 0, 0);
scene.add(cube1);

/**
 * 示例4：通过 Euler 对象设置旋转
 */
const geometry2 = new THREE.BoxGeometry(10, 10, 10);
const material2 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube2 = new THREE.Mesh(geometry2, material2);

// 方式2：创建 Euler 对象并复制到 rotation
const eulerRotation = new THREE.Euler(0, Math.PI / 4, 0);
cube2.rotation.copy(eulerRotation);
cube2.position.set(30, 0, 0);
scene.add(cube2);

/**
 * 示例5：单独设置 rotation 的 x、y、z
 */
const geometry3 = new THREE.BoxGeometry(10, 10, 10);
const material3 = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true,
});
const cube3 = new THREE.Mesh(geometry3, material3);

// 方式3：单独设置 x、y、z（弧度值）
cube3.rotation.x = 0;
cube3.rotation.y = 0;
cube3.rotation.z = Math.PI / 4;
cube3.position.set(60, 0, 0);
scene.add(cube3);

/**
 * 示例6：使用 MathUtils 工具方法（角度转弧度）
 */
const geometry4 = new THREE.BoxGeometry(10, 10, 10);
const material4 = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const cube4 = new THREE.Mesh(geometry4, material4);

// 使用 THREE.MathUtils.degToRad() 将角度转换为弧度
const angleInDegrees = 45;
const angleInRadians = THREE.MathUtils.degToRad(angleInDegrees);
cube4.rotation.set(angleInRadians, angleInRadians, 0);
cube4.position.set(0, 30, 0);
scene.add(cube4);

/**
 * 示例7：手动角度转弧度
 */
const geometry5 = new THREE.BoxGeometry(10, 10, 10);
const material5 = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
});
const cube5 = new THREE.Mesh(geometry5, material5);

// 手动转换：角度 * (Math.PI / 180)
const deg = 60;
const rad = deg * (Math.PI / 180);
cube5.rotation.set(0, rad, 0);
cube5.position.set(30, 30, 0);
scene.add(cube5);

/**
 * 示例8：欧拉角旋转顺序
 *
 * 欧拉角的旋转顺序会影响最终结果
 * Three.js 默认使用 'XYZ' 顺序
 * 可选顺序：'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'
 */
const geometry6 = new THREE.BoxGeometry(10, 10, 10);
const material6 = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: true,
});
const cube6 = new THREE.Mesh(geometry6, material6);

// 设置旋转顺序为 'YZX'
cube6.rotation.set(Math.PI / 4, Math.PI / 4, 0);
cube6.rotation.order = "YZX";
cube6.position.set(60, 30, 0);
scene.add(cube6);

/**
 * 示例9：组合旋转（多轴旋转）
 */
const geometry7 = new THREE.BoxGeometry(10, 10, 10);
const material7 = new THREE.MeshBasicMaterial({
  color: 0xff8800,
  wireframe: true,
});
const cube7 = new THREE.Mesh(geometry7, material7);

// 同时绕三个轴旋转
cube7.rotation.set(Math.PI / 6, Math.PI / 3, Math.PI / 4);
cube7.position.set(0, 60, 0);
scene.add(cube7);

/**
 * 示例10：动态旋转（在渲染循环中）
 */
const geometry8 = new THREE.BoxGeometry(10, 10, 10);
const material8 = new THREE.MeshBasicMaterial({
  color: 0x8800ff,
  wireframe: true,
});
const cube8 = new THREE.Mesh(geometry8, material8);
cube8.position.set(30, 60, 0);
scene.add(cube8);

/**
 * 示例11：使用 rotateX、rotateY、rotateZ 方法
 */
const geometry9 = new THREE.BoxGeometry(10, 10, 10);
const material9 = new THREE.MeshBasicMaterial({
  color: 0x00ff88,
  wireframe: true,
});
const cube9 = new THREE.Mesh(geometry9, material9);
cube9.position.set(60, 60, 0);
scene.add(cube9);

/**
 * Euler 常用方法说明
 */
// 1. setFromRotationMatrix - 从旋转矩阵设置欧拉角
// 2. setFromQuaternion - 从四元数设置欧拉角
// 3. clone - 克隆欧拉角
// 4. copy - 复制欧拉角
// 5. reorder - 更改旋转顺序

console.log("弧度转角度示例:", THREE.MathUtils.radToDeg(Math.PI)); // 180

/**
 * AxesHelper：辅助观察坐标系
 */
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

/**
 * 添加网格辅助线
 */
const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);

/**
 * 渲染器和控制器
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  // 动态旋转示例
  cube8.rotation.x += 0.01;
  cube8.rotation.y += 0.02;

  // 使用 rotateX/Y/Z 方法旋转
  cube9.rotateX(0.01);
  cube9.rotateY(0.015);
  cube9.rotateZ(0.005);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
