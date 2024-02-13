# CS916 Social informatics project

## E-Veg website

[![CI](https://github.com/Xanonymous-GitHub/eveg/actions/workflows/main.yml/badge.svg)](https://github.com/Xanonymous-GitHub/eveg/actions/workflows/main.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9a26b376-2789-4fc2-a67a-35638e0a5966/deploy-status)](https://app.netlify.com/sites/helpful-beignet-62ff6d/deploys)

The production version of this project is deployed on https://eveg.xcc.tw/
It is automatically built from the `main` branch.

## Get started

### First time setup

Since this is a project of a homework nature,
in addition to the recommended environment configuration and settings,
a simplified version of the approach is also listed here.
However, please note that using the simplified version of the configuration
may not be able to use most features properly,
such as Bootstrap, because the Bootstrap in this project is configured based on a standard web project.

#### Recommended steps

1. Install latest version of Node.js. You can follow the instructions on
   the [node.js install guide](https://nodejs.org/en/download/package-manager).
2. Install PNPM. You can follow the instructions on the [pnpm install guide](https://pnpm.io/installation).
3. Clone this repository.

    ```shell
    # Clone with SSH (recommended)
    git clone git@github.com:Xanonymous-GitHub/eveg.git
    ```

    ```shell
    # Clone with HTTPS
    git clone https://github.com/Xanonymous-GitHub/eveg.git
    ```

4. Install dependencies.
   Move to the project directory and run the following command.

    ```shell
    pnpm i
    ```
    - N.B pnpm may not be installed. If you have npm, you can simply run:
        ```shell
        npm install -g pnpm
        ```
    - Or, with homebrew or scoop:
        ```shell
        brew install pnpm
        scoop install nodejs-lts pnpm
        ```

#### Simple steps

1. Clone this repository (described above).
2. Use [VSCode](https://code.visualstudio.com/download) to open the project directory.
3. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### Start development

#### Recommended steps

In the recommended steps, you need to run the following command to start the development server.

```shell
pnpm dev
```

then open the browser and go to `http://localhost:5173`.
> [!TIP]
> Confirm the port number displayed in the URL after executing the command. It may not be 5173.

Okay, enjoy your development with hot reload and other features.

#### Simple steps

If you choose the simple steps, you can use the Live Server extension to start the development server.
Open the `index.html` file in the project directory with VSCode,
then click the `Go Live` button in the lower right corner of the VSCode status bar.
