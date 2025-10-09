// Data Harga dan Profil Aluminium (Struktur Baru)
const PRICE_DATA = {
    // Harga profil per meter, dikelompokkan berdasarkan merek dan ukuran
    PROFIL: {
        "Inkalum": {
            "3 inch": 55000,
            "4 inch": 75000
        },
        "Alexindo": {
            "3 inch": 60000,
            "4 inch": 80000
        }
    },
    // Harga kaca per meter persegi, direstrukturisasi
    KACA: {
        "Clear": {
            "5mm": 150000,
            "6mm": 200000
        },
        "Rayben": {
            "5mm": 180000
        }
    },
    // Biaya aksesoris per unit
    AKSESORIS: {
        "jendela": 150000,
        "pintu": 250000
    }
};

const PRODUCT_FORMULA = {
    "jendela": {
        label: "Jendela Geser",
        inputs: ["Tinggi (cm)", "Lebar (cm)", "Kuantitas Unit"],
        // Opsi tambahan untuk produk ini
        options: ["profil", "kaca"], 
        formula: (inputs, options) => {
            const [tinggi_cm, lebar_cm, kuantitas] = inputs;
            // Konversi cm ke m untuk perhitungan harga
            const tinggi_m = tinggi_cm / 100;
            const lebar_m = lebar_cm / 100;

            // 1. Harga Profil Aluminium
            const hargaProfilPerMeter = options.profil; // Harga sudah dipilih dari UI
            const panjangKusen = (2 * tinggi_m) + (2 * lebar_m);
            const panjangDaun = 2 * ((2 * tinggi_m) + lebar_m);
            const totalHargaProfil = (panjangKusen + panjangDaun) * hargaProfilPerMeter;

            // 2. Harga Kaca
            const hargaKacaPerM2 = options.kaca; // Harga sudah dipilih dari UI
            const luasKaca = tinggi_m * lebar_m;
            const totalHargaKaca = luasKaca * hargaKacaPerM2;

            // 3. Biaya Aksesoris
            const biayaAksesoris = PRICE_DATA.AKSESORIS.jendela;

            // 4. Total
            const hargaPerUnit = totalHargaProfil + totalHargaKaca + biayaAksesoris;
            return hargaPerUnit * kuantitas;
        }
    },
    "pintu": {
        label: "Pintu Swing",
        inputs: ["Tinggi (cm)", "Lebar (cm)", "Kuantitas Unit"],
        options: ["profil", "kaca"], // Pintu juga bisa punya opsi kaca
        formula: (inputs, options) => {
            const [tinggi_cm, lebar_cm, kuantitas] = inputs;
            const tinggi_m = tinggi_cm / 100;
            const lebar_m = lebar_cm / 100;

            // 1. Harga Profil
            const hargaProfilPerMeter = options.profil;
            const panjangProfil = (2 * tinggi_m) + (2 * lebar_m) + lebar_m; // Keliling + 1 palang
            const totalHargaProfil = panjangProfil * hargaProfilPerMeter;

            // 2. Harga Kaca (Asumsi setengah pintu adalah kaca, jika dipilih)
            let totalHargaKaca = 0;
            if (options.kaca > 0) { // Cek jika opsi kaca dipilih (bukan "Tanpa Kaca")
                 const hargaKacaPerM2 = options.kaca;
                 const luasKaca = (tinggi_m / 2) * lebar_m;
                 totalHargaKaca = luasKaca * hargaKacaPerM2;
            }
            
            // 3. Biaya Aksesoris
            const biayaAksesoris = PRICE_DATA.AKSESORIS.pintu;

            // 4. Total Harga
            const hargaPerUnit = totalHargaProfil + totalHargaKaca + biayaAksesoris;
            return hargaPerUnit * kuantitas;
        }
    }
};

// Fungsi untuk membuat dropdown dengan gaya tema
function createStyledSelect(id, label, options, placeholder) {
    const optionsHTML = Object.keys(options)
        .map(text => `<option value="${text}">${text}</option>`)
        .join('');
    
    return `
        <div class="w-full">
            <label for="${id}" class="block text-sm font-medium text-gray-700">${label}:</label>
            <div class="relative mt-1">
                <select id="${id}" class="w-full p-3 border border-gray-300 rounded-lg appearance-none pr-10 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">${placeholder}</option>
                    ${optionsHTML}
                </select>
                <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan input dan opsi sesuai tipe produk
function showInputFields() {
    const type = document.getElementById('product-type').value;
    const inputArea = document.getElementById('input-area');
    const configArea = document.getElementById('config-area');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    
    if (!type) {
        inputArea.style.display = 'none';
        return;
    }
    
    inputArea.style.display = 'block';
    configArea.innerHTML = '';
    dynamicInputs.innerHTML = ''; 

    const product = PRODUCT_FORMULA[type];

    // --- Baris Opsi Profil Kusen ---
    if (product.options.includes('profil')) {
        const profilRow = document.createElement('div');
        profilRow.className = 'flex space-x-4';
        profilRow.innerHTML = createStyledSelect('option-profil-brand', 'Merek Kusen', PRICE_DATA.PROFIL, '-- Pilih Merek --');
        profilRow.innerHTML += createStyledSelect('option-profil-size', 'Ukuran Kusen', {}, '-- Pilih Merek --');
        configArea.appendChild(profilRow);
    }

    // --- Baris Opsi Kaca ---
    if (product.options.includes('kaca')) {
        // Checkbox untuk mengontrol visibilitas kaca
        const kacaToggleRow = document.createElement('div');
        kacaToggleRow.className = 'flex items-center pt-4';
        kacaToggleRow.innerHTML = `
            <label for="use-kaca-checkbox" class="inline-flex items-center cursor-pointer">
                <span class="mr-3 text-sm font-medium text-gray-900">Pakai Kaca</span>
                <span class="relative">
                    <input id="use-kaca-checkbox" type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </span>
            </label>
        `;
        configArea.appendChild(kacaToggleRow);

        // Kontainer untuk dropdown kaca (awalnya disembunyikan)
        const kacaOptionsRow = document.createElement('div');
        kacaOptionsRow.id = 'kaca-options-container';
        kacaOptionsRow.className = 'flex space-x-4 mt-1 hidden';
        kacaOptionsRow.innerHTML = createStyledSelect('option-kaca-type', 'Jenis Kaca', PRICE_DATA.KACA, '-- Pilih Jenis --');
        kacaOptionsRow.innerHTML += createStyledSelect('option-kaca-thickness', 'Tebal Kaca', {}, '-- Pilih Jenis --');
        configArea.appendChild(kacaOptionsRow);
    }

    // --- Event Listeners ---
    const brandSelect = document.getElementById('option-profil-brand');
    if (brandSelect) {
        brandSelect.addEventListener('change', (e) => {
            const brand = e.target.value;
            const sizeSelect = document.getElementById('option-profil-size');
            sizeSelect.innerHTML = '';
            if (brand && PRICE_DATA.PROFIL[brand]) {
                const sizeOptions = Object.keys(PRICE_DATA.PROFIL[brand]).map(size => `<option value="${size}">${size}</option>`).join('');
                sizeSelect.innerHTML = `<option value="">-- Pilih Ukuran --</option>${sizeOptions}`;
            } else {
                sizeSelect.innerHTML = '<option value="">-- Pilih Merek --</option>';
            }
        });
    }

    const useKacaCheckbox = document.getElementById('use-kaca-checkbox');
    if (useKacaCheckbox) {
        useKacaCheckbox.addEventListener('change', (e) => {
            document.getElementById('kaca-options-container').classList.toggle('hidden', !e.target.checked);
        });
    }

    const kacaTypeSelect = document.getElementById('option-kaca-type');
    if (kacaTypeSelect) {
        kacaTypeSelect.addEventListener('change', (e) => {
            const kacaType = e.target.value;
            const thicknessSelect = document.getElementById('option-kaca-thickness');
            thicknessSelect.innerHTML = '';
            if (kacaType && PRICE_DATA.KACA[kacaType]) {
                const thicknessOptions = Object.keys(PRICE_DATA.KACA[kacaType]).map(thick => `<option value="${thick}">${thick}</option>`).join('');
                thicknessSelect.innerHTML = `<option value="">-- Pilih Tebal --</option>${thicknessOptions}`;
            } else {
                thicknessSelect.innerHTML = '<option value="">-- Pilih Jenis --</option>';
            }
        });
    }

    // Buat Input Dimensi
    product.inputs.forEach((inputLabel, index) => {
        const inputId = `input-${type}-${index}`;
        dynamicInputs.innerHTML += `
            <div>
                <label for="${inputId}" class="block text-sm font-medium text-gray-700">${inputLabel}:</label>
                <input type="number" id="${inputId}" step="1" value="0" 
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg" required>
            </div>
        `;
    });
}

// Fungsi untuk menjalankan perhitungan HARGA
function calculatePrice() {
    const type = document.getElementById('product-type').value;
    if (!type) {
        alert("Pilih tipe produk terlebih dahulu.");
        return;
    }
    
    const product = PRODUCT_FORMULA[type];

    const inputValues = product.inputs.map((_, index) => {
        const inputId = `input-${type}-${index}`;
        return parseFloat(document.getElementById(inputId).value) || 0;
    });

    const optionValues = {};
    if (product.options.includes('profil')) {
        const brand = document.getElementById('option-profil-brand').value;
        const size = document.getElementById('option-profil-size').value;
        optionValues.profil = (brand && size) ? PRICE_DATA.PROFIL[brand][size] : 0;
    }

    if (product.options.includes('kaca')) {
        const useKaca = document.getElementById('use-kaca-checkbox').checked;
        if (useKaca) {
            const kacaType = document.getElementById('option-kaca-type').value;
            const thickness = document.getElementById('option-kaca-thickness').value;
            optionValues.kaca = (kacaType && thickness) ? PRICE_DATA.KACA[kacaType][thickness] : 0;
        } else {
            optionValues.kaca = 0;
        }
    }
    
    try {
        const totalPrice = product.formula(inputValues, optionValues);
        const resultElement = document.getElementById('total-price');
        resultElement.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(totalPrice.toFixed(0))}`; 
    } catch (e) {
        console.error("Kesalahan dalam perhitungan rumus:", e);
        alert("Terjadi kesalahan. Pastikan semua angka valid.");
    }
}

// Panggil showInputFields saat halaman dimuat
document.addEventListener('DOMContentLoaded', showInputFields);