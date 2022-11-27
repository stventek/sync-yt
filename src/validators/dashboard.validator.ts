import {query} from 'express-validator';

const fromDate = query('fromDate')
    .exists().withMessage('fromDate is required')
    .isISO8601().withMessage('fromDate should be a valid ISO8601 timestamp')

const toDate = query('toDate')
    .exists().withMessage('toDate is required')
    .isISO8601().withMessage('toDate should be a valid ISO8601 timestamp')

const groupBy = query('groupBy')
    .exists().withMessage('GroupBy is required')
    .isString().withMessage('GroupBy should be an string')
    .isIn(['month', 'day'])

export const dashboardValidator = [fromDate, toDate, groupBy]