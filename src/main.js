import './style.css'
import '@google/model-viewer'
import modelsData from './data/models.json'

// Fungsi untuk merender tampilan awal pemilihan nominal
function renderSelection() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = `
    <div class="selection-container">
      <h1 class="selection-title">Eksplorasi Rupiah 3D</h1>
      <p class="selection-subtitle">Pilih nominal uang yang ingin Anda lihat dalam bentuk 3D dan AR.</p>
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
      render3DView(modelsData[index]);
    });
  });
}

// Fungsi untuk merender model berdasarkan data
function render3DView(modelData) {
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
    renderSelection();
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

// Inisialisasi: Render tampilan pemilihan nominal
renderSelection();

