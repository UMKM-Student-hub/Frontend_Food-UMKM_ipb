import React from 'react';

// Mendefinisikan tipe data untuk props agar Type-Safe
interface UMKMHeroProps {
  name: string;
  address: string;
  description: string;
  rating: string; // Menggunakan string untuk mendukung format koma seperti "4,5"
}

interface UMKMHeroState {}

export class UMKMHero extends React.Component<UMKMHeroProps, UMKMHeroState> {
  // Nilai default (fallback) yang sama persis dengan desain referensimu
  static defaultProps = {
    name: "Nama Kantin",
    address: "Alamat kantin, Kantin Fakultas Apa",
    description: "We consider all the drivers of change gives you the components you need to change to create a truly happens.",
    rating: "4,5"
  };

  render() {
    const { name, address, description, rating } = this.props;

    return (
      <section className="w-full bg-transparent py-8 px-4 md:px-0 font-sans">
        {/* Container Flex: Kolom di Mobile, Baris di Desktop */}
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
          
          {/* BAGIAN KIRI: Info UMKM */}
          <div className="flex flex-col max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0D2364] tracking-tight mb-2">
              {name}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-[#0D2364] mb-3">
              {address}
            </h2>
            <p className="text-base md:text-lg text-[#3C4D7B] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* BAGIAN KANAN: Rating & Ulasan */}
          <div className="flex flex-col items-start md:items-end flex-shrink-0">
            <div className="flex items-start md:items-center">
              <span className="text-6xl md:text-7xl font-extrabold text-[#0D2364] tracking-tighter">
                {rating}<span className="text-5xl md:text-6xl font-bold">/5</span>
              </span>
              {/* Ornamen Bintang/Sparkle */}
              <span className="text-4xl md:text-5xl ml-2 animate-pulse select-none">
                ✨
              </span>
            </div>
            <span className="text-lg md:text-xl text-[#3C4D7B] font-medium mt-1 md:mt-2">
              Ulasan
            </span>
          </div>

        </div>
      </section>
    );
  }
}