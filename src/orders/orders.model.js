import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const ordersSchema = new Schema(
  {
    creator: { type: String, required: true },
    productsList: [
      {
        product: { type: String, required: true },
        type: { type: String, required: true, enum: ["M", "XL", "XXL"] },
        itemsCount: { type: Number, required: true }
      }
    ],
    deliveryType: { type: String, required: true },
    deliveryAdress: { type: String, required: true },
    sumToPay: { type: Number, required: false },
    status: { type: String, required: false }
  },
  {
    timestamps: true
  }
);

ordersSchema.statics.getOrders = getOrders;
ordersSchema.statics.createOrder = createOrder;
ordersSchema.statics.getOrderById = getOrderById;

async function getOrders() {
  return this.find();
}

async function getOrderById(orderId) {
  // return this.findOne({ _id: questionId });
  return this.findById(orderId);
}

async function createOrder(body) {
  return this.create(body);
}

const usersModel = mongoose.model("Order", ordersSchema);
export default usersModel;
