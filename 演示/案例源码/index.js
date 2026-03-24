// 引入three.js核心库
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

// 创建场景
const scene = new THREE.Scene();

/**
 * 透视相机
 * PerspectiveCamera(fov: Number, aspect: Number, near: Number, far: Number)
 * fov: 摄像机视锥体垂直视野角度
 * aspect: 摄像机视锥体长宽比
 * near: 摄像机视锥体近端面
 * far: 摄像机视锥体远端面
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
// 设置相机的位置
camera.position.set(0, 0, 10);
// 相机添加到场景中
scene.add(camera);

// 创建立方体几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 创建一个基本材质,设置颜色为绿色
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // 设置材质颜色
  transparent: true, // 开启透明
  opacity: 0.5, // 设置透明度
});
// 创建一个网格物体;多边形网格;
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 将立方体添加到场景中
scene.add(cube);

/**
 * 几何体
 * 长方体：BoxGeometry
 * 圆柱体：CylinderGeometry
 * 球体：SphereGeometry
 * 圆锥：ConeGeometry
 * 矩形平面：PlaneGeometry
 * 圆形平面：CircleGeometry
 */
// 球体
const SphereGeometry = new THREE.SphereGeometry(50);
// 球体材质
const SphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000, // 设置材质颜色
});
// 球体网格物体
const Sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
// 将球体添加到场景中
scene.add(Sphere);

/**
 * AxesHelper：辅助观察坐标系
 * 辅助观察坐标系，用于可视化场景中的坐标轴。
 * 红色轴表示 X 轴，绿色轴表示 Y 轴，蓝色轴表示 Z 轴。
 * 辅助观察坐标系的长度可以通过参数指定。
 * 默认 Y 轴朝上
 */
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染升成的 DOM 元素添加到文档的 body 中
document.body.appendChild(renderer.domElement);
// 使用渲染器渲染场景和相机
// renderer.render(scene, camera);

// stats 查看 three.js 渲染帧率
// const stats = new Stats();
// document.body.appendChild(stats.domElement);

const clock = new THREE.Clock();
function render() {
  // stats.update();
  const spt = clock.getDelta() * 1000;
  // console.log("两帧渲染时间间隔（毫秒）", spt);
  // console.log(`帧率 FPS，${1000 / spt}`);
  renderer.render(scene, camera);
  cube.rotateY(0.01); // 每次绕 Y 轴旋转 0.01 弧度
  requestAnimationFrame(render); // 请求再次执行渲染函数 render，渲染下一帧

  // 全屏情况下：设置观察返回长宽比 aspect 为窗口宽高比
  // camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行 render 方法的时候会读取相机对象的投影矩阵属性 projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵（节约计算资源）
  // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix() 方法更新相机的投影矩阵
  // camera.updateProjectionMatrix();
}
render();
