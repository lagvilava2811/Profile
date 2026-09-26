// js/corridor3D.js
// itomdev.com-ის ავთენტური 3D ხელნაკეთი გამოცდილება (Vako Lagvilava | Digital Agency)
// ზუსტი პროპორციები: Wide Perspective Entrance (z = 32.5), Double Doors,
// Window Avatar with smooth peek-out hover & Cat with pointer-tracking pupils, Hanging Sign & Tree,
// Corridor 20 FPS Flipbook Animated Boy (ვაკო ლაღვილავა) with Pass-Through Evasion & Floating Splitting 3D Title,
// pustatabliczka.webp Wooden Signboards, Hinged Corridor Doors with Painted Hover & Audio Transitions.

import { soundEngine } from './components/audioManager.js';

export class Corridor3D {
  constructor(canvasContainerId, onEnterRoomCallback) {
    this.container = document.getElementById(canvasContainerId);
    this.onEnterRoom = onEnterRoomCallback;
    
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    
    // Wide cinematic entrance view:
    // Facade is at z = 22.0.
    // Wide cinematic distance: targetDist = Math.max(10.5, 9.5 / aspect);
    // On 16:9 desktop (aspect 1.78), targetDist = 10.5 => initialCameraZ = 32.5.
    // On narrower screens, camera pulls back further so tree, window, and facade are fully framed.
    const aspect = (window.innerWidth || 1200) / (window.innerHeight || 800);
    const targetDist = Math.max(10.5, 9.5 / aspect);
    this.initialCameraZ = 22.0 + targetDist;
    this.cameraZ = this.initialCameraZ;
    this.targetCameraZ = this.initialCameraZ;
    this.minZ = -27.5;
    this.maxZ = this.initialCameraZ;
    
    // Entrance Double Doors State
    this.isEntranceOpen = false;
    this.entranceGroup = null;
    this.doorFrameMesh = null;
    this.leftEntrancePivot = null;
    this.rightEntrancePivot = null;
    this.leftEntranceMesh = null;
    this.rightEntranceMesh = null;
    this.leftEntranceHandle = null;
    this.rightEntranceHandle = null;
    this.swingingSign = null;
    this.hangingMouse = null;
    this.catPupilLeft = null;
    this.flyingBug = null;
    
    // Entrance Double Doors Top-to-Bottom Reveal State
    this.isEntranceHovered = false;
    this.entranceRevealProgress = 0.0;
    this.entranceDoorCrack = 0.0;
    this.entranceHandleTilt = 0.0;
    this.leftDoorShaderMat = null;
    this.rightDoorShaderMat = null;
    this.leftEntranceHandlePainted = null;
    this.rightEntranceHandlePainted = null;
    this.leftHandlePaintedMat = null;
    this.rightHandlePaintedMat = null;
    this.innerEntrywayGroup = null;
    
    // Entrance Window Avatar Peek-out
    this.avatarWinMesh = null;
    this.targetAvatarWinX = 3.5;
    this.currentAvatarWinX = 3.5;
    this.entranceBubbleMesh = null;
    this.updateEntranceBubble = null;
    this.duckHitMesh = null;
    
    // Corridor Doors
    this.doors = [];
    this.hoveredDoor = null;
    this.isInsideRoom = false;
    this.isTransitioning = false;
    
    // Corridor Animated Boy Avatar (20 FPS Flipbook)
    this.corridorAvatarMesh = null;
    this.corridorAvatarGroup = null;
    this.avatarTextures = [];
    this.avatarFrameIndex = 0;
    this.avatarForward = true;
    this.lastFrameTime = 0;
    
    // Corridor 3D Floating Title & Subtitle with Splitting effect
    this.introLetterMeshes = [];
    this.introSubMeshes = [];
    this.doodleMeshes = [];
    
    this.mouse = new THREE.Vector2();
    this.pointerTarget = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.signboardReRenderers = [];
    
    this.init();
  }

  init() {
    if (!this.container || typeof THREE === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfaf8f5);
    this.scene.fog = new THREE.Fog(0xfaf8f5, 22, 65);

    // FOV 60 matches itomdev wide architectural perspective
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 160);
    this.camera.position.set(0, 0.35, this.cameraZ);
    this.camera.lookAt(0, 0.65, 22.0);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 12, 10);
    this.scene.add(dirLight);

    // 4. Texture Loader
    this.textureLoader = new THREE.TextureLoader();

    // 5. Build Entrance Scene (Wide Facade, Double Doors, Cat with eyes, Tree, Window Boy, Signs)
    this.buildEntranceScene();

    // 6. Build Corridor Geometry & Walls
    this.buildCorridor();

    // 6.5. Build Inner Entryway Partition Wall & Open Doors (media_1789629777815.png)
    this.buildInnerEntryway();

    // 7. Build Corridor Walking Boy Avatar (20 FPS Flipbook) & 3D Splitting Title
    this.buildCorridorAvatarAndIntro();

    // 8. Build Doors with Authentic Signboards & Handles
    this.buildDoorsAndDecorations();

    // 9. Re-render signboards once fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.signboardReRenderers.forEach(render => render());
      });
    }

    // 10. Event Listeners (Scroll, Touch, Resize, Click, Raycast)
    this.setupEvents();

    // 11. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  loadTexture(path, repeatX = 1, repeatY = 1) {
    const tex = this.textureLoader.load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // =========================================================================
  // 1. ENTRANCE SCENE (itomdev.com-ის ზუსტი არქიტექტურა: Wide Perspective View)
  // =========================================================================
  buildEntranceScene() {
    const entranceGroup = new THREE.Group();
    entranceGroup.position.set(0, 0, 22.0); // Entrance Facade Z = 22.0

    // A. აგურის ფასადის კედელი (Brick Facade Wall 16x8)
    const facadeGeo = new THREE.PlaneGeometry(16, 8);
    const facadeTex = this.loadTexture('assets/textures/entrance/wall_bricks_2.webp');
    const facadeMat = new THREE.MeshBasicMaterial({ map: facadeTex, transparent: true, side: THREE.DoubleSide });
    const facadeMesh = new THREE.Mesh(facadeGeo, facadeMat);
    facadeMesh.position.set(0, 2.25, 0.15);
    entranceGroup.add(facadeMesh);

    // B. ქვის ბილიკი შესასვლელთან (Cobblestone Path Stretching to camera)
    const pathLength = 13.0;
    const pathGeo = new THREE.PlaneGeometry(2.44, pathLength);
    const pathTex = this.loadTexture('assets/textures/entrance/stone-path.webp');
    pathTex.wrapT = THREE.RepeatWrapping;
    pathTex.repeat.set(1, 2.6);
    const pathMat = new THREE.MeshBasicMaterial({ map: pathTex, transparent: true, side: THREE.DoubleSide });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, -1.73, pathLength / 2);
    entranceGroup.add(pathMesh);

    // C. ქაღალდის იატაკი შესასვლელის გარეთ (Paper Floor 44x28)
    const paperFloorGeo = new THREE.PlaneGeometry(44, 28);
    const paperFloorTex = this.loadTexture('assets/textures/entrance/floor_paper.webp', 8, 6);
    const paperFloorMat = new THREE.MeshBasicMaterial({ map: paperFloorTex, transparent: true, side: THREE.DoubleSide, opacity: 0.9 });
    const paperFloorMesh = new THREE.Mesh(paperFloorGeo, paperFloorMat);
    paperFloorMesh.rotation.x = -Math.PI / 2;
    paperFloorMesh.position.set(0, -1.75, 8.0);
    entranceGroup.add(paperFloorMesh);

    // D. ხის კოჭი და ჩამოკიდებული წარწერა (Overhead Wooden Beam & Hanging Signboard)
    const beamTex = this.loadTexture('assets/textures/entrance/belka.webp');
    const beamGeo = new THREE.PlaneGeometry(2.7, 0.4);
    const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, side: THREE.DoubleSide });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(-0.05, 2.05, 0.65);
    entranceGroup.add(beamMesh);

    // Swinging sign hanging under beam (sign.webp)
    const signPivot = new THREE.Group();
    signPivot.position.set(0, 1.9, 0.6);

    const signTex = this.loadTexture('assets/textures/entrance/sign.webp');
    const signGeo = new THREE.PlaneGeometry(2.0, 1.0);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, -0.5, 0);
    signPivot.add(signMesh);
    entranceGroup.add(signPivot);
    this.swingingSign = signPivot;

    // E. ცენტრალური ორმაგი კარები (Double Entrance Doors with Authentic Top-to-Bottom Wood Reveal)
    const doorFrameTex = this.loadTexture('assets/textures/doors/frame_sketch.webp');
    const doorFrameGeo = new THREE.PlaneGeometry(2.04, 2.49);
    const doorFrameMat = new THREE.MeshBasicMaterial({ map: doorFrameTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const doorFrameMesh = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrameMesh.position.set(0, -0.505, 0.12);
    doorFrameMesh.userData = { isEntranceDoor: true };
    entranceGroup.add(doorFrameMesh);
    this.doorFrameMesh = doorFrameMesh;

    const Ae = 0.94; // door width
    const Re = 2.4;  // door height
    const doorGeo = new THREE.PlaneGeometry(Ae, Re);
    const doorBoxGeo = new THREE.BoxGeometry(Ae, Re, 0.04);

    const pienTex = this.loadTexture('assets/textures/doors/pien.webp');
    const leftDoorTex = this.loadTexture('assets/textures/doors/door_left_sketch.webp');
    const leftDoorTexPainted = this.loadTexture('assets/textures/doors/door_left_painted.webp');
    const rightDoorTex = this.loadTexture('assets/textures/doors/door_right_sketch.webp');
    const rightDoorTexPainted = this.loadTexture('assets/textures/doors/door_right_painted.webp');
    const doorBackLeftTex = this.loadTexture('assets/textures/doors/door_back_left_sketch.webp');
    const doorBackRightTex = this.loadTexture('assets/textures/doors/door_back.webp');

    const handleLeftTex = this.loadTexture('assets/textures/doors/handle_left_sketch.webp');
    const handleLeftTexPainted = this.loadTexture('assets/textures/doors/handle_left_painted.webp');
    const handleRightTex = this.loadTexture('assets/textures/doors/handle_right_sketch.webp');
    const handleRightTexPainted = this.loadTexture('assets/textures/doors/handle_right_painted.webp');

    // Authentic itomdev Brush-Stroke Reveal Shader (discards sketch from top to bottom)
    const doorRevealVS = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const doorRevealFS = `
      uniform sampler2D map;
      uniform float uProgress;
      varying vec2 vUv;

      float revealRand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float revealNoise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u * u * (3.0 - 2.0 * u);
        float res = mix(
          mix(revealRand(ip), revealRand(ip + vec2(1.0, 0.0)), u.x),
          mix(revealRand(ip + vec2(0.0, 1.0)), revealRand(ip + vec2(1.0, 1.0)), u.x), u.y);
        return res * res;
      }

      void main() {
        vec4 texColor = texture2D(map, vUv);
        if (texColor.a < 0.1) discard;

        if (uProgress > 0.001) {
          float rn = revealNoise(vUv * 15.0) * 0.15;
          float maskValue = (1.0 - vUv.y) + rn;
          float threshold = uProgress * 1.5;
          if (maskValue < threshold) discard;
        }

        gl_FragColor = texColor;
      }
    `;

    // 1. Left Entrance Door Pivot (Hinged at x = -Ae)
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-Ae, -0.55, 0.0);

    // Physical Wooden Paper Base (No black void)
    const pienMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: pienTex, roughness: 0.9 });
    const leftBaseMesh = new THREE.Mesh(doorBoxGeo, pienMat);
    leftBaseMesh.position.set(Ae / 2, 0, 0.06);
    leftBaseMesh.userData = { isEntranceDoor: true };
    leftPivot.add(leftBaseMesh);

    // Painted Door Layer (z = 0.088)
    const leftPaintedMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: leftDoorTexPainted, transparent: true, alphaTest: 0.1 });
    const leftPaintedMesh = new THREE.Mesh(doorGeo, leftPaintedMat);
    leftPaintedMesh.position.set(Ae / 2, 0, 0.088);
    leftPaintedMesh.userData = { isEntranceDoor: true };
    leftPivot.add(leftPaintedMesh);

    // Sketch Door Layer on Top with Organic Reveal (z = 0.09)
    const leftShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: leftDoorTex },
        uProgress: { value: 0.0 }
      },
      vertexShader: doorRevealVS,
      fragmentShader: doorRevealFS,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const leftMesh = new THREE.Mesh(doorGeo, leftShaderMat);
    leftMesh.position.set(Ae / 2, 0, 0.09);
    leftMesh.userData = { isEntranceDoor: true };
    leftPivot.add(leftMesh);

    // Back side of left door (visible when open)
    const leftBackMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: doorBackLeftTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
    const leftBackMesh = new THREE.Mesh(doorGeo, leftBackMat);
    leftBackMesh.position.set(Ae / 2, 0, 0.03);
    leftBackMesh.rotation.y = Math.PI;
    leftBackMesh.scale.set(-1, 1, 1);
    leftPivot.add(leftBackMesh);

    // Left Handle Group
    const leftHandlePivot = new THREE.Group();
    leftHandlePivot.position.set(Ae / 2 + 0.357, -0.099, 0.1);

    const leftHandlePaintedMesh = new THREE.Mesh(doorGeo, new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: handleLeftTexPainted, transparent: true, alphaTest: 0.5, depthWrite: false }));
    leftHandlePaintedMesh.position.set(-0.357, 0.09, -0.001);
    leftHandlePaintedMesh.visible = false;
    leftHandlePivot.add(leftHandlePaintedMesh);

    const leftHandleShaderMat = new THREE.ShaderMaterial({
      uniforms: { map: { value: handleLeftTex }, uProgress: { value: 0.0 } },
      vertexShader: doorRevealVS,
      fragmentShader: doorRevealFS,
      transparent: true,
      depthWrite: false
    });
    const leftHandleMesh = new THREE.Mesh(doorGeo, leftHandleShaderMat);
    leftHandleMesh.position.set(-0.357, 0.099, 0);
    leftHandleMesh.userData = { isEntranceDoor: true };
    leftHandlePivot.add(leftHandleMesh);

    leftPivot.add(leftHandlePivot);
    entranceGroup.add(leftPivot);

    // 2. Right Entrance Door Pivot (Hinged at x = +Ae)
    const rightPivot = new THREE.Group();
    rightPivot.position.set(Ae, -0.55, 0.0);

    // Physical Wooden Paper Base
    const rightBaseMesh = new THREE.Mesh(doorBoxGeo, pienMat);
    rightBaseMesh.position.set(-Ae / 2, 0, 0.06);
    rightBaseMesh.userData = { isEntranceDoor: true };
    rightPivot.add(rightBaseMesh);

    // Painted Door Layer (z = 0.088)
    const rightPaintedMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: rightDoorTexPainted, transparent: true, alphaTest: 0.1 });
    const rightPaintedMesh = new THREE.Mesh(doorGeo, rightPaintedMat);
    rightPaintedMesh.position.set(-Ae / 2, 0, 0.088);
    rightPaintedMesh.userData = { isEntranceDoor: true };
    rightPivot.add(rightPaintedMesh);

    // Sketch Door Layer on Top with Organic Reveal (z = 0.09)
    const rightShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: rightDoorTex },
        uProgress: { value: 0.0 }
      },
      vertexShader: doorRevealVS,
      fragmentShader: doorRevealFS,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const rightMesh = new THREE.Mesh(doorGeo, rightShaderMat);
    rightMesh.position.set(-Ae / 2, 0, 0.09);
    rightMesh.userData = { isEntranceDoor: true };
    rightPivot.add(rightMesh);

    // Back side of right door
    const rightBackMat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: doorBackRightTex, transparent: true, alphaTest: 0.5 });
    const rightBackMesh = new THREE.Mesh(doorGeo, rightBackMat);
    rightBackMesh.position.set(-Ae / 2, 0, 0.03);
    rightBackMesh.rotation.y = Math.PI;
    rightPivot.add(rightBackMesh);

    // Right Handle Group
    const rightHandlePivot = new THREE.Group();
    rightHandlePivot.position.set(-Ae / 2 - 0.357, -0.099, 0.1);

    const rightHandlePaintedMesh = new THREE.Mesh(doorGeo, new THREE.MeshBasicMaterial({ color: 0xe0e0e0, map: handleRightTexPainted, transparent: true, alphaTest: 0.5, depthWrite: false }));
    rightHandlePaintedMesh.position.set(0.357, 0.09, -0.001);
    rightHandlePaintedMesh.visible = false;
    rightHandlePivot.add(rightHandlePaintedMesh);

    const rightHandleShaderMat = new THREE.ShaderMaterial({
      uniforms: { map: { value: handleRightTex }, uProgress: { value: 0.0 } },
      vertexShader: doorRevealVS,
      fragmentShader: doorRevealFS,
      transparent: true,
      depthWrite: false
    });
    const rightHandleMesh = new THREE.Mesh(doorGeo, rightHandleShaderMat);
    rightHandleMesh.position.set(0.357, 0.099, 0);
    rightHandleMesh.userData = { isEntranceDoor: true };
    rightHandlePivot.add(rightHandleMesh);

    rightPivot.add(rightHandlePivot);
    entranceGroup.add(rightPivot);

    // Store references
    this.leftEntrancePivot = leftPivot;
    this.rightEntrancePivot = rightPivot;
    this.leftEntranceMesh = leftMesh;
    this.rightEntranceMesh = rightMesh;
    this.leftPaintedMesh = leftPaintedMesh;
    this.rightPaintedMesh = rightPaintedMesh;
    this.leftDoorShaderMat = leftShaderMat;
    this.rightDoorShaderMat = rightShaderMat;
    this.leftHandleShaderMat = leftHandleShaderMat;
    this.rightHandleShaderMat = rightHandleShaderMat;
    this.leftEntranceHandle = leftHandlePivot;
    this.rightEntranceHandle = rightHandlePivot;
    this.leftEntranceHandlePainted = leftHandlePaintedMesh;
    this.rightEntranceHandlePainted = rightHandlePaintedMesh;

    // F. მარცხენა მხარე: ხე (Tree), დაკიდებული თაგვი (Hanging Mouse) & კატა (Cat)
    const treeTex = this.loadTexture('assets/textures/entrance/tree_sketch.webp');
    const treeGeo = new THREE.PlaneGeometry(6.0, 8.0);
    const treeMat = new THREE.MeshBasicMaterial({ map: treeTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const treeMesh = new THREE.Mesh(treeGeo, treeMat);
    treeMesh.position.set(-2.9, 0.95, 1.0);
    entranceGroup.add(treeMesh);

    // Hanging mouse under tree branch
    const mousePivot = new THREE.Group();
    mousePivot.position.set(-2.56, 0.51, 1.0);
    const mouseTex = this.loadTexture('assets/textures/entrance/mouse_hanging.webp');
    const mouseGeo = new THREE.PlaneGeometry(1.2, 1.6);
    const mouseMat = new THREE.MeshBasicMaterial({ map: mouseTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const mouseMesh = new THREE.Mesh(mouseGeo, mouseMat);
    mouseMesh.position.set(-0.35, 0.45, 0);
    mousePivot.add(mouseMesh);
    entranceGroup.add(mousePivot);
    this.hangingMouse = mousePivot;

    // Cat on Window Sill with Interactive Eyes (cat_front_body.webp)
    const catGroup = new THREE.Group();
    catGroup.position.set(-1.5, -1.15, 0.8);

    const catTex = this.loadTexture('assets/textures/entrance/cat_front_body.webp');
    const catGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const catMat = new THREE.MeshBasicMaterial({ map: catTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const catMesh = new THREE.Mesh(catGeo, catMat);
    catGroup.add(catMesh);

    // Pupils tracking mouse pointer
    const pupilGeo = new THREE.CircleGeometry(0.024, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x18181b });

    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.063, 0.27, 0.02);
    catGroup.add(pupilL);
    this.catPupilLeft = pupilL;

    const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    pupilR.position.set(0.0615, 0.27, 0.02);
    catGroup.add(pupilR);
    this.catPupilRight = pupilR;

    entranceGroup.add(catGroup);

    // G. მარჯვენა მხარე: ფანჯარა (Window), მომზირალი ბიჭი (ვაკო), იხვი ქოთანში & მწერი
    // Window frame (window_sketch.webp)
    const winFrameTex = this.loadTexture('assets/textures/entrance/window_sketch.webp');
    const winFrameGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const winFrameMat = new THREE.MeshBasicMaterial({ map: winFrameTex, transparent: true, side: THREE.DoubleSide });
    const winFrameMesh = new THREE.Mesh(winFrameGeo, winFrameMat);
    winFrameMesh.position.set(2.5, 0, 0.1);
    winFrameMesh.userData = { isWindowHoverable: true };
    entranceGroup.add(winFrameMesh);

    // Avatar boy peeking from window (avatar_window.webp)
    // Starts hidden at x = 3.5; slides into x = 2.5 when hovering window!
    const avatarWinTex = this.loadTexture('assets/textures/entrance/avatar_window.webp');
    const avatarWinGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const avatarWinMat = new THREE.MeshBasicMaterial({ map: avatarWinTex, transparent: true, side: THREE.DoubleSide });
    const avatarWinMesh = new THREE.Mesh(avatarWinGeo, avatarWinMat);
    avatarWinMesh.position.set(3.5, 0, 0.04);
    avatarWinMesh.userData = { isWindowHoverable: true };
    entranceGroup.add(avatarWinMesh);
    this.avatarWinMesh = avatarWinMesh;

    // Pot with duck (pot_with_duck.webp)
    const potTex = this.loadTexture('assets/textures/entrance/pot_with_duck.webp');
    const potGeo = new THREE.PlaneGeometry(3.0, 1.8);
    const potMat = new THREE.MeshBasicMaterial({ map: potTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.set(2.5, -1.3, 0.4);
    potMesh.userData = { isDuckPot: true };
    entranceGroup.add(potMesh);
    this.duckHitMesh = potMesh;

    // Flying bug sketch (bug_sketch.webp)
    const bugTex = this.loadTexture('assets/textures/entrance/bug_sketch.webp');
    const bugGeo = new THREE.PlaneGeometry(0.4, 0.4);
    const bugMat = new THREE.MeshBasicMaterial({ map: bugTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const bugMesh = new THREE.Mesh(bugGeo, bugMat);
    bugMesh.position.set(2.5, 1.05, 0.16);
    bugMesh.userData = { isBug: true };
    entranceGroup.add(bugMesh);
    this.flyingBug = bugMesh;

    // Speech bubble for duck easter egg quotes
    const entranceBubbleData = this.createSpeechBubbleTexture([
      "გამარჯობა! მე ვარ ვაკო ლაღვილავა 👋",
      "Creative Lead & Digital Agency",
      "დაასქროლეთ ↕ ან შეაღეთ კარები 🚪"
    ]);
    this.updateEntranceBubble = entranceBubbleData.update;

    const entBubbleGeo = new THREE.PlaneGeometry(2.4, 1.4);
    const entBubbleMat = new THREE.MeshBasicMaterial({
      map: entranceBubbleData.texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const entBubbleMesh = new THREE.Mesh(entBubbleGeo, entBubbleMat);
    entBubbleMesh.position.set(2.5, 0.2, 0.5);
    entBubbleMesh.scale.set(0, 0, 0); // Initially hidden, pops up on duck click
    entranceGroup.add(entBubbleMesh);
    this.entranceBubbleMesh = entBubbleMesh;

    this.scene.add(entranceGroup);
    this.entranceGroup = entranceGroup;
  }

  // =========================================================================
  // 2. CORRIDOR GEOMETRY (Hallway, Paper Floor, Walls, Ceiling)
  // =========================================================================
  buildCorridor() {
    const corridorLength = 42;
    const corridorWidth = 7.0; // Matches itomdev hallway width
    const corridorHeight = 3.5;

    // A. იატაკი (Floor)
    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorTex = this.loadTexture('assets/textures/corridor/kawalekpodlogi.webp', 3, 16);
    const floorMat = new THREE.MeshBasicMaterial({ map: floorTex, side: THREE.DoubleSide });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -1.75, -9);
    this.scene.add(floorMesh);

    // B. ჭერი (Ceiling)
    const ceilGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilTex = this.loadTexture('assets/textures/corridor/ceiling_texture.webp', 2, 11);
    const ceilMat = new THREE.MeshBasicMaterial({ map: ceilTex, side: THREE.DoubleSide });
    const ceilMesh = new THREE.Mesh(ceilGeo, ceilMat);
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.set(0, 1.75, -9);
    this.scene.add(ceilMesh);

    // C. მარცხენა კედელი (Left Wall)
    const leftWallGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const wallTexLeft = this.loadTexture('assets/textures/corridor/wall_texture.webp', 10, 2);
    const wallMatLeft = new THREE.MeshBasicMaterial({ map: wallTexLeft, side: THREE.DoubleSide });
    const leftWall = new THREE.Mesh(leftWallGeo, wallMatLeft);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, 0, -9);
    this.scene.add(leftWall);

    // D. მარჯვენა კედელი (Right Wall)
    const rightWallGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const wallTexRight = this.loadTexture('assets/textures/corridor/wall_texture.webp', 10, 2);
    const wallMatRight = new THREE.MeshBasicMaterial({ map: wallTexRight, side: THREE.DoubleSide });
    const rightWall = new THREE.Mesh(rightWallGeo, wallMatRight);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(corridorWidth / 2, 0, -9);
    this.scene.add(rightWall);

    // E. ბოლო კედელი (Back Wall)
    const backWallGeo = new THREE.PlaneGeometry(corridorWidth, corridorHeight);
    const backWallTex = this.loadTexture('assets/textures/corridor/wall_texture.webp', 2, 2);
    const backWallMat = new THREE.MeshBasicMaterial({ map: backWallTex });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 0, -30.0);
    this.scene.add(backWall);

    // F. ჭერის ნათურები (Overhead tube lights with gratings)
    const lightZPositions = [6, -2, -10, -18, -26];
    const lampGrateTex = this.loadTexture('assets/textures/corridor/kratanalampy.webp');

    lightZPositions.forEach(lz => {
      const lightGroup = new THREE.Group();
      lightGroup.position.set(0, 1.72, lz);

      const grateGeo = new THREE.PlaneGeometry(2.0, 0.5);
      const grateMat = new THREE.MeshBasicMaterial({ map: lampGrateTex, transparent: true, side: THREE.DoubleSide });
      const grateMesh = new THREE.Mesh(grateGeo, grateMat);
      grateMesh.rotation.x = Math.PI / 2;
      lightGroup.add(grateMesh);

      // Glow plane
      const glowGeo = new THREE.PlaneGeometry(1.8, 0.35);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.rotation.x = Math.PI / 2;
      glowMesh.position.y = -0.02;
      lightGroup.add(glowMesh);

      this.scene.add(lightGroup);
    });
  }

  // =========================================================================
  // 2.5. INNER ENTRYWAY PARTITION WALL & OPEN DOORS (media_1789629777815.png)
  // =========================================================================
  buildInnerEntryway() {
    const entrywayGroup = new THREE.Group();
    entrywayGroup.position.set(0, 0, 8.5); // Inner partition at z = 8.5

    const wallTex = this.loadTexture('assets/textures/corridor/wall_texture.webp', 2, 2);
    const wallMat = new THREE.MeshBasicMaterial({ map: wallTex, side: THREE.DoubleSide });

    // 1. Left Partition Wall (from x = -3.5 to -1.1)
    const leftWallGeo = new THREE.PlaneGeometry(2.4, 3.5);
    const leftWallMesh = new THREE.Mesh(leftWallGeo, wallMat);
    leftWallMesh.position.set(-2.3, 0, 0);
    entrywayGroup.add(leftWallMesh);

    // 2. Right Partition Wall (from x = 1.1 to 3.5)
    const rightWallGeo = new THREE.PlaneGeometry(2.4, 3.5);
    const rightWallMesh = new THREE.Mesh(rightWallGeo, wallMat);
    rightWallMesh.position.set(2.3, 0, 0);
    entrywayGroup.add(rightWallMesh);

    // 3. Top Header Wall Above Opening (from x = -1.1 to 1.1, y = 0.85 to 1.75)
    const topWallGeo = new THREE.PlaneGeometry(2.2, 0.9);
    const topWallMesh = new THREE.Mesh(topWallGeo, wallMat);
    topWallMesh.position.set(0, 1.3, 0);
    entrywayGroup.add(topWallMesh);

    // 4. Authentic Doodles on the wall facing the entrance camera (media_1789629777815.png):
    // Left: IDEA -> DEV -> BUG!
    const ideaTex = this.loadTexture('assets/textures/corridor/decorations/idea_process.webp');
    const ideaGeo = new THREE.PlaneGeometry(1.6, 1.7);
    const ideaMat = new THREE.MeshBasicMaterial({ map: ideaTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const ideaMesh = new THREE.Mesh(ideaGeo, ideaMat);
    ideaMesh.position.set(-2.2, 0.05, 0.02);
    entrywayGroup.add(ideaMesh);

    // Above Doorway: while(true) { explore(); }
    const loopTex = this.loadTexture('assets/textures/corridor/decorations/while_true_loop.webp');
    const loopGeo = new THREE.PlaneGeometry(1.35, 0.85);
    const loopMat = new THREE.MeshBasicMaterial({ map: loopTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const loopMesh = new THREE.Mesh(loopGeo, loopMat);
    loopMesh.position.set(0, 1.25, 0.02);
    entrywayGroup.add(loopMesh);

    // Right: Coffee FUEL + crossed bug + git branching icon
    const coffeeTex = this.loadTexture('assets/textures/corridor/decorations/coffee_debug.webp');
    const coffeeGeo = new THREE.PlaneGeometry(1.4, 1.35);
    const coffeeMat = new THREE.MeshBasicMaterial({ map: coffeeTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const coffeeMesh = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffeeMesh.position.set(2.2, 0.05, 0.02);
    entrywayGroup.add(coffeeMesh);

    // 5. Inner Door Frame (frame_sketch.webp)
    const frameTex = this.loadTexture('assets/textures/corridor/doors/frame_sketch.webp');
    const frameGeo = new THREE.PlaneGeometry(2.2, 2.6);
    const frameMat = new THREE.MeshBasicMaterial({ map: frameTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, -0.45, 0.01);
    entrywayGroup.add(frameMesh);

    // 6. Two Inner Doors Swung Open Inwards (media_1789629777815.png)
    const doorW = 0.95;
    const doorH = 2.4;
    const innerDoorGeo = new THREE.PlaneGeometry(doorW, doorH);

    // Left Inner Door (doorrleft.webp) with blue loop ribbon doodle
    const leftInnerPivot = new THREE.Group();
    leftInnerPivot.position.set(-1.05, -0.5, 0);
    leftInnerPivot.rotation.y = -Math.PI * 0.42;

    const leftInnerTex = this.loadTexture('assets/textures/corridor/doors/doorrleft.webp');
    const leftInnerMat = new THREE.MeshBasicMaterial({ map: leftInnerTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const leftInnerMesh = new THREE.Mesh(innerDoorGeo, leftInnerMat);
    leftInnerMesh.position.set(doorW / 2, 0, 0);
    leftInnerPivot.add(leftInnerMesh);

    const handleTexL = this.loadTexture('assets/textures/corridor/doors/handle_left_sketch.webp');
    const handleMeshL = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.6), new THREE.MeshBasicMaterial({ map: handleTexL, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    handleMeshL.position.set(doorW - 0.15, -0.1, 0.02);
    leftInnerMesh.add(handleMeshL);
    entrywayGroup.add(leftInnerPivot);

    // Right Inner Door (dorright.webp) with blue loop ribbon doodle
    const rightInnerPivot = new THREE.Group();
    rightInnerPivot.position.set(1.05, -0.5, 0);
    rightInnerPivot.rotation.y = Math.PI * 0.42;

    const rightInnerTex = this.loadTexture('assets/textures/corridor/doors/dorright.webp');
    const rightInnerMat = new THREE.MeshBasicMaterial({ map: rightInnerTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const rightInnerMesh = new THREE.Mesh(innerDoorGeo, rightInnerMat);
    rightInnerMesh.position.set(-doorW / 2, 0, 0);
    rightInnerPivot.add(rightInnerMesh);

    const handleTexR = this.loadTexture('assets/textures/corridor/doors/handle_right_sketch.webp');
    const handleMeshR = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.6), new THREE.MeshBasicMaterial({ map: handleTexR, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    handleMeshR.position.set(-doorW + 0.15, -0.1, 0.02);
    rightInnerMesh.add(handleMeshR);
    entrywayGroup.add(rightInnerPivot);

    this.scene.add(entrywayGroup);
    this.innerEntrywayGroup = entrywayGroup;
  }

  // =========================================================================
  // 3. CORRIDOR WALKING BOY AVATAR (20 FPS Flipbook) & 3D SPLITTING TITLE
  // (media_1789629777815.png: z = 5.8-ზე დგას და კამერის მოახლოებისას გვერდზე იწევს!)
  // =========================================================================
  buildCorridorAvatarAndIntro() {
    this.avatarTextures = [];

    // Preload all 9 flipbook animation frames (assets/textures/corridor/avatar_anim/1.webp .. 9.webp)
    for (let i = 1; i <= 9; i++) {
      const tex = this.loadTexture(`assets/textures/corridor/avatar_anim/${i}.webp`);
      this.avatarTextures.push(tex);
    }

    // Avatar Group placed in hallway at z = 5.8, y = -0.61 (feet touch floor at -1.76)
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, -0.61, 5.8);

    // Natural 1:1 human proportion (2.3 x 2.3) matching the 1024x1024 square sketch frames
    const avatarGeo = new THREE.PlaneGeometry(2.3, 2.3);
    const avatarMat = new THREE.MeshBasicMaterial({
      map: this.avatarTextures[0],
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.corridorAvatarMesh = new THREE.Mesh(avatarGeo, avatarMat);
    this.corridorAvatarMesh.userData = { isCorridorAvatar: true };
    avatarGroup.add(this.corridorAvatarMesh);

    this.scene.add(avatarGroup);
    this.corridorAvatarGroup = avatarGroup;
    avatarGroup.visible = false;

    // 2. 3D Floating Sketched Title in front of avatar at z = 5.6
    // Top Letters: V, A, K, O (Split left and right on approach)
    const lettersConfig = [
      { char: 'V', baseX: -0.95, splitDir: -1.6 },
      { char: 'A', baseX: -0.32, splitDir: -0.7 },
      { char: 'K', baseX: 0.32, splitDir: 0.7 },
      { char: 'O', baseX: 0.95, splitDir: 1.6 }
    ];

    this.introLetterMeshes = [];
    lettersConfig.forEach(item => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      const renderLetter = () => {
        ctx.clearRect(0, 0, 256, 256);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 150px "Cabin Sketch", "Noto Sans Georgian", cursive, sans-serif';
        
        // Black outline with white fill (matching itomdev 3D Rubik Scribble lettering)
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 14;
        ctx.strokeText(item.char, 128, 128);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.char, 128, 128);
        tex.needsUpdate = true;
      };

      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      renderLetter();
      this.signboardReRenderers.push(renderLetter);

      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), mat);
      mesh.position.set(item.baseX, 0.25, 5.6);
      this.scene.add(mesh);

      this.introLetterMeshes.push({
        mesh,
        baseX: item.baseX,
        baseY: 0.25,
        splitDir: item.splitDir
      });
    });

    // Subtitle parts: < digital agency />
    const subConfig = [
      { text: '<', baseX: -0.85, splitDir: -1.4 },
      { text: 'digital', baseX: -0.38, splitDir: -0.8 },
      { text: 'agency', baseX: 0.38, splitDir: 0.8 },
      { text: '/>', baseX: 0.85, splitDir: 1.4 }
    ];

    this.introSubMeshes = [];
    subConfig.forEach(item => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const renderSub = () => {
        ctx.clearRect(0, 0, 256, 128);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 44px "Cabin Sketch", monospace, sans-serif';
        ctx.fillStyle = '#4f46e5';
        ctx.fillText(item.text, 128, 64);
        tex.needsUpdate = true;
      };

      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      renderSub();
      this.signboardReRenderers.push(renderSub);

      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.28), mat);
      mesh.position.set(item.baseX, -0.42, 5.55);
      this.scene.add(mesh);

      this.introSubMeshes.push({
        mesh,
        baseX: item.baseX,
        baseY: -0.42,
        splitDir: item.splitDir
      });
    });

    // 3. Floating Doodles in 3D air around avatar (media_1789629777815.png)
    const doodlesData = [
      { path: 'assets/textures/corridor/decorations/paper_airplane.webp', x: 0.65, y: 0.85, z: 5.75, w: 0.6, h: 0.5, speed: 0.7, rotSpeed: 0.15 },
      { path: 'assets/textures/corridor/decorations/pencil.webp', x: 0.85, y: -0.8, z: 5.85, w: 0.45, h: 0.45, speed: 0.4, rotSpeed: 0.1 },
      { path: 'assets/textures/corridor/decorations/coffee_cup.webp', x: 1.35, y: 0.6, z: 5.65, w: 0.35, h: 0.45, speed: 0.35, rotSpeed: 0.05 },
      { path: 'assets/textures/corridor/decorations/paper_ball.webp', x: -1.05, y: -0.7, z: 5.8, w: 0.4, h: 0.4, speed: 0.5, rotSpeed: 0.3 }
    ];

    this.doodleMeshes = [];
    doodlesData.forEach(d => {
      const tex = this.loadTexture(d.path);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.h), mat);
      mesh.position.set(d.x, d.y, d.z);
      this.scene.add(mesh);

      this.doodleMeshes.push({
        mesh,
        baseX: d.x,
        baseY: d.y,
        baseZ: d.z,
        speed: d.speed,
        rotSpeed: d.rotSpeed
      });
    });

    // Hide corridor interior elements until entrance doors open
    this.introLetterMeshes.forEach(item => { item.mesh.visible = false; });
    this.introSubMeshes.forEach(item => { item.mesh.visible = false; });
    this.doodleMeshes.forEach(item => { item.mesh.visible = false; });
  }

  // Helper to create Speech Bubble Texture with hand-drawn style
  createSpeechBubbleTexture(initialLines) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 580;
    const ctx = canvas.getContext('2d');

    const bubbleImg = new Image();
    bubbleImg.src = 'assets/textures/entrance/speech_bubble.webp';
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    let currentLines = initialLines;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bubbleImg.complete && bubbleImg.naturalWidth > 0) {
        ctx.drawImage(bubbleImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(30, 30, canvas.width - 60, canvas.height - 110, [28]);
        ctx.fill();
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Line 1: Main Name / Greeting
      ctx.font = 'bold 46px "Noto Sans Georgian", "Cabin Sketch", sans-serif';
      ctx.fillStyle = '#18181b';
      ctx.fillText(currentLines[0] || '', canvas.width / 2, canvas.height * 0.32);

      // Line 2: Role / Subtitle Accent
      ctx.font = 'bold 36px "Cabin Sketch", "Caveat", "Noto Sans Georgian", cursive, sans-serif';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText(currentLines[1] || '', canvas.width / 2, canvas.height * 0.49);

      // Line 3: Instruction
      ctx.font = 'bold 30px "Noto Sans Georgian", "Inter", sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText(currentLines[2] || '', canvas.width / 2, canvas.height * 0.65);

      texture.needsUpdate = true;
    };

    bubbleImg.onload = render;
    if (bubbleImg.complete) render();

    this.signboardReRenderers.push(render);

    return {
      texture,
      update: (newLines) => {
        currentLines = newLines;
        render();
      }
    };
  }

  // Trigger funny quotes when clicking on Duck Pot
  triggerDuckQuote() {
    const quotes = [
      [
        "Have you tried console.log()?",
        "Did you clear the cache? ☕",
        "It works on my machine! 🤷‍♂️"
      ],
      [
        "გამარჯობა! მე ვარ ვაკო ლაღვილავა 👋",
        "Creative Lead & Digital Agency",
        "დაასქროლეთ ↕ ან შეაღეთ კარები 🚪"
      ],
      [
        "Works in production! 🚀",
        "100% No-Template კოდი & 60 FPS",
        "დააკლიკეთ კარებს შესასვლელად!"
      ],
      [
        "Check for missing semicolons! ;",
        "სუფთა არქიტექტურა & 3D ანიმაცია",
        "შეაღეთ სერვისების სტუდია!"
      ],
      [
        "Lighthouse 100/100 ქულა! ⚡",
        "მაქსიმალური სისწრაფე და WOW ეფექტი",
        "მზად ხართ ახალი პროექტისთვის?"
      ]
    ];

    const q = quotes[Math.floor(Math.random() * quotes.length)];
    if (this.updateEntranceBubble) this.updateEntranceBubble(q);

    soundEngine.playPencilScratch();
    if (this.entranceBubbleMesh) {
      this.entranceBubbleMesh.scale.set(1, 1, 1);
      setTimeout(() => {
        if (this.entranceBubbleMesh) this.entranceBubbleMesh.scale.set(0, 0, 0);
      }, 3500);
    }
  }

  // =========================================================================
  // 4. CORRIDOR DOORS WITH AUTHENTIC SIGNBOARDS (pustatabliczka.webp) & HANDLES
  // =========================================================================
  buildDoorsAndDecorations() {
    const doorConfigs = [
      { id: 'about', name: 'THE ABOUT', geoTitle: 'ჩვენს შესახებ', z: 1.0, wall: 'left', texSketch: 'drzwiabout.webp', texPainted: 'drzwiabout_painted.webp' },
      { id: 'services', name: 'THE STUDIO', geoTitle: 'სერვისები', z: -6.0, wall: 'right', texSketch: 'drzwisocial.webp', texPainted: 'drzwisocial_painted.webp' },
      { id: 'work', name: 'THE GALLERY', geoTitle: 'პორტფოლიო', z: -13.0, wall: 'left', texSketch: 'drzwiprojekty.webp', texPainted: 'drzwiprojekty_painted.webp' },
      { id: 'ai-lab', name: 'AI LAB', geoTitle: 'AI აგენტები', z: -20.0, wall: 'right', texSketch: 'drzwisocial.webp', texPainted: 'drzwisocial_painted.webp' },
      { id: 'contact', name: 'LET\'S CONNECT', geoTitle: 'კონტაქტი', z: -27.0, wall: 'back', texSketch: 'drzwikontakt.webp', texPainted: 'drzwikontakt_painted.webp' }
    ];

    doorConfigs.forEach(conf => {
      this.createCorridorDoor(conf);
    });

    this.addWallDecors();
  }

  createCorridorDoor(conf) {
    const doorW = 1.35;
    const doorH = 2.4;
    const isLeft = conf.wall === 'left';
    const isRight = conf.wall === 'right';
    const isBack = conf.wall === 'back';

    // Static door group (frame stays fixed on wall, never rotates)
    const doorGroup = new THREE.Group();
    let posX = 0;
    let posZ = conf.z;
    let initialRotY = 0;

    if (isLeft) {
      posX = -3.49;
      initialRotY = Math.PI / 2;
    } else if (isRight) {
      posX = 3.49;
      initialRotY = -Math.PI / 2;
    } else if (isBack) {
      posX = 0;
      posZ = -29.98;
      initialRotY = 0;
    }

    doorGroup.position.set(posX, -0.45, posZ);
    doorGroup.rotation.y = initialRotY;

    // Door Frame (ramkasingledoors.webp) — stays fixed on wall
    const frameTex = this.loadTexture('assets/textures/corridor/doors/ramkasingledoors.webp');
    const frameGeo = new THREE.PlaneGeometry(1.65, 2.65);
    const frameMat = new THREE.MeshBasicMaterial({ map: frameTex, transparent: true, side: THREE.DoubleSide });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 0, -0.01);
    doorGroup.add(frameMesh);

    // Hinge Pivot — positioned at left edge of door, swings outward into corridor
    const hingePivot = new THREE.Group();
    hingePivot.position.set(-doorW / 2, 0, 0.02);

    // Door Leaf Mesh — offset from hinge so it swings correctly
    const texDefault = this.loadTexture(`assets/textures/corridor/doors/${conf.texSketch}`);
    const texPainted = this.loadTexture(`assets/textures/corridor/doors/${conf.texPainted}`);

    const doorMat = new THREE.MeshBasicMaterial({
      map: texDefault,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const doorMesh = new THREE.Mesh(new THREE.PlaneGeometry(doorW, doorH), doorMat);
    doorMesh.position.set(doorW / 2, 0, 0);
    hingePivot.add(doorMesh);

    // Door Handle Pivot & Mesh (klamkadodrzwi.webp / _painted.webp)
    const handleTex = this.loadTexture('assets/textures/corridor/doors/klamkadodrzwi.webp');
    const handleTexPainted = this.loadTexture('assets/textures/corridor/doors/klamkadodrzwi_painted.webp');

    const handlePivot = new THREE.Group();
    handlePivot.position.set(doorW - 0.15, -0.15, 0.04);

    const handleMat = new THREE.MeshBasicMaterial({ map: handleTex, transparent: true, side: THREE.DoubleSide });
    const handleMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.65), handleMat);
    handlePivot.add(handleMesh);
    hingePivot.add(handlePivot);

    doorGroup.add(hingePivot);

    doorMesh.userData = {
      id: conf.id,
      name: `${conf.name} (${conf.geoTitle})`,
      doorGroup: doorGroup,
      hingePivot: hingePivot,
      initialRotY: initialRotY,
      texDefault: texDefault,
      texPainted: texPainted,
      handlePivot: handlePivot,
      handleMesh: handleMesh,
      handleTex: handleTex,
      handleTexPainted: handleTexPainted
    };

    this.doors.push(doorMesh);
    this.scene.add(doorGroup);

    // Wooden Signboard Above Door (pustatabliczka.webp)
    this.createSignboard(posX, 1.25, posZ, conf.name, conf.geoTitle, initialRotY, conf.wall);
  }

  createSignboard(x, y, z, englishTitle, georgianTitle, rotY, wall) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const boardImg = new Image();
    boardImg.src = 'assets/textures/corridor/pustatabliczka.webp';
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (boardImg.complete && boardImg.naturalWidth > 0) {
        ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#f5ede3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 14;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // English Title
      if (englishTitle.includes(' ')) {
        const words = englishTitle.split(' ');
        ctx.font = 'bold 52px "Cabin Sketch", cursive, monospace, sans-serif';
        ctx.fillStyle = '#18181b';
        ctx.fillText(words[0], canvas.width / 2, canvas.height * 0.32);
        ctx.fillText(words[1], canvas.width / 2, canvas.height * 0.50);
      } else {
        ctx.font = 'bold 64px "Cabin Sketch", cursive, monospace, sans-serif';
        ctx.fillStyle = '#18181b';
        ctx.fillText(englishTitle, canvas.width / 2, canvas.height * 0.40);
      }

      // Hand-drawn sketch divider line
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([16, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.22, canvas.height * 0.65);
      ctx.lineTo(canvas.width * 0.78, canvas.height * 0.65);
      ctx.stroke();
      ctx.setLineDash([]);

      // Georgian Title
      ctx.font = 'bold 38px "Noto Sans Georgian", "Inter", sans-serif';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText(georgianTitle, canvas.width / 2, canvas.height * 0.79);

      texture.needsUpdate = true;
    };

    boardImg.onload = render;
    if (boardImg.complete) render();

    this.signboardReRenderers.push(render);

    const signGeo = new THREE.PlaneGeometry(1.4, 0.7);
    const signMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(signGeo, signMat);

    const offset = wall === 'left' ? 0.02 : (wall === 'right' ? -0.02 : 0.02);
    signMesh.position.set(x + (wall === 'back' ? 0 : offset), y, z + (wall === 'back' ? offset : 0));
    signMesh.rotation.y = rotY;
    this.scene.add(signMesh);
  }

  addWallDecors() {
    const decors = [
      { path: 'assets/textures/corridor/strzalka.webp', x: 3.48, y: 0.7, z: -1.5, rotY: -Math.PI / 2, w: 1.2, h: 0.5 },
      { path: 'assets/textures/corridor/rysuneknaobraz1.webp', x: -3.48, y: 0.9, z: -8.0, rotY: Math.PI / 2, w: 1.4, h: 1.3 },
      { path: 'assets/textures/corridor/rysuneknaobrazek3.webp', x: 3.48, y: 0.9, z: -15.0, rotY: -Math.PI / 2, w: 1.4, h: 1.3 },
      { path: 'assets/textures/corridor/ramkanazdjecieduza_painted.webp', x: -3.48, y: 0.9, z: -18.0, rotY: Math.PI / 2, w: 1.4, h: 1.2 },
      { path: 'assets/textures/corridor/szafkaprzod.webp', x: 3.4, y: -1.0, z: -10.0, rotY: -Math.PI / 2, w: 1.8, h: 1.6 },
      { path: 'assets/textures/corridor/drzewkowdoniczce.webp', x: -3.1, y: -1.1, z: -2.0, rotY: 0, w: 1.0, h: 1.6 },
      { path: 'assets/textures/corridor/kratkawentylacyjna.webp', x: 3.48, y: 1.3, z: 5.0, rotY: -Math.PI / 2, w: 1.0, h: 0.7 }
    ];

    decors.forEach(d => {
      const tex = this.loadTexture(d.path);
      const geo = new THREE.PlaneGeometry(d.w, d.h);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(d.x, d.y, d.z);
      mesh.rotation.y = d.rotY;
      this.scene.add(mesh);
    });
  }

  // =========================================================================
  // 5. EVENT LISTENERS (Scroll, Click, Touch, Mouse Raycast)
  // =========================================================================
  setupEvents() {
    // 1. Mouse Wheel Scroll
    window.addEventListener('wheel', (e) => {
      if (this.isInsideRoom || this.isTransitioning) return;

      // When outside at the entrance, scrolling is disabled just like on itomdev!
      // The user must click the entrance double doors to open them and enter.
      if (!this.isEntranceOpen) {
        return;
      }

      this.targetCameraZ -= e.deltaY * 0.012;
      this.targetCameraZ = Math.max(this.minZ, Math.min(11.0, this.targetCameraZ));
      soundEngine.playPencilScratch();
    }, { passive: true });

    // 2. Touch Drag Scroll
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length) touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isInsideRoom || this.isTransitioning || !e.touches.length) return;
      if (!this.isEntranceOpen) return;

      const deltaY = e.touches[0].clientY - touchStartY;
      touchStartY = e.touches[0].clientY;

      this.targetCameraZ += deltaY * 0.03;
      this.targetCameraZ = Math.max(this.minZ, Math.min(11.0, this.targetCameraZ));
    }, { passive: true });

    // 3. Keyboard Arrow Keys / WASD
    window.addEventListener('keydown', (e) => {
      if (this.isInsideRoom || this.isTransitioning) return;
      if (!this.isEntranceOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.openEntranceDoors();
        }
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.targetCameraZ = Math.max(this.minZ, this.targetCameraZ - 1.5);
        soundEngine.playPencilScratch();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.targetCameraZ = Math.min(11.0, this.targetCameraZ + 1.5);
        soundEngine.playPencilScratch();
      }
    });

    // 4. Mouse Move & Raycasting
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.pointerTarget.x = this.mouse.x;
      this.pointerTarget.y = this.mouse.y;
      this.checkRaycast();
    });

    // 5. Click on Entrance Doors, Duck, Window, or Corridor Doors
    window.addEventListener('click', (e) => {
      if (this.isInsideRoom || this.isTransitioning) return;
      if (e.target.closest('.site-header') ||
          e.target.closest('.map-modal-backdrop') ||
          e.target.closest('.audio-panel-card') ||
          e.target.closest('.notes-panel-card') ||
          e.target.closest('.back-to-corridor-btn') ||
          e.target.closest('button') ||
          e.target.closest('a') ||
          e.target.closest('input') ||
          e.target.closest('textarea')) {
        return;
      }

      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Check Duck Pot clicked
      if (this.duckHitMesh && !this.isEntranceOpen) {
        const duckHits = this.raycaster.intersectObject(this.duckHitMesh);
        if (duckHits.length > 0) {
          this.triggerDuckQuote();
          return;
        }
      }

      // Check Entrance Double Doors or Door Frame clicked
      if (!this.isEntranceOpen) {
        const doorTargets = [
          this.leftEntranceMesh,
          this.rightEntranceMesh,
          this.leftPaintedMesh,
          this.rightPaintedMesh,
          this.leftEntranceHandle,
          this.rightEntranceHandle,
          this.doorFrameMesh
        ].filter(Boolean);

        const entranceHits = this.raycaster.intersectObjects(doorTargets);
        if (entranceHits.length > 0) {
          this.openEntranceDoors();
          return;
        }
      }

      // Check corridor door clicked
      if (this.hoveredDoor) {
        this.enterRoom(this.hoveredDoor);
      }
    });

    // 6. Window Resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);

      // If at entrance, adjust camera framing so facade fits properly
      if (!this.isEntranceOpen) {
        const targetDist = Math.max(10.5, 9.5 / this.camera.aspect);
        this.initialCameraZ = 22.0 + targetDist;
        this.cameraZ = this.initialCameraZ;
        this.targetCameraZ = this.initialCameraZ;
        this.maxZ = this.initialCameraZ;
      }
    });
  }

  // Open the double entrance doors and glide camera into corridor
  openEntranceDoors() {
    if (this.isEntranceOpen || this.isTransitioning) return;
    this.isEntranceOpen = true;
    this.isTransitioning = true;
    soundEngine.playDoorOpen();

    // Turn handles down
    if (this.leftEntranceHandle) this.leftEntranceHandle.rotation.z = 0.4;
    if (this.rightEntranceHandle) this.rightEntranceHandle.rotation.z = -0.4;

    const startTime = performance.now();
    const duration = 1800;

    const startX = this.camera.position.x;
    const startY = this.camera.position.y;
    const startZ = this.camera.position.z;
    const targetX = 0;
    const targetY = 0.25;
    const targetZ = 11.0; // Corridor start viewing point

    const animateOpen = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = p * p * (3 - 2 * p); // smoothstep inOut

      // Swing doors wide open
      if (this.leftEntrancePivot) {
        this.leftEntrancePivot.rotation.y = -Math.PI * 0.55 * ease;
      }
      if (this.rightEntrancePivot) {
        this.rightEntrancePivot.rotation.y = Math.PI * 0.55 * ease;
      }

      // Camera swoops forward into corridor through doorway
      this.camera.position.x = startX + (targetX - startX) * ease;
      this.camera.position.y = startY + (targetY - startY) * ease;
      this.camera.position.z = startZ + (targetZ - startZ) * ease;

      const lookY = 0.65 + (0.25 - 0.65) * ease;
      const lookZ = 22.0 + (0.0 - 22.0) * ease;
      this.camera.lookAt(0, lookY, lookZ);

      this.cameraZ = this.camera.position.z;
      this.targetCameraZ = targetZ;

      if (p < 1) {
        requestAnimationFrame(animateOpen);
      } else {
        this.isTransitioning = false;
        // Show corridor interior elements
        if (this.corridorAvatarGroup) this.corridorAvatarGroup.visible = true;
        this.introLetterMeshes.forEach(item => { item.mesh.visible = true; });
        this.introSubMeshes.forEach(item => { item.mesh.visible = true; });
        this.doodleMeshes.forEach(item => { item.mesh.visible = true; });
        if (this.doorwayBackingMesh) this.doorwayBackingMesh.visible = false;
        const hintEl = document.getElementById('corridorHintText');
        if (hintEl) hintEl.textContent = 'დაასქროლეთ კორიდორის დასათვალიერებლად ↕';
      }
    };

    requestAnimationFrame(animateOpen);
  }

  checkRaycast() {
    if (this.isInsideRoom || this.isTransitioning) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hintEl = document.getElementById('corridorHintText');

    // 1. Entrance Area Hover
    if (!this.isEntranceOpen) {
      // Check Window hover -> Avatar boy peeks out!
      if (this.mouse.x > 0.15 && this.mouse.x < 0.65 && this.mouse.y > -0.3 && this.mouse.y < 0.4) {
        this.targetAvatarWinX = 2.5; // Peeks out into window
      } else {
        this.targetAvatarWinX = 3.5; // Slides back behind wall
      }

      // Check Duck Pot
      if (this.duckHitMesh) {
        const duckHits = this.raycaster.intersectObject(this.duckHitMesh);
        if (duckHits.length > 0) {
          if (hintEl) hintEl.textContent = '🦆 დააკლიკეთ იხვს საიდუმლო ფრაზებისთვის!';
          document.body.classList.add('cursor-hover');
          return;
        }
      }

      // Check double entrance doors
      const doorTargets = [
        this.leftEntranceMesh,
        this.rightEntranceMesh,
        this.leftPaintedMesh,
        this.rightPaintedMesh,
        this.leftEntranceHandle,
        this.rightEntranceHandle,
        this.doorFrameMesh
      ].filter(Boolean);

      const doorHits = this.raycaster.intersectObjects(doorTargets);
      if (doorHits.length > 0) {
        this.isEntranceHovered = true;
        if (hintEl) hintEl.textContent = '🚪 დააკლიკეთ კარებს შესასვლელად!';
        document.body.classList.add('cursor-hover');
        return;
      } else {
        this.isEntranceHovered = false;
      }

      if (hintEl) hintEl.textContent = '🚪 დააკლიკეთ კარებს შესასვლელად!';
      document.body.classList.remove('cursor-hover');
      return;
    }

    // 2. Corridor Doors Hover
    const intersects = this.raycaster.intersectObjects(this.doors);

    if (intersects.length > 0) {
      const hitDoor = intersects[0].object;
      if (this.hoveredDoor !== hitDoor) {
        if (this.hoveredDoor) {
          this.hoveredDoor.material.map = this.hoveredDoor.userData.texDefault;
          this.hoveredDoor.material.needsUpdate = true;
          if (this.hoveredDoor.userData.hingePivot) this.hoveredDoor.userData.hingePivot.rotation.y = 0;
          if (this.hoveredDoor.userData.handleMesh) {
            this.hoveredDoor.userData.handleMesh.material.map = this.hoveredDoor.userData.handleTex;
            this.hoveredDoor.userData.handleMesh.material.needsUpdate = true;
          }
          if (this.hoveredDoor.userData.handlePivot) {
            this.hoveredDoor.userData.handlePivot.rotation.z = 0;
          }
        }
        this.hoveredDoor = hitDoor;
        this.hoveredDoor.material.map = this.hoveredDoor.userData.texPainted;
        this.hoveredDoor.material.needsUpdate = true;

        // Crack door open outward into corridor on hover
        if (hitDoor.userData.hingePivot) hitDoor.userData.hingePivot.rotation.y = -0.2;

        if (this.hoveredDoor.userData.handleMesh) {
          this.hoveredDoor.userData.handleMesh.material.map = this.hoveredDoor.userData.handleTexPainted;
          this.hoveredDoor.userData.handleMesh.material.needsUpdate = true;
        }
        if (this.hoveredDoor.userData.handlePivot) {
          this.hoveredDoor.userData.handlePivot.rotation.z = 0.2;
        }
        soundEngine.playDoorCreak();

        if (hintEl) {
          hintEl.textContent = `🚪 დააკლიკეთ შესასვლელად: ${hitDoor.userData.name}`;
        }
      }
      document.body.classList.add('cursor-hover');
    } else {
      if (this.hoveredDoor) {
        this.hoveredDoor.material.map = this.hoveredDoor.userData.texDefault;
        this.hoveredDoor.material.needsUpdate = true;
        if (this.hoveredDoor.userData.hingePivot) this.hoveredDoor.userData.hingePivot.rotation.y = 0;
        if (this.hoveredDoor.userData.handleMesh) {
          this.hoveredDoor.userData.handleMesh.material.map = this.hoveredDoor.userData.handleTex;
          this.hoveredDoor.userData.handleMesh.material.needsUpdate = true;
        }
        if (this.hoveredDoor.userData.handlePivot) {
          this.hoveredDoor.userData.handlePivot.rotation.z = 0;
        }
        this.hoveredDoor = null;
        if (hintEl) {
          hintEl.textContent = 'დაასქროლეთ კორიდორის დასათვალიერებლად ↕';
        }
      }
      document.body.classList.remove('cursor-hover');
    }
  }

  enterRoom(doorMesh) {
    this.isTransitioning = true;
    soundEngine.playDoorOpen();

    const doorData = doorMesh.userData;

    // 1. Twist handle & Swing Door Wide Open (outward into corridor)
    if (doorData.handlePivot) {
      doorData.handlePivot.rotation.z = 0.45;
    }
    if (doorData.hingePivot) {
      doorData.hingePivot.rotation.y = -1.4;
    }

    // 2. Camera zoom through doorway
    const targetX = doorData.doorGroup.position.x * 0.45;
    const targetZ = doorData.doorGroup.position.z;

    const startX = this.camera.position.x;
    const startZ = this.camera.position.z;
    const startTime = performance.now();
    const duration = 750;

    const zoomStep = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress * (2 - progress); // Ease out quad

      this.camera.position.x = startX + (targetX - startX) * ease;
      this.camera.position.z = startZ + (targetZ - startZ) * ease;

      if (progress < 1) {
        requestAnimationFrame(zoomStep);
      } else {
        this.isInsideRoom = true;
        this.isTransitioning = false;
        if (this.onEnterRoom) {
          this.onEnterRoom(doorData.id);
        }
      }
    };
    requestAnimationFrame(zoomStep);
  }

  exitRoom() {
    this.isTransitioning = true;
    soundEngine.playDoorClose();

    // Close all open doors
    this.doors.forEach(d => {
      if (d.userData.hingePivot) d.userData.hingePivot.rotation.y = 0;
      d.material.map = d.userData.texDefault;
      d.material.needsUpdate = true;
      if (d.userData.handleMesh) {
        d.userData.handleMesh.material.map = d.userData.handleTex;
        d.userData.handleMesh.material.needsUpdate = true;
      }
      if (d.userData.handlePivot) {
        d.userData.handlePivot.rotation.z = 0;
      }
    });

    // Reset camera position smoothly back to center
    const startX = this.camera.position.x;
    const startTime = performance.now();
    const duration = 600;

    const resetStep = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress * (2 - progress);

      this.camera.position.x = startX * (1 - ease);

      if (progress < 1) {
        requestAnimationFrame(resetStep);
      } else {
        this.camera.position.x = 0;
        this.isInsideRoom = false;
        this.isTransitioning = false;
      }
    };
    requestAnimationFrame(resetStep);
  }

  teleportToRoom(roomId) {
    // If at entrance, open entrance doors first
    if (this.cameraZ > 20) {
      this.isEntranceOpen = true;
      if (this.leftEntrancePivot) this.leftEntrancePivot.rotation.y = -Math.PI * 0.55;
      if (this.rightEntrancePivot) this.rightEntrancePivot.rotation.y = Math.PI * 0.55;
      // Show corridor interior
      if (this.corridorAvatarGroup) this.corridorAvatarGroup.visible = true;
      this.introLetterMeshes.forEach(item => { item.mesh.visible = true; });
      this.introSubMeshes.forEach(item => { item.mesh.visible = true; });
      this.doodleMeshes.forEach(item => { item.mesh.visible = true; });
      if (this.doorwayBackingMesh) this.doorwayBackingMesh.visible = false;
    }

    const door = this.doors.find(d => d.userData.id === roomId);
    if (!door) return;

    soundEngine.playPaperRustle();
    
    // Position camera just in front of target door
    this.targetCameraZ = door.userData.doorGroup.position.z + (door.userData.id === 'contact' ? 1.5 : 0.8);
    this.cameraZ = this.targetCameraZ;
    this.camera.position.z = this.cameraZ;
    this.camera.position.x = 0;
    
    this.enterRoom(door);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const clockTime = now * 0.001;

    // A. Entrance Wind & Gentle Motion
    if (this.swingingSign) {
      this.swingingSign.rotation.x = Math.sin(clockTime * 2.0) * 0.05;
    }
    if (this.hangingMouse) {
      this.hangingMouse.rotation.z = Math.sin(clockTime * 1.5) * 0.06;
    }
    if (this.flyingBug) {
      this.flyingBug.position.x = 2.5 + Math.sin(clockTime * 3.0) * 0.15;
      this.flyingBug.position.y = 1.05 + Math.cos(clockTime * 2.2) * 0.12;
      this.flyingBug.rotation.z = Math.sin(clockTime * 6.0) * 0.1;
    }

    // Cat Eyes Tracking Mouse Pointer
    if (this.catPupilLeft && this.catPupilRight) {
      const eyeOffsetX = this.mouse.x * 0.015;
      const eyeOffsetY = this.mouse.y * 0.012;
      this.catPupilLeft.position.x = -0.063 + eyeOffsetX;
      this.catPupilLeft.position.y = 0.27 + eyeOffsetY;
      this.catPupilRight.position.x = 0.0615 + eyeOffsetX;
      this.catPupilRight.position.y = 0.27 + eyeOffsetY;
    }

    // Entrance Window Avatar Smooth Peek-out Lerp
    if (this.avatarWinMesh) {
      this.currentAvatarWinX += (this.targetAvatarWinX - this.currentAvatarWinX) * 0.12;
      this.avatarWinMesh.position.x = this.currentAvatarWinX;
      this.avatarWinMesh.rotation.z = (3.5 - this.currentAvatarWinX) * 0.08;
    }

    // Entrance Doors Top-to-Bottom Wood Reveal & Handle Tilt
    if (!this.isEntranceOpen) {
      const targetReveal = this.isEntranceHovered ? 1.0 : 0.0;
      const targetCrack = this.isEntranceHovered ? 0.08 : 0.0;
      const targetTilt = this.isEntranceHovered ? 0.15 : 0.0;

      this.entranceRevealProgress += (targetReveal - this.entranceRevealProgress) * 0.09;
      this.entranceDoorCrack += (targetCrack - this.entranceDoorCrack) * 0.12;
      this.entranceHandleTilt += (targetTilt - this.entranceHandleTilt) * 0.15;

      if (this.leftDoorShaderMat) this.leftDoorShaderMat.uniforms.uProgress.value = this.entranceRevealProgress;
      if (this.rightDoorShaderMat) this.rightDoorShaderMat.uniforms.uProgress.value = this.entranceRevealProgress;
      if (this.leftHandleShaderMat) this.leftHandleShaderMat.uniforms.uProgress.value = this.entranceRevealProgress;
      if (this.rightHandleShaderMat) this.rightHandleShaderMat.uniforms.uProgress.value = this.entranceRevealProgress;

      if (this.leftEntranceHandlePainted) this.leftEntranceHandlePainted.visible = this.entranceRevealProgress > 0.01;
      if (this.rightEntranceHandlePainted) this.rightEntranceHandlePainted.visible = this.entranceRevealProgress > 0.01;

      if (this.leftEntranceHandle) this.leftEntranceHandle.rotation.z = this.entranceHandleTilt;
      if (this.rightEntranceHandle) this.rightEntranceHandle.rotation.z = -this.entranceHandleTilt;

      if (this.leftEntrancePivot) this.leftEntrancePivot.rotation.y = -this.entranceDoorCrack;
      if (this.rightEntrancePivot) this.rightEntrancePivot.rotation.y = this.entranceDoorCrack;
    }

    // B. Corridor 20 FPS Flipbook Animation (frames 0 to 8 ping-pong loop at 50ms interval)
    if (this.avatarTextures && this.avatarTextures.length === 9 && this.corridorAvatarMesh) {
      if (now - this.lastFrameTime >= 50) { // 20 FPS = 50ms interval
        this.lastFrameTime = now;
        if (this.avatarFrameIndex >= 8) {
          this.avatarForward = false;
        } else if (this.avatarFrameIndex <= 0) {
          this.avatarForward = true;
        }
        this.avatarForward ? this.avatarFrameIndex++ : this.avatarFrameIndex--;
        const frameIdx = Math.max(0, Math.min(8, this.avatarFrameIndex));
        if (this.avatarTextures[frameIdx]) {
          this.corridorAvatarMesh.material.map = this.avatarTextures[frameIdx];
          this.corridorAvatarMesh.material.needsUpdate = true;
        }
      }
    }

    // C. itomdev Signature Pass-Through Evasion & 3D Title Splitting
    // When camera approaches z = 5.8, boy steps to left wall (-1.55) and letters split!
    if (this.corridorAvatarGroup && !this.isInsideRoom) {
      const distToAvatar = this.camera.position.z - 5.8;
      let boyTargetOffset = 0;
      let splitFactor = 0;

      if (distToAvatar > 0 && distToAvatar < 3.2) {
        const k = (3.2 - distToAvatar) / 3.2;
        const ease = k * (2 - k); // easeOutQuad
        boyTargetOffset = -1.55 * ease;
        splitFactor = ease;
      } else if (distToAvatar <= 0 && distToAvatar > -2.0) {
        const k = (distToAvatar - (-2.0)) / (0 - (-2.0));
        const ease = k * (2 - k);
        boyTargetOffset = -1.55 * ease;
        splitFactor = ease;
      }

      this.corridorAvatarGroup.position.x += (boyTargetOffset - this.corridorAvatarGroup.position.x) * 0.1;

      // Animate 3D Top Title letters (V, A, K, O)
      this.introLetterMeshes.forEach((item, idx) => {
        const targetX = item.baseX + item.splitDir * splitFactor * 0.95;
        item.mesh.position.x += (targetX - item.mesh.position.x) * 0.12;
        item.mesh.position.y = item.baseY + Math.sin(clockTime * 2.0 + idx * 0.6) * 0.015;
        item.mesh.rotation.z = Math.sin(clockTime * 1.5 + idx) * 0.02 * (1 + splitFactor);
      });

      // Animate Subtitle parts (< digital agency />)
      this.introSubMeshes.forEach((item, idx) => {
        const targetX = item.baseX + item.splitDir * splitFactor * 0.75;
        item.mesh.position.x += (targetX - item.mesh.position.x) * 0.12;
        item.mesh.position.y = item.baseY + Math.sin(clockTime * 1.8 + idx * 0.4) * 0.01;
      });

      // Animate Floating Doodles
      this.doodleMeshes.forEach(d => {
        d.mesh.position.y = d.baseY + Math.sin(clockTime * d.speed + d.baseX) * 0.035;
        d.mesh.rotation.z += d.rotSpeed * 0.015;
      });
    }

    // D. Camera Motion
    if (!this.isTransitioning && !this.isInsideRoom) {
      if (!this.isEntranceOpen) {
        // Outside Entrance Camera: locked wide at initial distance with gentle perspective glance
        this.camera.position.x = this.mouse.x * 0.35;
        this.camera.position.y = 0.35 + this.mouse.y * 0.15;
        this.camera.position.z = this.initialCameraZ;
        this.camera.lookAt(this.mouse.x * 0.08, 0.65 + this.mouse.y * 0.05, 22.0);
      } else {
        // Inside Corridor Camera: smooth scroll Lerp along Z
        this.cameraZ += (this.targetCameraZ - this.cameraZ) * 0.12;
        this.camera.position.z = this.cameraZ;
        this.camera.position.x = 0;
        this.camera.position.y = 0.25 + Math.sin(this.cameraZ * 1.5) * 0.035;
        this.camera.rotation.y = -this.mouse.x * 0.08;
        this.camera.rotation.x = this.mouse.y * 0.04;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
