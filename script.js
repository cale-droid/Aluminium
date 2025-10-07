st// Data Profil Aluminium (Sama seperti sebelumnya, ini adalah 'database' lokal Anda)
const PROFILE_DATA = {
    "jendela": {
        label: "Jendela Geser",
        inputs: ["Tinggi (m)", "Lebar (m)", "Kuantitas Unit"],
        formula: (tinggi, lebar, kuantitas, kepadatan) => {
            // Contoh Rumus Sederhana untuk Jendela Geser: 
            // Anggap rata-rata kebutuhan profil adalah 0.8 kg per meter keliling
            const BERAT_PROFIL_PER_METER_KELILING = 0.8; 
            const keliling = (2 * tinggi) + (2 * lebar);
            return (keliling * BERAT_PROFIL_PER_METER_KELILING) * kuantitas;
        }
    },
    "pintu": {
        label: "Pintu Swing",
        inputs: ["Tinggi (m)", "Lebar (m)", "Kuantitas Unit"],
        formula: (tinggi, lebar, kuantitas, kepadatan) => {
             // Contoh Rumus Sederhana untuk Pintu Swing:
             // Anggap rata-rata kebutuhan profil adalah 1.2 kg per meter keliling
            const BERAT_PROFIL_PER_METER_KELILING = 1.2;
            const keliling = (2 * tinggi) + (2 * lebar);
            return (keliling * BERAT_PROFIL_PER_METER_KELILING) * kuantitas;
        }
    },
    "batang": {
        label: "Batang/Pipa Umum",
        inputs: ["Diameter (m)", "Panjang (m)", "Kuantitas Batang"],
        formula: (diameter, panjang, kuantitas, kepadatan) => {
            const radius = diameter / 2;
            const volume_per_batang = Math.PI * radius * radius * panjang; // Volume Silinder
            const massa_per_batang = volume_per_batang * kepadatan;
            return massa_per_batang * kuantitas;
        }
    }
};

// Fungsi untuk menampilkan input sesuai tipe yang dipilih
function showInputFields() {
    const type = document.getElementById('product-type').value;
    const inputArea = document.getElementById('input-area');
    const dynamicInputs = document.getElementById('dynamic-inputs');
    
    // Sembunyikan dan keluar jika tidak ada tipe yang dipilih
    if (type === "") {
        inputArea.style.display = 'none';
        dynamicInputs.innerHTML = '';
        return;
    }
    
    // Tampilkan Area Input
    inputArea.style.display = 'block';
    dynamicInputs.innerHTML = ''; // Hapus input sebelumnya

    const data = PROFILE_DATA[type];

    // Generate input dan terapkan Tailwind classes
    data.inputs.forEach((inputLabel, index) => {
        const inputId = `input-${type}-${index}`;
        const html = `
            <div>
                <label for="${inputId}" class="block text-sm font-medium text-gray-700">${inputLabel}:</label>
                <input type="number" id="${inputId}" step="0.001" value="0" 
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
            </div>
        `;
        dynamicInputs.innerHTML += html;
    });
}

// Fungsi untuk menjalankan perhitungan
function calculateAluminum() {
    const type = document.getElementById('product-type').value;
    const data = PROFILE_DATA[type];
    const density = parseFloat(document.getElementById('density').value);
    
    if (!data || !density || type === "") {
        alert("Pilih tipe produk dan pastikan semua input terisi.");
        return;
    }

    // 1. Kumpulkan Nilai Input Dinamis
    const inputValues = data.inputs.map((_, index) => {
        const inputId = `input-${type}-${index}`;
        return parseFloat(document.getElementById(inputId).value) || 0;
    });
    
    // 2. Tambahkan Kepadatan ke daftar argumen
    inputValues.push(density);

    // 3. Jalankan Rumus
    let totalWeight = 0;
    try {
        totalWeight = data.formula(...inputValues);
    } catch (e) {
        console.error("Kesalahan dalam perhitungan rumus:", e);
        alert("Terjadi kesalahan. Pastikan semua angka valid.");
        return;
    }

    // 4. Tampilkan Hasil
    const resultElement = document.getElementById('total-weight');
    resultElement.textContent = `${totalWeight.toFixed(3)} kg`; 
}