import { Schema, model, Types } from 'mongoose';

interface Category {
    name: String;
    imgUrl?: String;
    description: String;
    menuItems: Types.ObjectId[];
    restaurantId: Types.ObjectId;
    isAvaliable: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const scheme = new Schema<Category>({
    name: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
    description:{
        type: String,
        default: ""
    },
    restaurantId:{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    menuItems: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        default: []
    }],
    isAvaliable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default model<Category>('Category', scheme);