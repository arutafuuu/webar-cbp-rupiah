import './style.css'
import '@google/model-viewer'
import modelsData from './data/models.json'

import { MindARThree } from 'https://esm.sh/mind-ar@1.2.5/dist/mindar-image-three.prod.js?deps=three@0.149.0';

let mindarThree = null;

// Fungsi untuk merender tampilan awal pemilihan nominal
function renderSelection() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = `
    <div class="selection-container">
      <h1 class="selection-title">Eksplorasi Rupiah 3D</h1>
      <p class="selection-subtitle">Pilih nominal uang yang ingin Anda lihat dalam bentuk 3D dan AR.</p>
      <button id="scan-mode-btn" class="back-button" style="margin-bottom: 24px; background: rgba(59, 130, 246, 0.2); border-color: var(--accent);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M3 7v-4h4M21 7v-4h-4M3 17v4h4M21 17v4h-4M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path></svg>
        Kembali ke Mode Scan
      </button>
      <div class="nominal-grid">
        ${modelsData.map((model, index) => `
          <div class="nominal-card" data-index="${index}">
            <div class="nominal-value">${model.name}</div>
            <div class="nominal-desc">Ketuk untuk melihat 3D</div>
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

  const scanBtn = document.getElementById('scan-mode-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      renderScanner();
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
          <button id="manual-btn" class="back-button" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); border-color: rgba(255,255,255,0.2);">
            Pilih Manual
          </button>
        </div>
        <div style="width: 280px; height: 140px; border: 2px dashed rgba(255,255,255,0.8); border-radius: 12px; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6);"></div>
        <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-align: center;">Model 3D akan muncul otomatis saat uang dikenali</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('manual-btn').addEventListener('click', () => {
    if (mindarThree) {
      mindarThree.stop();
      mindarThree = null;
    }
    renderSelection();
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
    const {renderer, scene, camera} = mindarThree;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("MindAR Error:", err);
  }
}

// Fungsi untuk merender model berdasarkan data
function render3DView(modelData, fromScanner = false) {
  const appElement = document.querySelector('#app');

  // Membuat elemen hotspot secara dinamis
  const hotspotsHTML = modelData.hotspots.map(hotspot => `
    <button class="hotspot" slot="${hotspot.id}" data-position="${hotspot.position}" data-normal="${hotspot.normal}" data-visibility-attribute="visible">
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
          Lihat di Ruangan Anda (AR)
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Kembali
        </button>
        <button class="ar-button-custom" id="custom-ar-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
             <path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Lihat di Ruangan Anda (AR)
        </button>
      </div>
    </div>
  `;

  // Logika tombol kembali
  document.getElementById('back-to-selection').addEventListener('click', () => {
    if (fromScanner) {
      renderScanner();
    } else {
      renderSelection();
    }
  });

  // Proxy AR click
  const customArButton = document.getElementById('custom-ar-button');
  const realArButton = document.getElementById('ar-button');
  customArButton.addEventListener('click', () => {
    if (realArButton) {
      realArButton.click();
    }
  });

  // Logika interaksi klik pada hotspot
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

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      // Mencegah klik tembus atau mengganggu model-viewer
      e.preventDefault();

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

// Inisialisasi: Render tampilan scanner (MindAR)
renderScanner();
