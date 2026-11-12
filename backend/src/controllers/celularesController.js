import { pool } from '../db/connection.js';

/**
 * Obtener todos los celulares con soporte para búsqueda, filtros y ordenamiento
 */
export async function getCelulares(req, res, next) {
  try {
    const { search, marca, minPrecio, maxPrecio, orden } = req.query;

    const conditions = [];
    const values = [];

    if (search && search.trim() !== '') {
      values.push(`%${search.trim()}%`);
      conditions.push(`(marca ILIKE $${values.length} OR modelo ILIKE $${values.length} OR color ILIKE $${values.length})`);
    }

    if (marca && marca.trim() !== '' && marca.toLowerCase() !== 'todas') {
      values.push(marca.trim());
      conditions.push(`marca ILIKE $${values.length}`);
    }

    if (minPrecio !== undefined && minPrecio !== '') {
      const min = Number(minPrecio);
      if (!isNaN(min)) {
        values.push(min);
        conditions.push(`precio >= $${values.length}`);
      }
    }

    if (maxPrecio !== undefined && maxPrecio !== '') {
      const max = Number(maxPrecio);
      if (!isNaN(max)) {
        values.push(max);
        conditions.push(`precio <= $${values.length}`);
      }
    }

    let orderClause = 'ORDER BY id DESC'; // Más recientes por defecto
    if (orden === 'precio_asc') {
      orderClause = 'ORDER BY precio ASC';
    } else if (orden === 'precio_desc') {
      orderClause = 'ORDER BY precio DESC';
    } else if (orden === 'modelo_asc') {
      orderClause = 'ORDER BY marca ASC, modelo ASC';
    } else if (orden === 'stock_desc') {
      orderClause = 'ORDER BY stock DESC';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT 
        id,
        marca,
        modelo,
        CAST(precio AS FLOAT) AS precio,
        almacenamiento_gb,
        ram_gb,
        color,
        stock,
        descripcion,
        imagen_url,
        creado_en,
        actualizado_en
      FROM celulares
      ${whereClause}
      ${orderClause};
    `;

    const { rows } = await pool.query(query, values);

    res.json({
      exito: true,
      total: rows.length,
      datos: rows
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener un celular específico por su ID
 */
export async function getCelularById(req, res, next) {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El identificador del celular debe ser un número entero válido.'
      });
    }

    const query = `
      SELECT 
        id,
        marca,
        modelo,
        CAST(precio AS FLOAT) AS precio,
        almacenamiento_gb,
        ram_gb,
        color,
        stock,
        descripcion,
        imagen_url,
        creado_en,
        actualizado_en
      FROM celulares
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [numId]);

    if (rows.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún celular con el ID ${numId}.`
      });
    }

    res.json({
      exito: true,
      datos: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear un nuevo celular
 */
export async function createCelular(req, res, next) {
  try {
    const {
      marca,
      modelo,
      precio,
      almacenamiento_gb,
      ram_gb,
      color,
      stock,
      descripcion,
      imagen_url
    } = req.body;

    const query = `
      INSERT INTO celulares (
        marca,
        modelo,
        precio,
        almacenamiento_gb,
        ram_gb,
        color,
        stock,
        descripcion,
        imagen_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        id,
        marca,
        modelo,
        CAST(precio AS FLOAT) AS precio,
        almacenamiento_gb,
        ram_gb,
        color,
        stock,
        descripcion,
        imagen_url,
        creado_en,
        actualizado_en;
    `;

    const values = [
      marca,
      modelo,
      precio,
      almacenamiento_gb,
      ram_gb,
      color,
      stock,
      descripcion,
      imagen_url
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      exito: true,
      mensaje: `El celular ${rows[0].marca} ${rows[0].modelo} fue registrado exitosamente.`,
      datos: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualizar un celular existente
 */
export async function updateCelular(req, res, next) {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El identificador del celular debe ser un número entero válido.'
      });
    }

    const {
      marca,
      modelo,
      precio,
      almacenamiento_gb,
      ram_gb,
      color,
      stock,
      descripcion,
      imagen_url
    } = req.body;

    const query = `
      UPDATE celulares
      SET 
        marca = $1,
        modelo = $2,
        precio = $3,
        almacenamiento_gb = $4,
        ram_gb = $5,
        color = $6,
        stock = $7,
        descripcion = $8,
        imagen_url = $9,
        actualizado_en = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING 
        id,
        marca,
        modelo,
        CAST(precio AS FLOAT) AS precio,
        almacenamiento_gb,
        ram_gb,
        color,
        stock,
        descripcion,
        imagen_url,
        creado_en,
        actualizado_en;
    `;

    const values = [
      marca,
      modelo,
      precio,
      almacenamiento_gb,
      ram_gb,
      color,
      stock,
      descripcion,
      imagen_url,
      numId
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún celular con el ID ${numId} para actualizar.`
      });
    }

    res.json({
      exito: true,
      mensaje: `El celular ${rows[0].marca} ${rows[0].modelo} se actualizó correctamente.`,
      datos: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Eliminar un celular por su ID
 */
export async function deleteCelular(req, res, next) {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El identificador del celular debe ser un número entero válido.'
      });
    }

    const query = `
      DELETE FROM celulares 
      WHERE id = $1 
      RETURNING id, marca, modelo;
    `;

    const { rows } = await pool.query(query, [numId]);

    if (rows.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún celular con el ID ${numId} para eliminar.`
      });
    }

    res.json({
      exito: true,
      mensaje: `El celular ${rows[0].marca} ${rows[0].modelo} fue eliminado con éxito del catálogo.`,
      id: rows[0].id
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener lista de marcas disponibles en el catálogo
 */
export async function getMarcas(req, res, next) {
  try {
    const query = `
      SELECT DISTINCT marca 
      FROM celulares 
      WHERE marca IS NOT NULL AND marca <> ''
      ORDER BY marca ASC;
    `;
    const { rows } = await pool.query(query);
    const marcasUnicas = Array.from(new Set(rows.map((r) => r.marca).filter(Boolean))).sort((a, b) => a.localeCompare(b));

    res.json({
      exito: true,
      datos: marcasUnicas
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener estadísticas resumidas del catálogo
 */
export async function getEstadisticas(req, res, next) {
  try {
    const query = `
      SELECT 
        COUNT(*)::int AS total_modelos,
        COALESCE(SUM(stock), 0)::int AS total_stock,
        COALESCE(ROUND(AVG(precio)::numeric, 2), 0)::float AS precio_promedio,
        COALESCE(MIN(precio), 0)::float AS precio_minimo,
        COALESCE(MAX(precio), 0)::float AS precio_maximo
      FROM celulares;
    `;
    const { rows } = await pool.query(query);
    res.json({
      exito: true,
      datos: rows[0]
    });
  } catch (error) {
    next(error);
  }
}
