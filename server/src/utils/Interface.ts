import { Document, ObjectId } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    vendor: string;
    isAvailable: boolean;
    tags: string[];
    status: string;
    category: ObjectId;
}

export interface IImage extends Document {
    productId: ObjectId;
    image: string;
    position: number;
}

export interface IProductVariant extends Document {
    size: "XS" | "S" | "M" | "L" | "XL" | '28' | '30' | '32' | '34' | '36' | '38' | '40' | '42';
    color?: {
        name: string;
        hex: string;
    };
    product: ObjectId;
    inventory: {
        quantity: number;
    };
    price: string;
    cost: string;
    comparePrice: string;
    sku: string;
}
