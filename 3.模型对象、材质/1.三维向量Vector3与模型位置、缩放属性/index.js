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
 * 核心：三维向量 Vector3 与模型位置、缩放属性
 *
 * Vector3 是 Three.js 中表示三维向量的类，包含 x、y、z 三个分量
 * 模型的 position、scale 属性都是 Vector3 对象
 */

/**
 * 示例1：Vector3 的创建方式
 */
// 方式1：使用构造函数
const v1 = new THREE.Vector3(10, 20, 30);

// 方式2：使用 set 方法
const v2 = new THREE.Vector3();
v2.set(10, 20, 30);

// 方式3：使用静态方法（较少用）
const v3 = new THREE.Vector3(0, 0, 0);

console.log("Vector3 示例:", v1);

/**
 * 示例2：创建一个立方体并设置位置属性
 */
const geometry1 = new THREE.BoxGeometry(10, 10, 10);
const material1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const cube1 = new THREE.Mesh(geometry1, material1);

// 方式1：使用 position.set() 设置位置
cube1.position.set(0, 0, 0);
scene.add(cube1);

/**
 * 示例3：通过 Vector3 对象设置位置
 */
const geometry2 = new THREE.BoxGeometry(10, 10, 10);
const material2 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube2 = new THREE.Mesh(geometry2, material2);

// 方式2：直接赋值 Vector3 对象
const position2 = new THREE.Vector3(30, 0, 0);
cube2.position.copy(position2);
scene.add(cube2);

/**
 * 示例4：通过 position 的 x、y、z 属性单独设置
 */
const geometry3 = new THREE.BoxGeometry(10, 10, 10);
const material3 = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true,
});
const cube3 = new THREE.Mesh(geometry3, material3);

// 方式3：单独设置 x、y、z
cube3.position.x = -30;
cube3.position.y = 0;
cube3.position.z = 0;
scene.add(cube3);

/**
 * 示例5：缩放属性 scale
 */
const geometry4 = new THREE.BoxGeometry(10, 10, 10);
const material4 = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const cube4 = new THREE.Mesh(geometry4, material4);

// 设置位置
cube4.position.set(0, 30, 0);

// 设置缩放 - scale 也是 Vector3 对象
// 方式1：使用 set 方法
cube4.scale.set(2, 1, 1.5);
scene.add(cube4);

/**
 * 示例6：通过 Vector3 设置缩放
 */
const geometry5 = new THREE.BoxGeometry(10, 10, 10);
const material5 = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
});
const cube5 = new THREE.Mesh(geometry5, material5);

cube5.position.set(30, 30, 0);

// 方式2：通过 Vector3 对象设置缩放
const scale5 = new THREE.Vector3(1, 2, 1);
cube5.scale.copy(scale5);
scene.add(cube5);

/**
 * 示例7：单独设置 scale 的 x、y、z
 */
const geometry6 = new THREE.BoxGeometry(10, 10, 10);
const material6 = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: true,
});
const cube6 = new THREE.Mesh(geometry6, material6);

cube6.position.set(-30, 30, 0);

// 方式3：单独设置 scale 的 x、y、z
cube6.scale.x = 1.5;
cube6.scale.y = 0.5;
cube6.scale.z = 2;
scene.add(cube6);

/**
 * 示例8：Vector3 常用方法
 */
const vA = new THREE.Vector3(10, 0, 0);
const vB = new THREE.Vector3(0, 10, 0);

// 获取向量长度
console.log("向量 vA 的长度:", vA.length());

// 向量归一化（长度变为1，方向不变）
const vANormalized = vA.clone().normalize();
console.log("归一化后的向量:", vANormalized);

// 向量相加
const vSum = new THREE.Vector3().addVectors(vA, vB);
console.log("vA + vB =", vSum);

// 向量相减
const vDiff = new THREE.Vector3().subVectors(vB, vA);
console.log("vB - vA =", vDiff);

// 两点之间的距离
const distance = vA.distanceTo(vB);
console.log("vA 到 vB 的距离:", distance);

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
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
