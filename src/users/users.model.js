import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema({
  username: { type: String, required: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  favoriteProducts: { type: Array, required: false },
  viewedProducts: { type: Array, required: false },
  orders: { type: Array, required: false },
  image: { type: Array, required: false }
},{
  timestamps: true
});

usersSchema.statics.getUsers = getUsers;
usersSchema.statics.createUser = createUser;
usersSchema.statics.getUserById = getUserById;
usersSchema.statics.updateUser = updateUser;
usersSchema.statics.upadeUserOrdersArray = upadeUserOrdersArray;

async function getUsers() {
  return this.find();
 
}

async function getUserById(questionId) {
  // return this.findOne({ _id: questionId });
  return this.findById(questionId);
}

async function createUser(body) {
  return this.create(body);
}

async function updateUser(id, update) {
  return this.findByIdAndUpdate(id, update, { new: true });
}

async function upadeUserOrdersArray(body) {
  return this.findOneAndUpdate(
    { _id: body.creator },
    { $push: { orders: body._id } }
  );
}

const usersModel = mongoose.model("User", usersSchema);
export default usersModel;
