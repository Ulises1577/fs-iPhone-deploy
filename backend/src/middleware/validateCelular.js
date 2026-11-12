/**
 * Middleware para validar el cuerpo de las peticiones para crear o actualizar un celular.
 * Asegura tipos de datos, rangos y restricciones según el esquema de la base de datos.
 */
export function validateCelular(req, res, next) {
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

  const errores = [];

  // Validación de marca
  if (!marca || typeof marca !== 'string' || marca.trim() === '') {
    errores.push('La marca es obligatoria.');
  } else if (marca.trim().length > 100) {
    errores.push('La marca no puede superar los 100 caracteres.');
  }

  // Validación de modelo
  if (!modelo || typeof modelo !== 'string' || modelo.trim() === '') {
    errores.push('El modelo es obligatorio.');
  } else if (modelo.trim().length > 150) {
    errores.push('El modelo no puede superar los 150 caracteres.');
  }

  // Validación de precio
  if (precio === undefined || precio === null || precio === '') {
    errores.push('El precio es obligatorio.');
  } else {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      errores.push('El precio debe ser un número mayor o igual a 0.');
    }
  }

  // Validación de almacenamiento_gb
  if (almacenamiento_gb === undefined || almacenamiento_gb === null || almacenamiento_gb === '') {
    errores.push('El almacenamiento (GB) es obligatorio.');
  } else {
    const numAlm = Number(almacenamiento_gb);
    if (!Number.isInteger(numAlm) || numAlm <= 0) {
      errores.push('El almacenamiento debe ser un número entero mayor a 0 (ej. 64, 128, 256, 512, 1024).');
    }
  }

  // Validación de ram_gb
  if (ram_gb === undefined || ram_gb === null || ram_gb === '') {
    errores.push('La memoria RAM (GB) es obligatoria.');
  } else {
    const numRam = Number(ram_gb);
    if (!Number.isInteger(numRam) || numRam <= 0) {
      errores.push('La memoria RAM debe ser un número entero mayor a 0 (ej. 4, 6, 8, 12, 16).');
    }
  }

  // Validación de color
  if (color !== undefined && color !== null && typeof color === 'string' && color.trim().length > 50) {
    errores.push('El color no puede superar los 50 caracteres.');
  }

  // Validación de stock
  if (stock !== undefined && stock !== null && stock !== '') {
    const numStock = Number(stock);
    if (!Number.isInteger(numStock) || numStock < 0) {
      errores.push('El stock debe ser un número entero mayor o igual a 0.');
    }
  }

  // Validación de imagen_url (opcional, pero si existe validar formato básico)
  if (imagen_url && typeof imagen_url === 'string' && imagen_url.trim() !== '') {
    try {
      new URL(imagen_url.trim());
    } catch (_) {
      errores.push('La URL de la imagen debe ser un enlace válido (ej. https://...).');
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Errores en la validación de los datos.',
      errores
    });
  }

  // Sanitizar valores normalizados
  req.body = {
    marca: marca.trim(),
    modelo: modelo.trim(),
    precio: parseFloat(Number(precio).toFixed(2)),
    almacenamiento_gb: parseInt(almacenamiento_gb, 10),
    ram_gb: parseInt(ram_gb, 10),
    color: color && typeof color === 'string' ? color.trim() : null,
    stock: stock !== undefined && stock !== null && stock !== '' ? parseInt(stock, 10) : 0,
    descripcion: descripcion && typeof descripcion === 'string' ? descripcion.trim() : null,
    imagen_url: imagen_url && typeof imagen_url === 'string' && imagen_url.trim() !== '' ? imagen_url.trim() : null
  };

  next();
}
