# Restaurant Management Application

## Overview

This is a restaurant management application built with `Next.js, TypeScript, Tailwind, Prisma, GraphQL, and Supabase`. The application allows customers to view the menu and make reservations by scanning a QR code containing the table's UUID. It also includes an admin panel protected by frontend and backend authentication, where administrators can manage the menu, tables, orders, payments, users, and analyze sales with graphs and statistics of top-selling items.

## Video Presentation

You can watch a video presentation of the application [here](https://youtu.be/VgTNnO7MJ0g).

## Features

- **Customer Interface**: Customers can view the menu and make reservations by scanning a QR code.
- **Admin Panel**: Protected by authentication, the admin panel allows managing the menu, tables, orders, payments, users, and sales analysis.
- **Authentication**: Secured with middleware on both the frontend and backend.
- **Database Seeding**: Includes default data for 3 menu items and 2 users.

## Deployment

Project deployed on Vercel: [https://adrien-morin-sebastian-ruiz-restaurant.vercel.app/](https://adrien-morin-sebastian-ruiz-restaurant.vercel.app/)

## Pages of the Application

- `/`: Displays the landing page.
- `/menu`: Displays the menu.
- `/menu?tableId=<UUID>`: Displays the menu with the possibility to order items for the given table corresponding to the unique QR Code.
- `/admin`: Displays the admin panel.
- `/auth/login`: Displays the login page.

Note: The admin panel is protected by frontend and backend authentication. Depending on the user role, the admin panel will display different pages in the layout.


## Environment Variables

To run the project, you need to set the following environment variables:

```plaintext
DATABASE_URL="<URL_SUPABASE_POSTGRES>/postgres?pgbouncer=true"
LOCAL_URL=http://localhost:3000
PRODUCTION_URL=URL_PRODUCTION_VERCEL
```

## Getting Started
### Prerequisites
Node.js and Yarn installed on your machine.

## Installation
### Clone the repository:

```bash
git clone <repository_url>
cd <repository_name>
```

### Install the dependencies:

```bash
yarn install
```

### Prisma migration

To create the database schema, run:

```bash
yarn prisma migrate dev --name "init"
```

### Database Seeding

To seed the database with default data (3 menu items and 2 users), run:

```bash
yarn prisma db seed
```

Default users:

Email: admin@gmail.com

Password: admin123

Email: kitchen@gmail.com

Password: kitchen123


### Run the development server:

```bash
yarn dev
```

### Regenerate Prisma Client
To regenerate the Prisma client, run:

```bash
yarn prisma generate
```

## Project Structure

- `/src/pages`: Contains the Next.js pages.
- `/src/pages/api/graphql`: Contains the GraphQL API running using Apollo Server v4.
- `/src/components` & `/src/molecules`: Reusable components.
- `/prisma`: Prisma schema and seeding scripts.
- `/graphql`: GraphQL schema and resolvers.
- `/utils`: Utility functions.
- `/hooks/useMiddleware`: Custom hook for frontend authentication.
- `/src/lib/auth`: Custom backend authentication middleware.
- `/styles`: Global styles and CSS modules (using Tailwind for styling).
- `/public`: Static files.
- `/lib`: apollo and prisma clients. 

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any questions or suggestions, please contact Adrien Morin at morinadrien71@gmail.com.

