import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const fakeLogs = [...Array(15)].map((_, index) => ({
  id: index,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  type: faker.helpers.arrayElement(['ENTRADA', 'SAIDA']),
  createdAt: faker.date.past().toLocaleString(),
}));
