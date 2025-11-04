import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addressLine1 : {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    postalCode : {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    telephone: {
        type: String
    },
    mobile: {
        type: String,
        required: true
    },
    alternateMobile: {
        type: String
    }
})

export const UserAddress = mongoose.model("UserAddress", userAddressSchema)