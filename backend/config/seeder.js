import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import products from "./data/productsData.js";
import Product from "../models/Product.js";
import connectDB from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
dotenv.config({ path: path.resolve(__dirname, "config.env") });

const importData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();

        const sampleProducts = products.map((product) => ({ ...product }));
        const insertedProducts = await Product.insertMany(sampleProducts);

        console.log(`Products inserted: ${insertedProducts.length}`);
        console.log("Data imported successfully!");
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

importData();


// const destroyData = async () => {
//     try {
//         await Order.deleteMany();
//         await Product.deleteMany();
//         await User.deleteMany();

//         console.log("Data destroyed successfully!".green.inverse);
//         process.exit();  // Exit after successful destruction
//     } catch (error) {
//         console.error(`${error.message}`.red.inverse);
//         process.exit(1);  // Exit with failure code
//     }
// };

// // Determine if we are importing or destroying data based on command-line arguments
// if (process.argv[2] === '-d') {
//     destroyData();
// } else {
//     importData();
// }
