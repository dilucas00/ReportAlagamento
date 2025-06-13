const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb+srv://gabriel:n3GrUFr0q33S8DFQ@cluster0.ttyszhn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const Alagamento = mongoose.model('Alagamento', {
  nameLocal: String,
  description: String,
  photo: String,
  latitude: Number,
  longitude: Number,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/alagamento', async (req, res) => {
  const alagamento = await Alagamento.find();
  res.json(alagamento);
});

app.post('/alagamento', upload.single('photo'), async (req, res) => {
  const { nameLocal, description, latitude, longitude } = req.body;
  const photo = req.file ? req.file.path : null;
  const alagamento = new Alagamento({ nameLocal, description, photo, latitude, longitude });
  await alagamento.save();
  res.json(alagamento);
});

app.listen(3000, () => console.log('Backend listening on port 3000'));