import Product from "../models/product.model.js"
import ProductStat from "../models/productStat.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import getCountryIso3 from "country-iso-2-to-3"

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        // console.log(products)
        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id,
                });
                // console.log(stat)
                return {
                    ...product._doc,
                    stat,
                };
            })
        );

        res.status(200).json(productsWithStats);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find().select("-password")

        res.status(200).json(customers)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getTransactions = async (req, res) => {
    try {
        // sort should look like this: { "field": "userId", "sort": "desc"}
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        // formatted sort should look like { userId: -1 }
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            // console.log(sortParsed)
            const sortFormatted = {
                [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
            };

            // console.log(sortFormatted)
            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } },
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" },
        });

        res.status(200).json({
            transactions,
            total,
        });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getGeography = async (req, res) => {
    try {
        const users = await User.find();

        const mappedLocations = users.reduce((acc, { country }) => {
            const countryISO3 = getCountryIso3(country);
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count };
            }
        );

        res.status(200).json(formattedLocations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}