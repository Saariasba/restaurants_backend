import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';


export const errorHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    } catch (err) {
        return res.status(400).json({ msg: 'Oops, an error has occurred.' });
    }
}
