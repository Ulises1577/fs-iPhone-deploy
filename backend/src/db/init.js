import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEMILLAS_INICIALES = [
  {
    marca: 'Apple',
    modelo: 'iPhone 16 Pro Max',
    precio: 1499.00,
    almacenamiento_gb: 256,
    ram_gb: 8,
    color: 'Titanio Desierto',
    stock: 12,
    descripcion: 'Diseño en titanio de grado aeroespacial, chip A18 Pro, Control de Cámara y la mayor duración de batería en un iPhone.',
    imagen_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  },
  {
    marca: 'Apple',
    modelo: 'iPhone 16 Pro',
    precio: 1199.00,
    almacenamiento_gb: 128,
    ram_gb: 8,
    color: 'Titanio Natural',
    stock: 18,
    descripcion: 'Pantalla Super Retina XDR de 6.3 pulgadas con ProMotion, cámara Fusion de 48 MP y chip A18 Pro.',
    imagen_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  },
  {
    marca: 'Apple',
    modelo: 'iPhone 16',
    precio: 899.00,
    almacenamiento_gb: 128,
    ram_gb: 8,
    color: 'Azul Ultramar',
    stock: 25,
    descripcion: 'Nuevo Control de Cámara, cámara Fusion de 48 MP 2x teleobjetivo, chip A18 y Ceramic Shield de última generación.',
    imagen_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    marca: 'Apple',
    modelo: 'iPhone 15 Pro',
    precio: 999.00,
    almacenamiento_gb: 128,
    ram_gb: 8,
    color: 'Titanio Azul',
    stock: 10,
    descripcion: 'Pionero diseño de titanio, chip A17 Pro, conector USB-C compatible con USB 3 y botón de Acción personalizable.',
    imagen_url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80'
  },
  {
    marca: 'Samsung',
    modelo: 'Galaxy S24 Ultra',
    precio: 1399.00,
    almacenamiento_gb: 512,
    ram_gb: 12,
    color: 'Gris Titanio',
    stock: 14,
    descripcion: 'Galaxy AI integrado, marco de titanio, pantalla Dynamic AMOLED 2X de 6.8 pulgadas y S-Pen incorporado.',
    imagen_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    marca: 'Google',
    modelo: 'Pixel 9 Pro',
    precio: 1099.00,
    almacenamiento_gb: 256,
    ram_gb: 16,
    color: 'Porcelana',
    stock: 8,
    descripcion: 'El procesador Google Tensor G4 optimizado para Gemini, triple cámara avanzada y acabado satinado.',
    imagen_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
  }
];

export async function initDB() {
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecuta las sentencias DDL
    await pool.query(sqlContent);
    console.log('✓ Tabla `celulares` verificada e inicializada con éxito.');

    // Verifica si la tabla está vacía para insertar semillas iniciales
    const { rows } = await pool.query('SELECT COUNT(*) AS total FROM celulares');
    const total = parseInt(rows[0].total, 10);

    if (total === 0) {
      console.log('Iniciando carga de datos iniciales en el catálogo...');
      for (const item of SEMILLAS_INICIALES) {
        await pool.query(
          `INSERT INTO celulares (marca, modelo, precio, almacenamiento_gb, ram_gb, color, stock, descripcion, imagen_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            item.marca,
            item.modelo,
            item.precio,
            item.almacenamiento_gb,
            item.ram_gb,
            item.color,
            item.stock,
            item.descripcion,
            item.imagen_url
          ]
        );
      }
      console.log(`✓ Se insertaron ${SEMILLAS_INICIALES.length} celulares iniciales en el catálogo.`);
    } else {
      console.log(`✓ Base de datos lista: ${total} celulares en el inventario.`);
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    throw error;
  }
}

// Ejecución directa si se invoca como script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDB()
    .then(() => {
      console.log('Inicialización manual completada.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error en inicialización manual:', err);
      process.exit(1);
    });
}
