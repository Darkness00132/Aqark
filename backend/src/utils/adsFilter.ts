import { Op } from 'sequelize';
import { type getAds } from '../validates/ad.js';

const adsFilters = (value: getAds) => {
  const {
    city,
    area,
    rooms,
    space,
    propertyType,
    type,
    minPrice,
    maxPrice,
    search,
  } = value;

  const where: any = {};

  if (city) where.city = city;

  if (area) where.area = area;

  if (rooms) where.rooms = rooms;

  if (space) where.space = space;

  if (propertyType) where.propertyType = propertyType;

  if (type) where.type = type;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price[Op.gte] = minPrice;
    }
    if (maxPrice) {
      where.price[Op.lte] = maxPrice;
    }
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return where;
};

export default adsFilters;
