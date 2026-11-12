import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'local_dev_db.json');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
      database: process.env.PGDATABASE || process.env.DB_NAME || 'tienda_celulares',
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };

const realPgPool = new Pool(poolConfig);

let connectionMode = 'pending'; // 'postgres' | 'local_fallback'
let localItems = [];
let nextId = 1;

function loadLocalItems() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      localItems = JSON.parse(content);
      const maxId = localItems.reduce((max, item) => Math.max(max, item.id || 0), 0);
      nextId = maxId + 1;
    }
  } catch (err) {
    console.warn('Advertencia al cargar local_dev_db.json:', err.message);
    localItems = [];
  }
}

function saveLocalItems() {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localItems, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al guardar local_dev_db.json:', err.message);
  }
}

// Emulador local para ejecución sin credenciales PostgreSQL locales
function executeLocalQuery(query, params = []) {
  const q = query.trim();
  const normQ = query.replace(/\s+/g, ' ').trim().toUpperCase();

  // DDL
  if (normQ.startsWith('CREATE TABLE') || normQ.startsWith('CREATE INDEX')) {
    return { rows: [] };
  }

  // COUNT
  if (normQ.includes('COUNT(*) AS TOTAL FROM CELULARES') || normQ.includes('COUNT(*) FROM CELULARES')) {
    return { rows: [{ total: localItems.length }] };
  }

  // INSERT
  if (normQ.includes('INSERT INTO CELULARES')) {
    const [marca, modelo, precio, almacenamiento_gb, ram_gb, color, stock, descripcion, imagen_url] = params;
    const now = new Date().toISOString();
    const newItem = {
      id: nextId++,
      marca,
      modelo,
      precio: parseFloat(Number(precio).toFixed(2)),
      almacenamiento_gb: parseInt(almacenamiento_gb, 10),
      ram_gb: parseInt(ram_gb, 10),
      color: color || null,
      stock: parseInt(stock || 0, 10),
      descripcion: descripcion || null,
      imagen_url: imagen_url || null,
      creado_en: now,
      actualizado_en: now
    };
    localItems.unshift(newItem);
    saveLocalItems();
    return { rows: [newItem] };
  }

  // SELECT BY ID
  if (normQ.includes('WHERE ID = $1')) {
    const id = parseInt(params[0], 10);
    const item = localItems.find((c) => c.id === id);
    return { rows: item ? [item] : [] };
  }

  // UPDATE
  if (normQ.includes('UPDATE CELULARES')) {
    const [marca, modelo, precio, almacenamiento_gb, ram_gb, color, stock, descripcion, imagen_url, numId] = params;
    const index = localItems.findIndex((c) => c.id === parseInt(numId, 10));
    if (index === -1) {
      return { rows: [] };
    }
    const updatedItem = {
      ...localItems[index],
      marca,
      modelo,
      precio: parseFloat(Number(precio).toFixed(2)),
      almacenamiento_gb: parseInt(almacenamiento_gb, 10),
      ram_gb: parseInt(ram_gb, 10),
      color: color || null,
      stock: parseInt(stock || 0, 10),
      descripcion: descripcion || null,
      imagen_url: imagen_url || null,
      actualizado_en: new Date().toISOString()
    };
    localItems[index] = updatedItem;
    saveLocalItems();
    return { rows: [updatedItem] };
  }

  // DELETE
  if (normQ.includes('DELETE FROM CELULARES WHERE ID = $1')) {
    const id = parseInt(params[0], 10);
    const index = localItems.findIndex((c) => c.id === id);
    if (index === -1) {
      return { rows: [] };
    }
    const [deleted] = localItems.splice(index, 1);
    saveLocalItems();
    return { rows: [{ id: deleted.id, marca: deleted.marca, modelo: deleted.modelo }] };
  }

  // MARCAS (Deduplicadas)
  if (normQ.includes('DISTINCT MARCA')) {
    const marcasUnicas = Array.from(new Set(localItems.map((c) => c.marca).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    return { rows: marcasUnicas.map((m) => ({ marca: m })) };
  }

  // ESTADISTICAS
  if (normQ.includes('TOTAL_MODELOS') && normQ.includes('TOTAL_STOCK')) {
    const total_modelos = localItems.length;
    const total_stock = localItems.reduce((acc, c) => acc + (c.stock || 0), 0);
    const sumaPrecios = localItems.reduce((acc, c) => acc + (parseFloat(c.precio) || 0), 0);
    const precio_promedio = total_modelos > 0 ? parseFloat((sumaPrecios / total_modelos).toFixed(2)) : 0;
    const precios = localItems.map((c) => parseFloat(c.precio) || 0);
    const precio_minimo = precios.length > 0 ? Math.min(...precios) : 0;
    const precio_maximo = precios.length > 0 ? Math.max(...precios) : 0;

    return {
      rows: [{
        total_modelos,
        total_stock,
        precio_promedio,
        precio_minimo,
        precio_maximo
      }]
    };
  }

  // SELECT GENERAL CON FILTROS Y ORDEN
  let result = [...localItems];

  // Simular filtros según parámetros
  for (const p of params) {
    if (typeof p === 'string' && p.startsWith('%') && p.endsWith('%')) {
      const term = p.slice(1, -1).toLowerCase();
      result = result.filter((c) =>
        (c.marca && c.marca.toLowerCase().includes(term)) ||
        (c.modelo && c.modelo.toLowerCase().includes(term)) ||
        (c.color && c.color.toLowerCase().includes(term))
      );
    } else if (typeof p === 'string') {
      result = result.filter((c) => c.marca && c.marca.toLowerCase() === p.toLowerCase());
    } else if (typeof p === 'number') {
      if (q.includes('precio >=')) {
        result = result.filter((c) => parseFloat(c.precio) >= p);
      }
      if (q.includes('precio <=')) {
        result = result.filter((c) => parseFloat(c.precio) <= p);
      }
    }
  }

  // Orden
  if (q.includes('ORDER BY precio ASC')) {
    result.sort((a, b) => a.precio - b.precio);
  } else if (q.includes('ORDER BY precio DESC')) {
    result.sort((a, b) => b.precio - a.precio);
  } else if (q.includes('ORDER BY marca ASC, modelo ASC')) {
    result.sort((a, b) => a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo));
  } else if (q.includes('ORDER BY stock DESC')) {
    result.sort((a, b) => b.stock - a.stock);
  } else {
    result.sort((a, b) => b.id - a.id);
  }

  return { rows: result };
}

export const pool = {
  async query(text, params = []) {
    if (connectionMode === 'pending') {
      try {
        const client = await realPgPool.connect();
        client.release();
        connectionMode = 'postgres';
        console.log('✓ Conectado exitosamente a PostgreSQL (Modo Producción/Local).');
      } catch (err) {
        connectionMode = 'local_fallback';
        console.warn(`⚠️ Conexión a PostgreSQL falló (${err.message}).`);
        console.log('⚙️ Activando almacenamiento local de respaldo (local_dev_db.json) para desarrollo inmediato.');
        loadLocalItems();
      }
    }

    if (connectionMode === 'postgres') {
      return realPgPool.query(text, params);
    } else {
      return executeLocalQuery(text, params);
    }
  }
};

export default pool;
