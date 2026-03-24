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
// 设置相机的位置，并调整视角以便更好地观察点模型
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);
// 相机添加到场景中
scene.add(camera);

/**
 * 核心：几何体顶点位置数据和点模型示例
 */
// 1. 创建一个空的几何体对象 BufferGeometry
const geometry = new THREE.BufferGeometry();

// 2. 定义顶点位置数据 (使用类型化数组 Float32Array)
// 包含 6 个顶点的 xyz 坐标
const vertices = new Float32Array([
  0,
  0,
  0, // 顶点1坐标 (原点)
  20,
  0,
  0, // 顶点2坐标 (X轴上)
  0,
  20,
  0, // 顶点3坐标 (Y轴上)
  0,
  0,
  20, // 顶点4坐标 (Z轴上)
  20,
  20,
  0, // 顶点5坐标 (XY平面)
  20,
  0,
  20, // 顶点6坐标 (XZ平面)
]);

// 3. 创建属性缓冲区对象 BufferAttribute
// 参数 3 表示每 3 个数据为一组，代表一个顶点的 xyz 坐标
const attribute = new THREE.BufferAttribute(vertices, 3);

// 4. 设置几何体 attributes 属性的位置 position 数据
geometry.attributes.position = attribute;

// 5. 创建点材质 PointsMaterial
const material = new THREE.PointsMaterial({
  color: 0xffff00, // 点的颜色：黄色
  size: 5.0, // 点的大小：5像素
});

// 6. 创建点模型对象 Points
const points = new THREE.Points(geometry, material);

// 7. 将点模型添加到场景中
scene.add(points);

/**
 * AxesHelper：辅助观察坐标系
 * 红色轴表示 X 轴，绿色轴表示 Y 轴，蓝色轴表示 Z 轴。
 */
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染升成的 DOM 元素添加到文档的 body 中
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼（惯性），使控制器更平滑
controls.enableDamping = true;

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// function render() {
//   // 每次渲染时让点模型绕 Y 轴缓慢旋转，方便多角度观察
//   points.rotateY(0.01);

//   renderer.render(scene, camera);
//   requestAnimationFrame(render); // 请求再次执行渲染函数 render，渲染下一帧
// }
// render();
