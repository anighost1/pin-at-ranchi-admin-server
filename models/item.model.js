import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90
    },
    addressLine1: {
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
    state: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    pin: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit pin code!`
        }
    },
    mobile: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid 10-digit mobile number!`,
        },
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    keyword: {
        type: Array,
        required: true,
    },
    image: {
        type: Array
    },
});


const Item = mongoose.model('Item', itemSchema)
export default Item