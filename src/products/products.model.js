import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    currency: { type: String, required: true },
    creatorId: { type: String, required: true },
    categories: [{ type: String, required: false }],
    image: [{ type: String, required: false }],
    likes: { type: Number, required: false, default: 0 }
  },
  {
    timestamps: true
  }
);

productSchema.statics.getProducts = getProducts;
productSchema.statics.createProduct = createProduct;
productSchema.statics.getProductById = getProductById;
productSchema.statics.updateProduct = updateProduct;

async function getProducts({ ids, category }) {
  let serchCreterion = null;
  if (ids && category) {
    serchCreterion = {
      categories: { $in: category },
      _id: { $in: ids.split(",") }
    };
  }
  if (!ids && category) {
    serchCreterion = { categories: { $in: category } };
  }
  if (ids && !category) {
    serchCreterion = { _id: { $in: ids.split(",") } };
  }

  return this.find(serchCreterion);
}

async function getProductById(productId) {
  return this.findById(productId);
}

async function createProduct(body) {
  return this.create(body);
}

async function updateProduct(id, update) {
  return this.findByIdAndUpdate(id, update, { new: true });
}

const productsModel = mongoose.model("Product", productSchema);
export default productsModel;
