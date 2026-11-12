-- Creación de la tabla de celulares según especificación
CREATE TABLE IF NOT EXISTS celulares (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(150) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  almacenamiento_gb INTEGER NOT NULL CHECK (almacenamiento_gb > 0),
  ram_gb INTEGER NOT NULL CHECK (ram_gb > 0),
  color VARCHAR(50),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  descripcion TEXT,
  imagen_url TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas por marca y modelo
CREATE INDEX IF NOT EXISTS idx_celulares_marca ON celulares (marca);
CREATE INDEX IF NOT EXISTS idx_celulares_modelo ON celulares (modelo);
