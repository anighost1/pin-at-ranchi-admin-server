
import Item from "../models/item.model.js"
import imageRetriever from "../service/imageRetriever.js"


export const getItems = async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const searchQuery = req.query.search || '';
    const status = req.query.status || '';
    const category = req.query.category || '';
    let dataToSend = {}
    const query = {
        $or: [
            { 'name': { $regex: searchQuery, $options: 'i' } },
            { 'keyword': { $regex: searchQuery, $options: 'i' } },
            { 'addressLine1': { $regex: searchQuery, $options: 'i' } },
            { 'addressLine2': { $regex: searchQuery, $options: 'i' } },
        ]
    };
    try {
        const itemData = await Item.find(searchQuery ? query : {})
            .where(status ? { "status": status } : {})
            .where(category ? { "category": category } : {})
            .populate('category')
            .skip(startIndex)
            .limit(limit);
        const count = await Item.countDocuments(searchQuery ? query : {});
        const totalPage = Math.ceil(count / limit)
        dataToSend.data = itemData
        if (endIndex < count) {
            dataToSend.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            dataToSend.prev = {
                page: page - 1,
                limit: limit
            }
        }
        dataToSend.currentPage = page
        dataToSend.currentLimit = limit
        dataToSend.totalPage = totalPage
        res.json(dataToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
}


export const getItemsWithImage = async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const searchQuery = req.query.search || '';
    let dataToSend = {}
    const query = {
        $and: [
            {
                $or: [
                    { 'name': { $regex: searchQuery, $options: 'i' } },
                    { 'addressLine1': { $regex: searchQuery, $options: 'i' } },
                    { 'addressLine2': { $regex: searchQuery, $options: 'i' } },
                    { 'keyword': { $regex: searchQuery, $options: 'i' } },
                ],
            },
            { status: true }
        ]
    };
    try {
        const itemData = await Item.find(searchQuery ? query : { status: true }).populate('category').populate('images').skip(startIndex).limit(limit);
        const count = await Item.countDocuments(searchQuery ? query : {});
        const totalPage = Math.ceil(count / limit)
        await Promise.all(
            itemData.map(async (item) => {
                let imgArray = []
                await Promise.all(
                    item?.images.map(async img => {
                        if (img.gridfsId) {
                            await imageRetriever(img, imgArray)
                        }
                    })
                )
                // fs.unlinkSync('/outputFile');
                // console.log(imgArray)
                item.images = imgArray
            })
        )
        dataToSend.data = itemData
        if (endIndex < count) {
            dataToSend.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            dataToSend.prev = {
                page: page - 1,
                limit: limit
            }
        }
        dataToSend.currentPage = page
        dataToSend.currentLimit = limit
        dataToSend.totalPage = totalPage
        res.json(dataToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
}


export const getItemWithImageById = async (req, res) => {
    const itemId = req.params.id
    try {
        const itemData = await Item.findById(itemId).populate('category').populate('images');
        let imgArray = []
        await Promise.all(
            itemData?.images.map(async img => {
                if (img.gridfsId) {
                    await imageRetriever(img, imgArray)
                }
            })
        )
        itemData.images = imgArray
        res.json(itemData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
}


export const getItemById = async (req, res) => {
    const itemId = req.params.id
    try {
        const itemData = await Item.findById(itemId);
        res.json(itemData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
}


export const addItem = async (req, res) => {
    const newItem = new Item(req.body)
    try {
        await newItem.save()
        res.status(200).json({
            message: 'Item successfully inserted'
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: 'Item insertion unsuccessful'
            });
        }
    }
}


export const updateItem = async (req, res) => {
    const dataToUpdate = req.body
    // const _id = dataToUpdate._id
    try {
        const oldItem = await Item.findByIdAndUpdate(dataToUpdate._id, dataToUpdate)
        // console.log(oldItem)
        res.status(200).json({
            message: 'Item successfully updated'
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: 'Item updation unsuccessful'
            });
        }
    }
}


export const updateItemStatus = async (req, res) => {
    const id = req.body.id
    try {
        const result = await Item.findById(id)
        result.status = !result.status
        result.save()
        res.status(200).json({
            message: `Status changed to ${result.status ? 'Active' : 'Inactive'}`
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Status change unsuccessful'
        });
    }
}