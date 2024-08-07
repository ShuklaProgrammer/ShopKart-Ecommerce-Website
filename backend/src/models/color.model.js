import mongoose from "mongoose"

const colorSchema = new mongoose.Schema({
    colorName:{
        type: String, 
        required: [true, "Color name required"],
        unique: true,
        index: true,
        trim: true
    },
    hexCodeColor:{
        type: String,
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex code"]
    }
}, {timestamps: true})

export const Color = mongoose.model("Color", colorSchema)