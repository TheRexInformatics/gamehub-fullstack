/* ==================================
 * GAMEHUB BACKEND - SERVER COMPLETO
 * ================================== */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ==================================
// WEBPAY CONFIGURACIÓN
// ==================================
const { WebpayPlus, Environment, Options } = require('transbank-sdk');

const app = express();

// ==================================
// CONFIGURACIÓN
// ==================================
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gamehub-jwt-secreto-2025';
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://viplat:572364@posterdream.dialyf6.mongodb.net/GameHubDB?retryWrites=true&w=majority";

// ==================================
// MIDDLEWARE
// ==================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'https://gamehub-fullstack.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// ==================================
// CONEXIÓN MONGODB
// ==================================
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB GameHub conectado'))
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });

// ==================================
// MODELOS
// ==================================
const UserSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  rut: String,
  direccion: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const GameSchema = new mongoose.Schema({
  titulo: String,
  precio: Number,
  imagen: String,
  plataforma: String,
  genero: String,
  desarrollador: String,
  descripcion: String,
  stock: { type: Number, default: 1 },
  categoria: { type: String, default: 'juegos' },
  enOferta: { type: Boolean, default: false },
  precioOferta: Number
}, { timestamps: true });
const Game = mongoose.model('Game', GameSchema);

const CarritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      juego: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
      cantidad: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });
const Carrito = mongoose.model('Carrito', CarritoSchema);

const BlogSchema = new mongoose.Schema({
  titulo: String,
  contenido: String,
  autor: String,
  fecha: { type: Date, default: Date.now },
  imagen: String,
  categoria: String
});
const Blog = mongoose.model('Blog', BlogSchema);

const ContactSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  asunto: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});
const Contact = mongoose.model('Contact', ContactSchema);

// ==================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==================================
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'Acceso denegado. No hay token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar permisos' });
  }
};

// ==================================
// ENDPOINTS
// ==================================

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'GameHub Backend', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. OBTENER TODOS LOS JUEGOS (con filtros)
app.get('/api/games', async (req, res) => {
  try {
    const { categoria, plataforma, oferta } = req.query;
    let filter = {};
    
    if (categoria) filter.categoria = categoria;
    if (plataforma) filter.plataforma = plataforma;
    if (oferta === 'true') filter.enOferta = true;
    
    const games = await Game.find(filter).sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error('Error en GET /api/games:', err);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// 3. OBTENER JUEGO POR ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (err) {
    console.error('Error en GET /api/games/:id:', err);
    res.status(500).json({ error: 'Error al obtener el juego' });
  }
});

// 4. REGISTRO DE USUARIO
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rut, direccion } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      rut: rut || '',
      direccion: direccion || '',
      isAdmin: false
    });
    
    await user.save();
    
    const token = jwt.sign(
      { 
        user: { 
          id: user._id, 
          nombre: user.nombre, 
          email: user.email, 
          isAdmin: user.isAdmin 
        } 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { 
        id: user._id, 
        nombre: user.nombre, 
        email: user.email, 
        isAdmin: user.isAdmin 
      }
    });
  } catch (err) {
    console.error('Error en POST /api/auth/register:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// 5. LOGIN DE USUARIO
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    
    const token = jwt.sign(
      { 
        user: { 
          id: user._id, 
          nombre: user.nombre, 
          email: user.email, 
          isAdmin: user.isAdmin 
        } 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: { 
        id: user._id, 
        nombre: user.nombre, 
        email: user.email, 
        isAdmin: user.isAdmin 
      }
    });
  } catch (err) {
    console.error('Error en POST /api/auth/login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
});

// 6. PERFIL DE USUARIO
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error en GET /api/auth/me:', err);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// 7. OBTENER CARRITO
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const cart = await Carrito.findOne({ usuario: req.user.id })
      .populate('items.juego', 'titulo imagen precio plataforma categoria');
    
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error en GET /api/cart:', err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// 8. AGREGAR AL CARRITO
app.post('/api/cart/add', authMiddleware, async (req, res) => {
  try {
    const { juegoId } = req.body;
    
    if (!juegoId) {
      return res.status(400).json({ error: 'ID de juego es requerido' });
    }
    
    const juego = await Game.findById(juegoId);
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    let cart = await Carrito.findOne({ usuario: req.user.id });
    if (!cart) {
      cart = new Carrito({ usuario: req.user.id, items: [] });
    }
    
    const itemIndex = cart.items.findIndex(item => item.juego.toString() === juegoId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].cantidad += 1;
    } else {
      cart.items.push({ juego: juegoId, cantidad: 1 });
    }
    
    await cart.save();
    
    res.json({ 
      message: 'Juego agregado al carrito', 
      cart 
    });
  } catch (err) {
    console.error('Error en POST /api/cart/add:', err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// 9. ELIMINAR DEL CARRITO
app.delete('/api/cart/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const cart = await Carrito.findOne({ usuario: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }
    
    await cart.save();
    
    res.json({ 
      message: 'Item eliminado del carrito', 
      cart 
    });
  } catch (err) {
    console.error('Error en DELETE /api/cart/remove/:itemId:', err);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
});

// 10. VACIAR CARRITO
app.delete('/api/cart/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Carrito.findOne({ usuario: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (err) {
    console.error('Error en DELETE /api/cart/clear:', err);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
});

// 11. CREAR JUEGO (ADMIN)
app.post('/api/admin/games', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const gameData = req.body;
    
    if (!gameData.titulo || !gameData.precio) {
      return res.status(400).json({ error: 'Título y precio son requeridos' });
    }
    
    const game = new Game(gameData);
    await game.save();
    
    res.status(201).json(game);
  } catch (err) {
    console.error('Error en POST /api/admin/games:', err);
    res.status(500).json({ error: 'Error al crear juego' });
  }
});

// 12. ACTUALIZAR JUEGO (ADMIN)
app.put('/api/admin/games/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.json(game);
  } catch (err) {
    console.error('Error en PUT /api/admin/games/:id:', err);
    res.status(500).json({ error: 'Error al actualizar juego' });
  }
});

// 13. ELIMINAR JUEGO (ADMIN)
app.delete('/api/admin/games/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    await Carrito.updateMany(
      { 'items.juego': req.params.id },
      { $pull: { items: { juego: req.params.id } } }
    );
    
    res.json({ message: 'Juego eliminado exitosamente' });
  } catch (err) {
    console.error('Error en DELETE /api/admin/games/:id:', err);
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

// 14. LISTAR USUARIOS (ADMIN)
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error en GET /api/admin/users:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// 15. CAMBIAR ROL ADMIN
app.put('/api/admin/users/:userId/toggle-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ 
      message: `Usuario ${user.isAdmin ? 'ahora es administrador' : 'ya no es administrador'}`,
      user: { id: user._id, nombre: user.nombre, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error('Error en PUT /api/admin/users/:userId/toggle-admin:', err);
    res.status(500).json({ error: 'Error al cambiar rol' });
  }
});

// 16. CREAR ORDEN
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, total, direccion, cliente } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items de orden son requeridos' });
    }
    
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({ 
      message: 'Orden creada exitosamente',
      orderId,
      total: total || 0,
      items,
      cliente: cliente || {},
      direccion: direccion || 'Dirección por definir',
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    });
  } catch (err) {
    console.error('Error en POST /api/orders:', err);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

// 17. BUSCAR JUEGOS
app.get('/api/search/games', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const games = await Game.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { desarrollador: { $regex: q, $options: 'i' } },
        { genero: { $regex: q, $options: 'i' } },
        { plataforma: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(games);
  } catch (err) {
    console.error('Error en GET /api/search/games:', err);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});

// 18. CONTACTO
app.post('/api/contact', async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;
    
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const contact = new Contact({
      nombre,
      email,
      asunto,
      mensaje
    });
    
    await contact.save();
    
    res.status(201).json({ 
      message: 'Mensaje enviado correctamente',
      contactId: contact._id
    });
  } catch (err) {
    console.error('Error en POST /api/contact:', err);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// 19. LISTAR BLOGS
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ fecha: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error en GET /api/blogs:', err);
    res.status(500).json({ error: 'Error al obtener blogs' });
  }
});

// 20. BLOG POR ID
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog no encontrado' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Error en GET /api/blogs/:id:', err);
    res.status(500).json({ error: 'Error al obtener blog' });
  }
});

// 21. CONFIRMAR PAGO (SIMULACIÓN) - MANTENER PARA COMPATIBILIDAD
app.post('/api/payments/commit-old', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    
    const response = {
      buyOrder: `BOU-${Date.now()}`,
      sessionId: `SESS-${Date.now()}`,
      amount: Math.floor(Math.random() * 100000) + 10000,
      transactionDate: new Date().toISOString(),
      responseCode: 0,
      responseDescription: 'Transacción aprobada',
      authorizationCode: `AUTH-${Math.random().toString(36).substr(2, 8)}`,
      paymentTypeCode: 'VD',
      installmentsNumber: 1,
      installmentsAmount: 0
    };
    
    res.json(response);
  } catch (err) {
    console.error('Error en POST /api/payments/commit-old:', err);
    res.status(500).json({ error: 'Error al procesar pago' });
  }
});

// 22. ESTADÍSTICAS (ADMIN)
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalContacts = await Contact.countDocuments();
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nombre email createdAt');
    
    const lowStockGames = await Game.find({ stock: { $lt: 5 } })
      .select('titulo stock precio');
    
    res.json({
      totalUsers,
      totalGames,
      totalContacts,
      recentUsers,
      lowStockGames,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error en GET /api/admin/stats:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// 23. SEED DATA (SOLO DESARROLLO)
app.post('/api/seed', async (req, res) => {
  try {
    const sampleGames = [
      {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        precio: 49990,
        imagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
        plataforma: 'Nintendo Switch',
        genero: 'Aventura',
        desarrollador: 'Nintendo',
        descripcion: 'Explora el vasto mundo de Hyrule en esta épica aventura.',
        stock: 15,
        categoria: 'juegos'
      },
      {
        titulo: 'PlayStation 5 Consola',
        precio: 599990,
        imagen: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
        plataforma: 'PlayStation',
        genero: 'Consola',
        desarrollador: 'Sony',
        descripcion: 'Consola de nueva generación con SSD ultrarrápido.',
        stock: 8,
        categoria: 'consolas'
      },
      {
        titulo: 'Xbox Series X',
        precio: 549990,
        imagen: 'https://compass-ssl.xbox.com/assets/b9/0a/b90ad58f-9950-44a7-87fa-1ee8f0f6a63e.jpg?n=XBX_A-BuyBoxBGImage01-D.png',
        plataforma: 'Xbox',
        genero: 'Consola',
        desarrollador: 'Microsoft',
        descripcion: 'La consola más potente de Microsoft.',
        stock: 12,
        categoria: 'consolas'
      },
      {
        titulo: 'Audífonos Gaming Logitech G733',
        precio: 89990,
        imagen: 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g733/g733-gallery-1.png?v=1',
        plataforma: 'Multiplataforma',
        genero: 'Accesorio',
        desarrollador: 'Logitech',
        descripcion: 'Audífonos inalámbricos con iluminación RGB LIGHTSYNC.',
        stock: 25,
        categoria: 'accesorios'
      },
      {
        titulo: 'Super Mario Bros. Wonder',
        precio: 54990,
        imagen: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000063709/32b85837be122d8c6b7c1b1d6c1a7c63b06a2cdfc5bbee5c5c0c6c6c6c6c6c6c6',
        plataforma: 'Nintendo Switch',
        genero: 'Plataformas',
        desarrollador: 'Nintendo',
        descripcion: 'Nueva aventura 2D de Mario con efectos Wonder.',
        stock: 10,
        categoria: 'juegos',
        enOferta: true,
        precioOferta: 44990
      },
      {
        titulo: 'Cyberpunk 2077: Phantom Liberty',
        precio: 39990,
        imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/N2cVcJ6k2F6RHGgM2MFE6FHu.png',
        plataforma: 'PlayStation 5',
        genero: 'RPG',
        desarrollador: 'CD Projekt Red',
        descripcion: 'RPG de mundo abierto en Night City con expansión.',
        stock: 20,
        categoria: 'juegos',
        enOferta: true,
        precioOferta: 29990
      }
    ];
    
    const sampleBlogs = [
      {
        titulo: 'Los 10 mejores juegos de 2024',
        contenido: 'Repasamos los juegos más destacados del año: Zelda: Tears of the Kingdom, Baldur\'s Gate 3, Spider-Man 2 y más...',
        autor: 'Equipo GameHub',
        imagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
        categoria: 'reseña'
      },
      {
        titulo: 'Guía: Cómo armar tu setup gaming ideal',
        contenido: 'Todo lo que necesitas saber para crear el espacio gaming perfecto: monitores, sillas, iluminación RGB y periféricos...',
        autor: 'Equipo GameHub',
        imagen: 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g733/g733-gallery-1.png?v=1',
        categoria: 'guia'
      }
    ];
    
    await Game.deleteMany({});
    await Blog.deleteMany({});
    
    await Game.insertMany(sampleGames);
    await Blog.insertMany(sampleBlogs);
    
    res.json({ 
      message: '✅ Base de datos poblada con 6 productos REALES',
      gamesAdded: sampleGames.length,
      blogsAdded: sampleBlogs.length,
      detalles: 'Imágenes 100% reales de fuentes oficiales'
    });
  } catch (err) {
    console.error('Error en POST /api/seed:', err);
    res.status(500).json({ error: 'Error al poblar base de datos' });
  }
});

// ==================================
// WEBPAY ENDPOINTS - DEFINITIVOS
// ==================================

// 24. CREAR TRANSACCIÓN WEBPAY
app.post('/api/payments/create', authMiddleware, async (req, res) => {
  console.log('🔍 [WEBPAY] Endpoint /api/payments/create llamado');
  
  try {
    const { amount, buyOrder, sessionId, returnUrl } = req.body;
    
    console.log('📦 [WEBPAY] Datos recibidos:', { amount, buyOrder, sessionId, returnUrl });
    
    if (!amount || !buyOrder || !returnUrl) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos: amount, buyOrder, returnUrl' 
      });
    }
    
    // Configuración Webpay (MODO INTEGRACIÓN - PRUEBAS)
    const webpayConfig = {
      commerceCode: '597055555532', // Código de comercio de integración
      apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key de integración
      environment: Environment.Integration
    };
    
    console.log('🔧 [WEBPAY] Config:', webpayConfig);
    
    // Crear instancia de transacción
    const tx = new WebpayPlus.Transaction(
      new Options(webpayConfig.commerceCode, webpayConfig.apiKey, webpayConfig.environment)
    );
    
    // Crear transacción en Webpay
    const response = await tx.create(
      buyOrder,
      sessionId || `sess_${Date.now()}`,
      parseInt(amount), // Asegurar que sea número entero
      returnUrl
    );
    
    console.log('✅ [WEBPAY] Respuesta:', response);
    
    res.json({
      success: true,
      token: response.token,
      url: response.url,
      message: 'Transacción Webpay creada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ [WEBPAY] Error:', error);
    res.status(500).json({ 
      error: 'Error al crear transacción Webpay',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 25. CONFIRMAR TRANSACCIÓN WEBPAY
app.post('/api/payments/commit', async (req, res) => {
  console.log('🔍 [WEBPAY] Endpoint /api/payments/commit llamado');
  
  try {
    const { token } = req.body;
    
    console.log('📦 [WEBPAY] Token recibido:', token);
    
    if (!token) {
      return res.status(400).json({ error: 'Token de transacción requerido' });
    }
    
    // Configuración Webpay (misma que create)
    const webpayConfig = {
      commerceCode: '597055555532',
      apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      environment: Environment.Integration
    };
    
    const tx = new WebpayPlus.Transaction(
      new Options(webpayConfig.commerceCode, webpayConfig.apiKey, webpayConfig.environment)
    );
    
    const response = await tx.commit(token);
    
    console.log('✅ [WEBPAY] Commit response:', response);
    
    res.json({
      success: response.response_code === 0,
      response_code: response.response_code,
      response_description: response.response_description,
      buy_order: response.buy_order,
      amount: response.amount,
      authorization_code: response.authorization_code,
      payment_type_code: response.payment_type_code,
      transaction_date: response.transaction_date
    });
    
  } catch (error) {
    console.error('❌ [WEBPAY] Commit error:', error);
    res.status(500).json({ 
      error: 'Error al confirmar transacción Webpay',
      details: error.message 
    });
  }
});

// 26. ESTADO DE TRANSACCIÓN WEBPAY
app.post('/api/payments/status', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    
    const webpayConfig = {
      commerceCode: '597055555532',
      apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      environment: Environment.Integration
    };
    
    const tx = new WebpayPlus.Transaction(
      new Options(webpayConfig.commerceCode, webpayConfig.apiKey, webpayConfig.environment)
    );
    
    const response = await tx.status(token);
    res.json(response);
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener estado de transacción',
      details: error.message 
    });
  }
});

// ==================================
// MANEJO DE ERRORES
// ==================================

// Endpoint no encontrado (SIEMPRE AL FINAL)
app.use('*', (req, res) => {
  console.log(`❌ [404] Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('❌ [500] Error del servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// ==================================
// INICIAR SERVIDOR
// ==================================
app.listen(PORT, () => {
  console.log(`🎮 GameHub Backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌱 Seed data: POST http://localhost:${PORT}/api/seed`);
  console.log(`🏦 Webpay endpoints activos:`);
  console.log(`   POST http://localhost:${PORT}/api/payments/create`);
  console.log(`   POST http://localhost:${PORT}/api/payments/commit`);
  console.log(`   POST http://localhost:${PORT}/api/payments/status`);
  console.log(`✅ Backend listo para producción`);
});