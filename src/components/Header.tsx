import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto mt-4 sm:mt-6 md:mt-8 px-4">
      <div className="flex items-center justify-center gap-4 text-text-main">
        <img src="/centauro.jpg" alt="Logo" className="h-12 w-auto" />
        <h1 className="text-3xl font-bold tracking-tight">Inteligência das Plantas : Diagnóstico</h1>
        <img src="/mdh.gif" alt="Logo MDH" className="h-12 w-auto" />
      </div>
    </header>
  );
};

export default Header;