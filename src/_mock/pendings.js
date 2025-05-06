import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const pendings = [...Array(6)].map((_, index) => ({
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  createdAt: faker.date.anytime().toLocaleString(),
}));
