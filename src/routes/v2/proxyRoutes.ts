import { Router } from "express";

const router = Router();

const fetchImage = async (url: string) => {
    const response = await fetch(url);

    return await response.blob();
};

router.get('/image/:url', async (req, res) => {
    try {
        if (!req.params.url) {
            return res.status(400).send('URL parameter is required (and has to be base64!)');
        }

        const imageUrl = Buffer.from(req.params.url, 'base64').toString('utf-8');

        const image = await fetchImage(imageUrl);

        res.type(image.type);
        const buffer = await image.arrayBuffer();
        return res.send(Buffer.from(buffer));
    } catch (error: any) {
        return res.status(500).send('Error fetching image: ' + error.message);
    }
});

export default router;
