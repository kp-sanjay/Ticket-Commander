import { Router } from 'express';
import { TN_DISTRICTS } from '../services/bms/meta.js';
import { fetchTheatres } from '../services/bms/scraper.js';

const router = Router();

// Get list of districts
router.get('/districts', (req, res) => {
    res.json(TN_DISTRICTS);
});

// Get theatres for a specific region
router.get('/theatres/:regionCode', async (req, res) => {
    const { regionCode } = req.params;
    if (!regionCode) {
        return res.status(400).json({ error: 'Region code required' });
    }
    
    try {
        const theatres = await fetchTheatres(regionCode);
        res.json({ region: regionCode, theatres });
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to fetch theatres', details: err.message });
    }
});

export default router;
