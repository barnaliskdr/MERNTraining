import Product from '../models/Product.js';
import { ObjectId } from 'mongodb';



const convertBase64ToBuffer = (base64Image, index) => {

    let contentType = "image/jpeg";
    let base64Data = base64Image;

    // Handle Data URL format
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

    if (matches) {
        contentType = matches[1];
        base64Data = matches[2];
    }

    return {
        filename: `image-${Date.now()}-${index}`,
        contentType,
        data: Buffer.from(base64Data, "base64"),
        createdAt: new Date()
    };
};


export const addProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            stock,
            rating,
            image,
            images
        } = req.body;

        if (!name || !description || price == null || !category) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        let imageList = [];

        // Multiple Images
        if (Array.isArray(images) && images.length > 0) {
            imageList = images;
        }

        // Single Image
        else if (image) {
            imageList = [image];
        }

        const bsonImages = imageList.map((img, index) =>
            convertBase64ToBuffer(img, index + 1)
        );

        const product = new Product({

            name,
            description,
            price,
            category,
            stock: stock || 1,
            rating: rating || 0,
            images: bsonImages

        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                id: product._id,
                imageCount: product.images.length
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select('-images.data')  // Exclude image data for list view
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products.map(product => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        imageCount: product.images.length,
        createdAt: product.createdAt
      }))
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve products'
    });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id)
      .select('-images.data');  // Exclude image data

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        images: product.images.map((img, idx) => ({
          index: idx,
          filename: img.filename,
          contentType: img.contentType,
          createdAt: img.createdAt
        })),
        createdAt: product.createdAt
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve product'
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    const { name, description, price, category, stock, rating } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (rating !== undefined) product.rating = rating;

    // Add new images if provided
    const imageInput = req.body.image || req.body.images || req.body.imageBase64;
    const normalizedImage = normalizeImagePayload(imageInput);
    const imagePayloads = Array.isArray(normalizedImage) ? normalizedImage : [normalizedImage].filter(Boolean);

    if (imagePayloads.length > 0) {
      const newImages = imagePayloads.map((image, index) => ({
        filename: req.body.imageName || `image-${Date.now()}-${index + 1}`,
        contentType: image.contentType || 'image/jpeg',
        data: Buffer.from(image.base64, 'base64'),
        createdAt: new Date()
      }));
      product.images.push(...newImages);
      product.image = imagePayloads[0].base64 || product.image;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        imageCount: product.images.length,
        createdAt: product.createdAt
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update product'
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        _id: product._id,
        name: product.name
      }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete product'
    });
  }
};

// Get Product Image
export const getProductImage = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imgIndex = parseInt(imageIndex);
    if (imgIndex < 0 || imgIndex >= product.images.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = product.images[imgIndex];
    res.setHeader('Content-Type', image.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`);
    res.send(image.data);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve image'
    });
  }
};
