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
// 设置相机的位置
camera.position.set(0, 0, 80);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * =============================================================================
 * 核心概念：网格模型（三角形）
 * =============================================================================
 *
 * 【为什么是三角形？】
 * 在 WebGL/Three.js 中，所有的 3D 形状（立方体、球体、角色模型等）
 * 本质上都是由无数个微小的"三角形"拼接而成的！
 *
 * 为什么是三角形而不是四边形或五边形？
 * 1. 三角形是最简单的多边形（只有3个顶点）
 * 2. 三个点永远在同一平面上（数学上可证明）
 * 3. GPU 对三角形渲染有专门的硬件优化
 * 4. 任何复杂形状都可以拆分成三角形
 *
 * 【三角形的顶点顺序：顺时针 vs 逆时针】
 * - 逆时针（Counter-clockwise）：正面（Front Side）
 * - 顺时针（Clockwise）：背面（Back Side）
 *
 * Three.js 默认只渲染正面，这就是为什么有时模型"背面看不见"
 * 可以通过 side: THREE.DoubleSide 让正反面都可见
 *
 * 【常用材质的 side 属性值】
 * - THREE.FrontSide（默认）：只渲染正面
 * - THREE.BackSide：只渲染背面
 * - THREE.DoubleSide：正反面都渲染
 * =============================================================================
 */

/**
 * =============================================================================
 * 示例1：单个三角形 —— 最基础的网格模型
 * =============================================================================
 *
 * 一个三角形只需要 3 个顶点
 * 顶点顺序：逆时针 = 正面朝向我们
 */
const geometry1 = new THREE.BufferGeometry();

// 定义三角形的 3 个顶点坐标
// Float32Array 是类型化数组，比普通数组性能更好
// 每 3 个数值表示一个顶点的：顶点1: (0, 20, 0)
const vertices1 = new Float32Array([
  // 逆时针顺序：顶点1 → 顶点2 → 顶点3
  0,
  20,
  0, // 顶点1：顶部 (x=0, y=20, z=0)
  -20,
  -10,
  0, // 顶点2：左下 (x=-20, y=-10, z=0)
  20,
  -10,
  0, // 顶点3：右下 (x=20, y=-10, z=0)
]);

// BufferAttribute 的第二个参数 "3" 表示：
// 每 3 个数值为一组，代表一个顶点的
geometry1.attributes.position = new THREE.BufferAttribute(vertices1, 3);

// MeshBasicMaterial 是最基础的材质，不受光照影响
const material1 = new THREE.MeshBasicMaterial({
  color: 0xff0000, // 红色
  side: THREE.DoubleSide, // 双面渲染：正反面都可见
});

// Mesh = 几何体 + 材质
const mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.position.x = -45; // 向左移动，避免与其他示例重叠
scene.add(mesh1);

// 添加标签：在三角形旁边显示文字说明
function createLabel(text, position, color = 0xffffff) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#" + color.toString(16).padStart(6, "0");
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(30, 7.5, 1);
  return sprite;
}

scene.add(createLabel("示例1: 单个三角形", { x: -45, y: 35, z: 0 }, 0xff0000));

/**
 * =============================================================================
 * 示例2：两个三角形组成一个矩形
 * =============================================================================
 *
 * 一个矩形 = 2 个三角形 = 6 个顶点（有重复顶点）
 *
 * 为什么会有重复顶点？
 * 因为两个三角形共享了对角线上的顶点
 *
 *    0 -------- 2
 *    |        / |
 *    |      /   |
 *    |    /     |
 *    |  /       |
 *    1 -------- 3
 *
 * 三角形1: 0 → 1 → 2（左上、左下、右上）
 * 三角形2: 2 → 1 → 3（右上、左下、右下）
 */
const geometry2 = new THREE.BufferGeometry();

const vertices2 = new Float32Array([
  // 第一个三角形（左上角那一半）
  -15,
  15,
  0, // 索引0: 左上角
  -15,
  -15,
  0, // 索引1: 左下角
  15,
  15,
  0, // 索引2: 右上角

  // 第二个三角形（右下角那一半）
  15,
  15,
  0, // 索引3: 右上角（与索引2相同，重复了！）
  -15,
  -15,
  0, // 索引4: 左下角（与索引1相同，重复了！）
  15,
  -15,
  0, // 索引5: 右下角
]);

geometry2.attributes.position = new THREE.BufferAttribute(vertices2, 3);

const material2 = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // 绿色
  side: THREE.DoubleSide,
});

const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.x = 0; // 中间位置
scene.add(mesh2);

scene.add(
  createLabel("示例2: 两个三角形=矩形", { x: 0, y: 35, z: 0 }, 0x00ff00),
);

/**
 * =============================================================================
 * 示例3：使用索引（Index）优化 —— 避免重复顶点
 * =============================================================================
 *
 * 示例2 中，矩形只需要 4 个不同的顶点，但我们定义了 6 个（有重复）
 * 当模型很复杂时，这种重复会浪费大量内存
 *
 * 解决方案：使用"索引"来复用顶点
 *
 * 步骤：
 * 1. 只定义不重复的顶点（4个）
 * 2. 用索引告诉 GPU 每个三角形使用哪些顶点
 *
 * 索引数组 [0, 1, 2, 2, 1, 3] 的含义：
 * - 三角形1: 使用顶点0、1、2
 * - 三角形2: 使用顶点2、1、3
 */
const geometry3 = new THREE.BufferGeometry();

// 只定义 4 个不重复的顶点
const vertices3 = new Float32Array([
  -15,
  15,
  0, // 索引0: 左上角
  -15,
  -15,
  0, // 索引1: 左下角
  15,
  15,
  0, // 索引2: 右上角
  15,
  -15,
  0, // 索引3: 右下角
]);

// 索引：告诉 GPU 如何连接这些顶点形成三角形
// Uint16Array: 每个索引是一个 0-65535 的整数
const indices = new Uint16Array([
  0,
  1,
  2, // 第一个三角形：顶点0 → 顶点1 → 顶点2
  2,
  1,
  3, // 第二个三角形：顶点2 → 顶点1 → 顶点3
]);

geometry3.attributes.position = new THREE.BufferAttribute(vertices3, 3);
// 设置索引缓冲区，参数 1 表示每个索引是一个单独的数字
geometry3.index = new THREE.BufferAttribute(indices, 1);

const material3 = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // 蓝色
  side: THREE.DoubleSide,
});

const mesh3 = new THREE.Mesh(geometry3, material3);
mesh3.position.x = 45; // 右边位置
scene.add(mesh3);

scene.add(
  createLabel("示例3: 索引优化(4顶点)", { x: 45, y: 35, z: 0 }, 0x0000ff),
);

/**
 * =============================================================================
 * 示例4：线框模式 —— 可视化三角形的边界
 * =============================================================================
 *
 * 线框模式(wireframe)可以让你看到三角形的"骨架"
 * 这对于调试和理解模型结构非常有用
 */
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true, // 开启线框模式
});

// 复制示例2的几何体，但使用线框材质
const wireframe2 = new THREE.Mesh(geometry2.clone(), wireframeMaterial);
wireframe2.position.x = 0;
wireframe2.position.y = -50;
scene.add(wireframe2);

scene.add(
  createLabel(
    "示例4: 线框模式(可看三角边界)",
    { x: 0, y: -20, z: 0 },
    0xffffff,
  ),
);

/**
 * =============================================================================
 * 示例5：正面 vs 背面演示（重点：观察旋转时的区别！）
 * =============================================================================
 *
 * 【重要理解】
 * side 属性决定的是"渲染哪个面"，而不是"哪面朝向相机"
 *
 * - FrontSide: 只渲染正面（逆时针定义的那面）
 * - BackSide: 只渲染背面（顺时针定义的那面）
 * - DoubleSide: 两面都渲染
 *
 * 当三角形旋转时：
 * - FrontSide 三角形：正面朝向相机时可见，背面朝向相机时消失
 * - BackSide 三角形：背面朝向相机时可见，正面朝向相机时消失
 *
 * 请观察下方两个旋转的三角形，看它们何时出现、何时消失！
 */

/**
 * 【关键修改】使用相同的几何体，只是 side 属性不同！
 *
 * 这样旋转时，两个三角形会【交替出现】：
 * - 正面朝向相机：FrontSide 可见，BackSide 消失
 * - 背面朝向相机：FrontSide 消失，BackSide 可见
 */

// 共享相同的几何体定义（逆时针 = 正面朝向我们）
const sharedGeometry = new THREE.BufferGeometry();
const sharedVertices = new Float32Array([0, 15, 0, -15, -10, 0, 15, -10, 0]);
sharedGeometry.attributes.position = new THREE.BufferAttribute(
  sharedVertices,
  3,
);

// FrontSide：只渲染正面
const frontMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  side: THREE.FrontSide,
});
const frontMesh = new THREE.Mesh(sharedGeometry.clone(), frontMaterial);
frontMesh.position.set(-30, -50, 0);
scene.add(frontMesh);

scene.add(
  createLabel("FrontSide(正面朝向时可见)", { x: -30, y: -70, z: 0 }, 0xff6600),
);

// BackSide：只渲染背面（使用完全相同的几何体！）
const backMaterial = new THREE.MeshBasicMaterial({
  color: 0x9900ff,
  side: THREE.BackSide,
});
const backMesh = new THREE.Mesh(sharedGeometry.clone(), backMaterial);
backMesh.position.set(30, -50, 0);
scene.add(backMesh);

scene.add(
  createLabel("BackSide(背面朝向时可见)", { x: 30, y: -70, z: 0 }, 0x9900ff),
);

/**
 * AxesHelper：辅助观察坐标系
 * 红色=X轴，绿色=Y轴，蓝色=Z轴
 */
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * OrbitControls 轨道控制器
 * - 左键拖拽：旋转相机
 * - 右键拖拽：平移相机
 * - 滚轮：缩放
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function render() {
  // 更新 OrbitControls
  controls.update();

  // 让上半部分的模型旋转，方便观察
  mesh1.rotation.y += 0.01;
  mesh2.rotation.y += 0.01;
  mesh3.rotation.y += 0.01;

  // 示例5：让正面/背面三角形绕Y轴旋转
  // 仔细观察：当正面背对相机时，FrontSide三角形会消失！
  // 而BackSide三角形正好相反
  frontMesh.rotation.y += 0.02;
  backMesh.rotation.y += 0.02;

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
