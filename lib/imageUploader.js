
import axios from 'axios'
import FormData from 'form-data'

export const imageUploader = async (file) => {
    const toReturn = []
    try {
        await Promise.all(
            file.map(async (item) => {

                const headers = {
                    'secret': process.env.DMS_SECRET,
                }

                const formData = new FormData();
                formData.append('doc', item?.buffer, item?.mimetype)

                await axios
                    .post(process.env.DMS_URL || '', formData, { headers })
                    .then(async response => {
                        await axios.get(`${process.env.DMS_URL}/${response?.data?.data?.referenceNumber}`, { headers })
                            .then((response) => {
                                toReturn.push(response?.data?.data?.docPath)
                            }).catch((err) => {
                                throw err
                            })
                    })
                    .catch(err => {
                        throw err
                    })
            })
        )
    } catch (err) {
        throw err
    }
    return toReturn
}
