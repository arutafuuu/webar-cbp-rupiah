import './style.css'
import '@google/model-viewer'
import modelsData from './data/models.json'

import { MindARThree } from 'https://esm.sh/mind-ar@1.2.5/dist/mindar-image-three.prod.js?deps=three@0.149.0';

let mindarThree = null;

function welcomeScreen() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = `
    <div class="selection-container" style="justify-content: center; position: relative;">
      <div class="welcome-header">
        <img src="/images/Bank-Indonesia-Putih.png" alt="Bank Indonesia" class="welcome-logo" />
        <img src="/images/cbp-rupiah-putih.png" alt="CBP Rupiah" class="welcome-logo" />
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 400px; z-index: 1;">
        <h1 class="selection-title">Mari kita Kenali Keaslian Uang Rupiah</h1>
        <p class="selection-subtitle">Pilih mode untuk memulai.</p>
        <button id="scan-mode-btn" class="back-button" style="margin-bottom: 24px; background: rgba(59, 130, 246, 0.2); border-color: var(--accent); width: 100%;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M3 7v-4h4M21 7v-4h-4M3 17v4h4M21 17v4h-4M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path></svg>
          Mode Scan
        </button>
        <button id="manual-btn" class="back-button" style="margin-bottom: 24px; background: rgba(59, 130, 246, 0.2); border-color: var(--accent); width: 100%;">
          <svg width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m7.5 12l-2.004 2.672a2 2 0 0 0 .126 2.552l3.784 4.128c.378.413.912.648 1.473.648H15.5c2.4 0 4-2 4-4q0 0 0 0V9.429m-3 .571v-.571c0-2.286 3-2.286 3 0"></path><path d="M13.5 10V8.286c0-2.286 3-2.286 3 0V10m-6 0V7.5c0-2.286 3-2.286 3 0q0 0 0 0V10m-3 0V3.499A1.5 1.5 0 0 0 9 2v0a1.5 1.5 0 0 0-1.5 1.5V15"></path></g></svg>
          Pilih Manual
        </button>
      </div>

      <div class="welcome-footer">
        <div class="social-icons">
          <a href="#" class="social-icon" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://instagram.com/cbp_rupiah_sulbar" class="social-icon" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="X">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <div class="credit-text">Developed by <strong>KPw BI Sulawesi Barat</strong></div>
      </div>
    </div>
  `;

  const scanBtn = document.getElementById('scan-mode-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      renderScanner();
    });
  }

  const manualBtn = document.getElementById('manual-btn');
  if (manualBtn) {
    manualBtn.addEventListener('click', () => {
      renderSelection();
    });
  }
}

// Fungsi untuk merender tampilan awal pemilihan nominal
function renderSelection() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = `
    <div class="selection-container">
      <h1 class="selection-title">Eksplorasi Rupiah 3D</h1>
      <p class="selection-subtitle">Pilih nominal uang yang ingin Anda lihat dalam bentuk 3D dan AR.</p>
      <button id="back-btn" class="back-button" style="margin-bottom: 24px; background: rgba(59, 130, 246, 0.2); border-color: var(--accent);">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4.4 7.4L6.8 4h2.5L7.2 7h6.3a6.5 6.5 0 0 1 0 13H9l1-2h3.5a4.5 4.5 0 1 0 0-9H7.2l2.1 3H6.8L4.4 8.6L4 8z"></path></svg>
        Kembali
      </button>
      <div class="nominal-grid">
        ${modelsData.map((model, index) => `
          <div class="nominal-card" data-index="${index}">
            <div class="nominal-value">${model.name}</div>
            <div class="nominal-desc">Tahun Emisi ${model.emisi}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const cards = document.querySelectorAll('.nominal-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      render3DView(modelsData[index], false);
    });
  });

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      welcomeScreen();
    });
  }
}

async function renderScanner() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = `
    <div class="scanner-container" style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000;">
      <div id="mindar-container" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
      <div class="scanner-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; pointer-events: auto;">
          <h2 style="color: white; margin: 0; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); font-weight: 600;">Arahkan ke Uang Rupiah</h2>
          <button id="back-btn" class="back-button" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); border-color: rgba(255,255,255,0.2);">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4.4 7.4L6.8 4h2.5L7.2 7h6.3a6.5 6.5 0 0 1 0 13H9l1-2h3.5a4.5 4.5 0 1 0 0-9H7.2l2.1 3H6.8L4.4 8.6L4 8z"></path></svg>
            Kembali
          </button>
        </div>
        <div style="width: 280px; height: 140px; border: 2px dashed rgba(255,255,255,0.8); border-radius: 12px; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6);"></div>
        <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-align: center;">Model 3D akan muncul otomatis saat uang dikenali</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    if (mindarThree) {
      mindarThree.stop();
      mindarThree = null;
    }
    welcomeScreen();
  });

  try {
    mindarThree = new MindARThree({
      container: document.querySelector("#mindar-container"),
      imageTargetSrc: '/targets.mind',
      uiScanning: "no",
      uiLoading: "yes"
    });

    modelsData.forEach((model, index) => {
      const anchor = mindarThree.addAnchor(index);
      anchor.onTargetFound = () => {
        if (mindarThree) {
          mindarThree.stop();
          mindarThree = null;
        }
        render3DView(model, true);
      }
    });

    await mindarThree.start();
    const { renderer, scene, camera } = mindarThree;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("MindAR Error:", err);
  }
}

function render3DView(modelData, fromScanner = false) {
  const appElement = document.querySelector('#app');

  const hotspotsHTML = modelData.hotspots.map((hotspot, index) => `
    <button class="hotspot" slot="${hotspot.id}" data-position="${hotspot.position}" data-normal="${hotspot.normal}" data-visibility-attribute="visible">
      <span class="hotspot-label">${index + 1}</span>
      <div class="hotspot-annotation">
        ${hotspot.imageSrc ? `<img src="${hotspot.imageSrc}" class="hotspot-image" alt="${hotspot.annotation}" />` : ''}
        <strong>${hotspot.annotation}</strong>
        ${hotspot.description ? `<p>${hotspot.description}</p>` : ''}
      </div>
    </button>
  `).join('');

  appElement.innerHTML = `
    <div class="ar-container">
      <model-viewer 
        id="uang-model"
        src="${modelData.modelSrc}" 
        camera-controls 
        ar 
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="auto"
        shadow-intensity="1"
        auto-rotate
        alt="${modelData.alt}"
        environment-image="neutral"
      >
        ${hotspotsHTML}

        <button slot="ar-button" id="ar-button" style="display: none;">
          Lihat di Ruangan Anda
        </button>
      </model-viewer>
    </div>
    <div class="info-overlay">
      <div class="info-content">
        <h1>${modelData.title}</h1>
        <p style="font-size: 12px; margin-top: 10px; color: #94a3b8; text-align: justify;">*Tips: ${modelData.description}</p>
      </div>
      <div class="info-actions">
        <button class="back-button" id="back-to-selection">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4.4 7.4L6.8 4h2.5L7.2 7h6.3a6.5 6.5 0 0 1 0 13H9l1-2h3.5a4.5 4.5 0 1 0 0-9H7.2l2.1 3H6.8L4.4 8.6L4 8z"></path></svg>
          Kembali
        </button>
        <button class="ar-button-custom" id="custom-ar-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
             <path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Lihat di Ruangan Anda
        </button>
      </div>
    </div>
  `;

  document.getElementById('back-to-selection').addEventListener('click', () => {
    if (fromScanner) {
      renderScanner();
    } else {
      renderSelection();
    }
  });

  const customArButton = document.getElementById('custom-ar-button');
  const realArButton = document.getElementById('ar-button');
  customArButton.addEventListener('click', () => {
    if (realArButton) {
      realArButton.click();
    } else {
      alert('Mode AR tidak tersedia di perangkat Anda. Silahkan coba di perangkat lain.');
    }
  });

  const hotspots = document.querySelectorAll('.hotspot');
  const infoOverlay = document.querySelector('.info-overlay');

  const updateOverlayVisibility = () => {
    const isAnyActive = Array.from(hotspots).some(h => h.classList.contains('active'));
    if (isAnyActive) {
      infoOverlay.classList.add('hidden');
    } else {
      infoOverlay.classList.remove('hidden');
    }
  };

  const clickSound = new Audio('/click-zoom.mp3');

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      // Mencegah klik tembus atau mengganggu model-viewer
      e.preventDefault();

      // Play sound effect
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.log('Audio play error:', err));

      // Tutup hotspot lain jika ada yang terbuka
      hotspots.forEach(h => {
        if (h !== hotspot) h.classList.remove('active');
      });

      // Buka/tutup hotspot yang sedang diklik
      hotspot.classList.toggle('active');

      // Perbarui visibilitas overlay
      updateOverlayVisibility();
    });
  });

  // Script pembantu untuk mencari titik koordinat
  const modelViewer = document.querySelector('#uang-model');
  modelViewer.addEventListener('click', (event) => {
    // Jika area di luar hotspot di-klik, tutup semua hotspot
    if (!event.target.closest('.hotspot')) {
      hotspots.forEach(h => h.classList.remove('active'));
      updateOverlayVisibility();
    }

    const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
    if (hit) {
      console.log(`\n\n--- Bikin Hotspot Baru ---`);
      console.log(`"position": "${hit.position.x.toFixed(4)} ${hit.position.y.toFixed(4)} ${hit.position.z.toFixed(4)}",`);
      console.log(`"normal": "${hit.normal.x.toFixed(4)} ${hit.normal.y.toFixed(4)} ${hit.normal.z.toFixed(4)}"`);
      console.log(`--------------------------\n\n`);
    }
  });
}

// Inisialisasi: Render tampilan Welcome Screen
welcomeScreen();
