// script.js

/* ===== THREE.JS STARFIELD ===== */
(function initThree(){
  const root = document.getElementById('three-root');
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color('#0b1024'), 0.035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.2, 6);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  controls.minDistance = 3; controls.maxDistance = 10;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.6;

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

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.25, 200, 32),
    new THREE.MeshStandardMaterial({ color:0xa7f3d0, metalness:0.2, roughness:0.25 })
  );
  scene.add(knot);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3,3,4); scene.add(dir);

  const clock = new THREE.Clock();
  (function tick(){
    const t = clock.getElapsedTime();
    stars.rotation.y = t*0.02;
    knot.rotation.x = t*0.35;
    knot.rotation.y = t*0.25;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

/* ===== EGG → CRACK → CAT MODE ===== */
const eggBtn  = document.getElementById('eggBtn');
const crackEl = document.getElementById('crack');
const audio   = document.getElementById('rickroll');
let dropping = false;

if (eggBtn) {
  eggBtn.addEventListener('click', () => {
    if (dropping) return;
    dropping = true;

    // Freeze egg at current screen position
    const rect = eggBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    eggBtn.style.position = 'fixed';
    eggBtn.style.left = `${cx}px`;
    eggBtn.style.top  = `${cy}px`;
    eggBtn.style.transform = 'translate(-50%, -50%)';
    eggBtn.style.zIndex = '6';

    // Start combined animation
    eggBtn.classList.add('fall');

    eggBtn.addEventListener('animationend', () => {
      // Show crack splash at bottom
      crackEl.classList.add('show');

      // Switch to tiled cat background and play audio
      document.body.classList.add('cat-mode');
      audio.currentTime = 0;
      audio.volume = 0.9;
      audio.play().catch(() => {
        const n = document.createElement('button');
        n.textContent = '▶ Play audio';
        Object.assign(n.style, {
          position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)',
          padding:'10px 14px', borderRadius:'999px', border:'0',
          background:'#a7f3d0', color:'#0b132a', fontWeight:'800', zIndex:9999
        });
        n.addEventListener('click', ()=>{ audio.play(); n.remove(); });
        document.body.appendChild(n);
      });
    }, { once:true });
  });
}
