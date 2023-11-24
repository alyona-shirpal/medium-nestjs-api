# Medium NestJS API

Welcome to the Medium NestJS API, a Nest.js project where users can authorize, create articles, comment on them or other articles, and tag them. The project utilizes TypeScript, Nest.js, and PostgresSQL for data storage.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Yarn](https://yarnpkg.com/) for managing dependencies.
- [Docker](https://www.docker.com/) for containerization (optional but recommended).

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/alyona-shirpal/medium-nestjs-api.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd medium-nestjs-api
    ```

3. **Install dependencies:**

    ```bash
    yarn install
    ```

### Database Setup (Docker)

1. **Start a PostgreSQL container:**

    ```bash
    docker run -d --name medium-postgres -p 5432:5432 -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb postgres
    ```

   Adjust `myuser`, `mypassword`, and `mydb` with your preferred values.

2. **Configure Database Connection:**

   Update the database connection configuration in the `.env` file:

    ```env
    DB_TYPE=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=myuser
    DB_PASSWORD=mypassword
    DB_DATABASE=mydb
    ```

### Usage

1. **Run the development server:**

    ```bash
    yarn start
    ```

### Contributing

Feel free to contribute to the development of this project. Create a fork, make your changes, and submit a pull request.

