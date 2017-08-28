# DragonFly

## Install

```bash
$ npm install -g ethereumjs-testrpc
$ npm install -g truffle
$ git clone https://github.com/CatalystCode/DragonFly.git
$ cd DragonFly
$ npm install
```

## Setup Metamask

1. Run [testrpc](https://github.com/ethereumjs/testrpc)
    ```bash
    $ testrpc
    ```

2. Install [Metamask Chrome Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
3. Import one of the accounts outputted by `testrpc` into Metamask. See [this](http://metamask.consensyssupport.happyfox.com/kb/article/7-importing-accounts) for instructions on how to import accounts.

## Run the Application

1. Run the application
    ```bash
    $ npm run dev
    ```
2. Open chrome to `http://localhost:3000`
