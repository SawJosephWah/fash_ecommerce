import { Request, Response, NextFunction } from 'express';
import Product from '../models/productModel';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/authMiddleware';
import { deleteImage, uploadImage } from '../utils/cloudinary';

export const createProduct = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // const { name, description, price, instock_count, category } = req.body;

  // 1. Handle Images
  const imageUrls: { url: string; public_id: string }[] = [];

  if (req.files && Array.isArray(req.files)) {
    // Loop through all files uploaded via multer
    for (const file of req.files as Express.Multer.File[]) {
      const result = await uploadImage(file.path, 'products'); // 'products' is the folder name
      if (result) {
        imageUrls.push({
          url: result.url,
          public_id: result.public_id // Note: match your model field name
        });
      }
    }
  }



  // 2. Prepare Data
  const productData = {
    ...req.body,
    images: imageUrls,
    user: req.user?._id
  };

  // 3. Save to Database
  const newProduct = await Product.create(productData);

  res.status(201).json({
    status: 'success',
    data: newProduct
  });
});

export const updateProduct = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error: any = new Error('No product found with that ID');
    error.statusCode = 404;
    return next(error);
  }

  // --- 1. HANDLE OLD IMAGES & DELETIONS ---
  let keptImages = [];

  if (req.body.existing_images) {
    try {
      const rawData = req.body.existing_images;

      // 1. If Multer gives us an array of strings (e.g. ['{"id":1}', '{"id":2}'])
      if (Array.isArray(rawData)) {
        keptImages = rawData.map((img) => (typeof img === "string" ? JSON.parse(img) : img)).flat();
      } else {
        // 2. If it's a single stringified array (e.g. '[{"id":1}]')
        const parsed = JSON.parse(rawData);

        // If the parsed result is an array, use it; otherwise, wrap it.
        keptImages = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (error) {
      console.error("Failed to parse existing_images:", error);
      keptImages = [];
    }
  }

  // Find images that exist in DB but ARE NOT in the 'keptImages' list
  const imagesToDelete = product.images.filter(
    (dbImg) => !keptImages.find((keep: any) => keep.public_id === dbImg.public_id)
  );


  // Delete removed images from Cloudinary
  for (const img of imagesToDelete) {
    await deleteImage(img.public_id);
  }

  // --- 2. HANDLE NEW IMAGE UPLOADS ---
  const newImageUrls: { url: string; public_id: string }[] = [];
  if (req.files && Array.isArray(req.files)) {
    const uploadPromises = (req.files as Express.Multer.File[]).map(file =>
      uploadImage(file.path, 'products')
    );
    const results = await Promise.all(uploadPromises);
    results.forEach(res => { if (res) newImageUrls.push(res); });
  }

  // --- 3. MERGE AND UPDATE ---
  const finalImages = [...keptImages, ...newImageUrls];
  console.log(finalImages);

  const updateData = {
    ...req.body,
    images: finalImages,
    // Ensure numbers are coerced correctly
    price: req.body.price ? Number(req.body.price) : product.price,
    instock_count: req.body.instock_count ? Number(req.body.instock_count) : product.instock_count,
  };

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedProduct
  });
});

export const deleteProduct = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Find the product
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error: any = new Error('No product found with that ID');
    error.statusCode = 404;
    return next(error);
  }

  // 2. Delete all images from Cloudinary using your helper
  if (product.images && product.images.length > 0) {
    const deletionPromises = product.images.map((img: any) => deleteImage(img.public_id));
    await Promise.all(deletionPromises);
  }

  // 3. Delete the product from Database
  await product.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Product and all associated images deleted successfully'
  });
});

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const queryObj: any = {};
  const { keyword, category, minPrice, maxPrice, size, color } = req.query;

  // 1. FILTERS
  if (keyword) {
    queryObj.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) queryObj.category = category;

  if (minPrice || maxPrice) {
    queryObj.price = {};
    if (minPrice) queryObj.price.$gte = Number(minPrice);
    if (maxPrice) queryObj.price.$lte = Number(maxPrice);
  }

  if (size) {
    const sizes = (size as string).split(",");
    queryObj.sizes = { $in: sizes };
  }

  if (color) {
    const colors = (color as string).split(",");
    queryObj.colors = { $in: colors };
  }

  // 2. PAGINATION LOGIC
  // Default to page 1 and 10 items per page if not provided
  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 10;
  // const skip = (page - 1) * limit;

  // 3. EXECUTE QUERY
  // We run two queries: one for the data, one for the total count (needed for frontend)
  const productsQuery = Product.find(queryObj)
    .sort("-createdAt")
  // .skip(skip)
  // .limit(limit);

  const totalProducts = await Product.countDocuments(queryObj);
  const products = await productsQuery;

  // 4. SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: products.length,
    total: totalProducts, // Useful for showing "Page 1 of 5"
    data: products,
  });
});


// GET NEW ARRIVALS
export const getNewArrivals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // .limit(5) ensures only the 5 most recently created 'new arrivals' are returned
  const products = await Product.find({ is_new_arrival: true })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

// GET FEATURED PRODUCTS
export const getFeaturedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Added .limit(5) to keep the response concise
  const products = await Product.find({ is_featured: true })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

// GET PRODUCT BY ID
export const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error('No product found with that ID'));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});


export const getFilterMetadata = catchAsync(async (req, res, next) => {
  const metadata = await Product.aggregate([
    {
      $facet: {
        // Collect all unique color strings into one array
        uniqueColors: [
          { $unwind: "$colors" },
          { $group: { _id: null, colors: { $addToSet: "$colors" } } }
        ],
        // Collect all unique size strings into one array
        uniqueSizes: [
          { $unwind: "$sizes" },
          { $group: { _id: null, sizes: { $addToSet: "$sizes" } } }
        ],
        // Find the absolute highest and lowest prices in the collection
        priceBounds: [
          {
            $group: {
              _id: null,
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" }
            }
          }
        ]
      }
    }
  ]);

  // Extract results from the facet arrays
  const colors = metadata[0].uniqueColors[0]?.colors || [];
  const sizes = metadata[0].uniqueSizes[0]?.sizes || [];
  const minPrice = metadata[0].priceBounds[0]?.minPrice || 0;
  const maxPrice = metadata[0].priceBounds[0]?.maxPrice || 0;

  res.status(200).json({
    status: 'success',
    data: {
      colors,
      sizes,
      minPrice,
      maxPrice
    }
  });
});