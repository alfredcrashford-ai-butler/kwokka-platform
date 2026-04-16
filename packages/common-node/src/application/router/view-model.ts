import Joi, { object } from 'joi';

export interface ViewModel {
  params?: Joi.Schema;
  body?: Joi.Schema;
  query?: Joi.Schema;
}

export const QueryListViewModel = {
  offset: Joi.number().optional(),
  limit: Joi.number().optional(),
};

function validateSorting(value, helpers) {
  let [{ sort, order }] = helpers.state.ancestors;

  if (typeof order === 'string' && order.split(',').length > 0) {
    order = order.split(',');
  }

  if (typeof sort === 'string' && sort.split(',').length > 0) {
    sort = sort.split(',');
  }

  if (!order && !sort) {
    return value;
  }

  if (Array.isArray(order) !== Array.isArray(sort)) {
    return helpers.error('any.custom', {
      error: new Error('"order" and "sort" must be both provided'),
    });
  }

  if (!order.every((el) => el === 'asc' || el === 'desc')) {
    return helpers.error('any.custom', {
      error: new Error('"order" must be an array of "asc" and "desc" strings'),
    });
  }

  if (sort.length !== order.length) {
    return helpers.error('any.custom', {
      error: new Error('"order" and "sort" must have the same size'),
    });
  }

  return value;
}

export const SortQueryListViewModel = {
  sort: Joi.custom(validateSorting),
  order: Joi.custom(validateSorting),
};

export const DeepSearchViewModel = Joi.extend({
  type: 'object',
  base: Joi.object(),
  coerce: {
    from: 'string',
    method: (value) => {
      try {
        const parsedValue = JSON.parse(value);
        if (typeof parsedValue !== 'object' || parsedValue === null) {
          return { value };
        }
        return { value: parsedValue };
      } catch (_) {
        return { value };
      }
    },
  },
})
  .object()
  .pattern(
    Joi.string(),
    Joi.alternatives().try(
      Joi.object({
        min: Joi.alternatives(Joi.number(), Joi.string(), Joi.date()).optional(),
        max: Joi.alternatives(Joi.number(), Joi.string(), Joi.date()).optional(),
        eq: Joi.alternatives(Joi.number(), Joi.string(), Joi.date(), Joi.valid(null)).optional(),
        neq: Joi.alternatives(Joi.number(), Joi.string(), Joi.date(), Joi.valid(null)).optional(),
      }),
      Joi.link('#deepSearch'), // allow nested objects
    ),
  )
  .id('deepSearch');
