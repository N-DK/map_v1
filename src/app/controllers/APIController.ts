import { NextFunction, Request, Response } from 'express';
import interpreter from '../models/Interpreter';

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
}

export default new APIController();
