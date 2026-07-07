import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: null
  },
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Product price cannot exceed 8 figures']
  },
  rating: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  images: [
    {
      filename: String,
      contentType: String,
      data: Buffer,
      createdAt: Date
    }
  ],
  category: {
    type: String,
    required: [true, 'Please select category for this product']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    default: 1
  },
  quantity: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  quantityInStock: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  portion: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
