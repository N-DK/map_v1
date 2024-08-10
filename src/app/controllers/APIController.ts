import { NextFunction, Request, Response } from 'express';
import interpreter from '../models/Interpreter';
import axios from 'axios';
import { URL_API } from '../../constant';

class APIController {
    // [GET] /
    index(req: Request, res: Response, next: NextFunction) {
        res.send('Server is running...!');
    }

    // [POST] interpreter/create
    createInterpreter(req: Request, res: Response, next: NextFunction) {
        const data = req?.body;
        if (!data) return res.json({ result: 0 });

        interpreter.create(data, (err, results) => {
            if (err) {
                return res.json({ result: 0, error: err });
            } else {
                return res.json({ result: 1, data: results });
            }
        });
    }

    // [PUT] interpreter/save
    saveInterpreter(req: Request, res: Response, next: NextFunction) {
        const data = req?.body;
        if (!data) return res.json({ result: 0 });

        interpreter.save(data, (err, results) => {
            if (err) {
                return res.json({ result: 0, error: err });
            } else {
                return res.json({ result: 1, data: results });
            }
        });
    }

    // [GET] get-displayname?lat=...&lng=...
    async getDisplayName(req: Request, res: Response, next: NextFunction) {
        const { lat, lng } = req?.query;
        if (!lat || !lng)
            return res.json({ result: 0, error: 'Missing lat or lng' });
        const placeResult = await axios.get(
            `${URL_API}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        );
        return res.json({
            result: 1,
            data: placeResult?.data?.display_name?.split('|')[0],
        });
    }
}

export default new APIController();
