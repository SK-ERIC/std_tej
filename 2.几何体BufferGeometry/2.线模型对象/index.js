// 引入three.js核心库
import * as THREE from "three";
// 引入轨道控制器
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
// 设置相机的位置
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * 核心：线模型对象示例
 */
// 1. 创建一个空的几何体对象 BufferGeometry
const geometry = new THREE.BufferGeometry();

// 2. 定义顶点位置数据 (使用类型化数组 Float32Array)
// 按顺序连接各点形成线条
const vertices = new Float32Array([
  0,
  0,
  0, // 起点 (原点)
  20,
  0,
  0, // 点2 (X轴上)
  20,
  20,
  0, // 点3 (XY平面)
  0,
  20,
  0, // 点4 (XY平面)
  0,
  0,
  0, // 回到原点，形成闭合矩形
]);

// 3. 创建属性缓冲区对象 BufferAttribute
const attribute = new THREE.BufferAttribute(vertices, 3);

// 4. 设置几何体的位置属性
geometry.attributes.position = attribute;

// 5. 创建线基础材质 LineBasicMaterial
const material = new THREE.LineBasicMaterial({
  color: 0xff0000, // 线的颜色：红色
  linewidth: 2, // 线宽（注意：大多数平台不支持设置线宽，始终为1像素）
});

// 6. 创建线模型对象 Line
const line = new THREE.Line(geometry, material);

// 7. 将线模型添加到场景中
scene.add(line);

/**
 * 示例2：使用 LineLoop 创建闭合线条
 */
const geometry2 = new THREE.BufferGeometry();
const vertices2 = new Float32Array([
  0, 0, 20, 20, 0, 20, 20, 20, 20, 0, 20, 20,
]);
geometry2.attributes.position = new THREE.BufferAttribute(vertices2, 3);
const material2 = new THREE.LineBasicMaterial({
  color: 0x00ff00, // 绿色
});
const lineLoop = new THREE.LineLoop(geometry2, material2);
scene.add(lineLoop);

/**
 * 示例3：使用 LineSegments 创建独立线段
 * 每两个点连成一条线，各线段之间不连续
 */
const geometry3 = new THREE.BufferGeometry();
const vertices3 = new Float32Array([
  -30,
  0,
  0,
  -30,
  30,
  0, // 第一条线段
  -30,
  0,
  0,
  -30,
  0,
  30, // 第二条线段
  -30,
  30,
  0,
  -30,
  0,
  30, // 第三条线段
]);
geometry3.attributes.position = new THREE.BufferAttribute(vertices3, 3);
const material3 = new THREE.LineBasicMaterial({
  color: 0x0000ff, // 蓝色
});
const lineSegments = new THREE.LineSegments(geometry3, material3);
scene.add(lineSegments);

/**
 * AxesHelper：辅助观察坐标系
 */
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼（惯性），使控制器更平滑
controls.enableDamping = true;

const clock = new THREE.Clock();
function render() {
  const spt = clock.getDelta() * 1000;

  // 让线模型绕 Y 轴旋转
  line.rotateY(0.01);
  lineLoop.rotateY(0.01);
  lineSegments.rotateY(0.01);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
