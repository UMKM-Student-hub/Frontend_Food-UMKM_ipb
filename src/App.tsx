import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponen Footer yang baru saja dibuat
// Sesuaikan path import ini jika struktur folder berbeda
import { Footer } from './components/common/Footer';

interface AppProps {}
interface AppState {}

class App extends React.Component<AppProps, AppState> {
  render() {
    return (
      <Router>
        {/* Wrapper utama agar Footer selalu terdorong ke bawah layar */}
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
          
          {/* Main Content Area (flex-grow akan mengisi sisa ruang kosong) */}
          <main className="flex-grow">
            <Routes>
              {/* Route dummy sementara untuk melihat hasilnya */}
              <Route 
                path="/" 
                element={
                  <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                    <h1 className="text-4xl font-bold text-[#02145A] mb-4">
                      UniBites
                    </h1>
                    <p className="text-gray-600">
                      Platform Digital UMKM Mahasiswa IPB University
                    </p>
                  </div>
                } 
              />
              
              {/* Nantinya route CatalogPage, DealsPage, dll dimasukkan di sini */}
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;