/* ===========================
   THREE.JS STARFIELD HERO
   =========================== */
(function initThree(){
  const root = document.getElementById('three-root');

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  root.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color('#0b1024'), 0.035);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.2, 6);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  controls.minDistance = 3; controls.maxDistance = 10;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.6;

  // Stars
  const COUNT = 1400;
  const starGeom = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT*3);
  for (let i=0;i<COUNT;i++){
    const r = 18 * Math.pow(Math.random(), 0.6);
    const th = Math.random()*Math.PI*2;
    const ph = Math.acos(2*Math.random()-1);
    pos[i*3+0]= r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1]= r*Math.cos(ph)*0.6;
    pos[i*3+2]= r*Math.sin(ph)*Math.sin(th);
  }
  starGeom.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  const starMat = new THREE.PointsMaterial({ color:0x86efac, size:0.02, transparent:true, opacity:0.9 });
  const stars = new THREE.Points(starGeom, starMat); scene.add(stars);

  // Centerpiece
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.25, 200, 32),
    new THREE.MeshStandardMaterial({ color:0xa7f3d0, metalness:0.2, roughness:0.25 })
  );
  scene.add(knot);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3,3,4); scene.add(dir);

  // Render loop
  const clock = new THREE.Clock();
  function tick(){
    const t = clock.getElapsedTime();
    stars.rotation.y = t*0.02;
    knot.rotation.x = t*0.35;
    knot.rotation.y = t*0.25;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // Resize
  window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

/* ===========================
   EGG → CAT MODE SEQUENCE
   =========================== */
const eggBtn  = document.getElementById('eggBtn');
const eggWrap = document.getElementById('eggWrap');
const audio   = document.getElementById('rickroll');

let triggered = false;

eggBtn.addEventListener('click', () => {
  if (triggered) return;
  triggered = true;

  // Drop the egg
  eggBtn.classList.add('fall');

  // When the fall animation ends, switch to cat mode & play audio
  eggBtn.addEventListener('animationend', () => {
    // Hide overlay UI & show tiled cat GIF
    document.body.classList.add('cat-mode');

    // Try to play; user gesture already occurred so this should work
    audio.currentTime = 0;
    audio.volume = 0.9;
    audio.play().catch(() => {
      // If browser blocks it, show a tiny nudge:
      const nudge = document.createElement('button');
      nudge.textContent = '▶ Play audio';
      Object.assign(nudge.style, {
        position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)',
        padding:'10px 14px', borderRadius:'999px', border:'0',
        background:'#a7f3d0', color:'#0b132a', fontWeight:'800', zIndex:9999
      });
      nudge.addEventListener('click', ()=>{ audio.play(); nudge.remove(); });
      document.body.appendChild(nudge);
    });
  }, { once:true });
});
