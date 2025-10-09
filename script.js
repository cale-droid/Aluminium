// Data Harga dan Profil Aluminium (Struktur Baru)
const PRICE_DATA = {
    // Harga profil per meter, dikelompokkan berdasarkan merek dan ukuran
    PROFIL: {
        "Inkalum": {
            "3 inch": 136000,
            "4 inch": 147000
        },
        "Alexindo": {
            "3 inch": 155000,
            "4 inch": 175000
        },
        "YKK": {
            "3 inch": 185000,
            "4 inch": 250000
        }
    },
    // Harga kaca per meter persegi, direstrukturisasi
    KACA: {
        "Clear": {
            "5mm": 250000,
            "6mm": 300000,
            "8mm": 410000,
            "10mm": 800000,
            "12mm": 1000000
        },
        "Clear Temper": {
            "5mm": 600000,
            "6mm": 670000,
            "8mm": 800000,
            "10mm": 1200000
        },
        "Riben (Hitam)": {
            "5mm": 300000,
            "6mm": 500000,
            "8mm": 600000
        },
        "Es/Blur": {
            "5mm": 450000
        },
        "Cermin": {
            "5mm": 870000
        },
        "Polos Biru": {
            "5mm": 600000
        }
    },
    // Biaya aksesoris per unit
    AKSESORIS: {
        "jendela": 0,
        "pintu": 0
    }
};

    const PRODUCT_FORMULA = {
        "jendela": {
            label: "Jendela",
            inputs: ["Total Tinggi (cm)", "Total Lebar (cm)", "Kuantitas Unit"],
            options: ["profil", "kaca"], 
            // Formula sekarang menerima input kaca secara terpisah
            formula: (inputs, glassInputs, options) => {
                const [total_tinggi_cm, total_lebar_cm, kuantitas] = inputs;
                
                // 1. Harga Profil Aluminium
                const total_panjang_cm = total_tinggi_cm + total_lebar_cm;
                const panjang_m = total_panjang_cm / 100;
                const totalHargaProfil = (panjang_m * options.profil) * kuantitas;

                // 2. Harga Kaca (menggunakan input kaca baru)
                let totalHargaKaca = 0;
                if (options.kaca > 0 && glassInputs) {
                    const [tinggi_kaca_cm, lebar_kaca_cm] = glassInputs;
                    const luasKaca = (tinggi_kaca_cm * lebar_kaca_cm) / 10000;
                    totalHargaKaca = (luasKaca * options.kaca) * kuantitas;
                }

                // 3. Biaya Aksesoris
                const biayaAksesoris = PRICE_DATA.AKSESORIS.jendela * kuantitas;

                // Kembalikan objek dengan rincian harga total
                return {
                    hargaProfil: totalHargaProfil,
                    hargaKaca: totalHargaKaca,
                    biayaAksesoris: biayaAksesoris
                };
            }
        },
        "pintu": {
            label: "Pintu",
            inputs: ["Tinggi (cm)", "Lebar (cm)", "Kuantitas Unit"],
            options: ["profil", "kaca"], // Pintu juga bisa punya opsi kaca
            formula: (inputs, options) => {
                const [tinggi_cm, lebar_cm, kuantitas] = inputs;
                const tinggi_m = tinggi_cm / 100;
                const lebar_m = lebar_cm / 100;

                // 1. Harga Profil
                const panjangProfil = (2 * tinggi_m) + (2 * lebar_m) + lebar_m;
                const totalHargaProfil = (panjangProfil * options.profil) * kuantitas;

                // 2. Harga Kaca
                let totalHargaKaca = 0;
                if (options.kaca > 0) {
                     const luasKaca = (tinggi_m / 2) * lebar_m;
                     totalHargaKaca = (luasKaca * options.kaca) * kuantitas;
                }
                
                // 3. Biaya Aksesoris
                const biayaAksesoris = PRICE_DATA.AKSESORIS.pintu * kuantitas;

                // Kembalikan objek dengan rincian harga total
                return {
                    hargaProfil: totalHargaProfil,
                    hargaKaca: totalHargaKaca,
                    biayaAksesoris: biayaAksesoris
                };
            }
        },
        "segitiga": {
            label: "Segitiga",
            inputs: ["Alas (a)", "Tinggi (t)", "Kuantitas"],
            options: [], // Tidak ada opsi profil atau kaca
            formula: (inputs) => {
                const [alas, tinggi, kuantitas] = inputs;

                // Hitung luas segitiga
                const luasSegitiga = (alas * tinggi) / 2;

                // Kembalikan objek dengan rincian harga total
                return {
                    hargaProfil: 0,
                    hargaKaca: 0,
                    biayaAksesoris: 0
                };
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

    // --- Baris Opsi Profil Kusen (tetap di atas) ---
    if (product.options.includes('profil')) {
        const profilRow = document.createElement('div');
        profilRow.className = 'flex space-x-4';
        profilRow.innerHTML = createStyledSelect('option-profil-brand', 'Merek Kusen', PRICE_DATA.PROFIL, '-- Pilih Merek --');
        profilRow.innerHTML += createStyledSelect('option-profil-size', 'Ukuran Kusen', {}, '-- Pilih Merek --');
        configArea.appendChild(profilRow);
    }

    // Buat Input Dimensi utama (Tinggi, Lebar, Kuantitas)
    product.inputs.forEach((inputLabel, index) => {
        const inputId = `input-${type}-${index}`;
        dynamicInputs.innerHTML += `
            <div>
                <label for="${inputId}" class="block text-sm font-medium text-gray-700">${inputLabel}:</label>
                <input type="number" id="${inputId}" step="any" value="0" 
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg" required>
            </div>
        `;
    });

    // --- Pindahkan Opsi Kaca ke sini, di dalam area dynamicInputs ---
    if (product.options.includes('kaca')) {
        const kacaContainer = document.createElement('div');
        kacaContainer.className = 'space-y-4 pt-4 border-t border-gray-200'; // Tambahkan pemisah visual

        // Checkbox untuk mengontrol visibilitas kaca
        const kacaToggleRow = document.createElement('div');
        kacaToggleRow.className = 'flex items-center';
        kacaToggleRow.innerHTML = `
            <label for="use-kaca-checkbox" class="inline-flex items-center cursor-pointer">
                <span class="mr-3 text-sm font-medium text-gray-900">Pakai Kaca</span>
                <span class="relative">
                    <input id="use-kaca-checkbox" type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </span>
            </label>
        `;
        kacaContainer.appendChild(kacaToggleRow);

        // Kontainer untuk dropdown dan input kaca (awalnya disembunyikan)
        const kacaOptionsRow = document.createElement('div');
        kacaOptionsRow.id = 'kaca-options-container';
        kacaOptionsRow.className = 'flex flex-col space-y-4 hidden';
        
        const kacaSelects = document.createElement('div');
        kacaSelects.className = 'flex space-x-4';
        kacaSelects.innerHTML = createStyledSelect('option-kaca-type', 'Jenis Kaca', PRICE_DATA.KACA, '-- Pilih Jenis --');
        kacaSelects.innerHTML += createStyledSelect('option-kaca-thickness', 'Tebal Kaca', {}, '-- Pilih Jenis --');
        
        const kacaInputs = document.createElement('div');
        kacaInputs.className = 'flex space-x-4';
        kacaInputs.innerHTML = `
            <div>
                <label for="input-kaca-tinggi" class="block text-sm font-medium text-gray-700">Tinggi Kaca (cm):</label>
                <input type="number" id="input-kaca-tinggi" step="any" value="0" class="mt-1 w-full p-3 border border-gray-300 rounded-lg">
            </div>
            <div>
                <label for="input-kaca-lebar" class="block text-sm font-medium text-gray-700">Lebar Kaca (cm):</label>
                <input type="number" id="input-kaca-lebar" step="any" value="0" class="mt-1 w-full p-3 border border-gray-300 rounded-lg">
            </div>
        `;

        kacaOptionsRow.appendChild(kacaSelects);
        kacaOptionsRow.appendChild(kacaInputs);
        kacaContainer.appendChild(kacaOptionsRow);

        // Tambahkan seluruh kontainer kaca ke area input dinamis
        dynamicInputs.appendChild(kacaContainer);
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

    // Buat Input Dimensi (sudah dipindahkan ke atas)
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
        const value = document.getElementById(inputId).value;
        return parseFloat(value.replace(',', '.')) || 0;
    });

    const optionValues = {};
    if (product.options.includes('profil')) {
        const brand = document.getElementById('option-profil-brand').value;
        const size = document.getElementById('option-profil-size').value;
        optionValues.profil = (brand && size) ? PRICE_DATA.PROFIL[brand][size] : 0;
    }

    let glassInputValues = null;
    const useKaca = document.getElementById('use-kaca-checkbox') ? document.getElementById('use-kaca-checkbox').checked : false;
    if (product.options.includes('kaca')) {
        if (useKaca) {
            const kacaType = document.getElementById('option-kaca-type').value;
            const thickness = document.getElementById('option-kaca-thickness').value;
            optionValues.kaca = (kacaType && thickness) ? PRICE_DATA.KACA[kacaType][thickness] : 0;

            // Ambil nilai dari input kaca yang baru
            const tinggiKaca = document.getElementById('input-kaca-tinggi').value;
            const lebarKaca = document.getElementById('input-kaca-lebar').value;
            glassInputValues = [
                parseFloat(tinggiKaca.replace(',', '.')) || 0,
                parseFloat(lebarKaca.replace(',', '.')) || 0
            ];
        } else {
            optionValues.kaca = 0;
        }
    }
    
    try {
        // Kirim input kaca ke formula
        const rincianHarga = product.formula(inputValues, glassInputValues, optionValues);
        
        const totalProfil = rincianHarga.hargaProfil;
        const totalKaca = rincianHarga.hargaKaca;
        const totalAksesoris = rincianHarga.biayaAksesoris;
        const grandTotal = totalProfil + totalKaca + totalAksesoris;

        // Fungsi untuk format ke Rupiah
        const formatRupiah = (angka) => `Rp ${new Intl.NumberFormat('id-ID').format(angka.toFixed(0))}`;

        // Update UI dengan semua nilai
        document.getElementById('result-profil').textContent = formatRupiah(totalProfil);
        document.getElementById('result-kaca').textContent = formatRupiah(totalKaca);
        document.getElementById('total-price').textContent = formatRupiah(grandTotal);

        // Tampilkan atau sembunyikan dimensi kaca
        const kacaDimensiEl = document.getElementById('result-kaca-dimensi');
        if (useKaca && totalKaca > 0) {
            const tinggi = glassInputValues[0];
            const lebar = glassInputValues[1];
            kacaDimensiEl.textContent = `(${tinggi} cm x ${lebar} cm)`;
        } else {
            kacaDimensiEl.textContent = ''; // Kosongkan jika tidak pakai kaca
        }

    } catch (e) {
        console.error("Kesalahan dalam perhitungan rumus:", e);
        alert("Terjadi kesalahan. Pastikan semua angka valid.");
    }
}

// Panggil showInputFields saat halaman dimuat
document.addEventListener('DOMContentLoaded', showInputFields);