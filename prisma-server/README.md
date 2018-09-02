# Prisma Server

This server is based on the example demonstrated in the prisma for how to use the simple and declarative [GraphQL Shield](https://github.com/maticzav/graphql-shield) library for authorization by protecting mutations and queries from unauthorized access.
This can be used as a server for the RAN Application 
## Get Started

### 1. Install the Prisma CLI
The `prisma` cli is the core component of your development workflow. `prisma` should be installed as a global dependency, you can install this with `npm install -g prisma`

### 2. Install dependencies
Navigate into the prisma-server folder and install the NPM dependencies

```sh
cd prisma-server
yarn install
```

### 3. Deploy the Prisma database service

You can now [deploy](https://www.prisma.io/docs/reference/cli-command-reference/database-service/prisma-deploy-kee1iedaov) the Prisma service (note that this requires you to have [Docker](https://www.docker.com) installed on your machine - if that's not the case, follow the collapsed instructions below the code block):

```sh
# Ensure docker is running the server's dependencies
# Add sudo docker-compose up if it fails
docker-compose up
# Deploy the server
cd prisma
prisma deploy
```

### 4. Deploy the Prisma Cloud database service Free (Optional)

You can deploy locally but for simplicity, you can use the Prisma free demo server. To deploy your service to a public cluster (rather than locally with Docker), you need to perform the following steps:

1.  Create a `.env` file and copy over the content of `.env.example` to it.
1.  Run `prisma deploy` to create a new Prisma service.
1.  Replace the value of `PRISMA_ENDPOINT` in your `.env` file with the URL of your service instance. The URL looks similar to this: `https://us1.prisma.sh/your-username-fd2dcf/service-name/stage`
1.  Remember to change the `APP_SECRET` in the `.env` file too.

### 5. Explore the API

To start the server, run the following command

```
yarn start
```

### Open a Playground

The easiest way to explore this deployed service and play with the API generated from the data model is by using a [GraphQL Playground](https://github.com/graphcool/graphql-playground).

The fastest way to open one is by going to [http://localhost:7200](http://localhost:7200)

### Testing the flow

Run the following mutation to signup:

```graphql
mutation signup {
  signup(username: "test", email: "test@gmail.com", password: "pass") {
    token
    user {
      email
      username
      createdAt
    }
  }
}
```

You can also login:

```graphql
mutation login {
  login(email: "test@gmail.com", password: "pass") {
    token
    user {
      email
      username
      createdAt
    }
  }
}
```

Adjust the HTTP header with the received `token` like so:

```
{
  "Authorization": "Bearer <token>"
}
```

for example

```
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamlkN3hmY3RwcXc1MGE5NnBjaDM1dmtuIiwiaWF0IjoxNTI4OTAwNjc3fQ.IqZ94TjeBaeY22y3XtzfK48fUON-IHk6B62C2xQyChs"
}
```

Try querying for data:

```graphql
query posts {
  posts {
    content
  }
}
```

You will get an `Not Authorised` error. This is because you need to be authorized as a user to read posts. Run the following:

```graphql
mutation AssignRole {
  assignRole(role: ADMIN, assigneeEmail: "test@gmail.com") {
    id
  }
}
```

This will assign the USER role to the just created user.

> `assignRole` mutation is open so you don't lock yourself out of your own system :). This kind of mutation should be restricted to only Admins.

Here is what the [restrictions/permissions](./src/permissions/index.js#L52-L62) look like:

```js
const permissions = shield({
  Query: {
    posts: rules.isUser,
  },
  Mutation: {
    createPost: or(rules.isAdmin, rules.isAuthor, rules.isEditor),
    updatePost: or(rules.isEditor, rules.isPostOwner),
    assignRole: rules.isAdmin,
    createRole: rules.isAdmin,
  },
})
```
