const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images and demo images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

mongoose.connect('mongodb://localhost:27017/citizensPortal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  userType: String,
  designationId: String,
  password: String,
  aadharNumber: String,
  officialId: String,
  designation: String
});

const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  description: String,
  location: String,
  officials: [String],
  image: String,
  score: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  authorityViewed: { type: Boolean, default: false },
  resolution: {
    beforeImage: String,
    afterImage: String,
    awaitingCitizenConfirmation: { type: Boolean, default: false }
  },
  citizenConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  ownerId: String
});

const Post = mongoose.model('Post', postSchema);

const voteSchema = new mongoose.Schema({
  userId: String,
  postId: String
});

const Vote = mongoose.model('Vote', voteSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    console.log('Saving image:', filename);
    cb(null, filename);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    console.error('Invalid file type:', file.originalname);
    cb(new Error('Only JPEG/PNG images are allowed'));
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, userType, designationId, password, aadharNumber, officialId, designation } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      phone,
      userType,
      designationId,
      password: hashedPassword,
      aadharNumber,
      officialId,
      designation
    });
    await user.save();
    console.log('User registered:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: username }, { designationId: username }]
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('Login failed: Invalid credentials for', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    console.log('User logged in:', user.email);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.fullName, 
        email: user.email, 
        type: user.userType,
        designation: user.designation,
        officialId: user.officialId,
        phone: user.phone
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.error('User not found:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      id: user._id, 
      name: user.fullName, 
      email: user.email, 
      type: user.userType,
      designation: user.designation,
      officialId: user.officialId,
      phone: user.phone,
      role: user.designation || 'Official',
      department: user.designation || 'General'
    });
  } catch (error) {
    console.error('Fetch current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.get('/api/user/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error('User not found:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user._id, name: user.fullName, email: user.email, type: user.userType });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/posts', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { description, location, officials, ownerId } = req.body;
    if (req.userId !== ownerId) {
      console.error('Unauthorized post attempt by user:', req.userId);
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const post = new Post({
      description,
      location,
      officials: officials ? officials.split(',').map(s => s.trim()) : [],
      image: imagePath,
      ownerId
    });
    await post.save();
    console.log('Post created:', post._id, 'Image:', imagePath);
    res.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.get('/api/posts', authenticate, async (req, res) => {
  try {
    const posts = await Post.find();
    console.log('Fetched posts:', posts.length);
    res.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts/:id/view', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post not found:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }
    post.views = (post.views || 0) + 1;
    await post.save();
    console.log('Post view incremented:', post._id, 'Views:', post.views);
    res.json({ views: post.views });
  } catch (error) {
    console.error('Post view error:', error);
    res.status(500).json({ error: 'Failed to update views' });
  }
});

app.post('/api/votes', authenticate, async (req, res) => {
  try {
    const { userId, postId } = req.body;
    if (req.userId !== userId) {
      console.error('Unauthorized vote attempt by user:', req.userId);
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const existing = await Vote.findOne({ userId, postId });
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Post not found for vote:', postId);
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existing) {
      await Vote.deleteOne({ userId, postId });
      post.score = Math.max(0, post.score - 1);
      console.log('Vote removed:', postId);
    } else {
      await new Vote({ userId, postId }).save();
      post.score += 1;
      console.log('Vote added:', postId);
    }
    await post.save();
    res.json({ score: post.score });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

app.get('/api/votes', authenticate, async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.query.userId });
    console.log('Fetched votes for user:', req.query.userId, 'Count:', votes.length);
    res.json(votes);
  } catch (error) {
    console.error('Fetch votes error:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

app.post('/api/posts/:id/confirm', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post not found for confirm:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.ownerId !== req.userId) {
      console.error('Unauthorized confirm attempt by user:', req.userId);
      return res.status(403).json({ error: 'Unauthorized' });
    }
    post.citizenConfirmed = true;
    await post.save();
    console.log('Post confirmed:', post._id);
    res.json(post);
  } catch (error) {
    console.error('Confirm post error:', error);
    res.status(500).json({ error: 'Failed to confirm post' });
  }
});

// Mark post as in progress
app.post('/api/posts/:id/mark-progress', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post not found for mark-progress:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Initialize resolution object if it doesn't exist
    if (!post.resolution) {
      post.resolution = {};
    }
    
    post.resolution.awaitingCitizenConfirmation = true;
    post.authorityViewed = true;
    await post.save();
    
    console.log('Post marked as in progress:', post._id);
    res.json(post);
  } catch (error) {
    console.error('Mark progress error:', error);
    res.status(500).json({ error: 'Failed to mark post as in progress' });
  }
});

// Submit resolution with after image
app.post('/api/posts/:id/resolve', authenticate, upload.single('afterImage'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.error('Post not found for resolve:', req.params.id);
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'After image is required' });
    }
    
    // Initialize resolution object if it doesn't exist
    if (!post.resolution) {
      post.resolution = {};
    }
    
    // Save the after image
    post.resolution.afterImage = `/uploads/${req.file.filename}`;
    post.resolution.awaitingCitizenConfirmation = true;
    post.authorityViewed = true;
    
    await post.save();
    
    console.log('Resolution submitted for post:', post._id, 'After image:', post.resolution.afterImage);
    res.json(post);
  } catch (error) {
    console.error('Resolution submission error:', error);
    res.status(500).json({ error: 'Failed to submit resolution' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));