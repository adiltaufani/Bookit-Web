import React, { useState } from 'react';
import './addformstyle.scss';
import config from '../config';

const AddProperty = () => {
  const [propertyData, setPropertyData] = useState({
    nama_penginapan: '',
    url_foto: '',
    alamat: '',
    latitude: '',
    longitude: '',
    kota: '',
    property_type: '',
    wifi: false,
    kolam_renang: false,
    parkir: false,
    restoran: false,
    pusat_kebugaran: false,
    resepsionis_24_jam: false,
  });

  const [roomData, setRoomData] = useState({
    nama_kamar: '',
    kapasitas: '',
    harga_kamar: '',
    jumlah_kasur: '',
    jumlah_toilet: '',
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    if (type === 'checkbox') {
      setPropertyData((prevData) => ({
        ...prevData,
        [id]: checked,
      }));
    } else if (type === 'radio') {
      setPropertyData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setPropertyData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleRoomChange = (e) => {
    const { id, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const submitBothForms = async () => {
    try {
      const response = await fetch(`${config.baseURL}/submitform.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      const hotelId = result.id;

      const roomResponse = await fetch(`${config.baseURL}/submitrooms.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...roomData, hotel_id: hotelId }),
      });

      if (!roomResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const roomResult = await roomResponse.json();
      if (roomResult.error) {
        throw new Error(roomResult.error);
      }

      document.getElementById('form-message').innerHTML = roomResult.message;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('form-message').innerHTML = `Error: ${error.message}`;
    }
  };

  return (
    <div className="demo-page">
      <div className="demo-page-navigation">
        <nav>
          <ul>
            <li><a href="#input-types">Isi Data Property</a></li>
            <li><a href="#checkbox-and-radio">Isi Tipe property dan fasilitas</a></li>
            <li><a href="#contribute">Submit</a></li>
          </ul>
        </nav>
      </div>
      <div className="demo-page-content">
        <main id="page-main" className="scrollable-content">
          <section>
            <div id="intro"></div>
            <h1 className="package-name">Form input Property</h1>
            <p>Tolong isi dengan teliti ya, jangan sampai ada kesalahan karena akan mempengaruhi skema dari pemesanan property anda.</p>
          </section>

          <section>
            <div id="input-types"></div>
            <h1>Input Data Property</h1>
            <p>Sertakan semua data yang diminta dengan sesuai</p>
            <form id="property-form">
              <div className="nice-form-group">
                <label>Nama Penginapan</label>
                <input type="text" id="nama_penginapan" value={propertyData.nama_penginapan} onChange={handleInputChange} placeholder="Nama Penginapan Kamu" />
              </div>
              <div className="nice-form-group">
                <label>URL Foto</label>
                <input type="text" id="url_foto" value={propertyData.url_foto} onChange={handleInputChange} placeholder="URL Foto Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Alamat</label>
                <input type="text" id="alamat" value={propertyData.alamat} onChange={handleInputChange} placeholder="Alamat Penginapan Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Latitude</label>
                <input type="text" id="latitude" value={propertyData.latitude} onChange={handleInputChange} placeholder="Latitude Penginapan kamu" />
              </div>
              <div className="nice-form-group">
                <label>Longitude</label>
                <input type="text" id="longitude" value={propertyData.longitude} onChange={handleInputChange} placeholder="Longitude Penginapan Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Kota</label>
                <input type="text" id="kota" value={propertyData.kota} onChange={handleInputChange} placeholder="Kota Penginapan Kamu" />
              </div>

              <h1>Masukan Tipe Property dan fasilitas yang tersedia di property kamu</h1>
              <p>Tolong isi dengan teliti ya, jangan sampai mengecewakan customer yang udah dateng ke property kamu.</p>
              <fieldset className="nice-form-group">
                <div className="nice-form-group">
                  <input type="radio" name="property_type" id="hotel" value="Hotel" checked={propertyData.property_type === 'Hotel'} onChange={handleInputChange} />
                  <label htmlFor="hotel">Hotel <small>Masukan data property kamu</small></label>
                </div>
                <div className="nice-form-group">
                  <input type="radio" name="property_type" id="apartement" value="Apartement" checked={propertyData.property_type === 'Apartement'} onChange={handleInputChange} />
                  <label htmlFor="apartement">Apartemen <small>Masukan data property kamu</small></label>
                </div>
                <div className="nice-form-group">
                  <input type="radio" name="property_type" id="villa" value="Villa" checked={propertyData.property_type === 'Villa'} onChange={handleInputChange} />
                  <label htmlFor="villa">Villa <small>Masukan data property kamu</small></label>
                </div>

                <p className="fasilitas-text">Tolong isi data fasilitas yang tersedia di property kamu.</p>
                <div className="nice-form-group">
                  <input type="checkbox" id="wifi" checked={propertyData.wifi} onChange={handleInputChange} />
                  <label htmlFor="wifi">Wifi</label>
                </div>
                <div className="nice-form-group">
                  <input type="checkbox" id="kolam_renang" checked={propertyData.kolam_renang} onChange={handleInputChange} />
                  <label htmlFor="kolam_renang">Kolam Renang</label>
                </div>
                <div className="nice-form-group">
                  <input type="checkbox" id="parkir" checked={propertyData.parkir} onChange={handleInputChange} />
                  <label htmlFor="parkir">Parkir</label>
                </div>
                <div className="nice-form-group">
                  <input type="checkbox" id="restoran" checked={propertyData.restoran} onChange={handleInputChange} />
                  <label htmlFor="restoran">Restoran</label>
                </div>
                <div className="nice-form-group">
                  <input type="checkbox" id="pusat_kebugaran" checked={propertyData.pusat_kebugaran} onChange={handleInputChange} />
                  <label htmlFor="pusat_kebugaran">Pusat Kebugaran</label>
                </div>
                <div className="nice-form-group">
                  <input type="checkbox" id="resepsionis_24_jam" checked={propertyData.resepsionis_24_jam} onChange={handleInputChange} />
                  <label htmlFor="resepsionis_24_jam">Resepsionis 24 jam</label>
                </div>
              </fieldset>
            </form>
          </section>

          <section id="room-sections">
            <h1>Form Input Data Kamar</h1>
            <p>Masukan input dengan sesuai dengan spesifikasi kamar kamu</p>
            <form id="room-form">
              <div className="nice-form-group">
                <label>Nama Kamar</label>
                <input type="text" id="nama_kamar" value={roomData.nama_kamar} onChange={handleRoomChange} placeholder="Nama Kamar Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Kapasitas</label>
                <input type="text" id="kapasitas" value={roomData.kapasitas} onChange={handleRoomChange} placeholder="Kapasitas Kamar Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Harga</label>
                <input type="text" id="harga_kamar" value={roomData.harga_kamar} onChange={handleRoomChange} placeholder="Harga Kamar Kamu" />
              </div>
              <div className="nice-form-group">
                <label>Jumlah Kasur</label>
                <input type="text" id="jumlah_kasur" value={roomData.jumlah_kasur} onChange={handleRoomChange} placeholder="Jumlah Kasur" />
              </div>
              <div className="nice-form-group">
                <label>Jumlah Toilet</label>
                <input type="text" id="jumlah_toilet" value={roomData.jumlah_toilet} onChange={handleRoomChange} placeholder="Jumlah Toilet" />
              </div>
            </form>
          </section>

          <div className="plus-icon-container" id="add-room">
            <div className="plus-icon">+</div>
            <div className="plus-text">Tambah Kamar</div>
          </div>

          <section>
            <div id="contribute"></div>
            <h1>Submit</h1>
            <p>Tolong di cek lagi data propertynya, jika anda sudah yakin tidak ada kesalahan silahkan submit.</p>
            <button type="button" className="custom-button" onClick={submitBothForms}>Kirim</button>
            <div id="form-message"></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AddProperty;
