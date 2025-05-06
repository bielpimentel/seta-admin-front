import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const contacts = [...Array(22)].map((_, index) => ({
  id: index,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: "(13) 98123-4567",
  subject: faker.lorem.lines(1),
  message: faker.lorem.lines(4),
  createdAt: faker.date.anytime().toLocaleString(),
}));
